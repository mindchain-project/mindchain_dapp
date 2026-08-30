/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { UpdateIcon } from "@radix-ui/react-icons";
import bs58 from "bs58";
import { of as computeCID } from "ipfs-only-hash";
// COMPONENTS
import { Form } from '@/components/ui/form';
// Import des contrôleurs de formulaire
import ArtworkFormController from '@/components/shared/forms/ArtworkFormController';
import IterationFormController from '@/components/shared/forms/IterationFormController';
import ParametersFormController from '@/components/shared/forms/ParametersFormController';
import LegalFormController from '@/components/shared/forms/LegalFormController';
import ValidationFormController from '@/components/shared/forms/ValidationFormController';
import {
  CertificationFormData,
  FileMetadata,
  CertificateFormProps,
  MintResult,
  iterationFileMetadata,
  CertificateForTransaction,
  CidReceipt,
  UploadErrorCode
} from '@/utils/interfaces';
import { uploadImageFile, uploadJsonFile, deleteFiles } from '@/services/storage';
import { useSiweSession } from '@/hooks/useSiweSession';
import { useWriteContract } from 'wagmi';
import { contractConfig, MindchainContractAddress } from "@/abi/MindchainContract";

/** Traduction des causes d'échec d'upload renvoyées par le serveur. */
const UPLOAD_ERRORS: Record<UploadErrorCode, string> = {
  unauthorized:
    "Session expirée. Reconnectez votre portefeuille pour publier sur IPFS.",
  invalid_file: "Le fichier fourni est vide ou illisible.",
  too_large: "Le fichier dépasse la taille maximale autorisée (10 Mo).",
  unsupported_type: "Format d'image non pris en charge (PNG, JPEG, WebP ou GIF).",
  duplicate: "Ce certificat existe déjà sur IPFS : il ne peut pas être publié deux fois.",
  upload_failed: "La publication sur IPFS a échoué. Réessayez dans un instant.",
};

/** Données prêtes pour le mint, accompagnées des preuves de propriété des CID. */
interface PreparedCertificate {
  tokenURI: string;
  imageCID: string;
  /** Reçus des seuls CID que cette session a effectivement épinglés. */
  receipts: CidReceipt[];
}


// Image Mindchain par défaut si l’utilisateur ne publie pas l’image finale sur IPFS
const MINDCHAIN_IMAGE_CID = "bafybeidpcbs5gklqwqgb22hsmb5vlyv242lvttlpenmapb72fxjrnsawde";
// Préfixe standard pour les liens IPFS dans Metamask
const CID_PREFIX = "ipfs://";

// Fonction utilitaire pour générer les métadonnées d’un fichier
const getFileMetadata = (file: File): FileMetadata => {
  const metadata = {
    type: file.type || '',
    name: file.name.toLowerCase().trim() || '',
    size: file.size || 0,
  };
  return metadata;
};

// Fonction utilitaire pour calculer le CID d’un fichier sans l’uploader sha256 base32
const getCID = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const cid = await computeCID(Buffer.from(arrayBuffer), {
    cidVersion: 1,
    rawLeaves: false
  });
  return cid;
};

// Fonction utilitaire pour générer un UUID court en base58
// `crypto.randomUUID()` remplace le paquet `uuid`, qui était importé sans
// figurer dans les dépendances du projet (constat FE-02 de l'audit).
const shortUuid = (): string => {
  const uuid = crypto.randomUUID().replace(/-/g, "");        // 32 hex
  const bytes = Uint8Array.from(uuid.match(/.{2}/g)!.map(b => parseInt(b, 16)));
  return bs58.encode(bytes);                      // ~22 chars
};

async function getTransactionData(form: CertificationFormData): Promise<PreparedCertificate> {

  // Génération d’un ID unique pour le certificat
  const certificateId = shortUuid();
  const attributes: any[] = []; // Eslint-disable-line @typescript-eslint/no-explicit-any

  // Gestion du fichier de l’image finale
  const originalFile: File = form.finalArtworkFileOriginal as File;
  const originalFileMetadata: FileMetadata = getFileMetadata(originalFile);
  let imageCID: string | null = null;
  let tokenURI: string | null = null;
  // Reçus de propriété : seuls les CID épinglés par cette session y figurent,
  // ce sont les seuls que le serveur nous autorisera à supprimer.
  const receipts: CidReceipt[] = [];

  // Refus publication IPFS (false) ou Image compressée invalide/manquante (null)
  if(form.finalArtworkFileIpfsPublish === false || !form.finalArtworkFile || !(form.finalArtworkFile instanceof File)) {
    // On utilise le CID par défaut
    imageCID = MINDCHAIN_IMAGE_CID
  } else {
    // Nommage de l'image sur IPFS
    const filename = `${certificateId}.${originalFileMetadata.name}`;
    const upload = await uploadImageFile(form.finalArtworkFile, filename);
    if (!upload.ok) {
      // On interrompt plutôt que de poursuivre avec un CID calculé localement :
      // un certificat qui référence une image que personne n'héberge n'a
      // aucune valeur probante.
      throw new Error(UPLOAD_ERRORS[upload.error]);
    }
    imageCID = upload.cid;
    receipts.push({ cid: upload.cid, receipt: upload.receipt });
  }

  try {    
    // Construction des attributs du certificat
    for (let index = 0; index < form.iterations.length; index++) {
      const iteration = form.iterations[index];
      let sourceFileData: iterationFileMetadata | null = null;
      let iterationImageData: iterationFileMetadata | null = null;
      if (iteration.sourceFile instanceof File) {
        sourceFileData = {
          metadata: getFileMetadata(iteration.sourceFile),
          cid: await getCID(iteration.sourceFile),
          description: iteration.sourceFileDesc ? iteration.sourceFileDesc.toLowerCase().trim() : null,
        };
      }
      // Pour la première itération, on utilise le fichier original
      if (index === 0) {
        iterationImageData = {
          metadata: originalFileMetadata,
          cid: imageCID!,
          description: form.description ? form.description.toLowerCase().trim() : null,
        };
      } else {
        iterationImageData = {
          metadata: getFileMetadata(iteration.iterationImage as File),
          cid: iteration.iterationImage instanceof File ? await getCID(iteration.iterationImage) : "",
          description: iteration.sourceFileDesc ? iteration.sourceFileDesc.toLowerCase().trim() : null,
        }
      }
      // Construction de la valeur de l’attribut
      const attribute_value = {
          iteration: index,
          prompt: iteration.prompt.toLowerCase().trim(),
          model: iteration.model.toLowerCase().trim(),
          provider: iteration.provider.toLowerCase().trim(),
          mode: iteration.mode.toLowerCase(),
          source_file: sourceFileData,
          iteration_image: iterationImageData,
          personalData: iteration.personalData,
        }; //TODO proposer de crypter si données personnelles
      attributes.push({
        trait_type: index === 0 ? "final_image_iteration" : "iteration_" + index,
        value: attribute_value,
      });
    };
    //Construction des paramètres techniques généraux
    const parameters = {
      main_provider: form.parameters.mainProvider.toLowerCase().trim(),
      model_data: form.parameters.modelData.toLowerCase().trim(),
      logs_file: form.parameters.logsFile instanceof File ? {
        metadata: getFileMetadata(form.parameters.logsFile),
        cid: await getCID(form.parameters.logsFile),
      } : null,
    };
    // Construction de l’objet certificat
    const certificate : CertificateForTransaction = {
      name: form.title.toLowerCase().trim(),
      description: form.description.toLowerCase().trim(),
      image: CID_PREFIX + imageCID,
      attributes: attributes,
      parameters: parameters,
      license: form.legal.license,
      creation: {
        certification_timestamp: Date.now(),
        certificate_id: certificateId
      },
      contract_address: MindchainContractAddress,
    };

    // Upload des métadonnées du certificat sur IPFS
    const uploadJsonFilename = `${certificateId}_mindchain.json`;
    const metadataUpload = await uploadJsonFile(certificate, uploadJsonFilename);
    if (!metadataUpload.ok) {
      throw new Error(UPLOAD_ERRORS[metadataUpload.error]);
    }
    tokenURI = metadataUpload.cid;
    receipts.push({ cid: metadataUpload.cid, receipt: metadataUpload.receipt });
  } catch (err) {
    console.error("[Certificat] Erreur lors de la préparation des données du certificat :", err);
    // Nettoyage : on ne dépublie que ce que cette session a elle-même épinglé.
    if (receipts.length > 0) {
      await deleteFiles(receipts);
    }
    throw err;
  }
  if (tokenURI === null || imageCID === null) {
    throw new Error("[Certificat] Erreur lors de la préparation des métadonnées du certificat.");
  }
  return { tokenURI, imageCID, receipts };
}


const CertificateForm = ({ onResult }: CertificateFormProps) => {

  const methods = useForm<CertificationFormData>({
    mode: "onSubmit",
    defaultValues: {
      title: '',
      description: '',
      finalArtworkFile: null, // A destination de l'upload IPFS
      finalArtworkFileCid: null,
      finalArtworkFileIpfsPublish: true,
      finalArtworkFileOriginal: null, // Fichier original pour hash local
      iterations: [{
        prompt: "",
        model: "",
        provider: "",
        mode: "",
        sourceFile: null,
        sourceFileDesc: "",
        personalData: false,
        ipfsPublish: true,
        iterationImage: null,
      }],
      legal: {
        authorshipConfirmation: false,
        thirdPartyRights: false,
        exploitationRights: false,
        license: '',
      },
      parameters: {
        mainProvider: '',
        modelData: '',
        logsFile: null,
      },
      validation: {
        processConfirmation: false,
        certification: false,
        privacy: false,
        terms: false,
        ownership: false,
      },
    },
  });
  
  const { control } = methods;

  /**
   * Référence plutôt qu'état React : les callbacks de wagmi s'exécutent avec
   * la closure du rendu en cours, or `setTxData` n'était pas encore appliqué
   * quand `writeContract` démarrait — le nettoyage IPFS pouvait donc être
   * ignoré (constat FE-06 de l'audit).
   */
  const preparedRef = useRef<PreparedCertificate | null>(null)

  const [error, setError] = useState<string | null>(null)
  const { ensureSession, isConnected } = useSiweSession()

  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onSuccess: (hash) => {
        const prepared = preparedRef.current
        if (!prepared) return

        const result: MintResult = {
          txHash: hash,
          tokenId: null,
          metadataCid: prepared.tokenURI,
          imageCid: prepared.imageCID,
        }

        onResult?.(result)
        preparedRef.current = null
      },

      onError: async (err) => {
        console.error("[TX ERROR]", err)

        const prepared = preparedRef.current
        if (prepared && prepared.receipts.length > 0) {
          await deleteFiles(prepared.receipts)
        }

        preparedRef.current = null
        setError("La transaction a échoué. Les fichiers publiés ont été retirés d'IPFS.")
      },
    },
  })

  // Gestion des itérations du processus créatif
  const {
      fields: iterationFields,
      append: addIteration,
      remove: removeIteration,
    } = useFieldArray({
      control,
      name: "iterations",
    });
  useEffect(() => {
    if (iterationFields.length === 0) {
      addIteration({
        prompt: "",
        model: "",
        provider: "",
        mode: "",
        sourceFile: null,
        sourceFileDesc: "",
        personalData: false,
        ipfsPublish: true,
        iterationImage: null,
      });
    }
  }, [iterationFields, addIteration]);


  const onSubmit = async (data: CertificationFormData) => {
    setError(null)
    // L'image de l'oeuvre finale est obligatoire
    if (!data.finalArtworkFileOriginal) {
      setError("Veuillez téléverser le fichier de l'œuvre finale.")
      return;
    }
    if (!isConnected) {
      setError("Connectez votre portefeuille avant de certifier une œuvre.")
      return;
    }

    /*
     * Ouverture de la session applicative avant tout appel serveur.
     * La publication IPFS consomme un compte payant : elle est réservée aux
     * utilisateurs ayant prouvé la possession de leur adresse par signature
     * (correctif SEC-01). La session dure une heure, l'utilisateur ne signe
     * donc pas à chaque certificat.
     */
    const authenticated = await ensureSession()
    if (!authenticated) {
      setError("La signature de connexion est nécessaire pour publier sur IPFS.")
      return;
    }

    // Génération du certificat
    try {
      const prepared = await getTransactionData(data)
      preparedRef.current = prepared
      // Interaction avec le contrat pour le mint du NFT
      writeContract({
        ...contractConfig,
        functionName: 'useCertificationService',
        args: [prepared.tokenURI],
      })
    } catch (err) {
        console.error("[CERTIFICATE ERROR]", err)
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de la préparation du certificat"
        )
    }
  };

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form
        /* `handleSubmit` est composé au moment de la soumission et non pendant
           le rendu : `onSubmit` lit `preparedRef`, et le compilateur React
           interdit qu'une fonction accédant à une ref soit évaluée au rendu. */
        onSubmit={(event) => { void methods.handleSubmit(onSubmit)(event); }}
        className="space-y-4"
        >
          <h4 className="mt-10 mb-2 block text-lg font-bold text-white before:content-['1._'] before:mr-2">
          Information sur l&apos;œuvre finale
          </h4>
          <ArtworkFormController />

          <h4 className="mt-10 mb-2 block text-lg font-bold text-white before:content-['2._'] before:mr-2">
            Processus créatif - itérations
          </h4>
          {iterationFields.map((field, index) => (
            <IterationFormController
              key={field.id}
              index={index}
              removeIteration={index === 0 ? () => {} : () => removeIteration(index)}
            />
          ))}

          <button
            type="button"
            className="btn-action px-6 mb-20 mt-10"
            onClick={() => {
              addIteration({
                prompt: "",
                model: "",
                provider: "",
                mode: "",
                sourceFile: null,
                sourceFileDesc: "",
                personalData: false,
                ipfsPublish: true,
                iterationImage: null,
              });
            }}
          >
            Ajouter l&apos;itération précédente
          </button>

          <h4 className="mt-10 mb-2 block text-lg font-bold text-white before:content-['3._'] before:mr-2">
            Paramètres techniques généraux
          </h4>
          <ParametersFormController />

          <h4 className="mt-10 mb-2 block text-lg font-bold text-white before:content-['4._'] before:mr-2">
            Déclarations juridiques
          </h4>
          <LegalFormController />

          <h4 className="mt-10 mb-2 block text-lg font-bold text-white before:content-['5._'] before:mr-2">
            Validation finale
          </h4>
          <ValidationFormController />

          {/* Boutons de soumission et d’abandon */}
          <button 
            type="submit" 
            className="btn-action margin-right-20"
            disabled={isPending}
            >
            {isPending && (
              <UpdateIcon className="animate-spin [animation-duration:3s] inline-block ml-2 mb-1 border-t-transparent rounded-full h-10 w-10 m-2" />
            )}
            {isPending ? "Certification en cours..." : "Certifier l'oeuvre"}
          </button>
          <button
            type="button"
            className="btn-action m-4"
            disabled={isPending}
            onClick={() => {
              console.log("FORM RESET");
              methods.reset();
              window.scrollTo({ top: 200, behavior: "smooth" });
            }}
          >Abandonner
          </button>
        </form>
        {error && (
          <div className="text-red-600">{error}</div>
        )}
      </Form>
    </FormProvider>
  );
};

export default CertificateForm;

import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { useEffect } from 'react';
import { UpdateIcon } from "@radix-ui/react-icons";
import { v4 as uuidv4 } from "uuid";
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

import { CertificationFormData, FileMetadata, CertificateFormProps, MintResult } from '@/utils/interfaces';
import { uploadImageFile, uploadJsonFile, deleteFiles } from '@/services/storage';

import { useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent , type BaseError  } from 'wagmi';
import { useAppKitAccount } from '@reown/appkit/react';

import { contractConfig, MindchainContractAddress } from "@/abi/MindchainContract";


// Image Mindchain par défaut si l’utilisateur ne publie pas l’image finale sur IPFS
const MINDCHAIN_NFT_CID = "bafybeidpcbs5gklqwqgb22hsmb5vlyv242lvttlpenmapb72fxjrnsawde";

// Fonction utilitaire pour générer les métadonnées d’un fichier
const getFileMetadata = (file: File): FileMetadata => {
  const metadata = {
    type: file.type,
    name: file.name.toLowerCase().trim(),
    size: file.size,
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
const shortUuid = (): string => {
  const uuid = uuidv4().replace(/-/g, "");        // 32 hex
  const bytes = Uint8Array.from(uuid.match(/.{2}/g)!.map(b => parseInt(b, 16)));
  return bs58.encode(bytes);                      // ~22 chars
};

async function getTransactionData(form: CertificationFormData): Promise<{jsonCID: string, imageCID: string}> {

  // Génération d’un ID unique pour le certificat
  const certificateId = shortUuid();
  const attributes: any[] = [];

  // Gestion du fichier de l’image finale
  const originalFile: File = form.finalArtworkFileOriginal as File;
  const originalFileMetadata: FileMetadata = getFileMetadata(originalFile);
  let imageCID: string | null = null;
  let jsonCID: string | null = null;

  // Refus publication IPFS (false) ou Image compressée invalide/manquante (null)
  if(form.finalArtworkFileIpfsPublish === false || !form.finalArtworkFile || !(form.finalArtworkFile instanceof File)) {
    // On utilise le CID par défaut
    imageCID = MINDCHAIN_NFT_CID;
  } else {
    // Generation du CID de l’image finale
    try {
      // Nommage de l'image sur IPFS
      const filename = `${certificateId}.${originalFileMetadata.name}`;
      imageCID = await uploadImageFile(form.finalArtworkFile, filename);
    } catch (err) {
      console.error("[Certificat] Erreur lors de l’upload de l’image finale sur IPFS :", err);
      throw err;
    }
  }
  // Gestion du CID de l’image finale
  if (!imageCID) {
    alert("Erreur lors de l’upload de l’image finale sur IPFS. Votre image ne sera pas publiée.");
    imageCID = await getCID(originalFile);
  }

  interface iterationFileMetadata {
    metadata :FileMetadata,
    cid : string,
    description: string | null,
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
          description: null,
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

    // Construction de l’objet certificat
    const certificate = {
      name: form.title.toLowerCase().trim(),
      description: form.description.toLowerCase().trim(),
      image: imageCID,
      external_url:'',
      attributes: attributes,
      creation: {
        certification_timestamp: Date.now(),
        certificate_id: certificateId
      },
      contract_address: MindchainContractAddress,
    };

    // Upload des métadonnées du certificat sur IPFS
    const uploadJsonFilename = `Mindchain_certification_${certificateId}.json`;
    jsonCID = await uploadJsonFile(certificate, uploadJsonFilename);
  } catch (err) {
    console.error("[Certificat] Erreur lors de la préparation des données du certificat :", err);
    // En cas d’erreur lors de la préparation des données, on supprime les fichiers uploadés sur IPFS (si applicable)
    if(imageCID && imageCID !== MINDCHAIN_NFT_CID) {
      await deleteFiles([imageCID]);
    }
    if(jsonCID) {
      await deleteFiles([jsonCID]);
    }
    throw err;
  } 
  if (jsonCID === null || imageCID === null) {
    throw new Error("[Certificat] Erreur lors de lors de la préparation des métadonnées du certificat.");
  }
  return {jsonCID, imageCID};
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

  const {
    fields: iterationFields,
    append: addIteration,
    remove: removeIteration,
  } = useFieldArray({
    control,
    name: "iterations",
  });
  const { address } = useAppKitAccount();
  const { data: hash, isPending, error, writeContract  } = useWriteContract ();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
  })

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

  useWatchContractEvent({
    ...contractConfig,
    eventName: 'CertificationMinted',
    onLogs(logs) {
      console.log('CertificationMinted event logs:', logs);
    }
  });

  const onSubmit = async (data: CertificationFormData) => {
    // L'image de l'oeuvre finale est obligatoire
    if (!data.finalArtworkFileOriginal || !(data.finalArtworkFileOriginal instanceof File)) {
      alert("Veuillez télécharger le fichier de l'œuvre finale.");
      return;
    }
    // Génération du certificat
    let txData: {jsonCID: string, imageCID: string} = {jsonCID: "", imageCID: ""};
    try {
      txData = await getTransactionData(data);
      // Interaction avec le contrat pour le mint du NFT
      writeContract({
        ...contractConfig,
        functionName: 'mintCertification',
        args: [address, txData.jsonCID!],
      })
      if (!hash) {
        // En cas d’erreur lors du mint, on supprime les fichiers uploadés sur IPFS (si applicable)
        await deleteFiles([txData.imageCID!, txData.jsonCID!]);
        throw new Error("[Certificat] Erreur lors du mint du certificat NFT.");  
      }
      console.log("CERTIFICATE GENERATED");
      let mintCertificationResult: MintResult | null = null;
      if(isConfirmed) { 
        mintCertificationResult = {
          txHash: hash,
          tokenId: null,
          metadataCid: txData.jsonCID,
          imageCid: txData.imageCID
        };
      }
      if (onResult) onResult(mintCertificationResult);
    } catch (err) {
      console.error("CERTIFICATE ERROR:", err);
      await deleteFiles([txData.imageCID!, txData.jsonCID!]);
      alert("Erreur lors de la génération du certificat.");
    }
  };

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">

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
            {methods.formState.isSubmitting && (
              <UpdateIcon className="animate-spin [animation-duration:3s] inline-block ml-2 mb-1 border-t-transparent rounded-full h-10 w-10 m-2" />
            )}
            {methods.formState.isSubmitting ? "Certification en cours..." : "Certifier l'oeuvre"}
          </button>
          <button
            type="button"
            className="btn-action m-4"
            disabled={isPending}
            onClick={() => {
              console.log("FORM RESET");
              methods.reset();
            }}
          >Abandonner
          </button>
        </form>
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>} 
      {error && (
        <div className='text-red-600'>
          Error: {(error as BaseError).shortMessage || error.message}
        </div>
      )}
      </Form>
    </FormProvider>
  );
};

export default CertificateForm;

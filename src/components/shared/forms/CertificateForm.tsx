import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import ArtworkFormController from '@/components/shared/forms/ArtworkFormController';
import IterationFormController from '@/components/shared/forms/IterationFormController';
import ParametersFormController from '@/components/shared/forms/ParametersFormController';
import LegalFormController from '@/components/shared/forms/LegalFormController';
import ValidationFormController from '@/components/shared/forms/ValidationFormController';
import { generateCertificate } from '@/services/certificate';
import { CertificateFormData } from '@/utils/interfaces';
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useEffect } from 'react';
import { UpdateIcon } from "@radix-ui/react-icons";

interface CertificateFormProps {
  onResult?: (result: any) => void;  // 🔥 typé !
}

const CertificateForm = ({ onResult }: CertificateFormProps) => {
  const { address } = useAppKitAccount();
  const { walletProvider: walletProvider } = useAppKitProvider("eip155");

  const methods = useForm<CertificateFormData>({
    mode: "onSubmit",
    defaultValues: {
      title: '',
      description: '',
      finalArtworkFile: null,
      finalArtworkFileCid: null,
      finalArtworkFileIpfsPublish: true,
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

const onSubmit = async (data: CertificateFormData) => {
  if (!data.finalArtworkFile) {
    alert("Veuillez télécharger le fichier de l'œuvre finale.");
    return;
  }
  // Génération du certificat
  try {
    const result = await generateCertificate(data, address, walletProvider);
    console.log("CERTIFICATE GENERATED", result);
    if (onResult) onResult(result);
  } catch (e) {
    console.error("CERTIFICATE ERROR:", e);
    // Gérer l'erreur (affichage message, etc.)
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

          <button type="submit" className="btn-action margin-right-20">
            {methods.formState.isSubmitting && (
              <UpdateIcon className="animate-spin [animation-duration:3s] inline-block ml-2 mb-1 border-t-transparent rounded-full h-10 w-10" />
            )}
            {methods.formState.isSubmitting ? "Certification en cours..." : "Certifier l'oeuvre"}
          </button>
          <button
            type="button"
            className="btn-action m-4 bg-red-600 hover:bg-red-700"
            onClick={() => {
              console.log("FORM RESET");
              methods.reset();
            }}
          >Abandonner
          </button>
        </form>
      </Form>
    </FormProvider>
  );
};

export default CertificateForm;

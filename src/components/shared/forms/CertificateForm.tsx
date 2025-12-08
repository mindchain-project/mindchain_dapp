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

const CertificateForm = () => {
  const { address } = useAppKitAccount();
  const { walletProvider: walletProvider } = useAppKitProvider("eip155");

  const methods = useForm<CertificateFormData>({
    defaultValues: {
      title: '',
      description: '',
      uploadedFile: null,
      iterations: [],
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

const onSubmit = async (data: CertificateFormData) => {
  console.log("FORM FINAL SUBMIT:", data);
  try {
    await generateCertificate(data, address, walletProvider);
    console.log("CERTIFICATE GENERATED");
  } catch (e) {
    console.error("CERTIFICATE ERROR:", e);
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
              iterationNumber={index + 1}
              removeIteration={() => removeIteration(index)}
            />
          ))}

          <button
            type="button"
            className="btn-action px-6 mb-20"
            onClick={() => addIteration({ 
              prompt: "", 
              model: "", 
              provider: "", 
              mode: "", 
              sourceFile: null, 
              sourceFileDesc: "", 
              personalData: false, 
              ipfsPublish: true, 
              iterationImage: null 
            } satisfies CertificateFormData["iterations"][number])}
          >
            Ajouter une itération
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

          <button type="submit" className="btn-action">
            Prévisualiser le certificat
          </button>
          <button
            type="button"
            className="btn-action m-4 bg-red-600 hover:bg-red-700"
            onClick={() => {
              console.log("FORM RESET");
              methods.reset();
              methods.setValue("uploadedFile", null);
            }}
          >Abandonner
          </button>
        </form>
      </Form>
    </FormProvider>
  );
};

export default CertificateForm;

import { FormProvider, useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import ArtworkFormController from '@/components/shared/forms/ArtworkFormController';
import IterationFormController from '@/components/shared/forms/IterationFormController';
import ParametersFormController from '@/components/shared/forms/ParametersFormController';
import LegalFormController from '@/components/shared/forms/LegalFormController';
import ValidationFormController from '@/components/shared/forms/ValidationFormController';
import { generateCertificate } from '@/services/certificate';
import { it } from 'node:test';

const CertificateForm = () => {

  const methods = useForm({
    defaultValues: {
      title: '',
      description: '',
      uploadedFile: null,
      prompt: '',
      model: '',
      provider: '',
      mode: '',
      sourceFile: null,
      sourceFileDesc: '',
      personalData: false,
      ipfsPublish: false,
      iterationImage: null,
      legal: {
        authorshipConfirmation: false,
        thirdPartyRights: false,
        exploitationRights: false,
        license: false,
      },
      iterations: [],
      parameters: {
        'main-provider': '',
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

  const onSubmit = (data) => {
    console.log("FORM FINAL SUBMIT:", data);
    generateCertificate(data);
  };

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <ArtworkFormController />
          <IterationFormController />
          <button className="btn-action px-6 mb-20">
            Ajouter une itération
          </button>
          <ParametersFormController />
          <LegalFormController />
          <ValidationFormController />
          <button type="submit" className="btn-action">
            Prévisualiser le certificat
          </button>
          <button
            type="button"
            className="btn-action m-4 bg-red-600 hover:bg-red-700"
            onClick={() => {
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

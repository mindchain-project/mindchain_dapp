import {StudioTabProps} from '@/utils/interfaces';
import CertificateForm from '@/components/shared/forms/CertificateForm'

const Certification = (props: StudioTabProps) => {
    console.log("Certification props:", props);
  return (
     <section className="space-y-4 justify-self-center">
        <h3 className="text-xl font-semibold gradient-text">Certification d&apos;oeuvre</h3>
        <p className="text-muted-foreground w-full">Pour faire certifier votre création IA en toute simplicité, remplissez le formulaire ci-dessous.<br/>
        Tous les champs marqués d&apos;un astérisque (*) sont obligatoires.</p>
        <CertificateForm />
    </section>
  )
}

export default Certification
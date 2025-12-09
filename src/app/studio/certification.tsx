import {StudioTabProps} from '@/utils/interfaces';
import CertificateForm from '@/components/shared/forms/CertificateForm'
import { useState } from 'react';
import { MintResult } from '@/utils/interfaces';

const Certification = (props: StudioTabProps) => {

  const [certificationResult, setCertificationResult] = useState<MintResult | null>(null);

  return (
     <section className="space-y-4 justify-self-center">
        <h3 className="text-xl font-semibold gradient-text">Certification d&apos;oeuvre</h3>
        <p className="text-muted-foreground w-full">Pour faire certifier votre création IA en toute simplicité, remplissez le formulaire ci-dessous.<br/>
        Tous les champs marqués d&apos;un astérisque (*) sont obligatoires.</p>

      {/* Affichage du formulaire */}
      {!certificationResult && (
        <CertificateForm onResult={(data) => setCertificationResult(data)}/>
      )}

      {/* Affichage du résultat */}
      {certificationResult && (
        <div className="mt-6 p-4 bg-green-900/30 border border-green-600 rounded-lg text-white">
          <h4 className="font-bold mb-2">Félicitations ! Votre certification est on-chain ! 🎉</h4>

          {certificationResult.txHash && (
            <p><strong>Transaction :</strong> {certificationResult.txHash}</p>
          )}

          {certificationResult.metadataCid && (
            <p><strong>Metadata CID :</strong> {certificationResult.metadataCid}</p>
          )}

          {certificationResult.tokenId && (
            <p><strong>Image CID :</strong> {certificationResult.tokenId}</p>
          )}

          <button 
            onClick={() => setCertificationResult(null)}
            className='btn-action px-6 mt-4'
            >
              Certifier une nouvelle oeuvre
              </button>

        </div>
      )}
    </section>
  )
}

export default Certification
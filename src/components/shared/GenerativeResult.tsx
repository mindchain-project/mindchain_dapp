'use client';
import Image from 'next/image';
import { useGenerativeContext } from './GenerativeContext';
import { useEffect, useState } from 'react';
import { retrieveFile } from '@/services/storage';

const GenerativeResult = (props : { address: string }) => {
  // console.log("GenerativeResult props:", props.address);
  const { promptRequest, setPromptRequest, promptResult, setPromptResult } = useGenerativeContext();
  const isResultValid = promptResult && promptResult.cid !== '';

  const [imageUrl, setImageUrl] = useState<string | null>(null);  
  console.log("GenerativeResult - promptRequest:", promptRequest);
  console.log("GenerativeResult - promptResult:", promptResult);

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (promptResult?.cid) {
        const url = await retrieveFile(promptResult.cid);
        setImageUrl(url);
      }
    };
    fetchImageUrl();
    console.log("GenerativeResult - imageUrl:", imageUrl);
  }, [promptResult, imageUrl]);


  // Génération et téléchargement du certificat
  const generateCertificate = async () => {
    const certificateData = {
      "title": "Asset Metadata",
      "type": "object",
      "properties": {
          "name": {
              "type": "string",
              "description": promptRequest?.title
          },
          "description": {
              "type": "string",
              "description": "Image generated with AI"
          },
          "image": {
              "type": "string",
              "description": promptResult?.cid
          },
          "prompt": {
              "type": "string",
              "description": promptRequest?.prompt
          },
          "model": {
              "type": "string",
              "description": promptRequest?.model
          },
          "date": {
              "type": "string",
              "description": promptResult?.date
          }
      }
    };
    // // Appel de la fonction server-side pour générer et télécharger le certificat
    // const certifiedImage = await certificateImage(certificateData);
    // const blob = new Blob(
    //   [Uint8Array.from(atob(certifiedImage.content), c => c.charCodeAt(0))],
    //   { type: "application/json" }
    // // );

    // const url = URL.createObjectURL(blob);

    // const link = document.createElement("a");
    // link.href = url;
    // link.download = certifiedImage.fileName;
    // link.click();

    // URL.revokeObjectURL(url);
  };


  return (
    <>
      {isResultValid && (
      <div>
        <div className="mt-4 flex flex-col gap-2">
          <div>Titre: {promptRequest?.title}</div>
          <div>Prompt: {promptRequest?.prompt}</div>
          <div>Modèle: {promptRequest?.model}</div>
          <div>Date: {promptResult?.date}</div>
          <div>Cid IPFS: {promptResult?.cid}</div>
          {imageUrl && (
          <Image src={imageUrl} width={500} height={500} alt={promptRequest?.title || ""} />
          )}
        </div>

        <div className="flex gap-4 mt-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={generateCertificate}>
            Générer le certificat
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded"
            type='button'
            onClick={() => {
              setPromptResult({ id: '', url: '', date: '', cid: '' });
              setImageUrl(null);
              setPromptRequest({ title: '', prompt: '', model: '', uploadedFile: null });
            }}
            >
            Abandonner
          </button>
        </div>
      </div>
      )}
      </>
  );
};

export default GenerativeResult;

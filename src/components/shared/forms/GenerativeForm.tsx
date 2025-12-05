'use client';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useGenerativeContext } from '@/components/shared/GenerativeContext';
import Image from 'next/image';
import { X } from "lucide-react";
import { generateImage, generateImageDemo } from '@/services/generate';



// Nouvelle itération en réutilisant l’image générée comme entrée
const newIteration = async () => {
  // try {
  //   // Si une image a été générée, la récupérer et la charger en tant que fichier pour l'entrée suivante
  //   if (imageUrl) {
  //     const res = await fetch(imageUrl);
  //     const blob = await res.blob();
  //     const fileName = ((title +"_" + data?.["Image Id"]) || 'generated').replace(/\s+/g, '_') + '.png';
  //     const nextFile = new File([blob], fileName, { type: blob.type || 'image/png' });
  //     setUploadedFile(nextFile);
  //     setUploadedFileUrl(URL.createObjectURL(nextFile));
  //   } else {
  //     setUploadedFile(null);
  //     setUploadedFileUrl(null);
  //   }
  // } catch (err) {
  //   console.error('Failed to load generated image for new iteration:', err);
  // } finally {
  //   setImageUrl('');
  //   setData(null);
  //   console.log('Nouvelle itération de génération');
  // }
}


const GenerativeForm = (props : { address: string }) => {
  // console.log("GenerativeForm props:", props.address);
  // Extraction des valeurs et fonctions du contexte
  const { signature, handleSignMsg, promptRequest, setPromptRequest, promptResult, setPromptResult } = useGenerativeContext();
  const [signatureChecked, setSignatureChecked] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  // Initialisation du formulaire avec react-hook-form
  const methods = useForm({
    defaultValues: { 
    title: promptRequest?.title ?? '',
    prompt: promptRequest?.prompt ?? '',
    model: promptRequest?.model ?? '',
    uploadedFile: promptRequest?.uploadedFile ?? null,
    },
  });
  // Surveillance des champs du formulaire
  const { watch } = methods;
  const watchedTitle = watch('title');
  const watchedPrompt = watch('prompt');
  const watchedModel = watch('model');
  const { reset: formReset } = methods;

  // const watchedIpfsConsent = watch('ipfsConsent');
  // Autorise la validation du formulaire uniquement si tous les champs sont remplis
  const isFormValid = watchedTitle.length > 0 && watchedPrompt.length > 0 && watchedModel !== 'null';
  // Message à signer pour autoriser le cryptage des créations génératives
  const ipfsMsg = "J'autorise Mindchain à stocker ma création sur IPFS.";
  const sigMsg = "J'autorise Mindchain à utiliser ma clé privée pour crypter mes créations.";

  const formatTitle = (title: string) => {
    return title.toLowerCase().trim().replace(/\s+/g, '_');
  };

  // Met à jour/revoque l'URL d'aperçu quand le fichier change
  useEffect(() => {
    // Révoque l'ancienne URL si présente
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    // Crée une nouvelle URL d'aperçu si un fichier est uploadé
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      setPreviewUrl(url);
    }
    // Cleanup au démontage
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFile]);

  // Fonction de génération de l'image
  const generatePrompt = async (promptRequest: {title: string, prompt: string, model: string, uploadedFile: File | null}) => {
    console.log("Generating image with promptRequest:", promptRequest);
    const result = await generateImage(
      promptRequest.model,
      promptRequest.prompt,
      promptRequest.uploadedFile
    );
    setPromptResult(result);
  };
  // Fonction de génération de l'image en mode démo
  const generatePromptDemo = async () => {
    console.log("Generating DEMO image with promptRequest:");
    const result = await generateImageDemo();
    setPromptResult(result);
  };

  // Prépare une nouvelle itération en réutilisant l’image générée comme entrée
  const prepareNextIteration = async () => {
    try {
      if (promptResult?.cid && promptRequest?.title) {
        setUploadedFile(null);
        const res = await fetch(promptResult.cid);
        const blob = await res.blob();
        const fileName = (promptRequest.title || "generated").replace(/\s+/g, "_") + ".png";
        const nextFile = new File([blob], fileName, {
          type: blob.type || "image/png",
        });
        console.log("Next file for new iteration:", promptResult.cid);
        // Mise à jour locale
        setUploadedFile(nextFile);
        const imgUrl = `https://gateway.pinata.cloud/ipfs/${promptResult.cid}`;
        setPreviewUrl(imgUrl);
        // Mise à jour du contexte
        setPromptRequest({
          ...promptRequest,
          uploadedFile: nextFile,
        });
      // Reset du résultat précédent
      //setPromptResult({ id: '', url: '', date: '', cid: '' });
      } else {
        return;
      }
    } catch (error) {
      console.error("Erreur nouvelle itération :", error);
    }
  };

  return (
      <FormProvider {...methods}>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await handleSignMsg(sigMsg);
              //await prepareNextIteration();
              //await generatePrompt(promptRequest);
              await generatePromptDemo()
            } catch (err) {
              console.error("Signature error:", err);
            }
          }}>

          {/* Title input */}
          <Controller
            name="title"
            control={methods.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    value={watchedTitle}
                    onChange={(e) => {
                      field.onChange(e);
                      setPromptRequest((prev) => ({...prev, title: e.target.value ?? ""}));
                    }}
                    placeholder="Titre de votre création."
                    className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Prompt input */}
          <Controller
            name="prompt"
            control={methods.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    value={watchedPrompt}
                    onChange={(e) => {
                      field.onChange(e);
                      //setPrompt(e.target.value);
                      setPromptRequest((prev) => ({...prev, prompt: e.target.value ?? ""}));
                    }}
                    placeholder="Un chat dans un style cyberpunk."
                    className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Model input*/}
          <Controller
            name="model"
            control={methods.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modèle</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    value={watchedModel}
                    onChange={(e) => {
                      field.onChange(e);
                      // setModel(e.target.value);
                      setPromptRequest((prev) => ({...prev, model: e.target.value ?? ""}));
                    }}
                    className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Choisir un modèle --</option>
                    <option value="gemini">gemini-2.5-flash-image</option>
                    <option value="flux">FLUX.1-Kontext-dev</option>
                  </select>
                </FormControl>
              </FormItem>
            )}
          />

         {/* Upload File input */}
          <div className="space-y-2">
            <FormLabel>Fichier</FormLabel>
            <div className="relative">
              {/* Hidden file input */}
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                className="hidden"
                //onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setUploadedFile(file);
                  setPromptRequest((prev) => ({...prev, uploadedFile: file ?? null}));
                }}
              />
              {/* Custom label serving as a button */}
              <label
                htmlFor="fileInput"
                className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {uploadedFile ? uploadedFile.name : "Importer une image source..."}
              </label>
              {/* Reset button */}
              {uploadedFile && (
                <button
                  type="button"
                  onClick={() => {
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {/* Image preview */}
            {previewUrl && uploadedFile && (
              <div className="mt-4 relative inline-block">
                <Image
                  src={previewUrl}
                  width={500}
                  height={500}
                  alt="Preview"
                  className="rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* IPFS consent checkbox
          <div className="flex items-start gap-2 px-2 py-2 rounded-md p-3">
            <input
              id="ipfsConsent"
              type="checkbox"
              className="mt-1 h-4 w-4 cursor-pointer"
              checked={watchedIpfsConsent}
              onChange={async (e) => {
                const wantCheck = e.target.checked;
                // Mise à jour du consentement dans le formulaire et le contexte
                methods.setValue('ipfsConsent', wantCheck);
                setPromptRequest({...promptRequest, ipfsConsent: wantCheck});
              }}
              disabled={!uploadedFile}
            />
            <label htmlFor="ipfsConsent" className="text-sm leading-tight select-none">
                <span className="text-red-700">{ipfsMsg}</span>
            </label>
          </div> */}

          {/* Signature checkbox */}
          <div className="flex items-start gap-2 px-2 py-2 rounded-md p-3">
            <input
              id="signatureConsent"
              type="checkbox"
              className="mt-1 h-4 w-4 cursor-pointer"
              checked={!!signature && signatureChecked}
              onChange={async (e) => {
                const wantCheck = e.target.checked;
                if (wantCheck && !signature) {
                  try {
                    await handleSignMsg(ipfsMsg);
                    setSignatureChecked(true);
                  } catch (err) {
                    console.error('Erreur de signature:', err);
                    setSignatureChecked(false);
                  }
                } else if (!wantCheck) {
                  // On laisse la signature existante intacte mais on désactive l'utilisation (ou on pourrait la purger si besoin)
                  setSignatureChecked(false);
                }
              }}
              disabled={!isFormValid}
            />
            <label htmlFor="signatureConsent" className="text-sm leading-tight select-none">
                <span className="text-red-700">{ipfsMsg}</span>
              <br />
              <span className="text-xs text-gray-500">La signature prouve votre consentement à associer l’adresse à cette création.</span>
            </label>
          </div>

          {/* Generate and reset buttons */}
          <div className="flex gap-4 justify-center">
            {!promptResult?.cid && (
            <button
              type="submit"
              disabled={!(isFormValid && signature && signatureChecked)}
              className="mx-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600 disabled:hover:bg-blue-500"
            >
              Générer l&apos;image
            </button>
            )}
            {!promptResult?.cid && (
            <button 
              type='button'
              className="mx-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => {
              formReset({        // reset du formulaire
                title: '',
                prompt: '',
                model: '',
                uploadedFile: null,
              });
              setUploadedFile(null);   // reset preview
              setPreviewUrl(null);     // reset preview
            }}
              >
              Réinitialiser
            </button>
            )}
            {/* {promptResult.cid && (
            <button
              type="submit"
              className="mx-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600 disabled:hover:bg-blue-500"
            >
              Nouvelle itération
            </button>
            )} */}
          </div>
        </form>
      </FormProvider>
  );
};

export default GenerativeForm;

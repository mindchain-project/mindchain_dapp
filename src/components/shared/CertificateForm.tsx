import { useEffect, useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { FormItem, FormLabel, FormControl, FormDescription, FormField } from '@/components/ui/form';
import { Input } from '../ui/input';
import { Label } from '@radix-ui/react-label';
import Link from 'next/link';
import { X } from "lucide-react";

const CertificateForm = (props : { address: string, model: string }) => {
  
  console.log("CertificateForm props:", props.address, props.model);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [model, setModel] = useState('');
  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState('');
  const [mode, setMode] = useState('');


  const methods = useForm({
    defaultValues: {
      title: '',
      description: '',
      uploadedFile: null,
      model: '',
      prompt: '',
      provider: '',
      mode: '',
    }
  });
  const { watch } = methods;
  const watchedTitle = watch('title');
  const watchedDescription = watch('description');
  const watchedModel = watch('model');
  const watchedPrompt = watch('prompt');
  const watchedProvider = watch('provider');
  const watchedMode = watch('mode');

  return (
    <>
     <FormProvider {...methods}>
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            //await handleSignMsg(sigMsg);
          } catch (err) {
            console.error("Signature error:", err);
          }
        }}>
      <Label htmlFor="title" className="mb-2 block text-lg font-bold text-white before:content-['1._'] before:mr-2 before:text-white">
      Information sur l&apos;oeuvre finale
      </Label>
      <Controller
        name="title"
        control={methods.control}
        render={({ field }) => (
          <FormItem>
            {/* Title input */}
            <FormLabel>Titre de l&apos;oeuvre</FormLabel>
            <FormControl>
              <input
                {...field}
                value={watchedTitle}
                onChange={(e) => {
                  field.onChange(e);
                  setTitle(e.target.value);
                }}
                placeholder="Titre de votre création."
                className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </FormControl>
            {/* Description input */}             
            <FormLabel>Description de l&apos;oeuvre</FormLabel>
            <FormControl>
              <input
                {...field}
                value={watchedDescription}
                onChange={(e) => {
                  field.onChange(e);
                  setDescription(e.target.value);
                }}
                placeholder="Description de votre création."
                className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </FormControl>
            {/* File upload input */}
            <FormLabel>Image finale</FormLabel>
            <FormControl>
            {/* Upload File input */}
            <div className="space-y-2">
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
                  }}
                />
              {/* Custom label serving as a button */}
              <label
                htmlFor="fileInput"
                className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {uploadedFile ? uploadedFile.name : "Importer l'image de l'oeuvre finale"}
              </label>
              {/* Reset button */}
              {uploadedFile && (
                <button
                  type="button"
                  onClick={() => setUploadedFile(null)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            </div>
          </FormControl>
          </FormItem>
        )}
      />
      <Label htmlFor="model" className="mb-2 block text-lg font-bold text-white before:content-['2._'] before:mr-2 before:text-white">
      Processus créatif - itérations
      </Label>
      <Controller
        name="prompt"
        control={methods.control}
        render={({ field }) => (
        <FormItem>   
          <FormLabel>Texte du prompt</FormLabel>
          <FormControl>
            <input
              {...field}
              value={watchedPrompt}
              onChange={(e) => {
                field.onChange(e);
                setPrompt(e.target.value);
              }}
              placeholder="Description de votre création."
              className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </FormControl>
          <FormLabel>Modèle utilisé</FormLabel>
          <FormControl>
            <select
              {...field}
              value={watchedModel}
              onChange={(e) => {
                field.onChange(e);
                // setModel(e.target.value);
              }}
              className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">-- Choisir un modèle --</option>
              <option value={"openai"}>Open AI</option>
              <option value={"midjourney"}>Midjourney</option>
              <option value={"flux"}>Flux</option>
              <option value={"gemini"}>Gemini</option>
            </select>
          </FormControl>
        <FormLabel>Fournisseur</FormLabel>
          <FormControl>
            <select
              {...field}
              value={watchedProvider}
              onChange={(e) => {
                field.onChange(e);
                setProvider(e.target.value);
              }}
              className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">-- Choisir un fournisseur --</option>
              <option value={"openai"}>Open AI</option>
              <option value={"midjourney"}>Midjourney</option>
              <option value={"flux"}>Flux</option>
              <option value={"gemini"}>Gemini</option>
            </select>
          </FormControl>    
          <FormLabel>Mode</FormLabel>
          <FormControl>
            <select
              {...field}
              value={watchedMode}
              onChange={(e) => {
                field.onChange(e);
                setMode(e.target.value);
              }}
              className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">-- Choisir un mode --</option>
              <option value={"i2i"}>Image to image</option>
              <option value={"t2i"}>Text to image</option>
              <option value={"inP"}>In Painting</option>
            </select>
          </FormControl>     
          <Input type="file" placeholder="Fichier source (upload)" className='bg-white text-gray-500' />
          <Input type="text" placeholder="Description du rôle du fichier source" className='h-18'/>
          <div className='flex content-center py-0 my-0'><Input type="checkbox" className='h-4 w-4 m-4'/><p className='text-sm py-0 my-0'>Contient des données personnelles.</p></div>
          <div className='flex content-center py-0 my-0'><Input type="checkbox" className='h-4 w-4 m-4'/><p className='text-sm py-0 my-0'>Autoriser la publication IPFS.</p></div>
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Ajouter une itération
          </button>
        </FormItem>
        )}
      />

      </form>
    </FormProvider>
    </>
  )
}

export default CertificateForm
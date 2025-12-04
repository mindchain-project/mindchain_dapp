import { useEffect, useState } from 'react';
import { useFormContext, Controller, set } from 'react-hook-form';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Label } from '@radix-ui/react-label';
import { X } from "lucide-react";

const IterationFormController = () => {

    const { control, watch } = useFormContext();

    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [iterationImage, setIterationImage] = useState<File | null>(null);

    const watchedPrompt = watch('prompt');
    const watchedModel = watch('model');
    const watchedProvider = watch('provider');
    const watchedMode = watch('mode');
    const watchedSourceFileDesc = watch('sourceFileDesc');
    const watchedPersonalData = watch('personalData');
    const watchedIpfsPublish = watch('ipfsPublish');
    const watchedIterationImage = watch('iterationImage');

    useEffect(() => {
        console.log("ITERATION :", watchedPrompt, watchedModel, watchedProvider, watchedMode, watchedSourceFileDesc, watchedPersonalData, watchedIpfsPublish, watchedIterationImage);
    }, [watchedPrompt, watchedModel, watchedProvider, watchedMode, watchedSourceFileDesc, watchedPersonalData, watchedIpfsPublish, watchedIterationImage]);

    return (
    <>
    <Label htmlFor="iteration" className="mt-4 mb-2 block text-lg font-bold text-white before:content-['2._'] before:mr-2 before:text-white">
        Processus créatif - itérations
    </Label>
    {/* PROMPT */}
    <Controller
        name="prompt"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
            <FormItem>
            <FormLabel>Texte du prompt *</FormLabel>
            <FormControl>
                <textarea
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border h-25 px-3 py-2 resize-y"
                placeholder='Entrez le texte du prompt ici...'
                />
            </FormControl>
            </FormItem>
        )}
        />
    {/* MODEL */}
    <Controller
        name="model"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
            <FormItem>
            <FormLabel>Modèle utilisé *</FormLabel>
            <FormControl>
                <select
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                className="text-sm bg-gray-100 text-blue-700 rounded-md border py-2"
                >
                <option value="">-- Choisir un modèle --</option>
                <option value="openai">OpenAI</option>
                <option value="midjourney">Midjourney</option>
                <option value="gemini">Gemini</option>
                <option value="flux">Flux</option>
                </select>
            </FormControl>
            </FormItem>
        )}
        />
    {/* PROVIDER */}
    <Controller
        name="provider"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
            <FormItem>
            <FormLabel>Fournisseur du modèle *</FormLabel>
            <FormControl>
                <select
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                className="text-sm bg-gray-100 text-blue-700 rounded-md border py-2"
                >
                <option value="">-- Choisir un fournisseur --</option>
                <option value="openai">OpenAI</option>
                <option value="midjourney">Midjourney</option>
                <option value="gemini">Gemini</option>
                <option value="flux">Flux</option>
                </select>
            </FormControl>
            </FormItem>
        )}
        />
    {/* MODE */}
    <Controller
        name="mode"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
            <FormItem>
            <FormLabel>Mode *</FormLabel>
            <FormControl>
                <select
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border py-2"
                >
                <option value="">-- Choisir un mode --</option>
                <option value="image-to-image">Image to image</option>
                <option value="text-to-image">Text to image</option>
                <option value="in-painting">In painting</option>
                </select>
            </FormControl>
            </FormItem>
        )}
        />
        {/* SOURCE FILE UPLOAD */}
        <Controller
        name="sourceFile"
        control={control}
        render={({ field }) => (
            <FormItem>
            <FormLabel>Image source utilisée dans cette itération</FormLabel>
            <FormControl>
                <div className="relative">
                <input
                    id="sourceFile"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    field.onChange(file);
                    setSourceFile(file);
                    }}
                />
                <label
                    htmlFor="sourceFile"
                    className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border px-3 py-2 cursor-pointer"
                >
                    {sourceFile ? sourceFile.name : "Importer l'image source"}
                </label>
                {sourceFile && (
                    <button
                    type="button"
                    onClick={() => setSourceFile(null)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-red-500 text-white rounded-full"
                    >
                    <X size={14} />
                    </button>
                )}
                </div>
            </FormControl>
            </FormItem>
        )}
        />
        {/* SOURCE FILE DESCRIPTION */}
        <Controller
            name="sourceFileDesc"
            control={control}
            rules={sourceFile ? { required: true } : undefined}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Description du fichier source</FormLabel>
                <FormControl>
                    <textarea
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full text-sm bg-gray-100 border h-15 resize-y px-3 py-2 rounded-md text-blue-700"
                    placeholder="Décrivez le fichier source utilisé pour cette itération."
                    />
                </FormControl>
                </FormItem>
            )}
            />
        {/* PERSONAL DATA */}
        <Controller
            name="personalData"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Données personnelles *</FormLabel>
                <FormControl>
                    <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                        <input
                        type="radio"
                        value="yes"
                        checked={field.value === true}
                        onChange={() => field.onChange(true)}
                        />
                        <span className="ml-2 text-white">Oui</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                        type="radio"
                        value="no"
                        checked={field.value === false}
                        onChange={() => field.onChange(false)}
                        />
                        <span className="ml-2 text-white">Non</span>
                    </label>
                    </div>
                </FormControl>
                </FormItem>
            )}
            />
        {/* IPFS PUBLISH */}
        <Controller
            name="ipfsPublish"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Publication IPFS *</FormLabel>
                <FormControl>
                    <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                        <input
                        type="radio"
                        value="yes"
                        checked={field.value === true}
                        onChange={() => field.onChange(true)}
                        />
                        <span className="ml-2 text-white">Oui</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                        type="radio"
                        value="no"
                        checked={field.value === false}
                        onChange={() => field.onChange(false)}
                        />
                        <span className="ml-2 text-white">Non</span>
                    </label>
                    </div>
                </FormControl>
                </FormItem>
            )}
            />
        {/* ITERATION IMAGE UPLOAD */}
        <Controller
        name="iterationImage"
        control={control}
        render={({ field }) => (
            <FormItem>
            <FormLabel>Image résultat de cette itération </FormLabel>
            <FormControl>
                <div className="relative">
                <input
                    id="iterationImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    field.onChange(file); 
                    setIterationImage(file);
                    }}
                />
                <label
                    htmlFor="iterationImage"
                    className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border px-3 py-2 cursor-pointer"
                >
                    {iterationImage ? iterationImage.name : "Importer l'image résultat de l'itération"}
                </label>
                {iterationImage && (
                    <button
                    type="button"
                    onClick={() => setIterationImage(null)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-red-500 text-white rounded-full"
                    >
                    <X size={14} />
                    </button>
                )}
                </div>
            </FormControl>
            </FormItem>
        )}
        />

    </>
  )
}

export default IterationFormController
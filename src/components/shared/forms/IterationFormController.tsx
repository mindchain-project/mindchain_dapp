import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Label } from "@radix-ui/react-label";
import { X } from "lucide-react";

const IterationFormController = () => {
  const { control } = useFormContext();
  const [sourcePreview, setSourcePreview] = useState<File | null>(null);
  const [iterationPreview, setIterationPreview] = useState<File | null>(null);

  const hasSource = Boolean(sourcePreview);

  return (
    <>
      <Label className="mt-4 mb-2 block text-lg font-bold text-white before:content-['2._'] before:mr-2">
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
                className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border px-3 py-2 resize-y"
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
                className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border py-2"
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
                className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border py-2"
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
                <option value="text-to-image">Text to Image</option>
                <option value="image-to-image">Image to Image</option>
                <option value="in-painting">In Painting</option>
              </select>
            </FormControl>
          </FormItem>
        )}
      />

      {/* SOURCE FILE */}
      <Controller
        name="sourceFile"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image source utilisée</FormLabel>
            <FormControl>
              <div className="relative">
                <input
                  id="sourceFile"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    field.onChange(f);
                    setSourcePreview(f);
                  }}
                />
                <label
                  htmlFor="sourceFile"
                  className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border px-3 py-2 cursor-pointer"
                >
                  {sourcePreview ? sourcePreview.name : "Importer l'image source"}
                </label>

                {sourcePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setSourcePreview(null);
                      field.onChange(null);
                    }}
                    className="absolute text-sm right-3 top-1/2 -translate-y-1/2 bg-red-600 text-white p-1 rounded-full"
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
        rules={hasSource ? { required: true } : undefined}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description du fichier source</FormLabel>
            <FormControl>
              <textarea
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border px-3 py-2 resize-y"
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* PERSONAL DATA */}
      <Controller
        name="personalData"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Données personnelles *</FormLabel>
            <FormControl>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={field.value === true}
                    onChange={() => field.onChange(true)}
                  />
                  <span className="ml-2 text-sm text-white">oui</span>
                </label>

                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={field.value === false}
                    onChange={() => field.onChange(false)}
                  />
                  <span className="ml-2 text-sm text-white">non</span>
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
        render={({ field }) => (
          <FormItem>
            <FormLabel>Publication IPFS *</FormLabel>
            <FormControl>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={field.value === true}
                    onChange={() => field.onChange(true)}
                  />
                  <span className="ml-2 text-sm text-white">oui</span>
                </label>

                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={field.value === false}
                    onChange={() => field.onChange(false)}
                  />
                  <span className="ml-2 text-sm text-white">non</span>
                </label>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      {/* ITERATION RESULT IMAGE */}
      <Controller
        name="iterationImage"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image résultat</FormLabel>
            <FormControl>
              <div className="relative">
                <input
                  id="iterationImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    field.onChange(f);
                    setIterationPreview(f);
                  }}
                />
                <label
                  htmlFor="iterationImage"
                  className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border px-3 py-2 cursor-pointer"
                >
                  {iterationPreview ? iterationPreview.name : "Importer l'image résultat"}
                </label>

                {iterationPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setIterationPreview(null);
                      field.onChange(null);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-600 text-white p-1 rounded-full"
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
  );
};

export default IterationFormController;

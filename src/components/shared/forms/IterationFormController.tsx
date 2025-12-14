import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { X } from "lucide-react";
import { Root as CollapsibleRoot, Trigger as CollapsibleTrigger, Content as CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronUpIcon, DoubleArrowDownIcon, CrossCircledIcon } from "@radix-ui/react-icons";

interface IterationFormControllerProps {
  index: number;
  removeIteration: () => void;
}

const IterationFormController = ({ index, removeIteration }: IterationFormControllerProps) => {
  const { control, formState: { errors } } = useFormContext();
  const [sourcePreview, setSourcePreview] = useState<File | null>(null);
  const [iterationPreview, setIterationPreview] = useState<File | null>(null);
  const hasSource = Boolean(sourcePreview);
  const [open, setOpen] = useState(index === 0);

  const Providers = {
    "openai": "OpenAI",
    "midjourney": "Midjourney",
    "gemini": "Gemini",
    "flux": "Flux",
  };
  const Models = {
    "o1": "O1",
    "gpt": "GPT",
    "dall-e": "Dall-E",
    "gemini": "Gemini",
    "midjourney": "Midjourney",
    "flux": "Flux",
  };
  const Modes = {
    "text-to-image": "Text to Image",
    "image-to-image": "Image to Image",
    "in-painting": "In Painting",
  };



  return (
    <>
    <CollapsibleRoot className="w-[80%]" open={open} onOpenChange={setOpen}>
    <div className="flex items-center justify-between"> Itération { index === 0 ? "oeuvre finale *" : "n°" + index } 
      <CollapsibleTrigger asChild>
        <div className="flex items-center gap-2">
          { index !== 0 && (
            <button
              type="button"
              onClick={removeIteration}
              className="bg-red-700 inline-flex size-[25px] items-center justify-center rounded-full m-2"
            >
              <CrossCircledIcon />
            </button>)
          }
					<button type="button" className="inline-flex size-[25px] items-center justify-center rounded-full text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=closed]:bg-blue data-[state=open]:bg-violet3">
						{open ? <ChevronUpIcon /> : <DoubleArrowDownIcon />}
					</button>
        </div>
			</CollapsibleTrigger>
    </div>
    <CollapsibleContent>
      {/* PROMPT */}
      <Controller
        name={`iterations.${index}.prompt`}
        control={control}
        rules={{ required: "Le texte du prompt est obligatoire." }}
        render={({ field }) => (
          <FormItem>
            <FormLabel style={{ marginTop: "10px" }}>Texte du prompt *</FormLabel>
            <FormControl>
              <textarea
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border px-3 py-2 resize-y"
              />
            </FormControl>
            {errors.iterations && Array.isArray(errors.iterations) && errors.iterations[index]?.prompt && (
              <p className="text-red-600 text-sm mt-1">{errors.iterations[index]?.prompt?.message}</p>
            )}
          </FormItem>
        )}
      />

      {/* MODEL */}
      <Controller
        name={`iterations.${index}.model`}
        control={control}
        rules={{ required: "Le modèle est obligatoire." }}
        render={({ field }) => (
          <FormItem>
            <FormLabel style={{ marginTop: "10px" }}>Modèle utilisé *</FormLabel>
            <FormControl>
              <select
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border py-2"
              >
                <option value="">-- Choisir un modèle --</option>
                {Object.entries(Models).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </FormControl>
            {errors.iterations && Array.isArray(errors.iterations) && errors.iterations[index]?.model && (
              <p className="text-red-600 text-sm mt-1">{errors.iterations[index]?.model?.message}</p>
            )}
          </FormItem>
        )}
      />

      {/* PROVIDER */}
      <Controller
        name={`iterations.${index}.provider`}
        control={control}
        rules={{ required: "Le fournisseur est obligatoire." }}
        render={({ field }) => (
          <FormItem>
            <FormLabel style={{ marginTop: "10px" }}>Fournisseur du modèle *</FormLabel>
            <FormControl>
              <select
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border py-2"
              >
                <option value="">-- Choisir un fournisseur --</option>
                {Object.entries(Providers).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </FormControl>
            {errors.iterations && Array.isArray(errors.iterations) && errors.iterations[index]?.provider && (
              <p className="text-red-600 text-sm mt-1">{errors.iterations[index]?.provider?.message}</p>
            )}
          </FormItem>
        )}
      />

      {/* MODE */}
      <Controller
        name={`iterations.${index}.mode`}
        control={control}
        rules={{ required: "Le mode est obligatoire." }}
        render={({ field }) => (
          <FormItem>
            <FormLabel style={{ marginTop: "10px" }}>Mode *</FormLabel>
            <FormControl>
              <select
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border py-2"
              >
                <option value="">-- Choisir un mode --</option>
                {Object.entries(Modes).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </FormControl>
            {errors.iterations && Array.isArray(errors.iterations) && errors.iterations[index]?.mode && (
              <p className="text-red-600 text-sm mt-1">{errors.iterations[index]?.mode?.message}</p>
            )}
          </FormItem>
        )}
      />

      {/* SOURCE FILE */}
      <Controller
        name={`iterations.${index}.sourceFile`}
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel style={{ marginTop: "10px" }}>Image source utilisée</FormLabel>
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
        name={`iterations.${index}.sourceFileDesc`}
        control={control}
        rules={hasSource ? { required: true } : undefined}
        render={({ field }) => (
          <FormItem>
            <FormLabel style={{ marginTop: "10px" }}>Description du fichier source</FormLabel>
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
        name={`iterations.${index}.personalData`}
        control={control}
        render={({ field }) => (
          <FormItem>
            <div className="inline-flex items-center space-x-4 my-4">
            <FormLabel>Données personnelles * :</FormLabel>
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
            </div>
          </FormItem>
        )}
      />
      <div className="mb-4 flex w-full gap-4">
      {/* ITERATION RESULT IMAGE */}
      { index != 0 && (
      <Controller
        name={`iterations.${index}.iterationImage`}
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel style={{ marginTop: "10px" }}>Image de l&apos;itération</FormLabel>
            <FormControl>
              <div className="relative">
                <input
                  id={`iterationImage${index}`}
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
                  htmlFor={`iterationImage${index}`}
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
      )}
    </div>
    </CollapsibleContent>
    </CollapsibleRoot>

    </>
  );
};

export default IterationFormController;

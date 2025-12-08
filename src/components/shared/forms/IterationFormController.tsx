import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { X } from "lucide-react";
import { Root as CollapsibleRoot, Trigger as CollapsibleTrigger, Content as CollapsibleContent } from "@radix-ui/react-collapsible";
import { Cross2Icon, RowSpacingIcon } from "@radix-ui/react-icons";

interface IterationFormControllerProps {
  index: number;
  iterationNumber: number;
  removeIteration: () => void;
}

const IterationFormController = ({ index, iterationNumber, removeIteration }: IterationFormControllerProps) => {
  const { register, control } = useFormContext();
  const [sourcePreview, setSourcePreview] = useState<File | null>(null);
  const [iterationPreview, setIterationPreview] = useState<File | null>(null);
  const hasSource = Boolean(sourcePreview);
  const [open, setOpen] = useState(false);

  return (
    <>
    <CollapsibleRoot className="w-[80%]" open={open} onOpenChange={setOpen}>
    <div className="flex items-center justify-between"> Itération #{iterationNumber}
      <CollapsibleTrigger asChild>
					<button className="inline-flex size-[25px] items-center justify-center rounded-full text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=closed]:bg-blue data-[state=open]:bg-violet3">
						{open ? <Cross2Icon /> : <RowSpacingIcon />}
					</button>
				</CollapsibleTrigger>
    </div>
    <CollapsibleContent>
      {/* PROMPT */}
      <Controller
        name={`iterations.${index}.prompt`}
        control={control}
        rules={{ required: true }}
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
          </FormItem>
        )}
      />

      {/* MODEL */}
      <Controller
        name={`iterations.${index}.model`}
        control={control}
        rules={{ required: true }}
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
        name={`iterations.${index}.provider`}
        control={control}
        rules={{ required: true }}
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
        name={`iterations.${index}.mode`}
        control={control}
        rules={{ required: true }}
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
            <FormLabel style={{ marginTop: "10px" }}>Données personnelles *</FormLabel>
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
        name={`iterations.${index}.ipfsPublish`}
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel style={{ marginTop: "10px" }}>Publication IPFS *</FormLabel>
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
        name={`iterations.${index}.iterationImage`}
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel style={{ marginTop: "10px" }}>Image résultat</FormLabel>
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
    </CollapsibleContent>
    <button
      type="button"
      onClick={removeIteration}
      className="bg-red-700 mt-4 text-white px-3 py-1 rounded-md flex items-center"
    >
      <X size={14} />
    </button>
    </CollapsibleRoot>

    </>
  );
};

export default IterationFormController;

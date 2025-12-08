import { useFormContext, Controller } from "react-hook-form";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Label } from "@radix-ui/react-label";
import { X } from "lucide-react";
import { useState } from "react";

const ArtworkFormController = () => {
  const { control } = useFormContext();
  const [filePreview, setFilePreview] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <>
      {/* TITLE */}
      <Controller
        name="title"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titre de l’œuvre *</FormLabel>
            <FormControl>
              <input
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border px-3 py-2"
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* DESCRIPTION */}
      <Controller
        name="description"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description courte *</FormLabel>
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

        {/* FILE UPLOAD */}
      <Controller
        name="uploadedFile"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image finale *</FormLabel>
            <FormControl>
              <div className="relative">
                {/* Hidden input */}
                <input
                  id="uploadedFile"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    field.onChange(file);

                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPreviewUrl(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      setPreviewUrl(null);
                    }
                  }}
                />

                {/* Label button */}
                <label
                  htmlFor="uploadedFile"
                  className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border px-3 py-2 cursor-pointer"
                >
                  {field.value ? field.value.name : "Importer l'image finale"}
                </label>

                {/* Remove file */}
                {field.value && (
                  <button
                    type="button"
                    onClick={() => {
                      field.onChange(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-600 text-white p-1 rounded-full"
                  >
                    <X size={14} />
                  </button>
                )}

                {/* Preview */}
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="mt-4 rounded-md w-64 h-auto border"
                  />
                )}
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default ArtworkFormController;

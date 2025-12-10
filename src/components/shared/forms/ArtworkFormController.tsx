import { useFormContext, Controller, set } from "react-hook-form";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

// Fonction de compression d’image avant upload
export async function compressImage(file: File, maxWidth = 1024, quality = 0.7): Promise<File> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;
      // Resize proportionnel
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          resolve(
            new File([blob!], file.name, { type: "image/jpeg", lastModified: Date.now() })
          );
        },
        "image/jpeg",
        quality // compression entre 0 et 1
      );
    };
  });
}


const ArtworkFormController = () => {
  const { control, setValue, formState: { errors } } = useFormContext();
  const [filePreview, setFilePreview] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <>
      {/* TITLE */}
      <Controller
        name="title"
        control={control}
        rules={{ required: "Le titre est obligatoire." }}
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
            {errors.title?.message && typeof errors.title.message === "string" && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </FormItem>
        )}
      />

      {/* DESCRIPTION */}
      <Controller
        name="description"
        control={control}
        rules={{ required: "La description est obligatoire." }}
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
            {errors.description?.message && typeof errors.description.message === "string" && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </FormItem>
        )}
      />
      {/* FILE UPLOAD */}
      <Controller
        name="finalArtworkFile"
        control={control}
        rules={{ required: "L'image finale est obligatoire." }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image finale *</FormLabel>
            <FormControl>
              <div className="relative">
                <div className="flex items-center space-x-2">
                {/* Hidden input */}
                <input
                  id="finalArtworkFile"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0] || null;
                    if (!file) {
                      setPreviewUrl(null);
                      return;
                    }
                    // Save original file for merkle tree
                    setValue("finalArtworkFileOriginal", file);
                    // Compress image
                    const compressed = await compressImage(file);
                    console.log("Original:", file.size / 1024, "KB");
                    console.log("Compressed:", compressed.size / 1024, "KB");
                    field.onChange(compressed);
                    // Preview of file
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPreviewUrl(reader.result as string);
                    };
                    reader.readAsDataURL(compressed);
                  }}
                />

                {/* Label button */}
                <label
                  htmlFor="finalArtworkFile"
                  className="w-[50%] text-sm bg-gray-100 text-blue-700 rounded-md border px-3 py-2 cursor-pointer"
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
                {/* IPFS PUBLISH */}
                <Controller
                  name="finalArtworkFileIpfsPublish"
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
                </div>
                {errors.finalArtworkFile?.message && typeof errors.finalArtworkFile.message === "string" && (
                  <p className="text-red-500 text-sm">{errors.finalArtworkFile.message}</p>
                )}
                {/* PREVIEW */}
                {previewUrl && (
                  <Image
                    src={previewUrl}
                    alt="preview"
                    className="mt-4 rounded-md w-64 h-auto border"
                    width={256}
                    height={256}
                    unoptimized
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

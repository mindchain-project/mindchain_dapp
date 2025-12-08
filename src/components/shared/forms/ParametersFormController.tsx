import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Label } from '@radix-ui/react-label';
import { X } from "lucide-react";

const ParametersFormController = () => {
  const { control } = useFormContext();
  const [logsPreview, setLogsPreview] = useState<File | null>(null);

  return (
    <div className="space-y-4">
      {/* MAIN PROVIDER */}
      <Controller
        name="parameters.mainProvider"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fournisseur IA principal</FormLabel>
            <FormControl>
              <input
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Fournisseur IA principal"
                className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border px-3 py-2"
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* MODEL DATA */}
      <Controller
        name="parameters.modelData"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Modèle IA (nom + version)</FormLabel>
            <FormControl>
              <input
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Modèle IA utilisé"
                className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border px-3 py-2"
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* LOGS UPLOAD */}
      <Controller
        name="parameters.logsFile"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Logs techniques anonymisés</FormLabel>
            <FormControl>
              <div className="relative">
                <input
                  id="logsFile"
                  type="file"
                  accept=".txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    field.onChange(file);
                    setLogsPreview(file);
                  }}
                />

                <label
                  htmlFor="logsFile"
                  className="w-full text-sm bg-gray-100 rounded-md border px-3 py-2 text-blue-700 cursor-pointer"
                >
                  {logsPreview ? logsPreview.name : "Importer le fichier de logs (.txt)"}
                </label>

                {logsPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      field.onChange(null);
                      setLogsPreview(null);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-red-600 text-white rounded-full"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default ParametersFormController;

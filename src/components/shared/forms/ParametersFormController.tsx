import { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Label } from '@radix-ui/react-label';
import { X } from "lucide-react";

const ParametersFormController = () => {
    const { control, watch } = useFormContext();

    const [mainProvider, setMainProvider] = useState('');
    const [modelData, setModelData] = useState('');
    const [logsFile, setLogsFile] = useState<File | null>(null);

    const watchedMainProvider = watch('main-provider');
    const watchedModelData = watch('modelData');

    useEffect(() => {
        console.log("PARAMETERS :", watchedMainProvider, watchedModelData);
    }, [watchedMainProvider, watchedModelData]);

  return (
    <div className="space-y-4">
      <Label htmlFor="parameters" className="mt-4 mb-2 block text-lg font-bold text-white before:content-['3._'] before:mr-2 before:text-white">
          Paramètres techniques généraux
      </Label>
       <Controller
        name="parameters"
        control={control}
        render={({ field }) => (
        <FormItem>
            <FormLabel>Fournisseur IA principal</FormLabel>
            <FormControl>
                <input
                    {...field}
                    value={watchedMainProvider}
                    onChange={(e) => {
                    field.onChange(e);
                    setMainProvider(e.target.value);
                    }}
                    placeholder="Fournisseur IA principal"
                    className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
            </FormControl>
            {/* ajouter une radio box*/}
            <FormLabel>Modèle IA (nom + version)</FormLabel>
            <FormControl>
                <input
                    {...field}
                    value={watchedModelData}
                    onChange={(e) => {
                    field.onChange(e);
                    setModelData(e.target.value);
                    }}
                    placeholder="Modèle IA (nom + version)"
                    className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
            </FormControl>
             {/* Source file upload and description */}
              <FormLabel>Logs techniques anonymisés</FormLabel>
              <FormControl>
                  {/* Upload File input */}
                  <div className="space-y-2">
                      <div className="relative">
                      {/* Hidden file input */}
                          <input
                              id="logsFileInput"
                              type="file"
                              accept=".txt"
                              className="hidden"
                              onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setLogsFile(file);
                              }}
                          />
                          {/* Custom label serving as a button */}
                          <label
                              htmlFor="logsFileInput"
                              className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              >
                              {logsFile ? logsFile.name : "Importer le fichier de logs"}
                          </label>
                          {/* Reset button */}
                          {logsFile && (
                          <button
                              type="button"
                              onClick={() => setLogsFile(null)}
                              className="btn-file-reset absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
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
    </div>
  );
};

export default ParametersFormController;

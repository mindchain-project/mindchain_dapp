import { useFormContext, Controller } from "react-hook-form";
import { FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Label } from "@radix-ui/react-label";

const LegalFormController = () => {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <Label
        htmlFor="legal"
        className="mt-4 mb-2 block text-lg font-bold text-white 
        before:content-['4._'] before:mr-2"
      >
        Déclarations juridiques
      </Label>

      {/* AUTHORSHIP */}
      <Controller
        name="legal.authorshipConfirmation"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
                <span className="text-sm text-white">
                  Je suis l’auteur ou ayant-droit du processus créatif. *
                </span>
              </label>
            </FormControl>
          </FormItem>
        )}
      />

      {/* THIRD PARTY RIGHTS */}
      <Controller
        name="legal.thirdPartyRights"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
                <span className="text-sm text-white">
                  Les fichiers sources ne violent pas les droits de tiers. *
                </span>
              </label>
            </FormControl>
          </FormItem>
        )}
      />

      {/* EXPLOITATION RIGHTS */}
      <Controller
        name="legal.exploitationRights"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
                <span className="text-sm text-white">
                  Le Certificate Token ne contient aucun droit d’exploitation commerciale. *
                </span>
              </label>
            </FormControl>
          </FormItem>
        )}
      />

      {/* LICENSE TYPE */}
      <Controller
        name="legal.license"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de licence *</FormLabel>
            <FormControl>
              <input
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Type de licence du Certificate Token"
                className="w-full text-sm bg-gray-100 rounded-md border px-3 py-2 text-blue-700"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default LegalFormController;

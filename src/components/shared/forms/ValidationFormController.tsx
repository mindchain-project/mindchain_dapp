import { useFormContext, Controller } from "react-hook-form";
import { FormItem, FormControl } from "@/components/ui/form";
import Link from "next/link";

type ValidationFieldName = 
  | "validation.processConfirmation"
  | "validation.certification" 
  | "validation.privacy"
  | "validation.terms"
  | "validation.ownership";

const ValidationFormController = () => {
  const { control } = useFormContext();

  const fields = [
    {
      name: "validation.processConfirmation",
      label: "Je confirme l’exactitude du processus créatif. *",
    },
    {
      name: "validation.certification",
      label: "Je valide la certification de cette œuvre. *",
    },
    {
      name: "validation.privacy",
      label: (
        <>
          J&apos;accepte la{" "}
          <Link href="/" className="text-blue-400 underline">
            Politique de confidentialité
          </Link>{" "}
          (RGPD). *
        </>
      ),
    },
    {
      name: "validation.terms",
      label: (
        <>
          J&apos;accepte les{" "}
          <Link href="/" className="text-blue-400 underline">
            CGU Mindchain
          </Link>
          . *
        </>
      ),
    },
    {
      name: "validation.ownership",
      label: "Je déclare être titulaire légitime des droits nécessaires. *",
    },
  ];

  return (
    <div className="space-y-4">
      {fields.map((f) => (
        <Controller
          key={f.name}
          name={f.name as ValidationFieldName}
          control={control}
          //rules={{ required: true }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={field.value || false}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                  <span className="text-sm text-white">{f.label}</span>
                </label>
                
              </FormControl>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};

export default ValidationFormController;

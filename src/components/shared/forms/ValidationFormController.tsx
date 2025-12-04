import { useFormContext, Controller } from "react-hook-form";
import { FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";

const ValidationFormController = () => {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <Label
        htmlFor="validation"
        className="mt-4 mb-2 block text-lg font-bold text-white 
        before:content-['5._'] before:mr-2 before:text-white"
      >
        Déclarations juridiques (sans licence)
      </Label>

      {/* 1 — Confirmation du processus créatif */}
      <Controller
        name="validation.processConfirmation"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  required
                />
                <p className="text-sm text-white">
                  Je confirme l’exactitude du processus créatif. *
                </p>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      {/* 2 — Certification de l’œuvre */}
      <Controller
        name="validation.certification"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  required
                />
                <p className="text-sm text-white">
                  Je valide la certification de cette œuvre. *
                </p>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      {/* 3 — RGPD */}
      <Controller
        name="validation.privacy"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  required
                />
                <p className="text-sm text-white">
                  J&apos;accepte la{" "}
                  <Link href="/" className="text-purple-500 underline">
                    Politique de confidentialité
                  </Link>{" "}
                  (RGPD). *
                </p>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      {/* 4 — CGU */}
      <Controller
        name="validation.terms"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  required
                />
                <p className="text-sm text-white">
                  J&apos;accepte les{" "}
                  <Link href="/" className="text-purple-500 underline">
                    CGU Mindchain
                  </Link>
                  . *
                </p>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      {/* 5 — Titularité des droits */}
      <Controller
        name="validation.ownership"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  required
                />
                <p className="text-sm text-white">
                  Je déclare être titulaire légitime des droits nécessaires. *
                </p>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default ValidationFormController;

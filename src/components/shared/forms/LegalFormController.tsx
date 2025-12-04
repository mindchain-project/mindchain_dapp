import { useFormContext, Controller } from "react-hook-form";
import { useState } from 'react';
import { FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";

const LegalFormController = () => {
  const { control, watch } = useFormContext();
    const [license, setLicense] = useState('');
    const watchedLicense = watch("legal.license", "");

  return (
    <div className="space-y-4">
      <Label
        htmlFor="legal"
        className="mt-4 mb-2 block text-lg font-bold text-white 
        before:content-['4._'] before:mr-2 before:text-white"
      >
        Déclarations juridiques (sans licence)
      </Label>

      {/* 1 — Confirmation du processus créatif */}
      <Controller
        name="legal.authorshipConfirmation"
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
                  Je déclare que je suis l&apos;auteur ou ayant-droit légitime du processus créatif. *
                </p>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      {/* 2 — Certification de l’œuvre */}
      <Controller
        name="legal.thirdPartyRights"
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
                  Je confirme que les fichiers sources ne violent pas les droits de tiers. *
                </p>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

    {/* 3 — RGPD */}
    <Controller
        name="legal.exploitationRights"
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
                  Je comprends que le Certificate Token ne contient aucun droit d&apos;exploitation commerciale. *
                </p>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      {/* 4 — CGU */}
      <Controller
        name="legal.license"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de licence du Certificate Token *</FormLabel>
            <FormControl>
                <input
                    {...field}
                    value={watchedLicense}
                    onChange={(e) => {
                    field.onChange(e);
                    setLicense(e.target.value);
                    }}
                    placeholder="Type de licence du Certificate Token."
                    className="w-full text-sm bg-gray-100 text-blue-700 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default LegalFormController;

import { v4 as uuidv4 } from "uuid";

export async function generateCertificate(form) {

  // Utilitaires pour obtenir des métadonnées fichiers
  const getFileMetadata = (file, role) => {
    if (!file) return null;
    return {
      uri: `ipfs://TO_BE_REPLACED_AFTER_UPLOAD`, // tu pourras injecter le CID
      type: file.type,
      original_filename: file.name,
      size: file.size,
      role,
    };
  };

  const certificate = {
    name: form.title,
    description: form.description,
    image: "ipfs://CID_FINAL_ARTWORK", // remplacé après upload sur IPFS
    external_url: `https://mindchain.ai/certificate/${uuidv4()}`,
    attributes: [
      { trait_type: "Model", value: form.model },
      { trait_type: "Provider", value: form.provider },
      { trait_type: "Mode", value: form.mode },
      { trait_type: "Personal Data", value: form.personalData },
      { trait_type: "IPFS Publication Allowed", value: form.ipfsPublish }
    ],
    properties: {
      files: [
        getFileMetadata(form.uploadedFile, "final_artwork"),
        getFileMetadata(form.sourceFile, "source_image"),
        getFileMetadata(form.iterationImage, "iteration_step")
      ].filter(Boolean),

      ai_parameters: {
        prompt: form.prompt,
        model: form.model,
        provider: form.provider,
        mode: form.mode,
      },

      source_file: {
        description: form.sourceFileDesc,
        original_filename: form.sourceFile?.name ?? null
      },

      legal: {
        process_confirmation: form.legal?.processConfirmation ?? true,
        certification_validation: form.legal?.certification ?? true,
        privacy_acceptance: form.legal?.privacy ?? true,
        terms_acceptance: form.legal?.terms ?? true,
        ownership_confirmation: form.legal?.ownership ?? true,
      },

      creation: {
        timestamp: Date.now(),
        certificate_id: uuidv4(),
        creator_wallet: form.address || "unknown"
      }
    }
  };

  console.log("NFT Certificate JSON:", certificate);

  return certificate;
}

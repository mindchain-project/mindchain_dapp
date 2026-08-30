import "server-only";
import { z } from "zod";
import { ALLOWED_IPFS_HOSTS, resolveURI } from "@/lib/ipfs";
import { boundedFetch, FetchLimitError } from "@/lib/http/bounded-fetch";

/**
 * Récupération et validation des métadonnées d'un certificat.
 *
 * Ces métadonnées vivent sur IPFS : le serveur ne les produit pas et ne peut
 * pas garantir leur forme. Même référencées par la chaîne, elles restent une
 * entrée non fiable, et sont donc validées comme telles avant tout usage.
 */

// Les hôtes autorisés sont dérivés de `NEXT_PUBLIC_IPFS_GATEWAY` (cf. `@/lib/ipfs`)
// plutôt que listés ici : une liste blanche écrite en dur finit toujours par
// contenir un domaine qu'on ne contrôle plus.
export { ALLOWED_IPFS_HOSTS };

const MAX_METADATA_BYTES = 512 * 1024; // 512 Ko : un JSON de certificat est petit
const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 Mo
const FETCH_TIMEOUT_MS = 10_000;

/** Itération du processus créatif, telle qu'inscrite par le formulaire. */
const iterationSchema = z.object({
  prompt: z.string().default(""),
  model: z.string().default(""),
  provider: z.string().default(""),
});

const attributeSchema = z.object({
  trait_type: z.string(),
  value: z.unknown(),
});

/**
 * Schéma volontairement tolérant : des certificats déjà émis peuvent différer
 * des plus récents. Seuls les champs réellement rendus dans le PDF sont exigés,
 * les autres reçoivent une valeur par défaut plutôt que de faire échouer la
 * génération d'un certificat par ailleurs valide.
 */
export const certificateMetadataSchema = z.object({
  name: z.string().default(""),
  description: z.string().default(""),
  image: z.string().default(""),
  license: z.string().default(""),
  contract_address: z.string().default(""),
  creation: z
    .object({
      certification_timestamp: z.number().default(0),
      certificate_id: z.string().default(""),
    })
    .default({ certification_timestamp: 0, certificate_id: "" }),
  attributes: z.array(attributeSchema).default([]),
});

export type CertificateMetadata = z.infer<typeof certificateMetadataSchema>;

export class MetadataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MetadataError";
  }
}

/** Récupère et valide le JSON de métadonnées désigné par un `tokenURI`. */
export async function fetchCertificateMetadata(
  tokenUri: string,
): Promise<CertificateMetadata> {
  const url = resolveURI(tokenUri);
  if (!url) throw new MetadataError("tokenURI vide.");

  let raw: string;
  try {
    const { bytes } = await boundedFetch(url, {
      maxBytes: MAX_METADATA_BYTES,
      timeoutMs: FETCH_TIMEOUT_MS,
      allowedHosts: ALLOWED_IPFS_HOSTS,
    });
    raw = new TextDecoder().decode(bytes);
  } catch (error) {
    throw new MetadataError(
      error instanceof FetchLimitError
        ? `Métadonnées inaccessibles : ${error.message}`
        : "Métadonnées inaccessibles.",
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new MetadataError("Les métadonnées ne sont pas un JSON valide.");
  }

  const result = certificateMetadataSchema.safeParse(parsed);
  if (!result.success) {
    throw new MetadataError("Les métadonnées ne respectent pas le format attendu.");
  }
  return result.data;
}

/**
 * Extrait l'itération finale, celle dont le prompt figure sur le certificat.
 * Renvoie `undefined` si l'attribut est absent ou d'une forme inattendue —
 * le PDF est alors produit sans ce bloc, plutôt que de échouer.
 */
export function extractFinalIteration(metadata: CertificateMetadata) {
  const attribute = metadata.attributes.find(
    (a) => a.trait_type === "final_image_iteration",
  );
  if (!attribute) return undefined;
  const parsed = iterationSchema.safeParse(attribute.value);
  return parsed.success ? parsed.data : undefined;
}

/** Récupère l'image de l'œuvre, bornée en taille et restreinte aux passerelles connues. */
export async function fetchCertificateImage(image: string) {
  if (!image) return null;
  const url = resolveURI(image);
  if (!url || !url.startsWith("https://")) return null;

  try {
    return await boundedFetch(url, {
      maxBytes: MAX_IMAGE_BYTES,
      timeoutMs: FETCH_TIMEOUT_MS,
      allowedHosts: ALLOWED_IPFS_HOSTS,
    });
  } catch {
    // Une image indisponible ne doit pas empêcher l'émission du certificat :
    // les informations qui font foi sont textuelles et viennent de la chaîne.
    return null;
  }
}

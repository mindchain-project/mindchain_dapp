import "server-only";

/**
 * Configuration commune à l'authentification serveur.
 * Ce module ne doit JAMAIS être importé depuis un composant client :
 * `server-only` transforme une telle tentative en erreur de build.
 */

/** Durée de validité du défi SIWE (le temps de signer dans le wallet). */
export const CHALLENGE_TTL_SECONDS = 5 * 60; // 5 minutes

/** Durée de validité de la session une fois la signature vérifiée. */
export const SESSION_TTL_SECONDS = 60 * 60; // 1 heure

/** Durée pendant laquelle un reçu d'upload autorise la suppression du CID. */
export const CID_RECEIPT_TTL_SECONDS = 30 * 60; // 30 minutes

export const CHALLENGE_COOKIE = "mc_siwe_challenge";
export const SESSION_COOKIE = "mc_session";

/** Réseau attendu pour la connexion (Sepolia). */
export const EXPECTED_CHAIN_ID = 11155111;

/** Taille maximale acceptée pour un fichier épinglé sur IPFS. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 Mo

/** Types MIME autorisés à l'upload d'image. */
export const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
] as const;

let cachedSecret: Uint8Array | null = null;

/**
 * Secret de signature des cookies (défi + session + reçus CID).
 *
 * Volontairement sans valeur par défaut : une clé de repli codée en dur
 * donnerait l'illusion d'une protection tout en la rendant publique.
 * L'absence de la variable doit faire échouer l'application, pas la dégrader.
 */
export function getAuthSecret(): Uint8Array {
  if (cachedSecret) return cachedSecret;

  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET manquant ou trop court (32 caractères minimum). " +
        "Générez-le avec : openssl rand -base64 32",
    );
  }
  cachedSecret = new TextEncoder().encode(secret);
  return cachedSecret;
}

/** URL publique de l'application, utilisée dans le message SIWE. */
export function getAppOrigin(requestHost?: string | null): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) return configured.replace(/\/+$/, "");
  if (requestHost) {
    const protocol = requestHost.startsWith("localhost") ? "http" : "https";
    return `${protocol}://${requestHost}`;
  }
  return "http://localhost:3000";
}

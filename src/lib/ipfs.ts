/**
 * Utilitaires IPFS purs (aucun secret, aucun accès réseau).
 *
 * Ce module remplace `resolveURI` qui vivait dans `services/storage.ts`.
 * Cette fonction est purement synchrone : l'exposer comme Server Action
 * imposait un aller-retour HTTP par NFT affiché, pour un simple remplacement
 * de chaîne, et élargissait inutilement la surface serveur.
 */

/**
 * Passerelles IPFS — source de vérité unique du projet.
 *
 * Le nom d'une passerelle dédiée Pinata est un détail de compte, pas une
 * caractéristique du produit : il a déjà changé une fois, et il était alors
 * codé en dur à trois endroits. Tout est donc dérivé d'une seule variable.
 *
 * ⚠️ `NEXT_PUBLIC_*` est inlinée dans le bundle **au build** : modifier cette
 * variable sur Vercel exige un redéploiement pour que les clients en tiennent
 * compte. Le serveur, lui, la relit à chaque exécution.
 */

/** Passerelles publiques, indépendantes de tout fournisseur : toujours acceptées en lecture. */
export const PUBLIC_IPFS_GATEWAYS = [
  "https://gateway.pinata.cloud/ipfs",
  "https://dweb.link/ipfs",
] as const;

/** Passerelle utilisée pour construire les URL. Par défaut, la passerelle publique Pinata. */
export const IPFS_GATEWAY =
  process.env.NEXT_PUBLIC_IPFS_GATEWAY?.replace(/\/+$/, "") ||
  PUBLIC_IPFS_GATEWAYS[0];

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

/**
 * Hôtes autorisés en lecture : la passerelle configurée, plus les publiques.
 * Conserver les publiques en repli évite qu'un changement de fournisseur ne
 * rende illisibles des contenus déjà référencés ailleurs.
 */
export const ALLOWED_IPFS_HOSTS: readonly string[] = Array.from(
  new Set([IPFS_GATEWAY, ...PUBLIC_IPFS_GATEWAYS].map(hostOf).filter(Boolean)),
);

/** Un CID v0 (Qm...) ou v1 (bafy...), sans préfixe ni chemin. */
const RAW_CID = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[a-z2-7]{58,})$/;

/**
 * Convertit une référence IPFS en URL HTTP consultable.
 * Accepte `ipfs://CID`, `ipfs/CID`, un CID nu, ou renvoie l'entrée telle
 * quelle si elle est déjà une URL.
 */
export function resolveURI(uri: string): string {
  if (!uri) return "";
  const value = uri.trim();

  if (value.startsWith("ipfs://")) {
    return `${IPFS_GATEWAY}/${value.slice("ipfs://".length)}`;
  }
  // Corrige un décalage de l'implémentation précédente : `slice(7)` était
  // appliqué aux deux préfixes alors que "ipfs/" n'en fait que 5.
  if (value.startsWith("ipfs/")) {
    return `${IPFS_GATEWAY}/${value.slice("ipfs/".length)}`;
  }
  if (RAW_CID.test(value)) {
    return `${IPFS_GATEWAY}/${value}`;
  }
  return value;
}

/** Préfixe un CID nu pour obtenir un URI interopérable (wallets, marketplaces). */
export function toIpfsUri(cid: string): string {
  const value = cid.trim();
  return value.startsWith("ipfs://") ? value : `ipfs://${value}`;
}

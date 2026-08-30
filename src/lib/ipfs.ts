/**
 * Utilitaires IPFS purs (aucun secret, aucun accès réseau).
 *
 * Ce module remplace `resolveURI` qui vivait dans `services/storage.ts`.
 * Cette fonction est purement synchrone : l'exposer comme Server Action
 * imposait un aller-retour HTTP par NFT affiché, pour un simple remplacement
 * de chaîne, et élargissait inutilement la surface serveur.
 */

/** Passerelle de lecture IPFS. Surchargeable via l'environnement. */
export const IPFS_GATEWAY =
  process.env.NEXT_PUBLIC_IPFS_GATEWAY?.replace(/\/+$/, "") ??
  "https://gateway.pinata.cloud/ipfs";

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

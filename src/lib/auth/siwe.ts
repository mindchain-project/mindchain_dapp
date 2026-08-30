import "server-only";
import { EXPECTED_CHAIN_ID } from "./config";

/**
 * Construction du message de connexion au format EIP-4361 (Sign-In With Ethereum).
 *
 * Choix d'architecture : le message est intégralement construit **côté serveur**,
 * puis conservé dans un cookie signé. À la vérification, on relit le message
 * depuis ce cookie plutôt que de faire confiance à celui renvoyé par le client.
 * Conséquence : aucun analyseur de message n'est nécessaire, donc aucune faille
 * d'analyse possible (adresse ou nonce substitués dans un message forgé).
 */

export const SIWE_STATEMENT =
  "Connectez-vous à Mindchain pour publier et gérer vos certificats sur IPFS.";

export interface SiweMessageParams {
  domain: string;
  address: `0x${string}`;
  uri: string;
  nonce: string;
  issuedAt: Date;
  expiresAt: Date;
  chainId?: number;
}

export function buildSiweMessage({
  domain,
  address,
  uri,
  nonce,
  issuedAt,
  expiresAt,
  chainId = EXPECTED_CHAIN_ID,
}: SiweMessageParams): string {
  return [
    `${domain} wants you to sign in with your Ethereum account:`,
    address,
    "",
    SIWE_STATEMENT,
    "",
    `URI: ${uri}`,
    "Version: 1",
    `Chain ID: ${chainId}`,
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt.toISOString()}`,
    `Expiration Time: ${expiresAt.toISOString()}`,
  ].join("\n");
}

/** Nonce aléatoire de 128 bits, encodé en hexadécimal. */
export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Normalise une adresse pour la comparaison (les casses EIP-55 diffèrent). */
export function normalizeAddress(address: string): string {
  return address.trim().toLowerCase();
}

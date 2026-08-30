import "server-only";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { MindchainContractABI, MindchainContractAddress } from "@/abi/MindchainContract";

/**
 * Client RPC serveur, partagé par les routes qui doivent lire la chaîne.
 *
 * Utilisé pour valider les signatures de comptes contrats (route d'auth) et
 * pour reconstruire un certificat à partir de son tokenId sans faire confiance
 * au client (route PDF).
 */
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.INFURA_SEPOLIA_RPC_URL),
});

export class TokenNotFoundError extends Error {
  constructor(tokenId: bigint) {
    super(`Le token #${tokenId} n'existe pas sur ce contrat.`);
    this.name = "TokenNotFoundError";
  }
}

export interface OnChainToken {
  tokenId: bigint;
  /** Valeur brute de `tokenURI()` : un CID nu dans l'implémentation actuelle. */
  tokenUri: string;
  /** Propriétaire réel du token, seul auteur légitime du certificat. */
  owner: `0x${string}`;
}

/**
 * Lit sur la chaîne les seules informations qui font foi pour un certificat.
 *
 * `ownerOf` et `tokenURI` révertent tous deux si le token n'existe pas
 * (`ERC721NonexistentToken`) : c'est le contrôle d'existence, il n'y a pas
 * besoin d'en ajouter un autre.
 */
export async function readCertificateToken(
  tokenId: bigint,
): Promise<OnChainToken> {
  if (!MindchainContractAddress) {
    throw new Error("NEXT_PUBLIC_MINDCHAIN_ADDRESS n'est pas configurée.");
  }

  try {
    const [tokenUri, owner] = await Promise.all([
      publicClient.readContract({
        address: MindchainContractAddress,
        abi: MindchainContractABI,
        functionName: "tokenURI",
        args: [tokenId],
      }) as Promise<string>,
      publicClient.readContract({
        address: MindchainContractAddress,
        abi: MindchainContractABI,
        functionName: "ownerOf",
        args: [tokenId],
      }) as Promise<`0x${string}`>,
    ]);

    return { tokenId, tokenUri, owner };
  } catch {
    // On ne propage pas le détail du revert : il n'apprendrait rien à
    // l'appelant et exposerait la mécanique du contrat.
    throw new TokenNotFoundError(tokenId);
  }
}

import { loadJsonFile } from "@/services/storage";
import { getMindchainContract } from "@/contracts/MindchainNFT";
import { NFTItem } from '@/utils/interfaces';
import { MintResult } from '@/utils/interfaces';

// Fonction pour mint un token NFT avec les métadonnées hébergées sur IPFS
export async function mintCertificateToken(nftURI: string, walletProvider: any, address: string) {

  const mintData: MintResult = {
    status: false,
    txHash: "",
    tokenId: null,
    metadataCid: ""
  };
  // Connexion au contrat
  const { contract, signer } = await getMindchainContract(walletProvider);
  if (!contract || !signer) {
    console.error("[Mint] Impossible de se connecter au contrat ou au signataire.");
    return mintData;
  }
  // Transaction de mint
  let tx;
  try {
    console.log("[Mint] Envoi de la transaction mintMindchain() …");
    tx = await contract.mintMindchain(address, nftURI);
    console.log("[Mint] Transaction envoyée, en attente…", tx.hash);
  } catch (err) {
    console.error("[Mint] Échec lors de l’envoi de la transaction :", err);
    return mintData;
  }

  // Attente du receipt
  let receipt;
  try {
    receipt = await tx.wait();
    console.log("[Mint] Transaction mintée !", receipt.hash);
    mintData.status = true;
  } catch (err) {
    console.error("[Mint] Échec lors de la confirmation :", err);
    return mintData;
  }

  // Extraction de l’event
  console.log("[Mint] Analyse des logs…");
  const parsedEvent = receipt.logs
    .map((log: any) => {
      try {
        return contract.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find((evt: any) => evt && evt.name === "MindchainMinted");

  if (!parsedEvent) {
    console.warn("[Mint] Impossible de trouver l’event MindchainMinted !");
    return mintData;
  } else {
    mintData.status = true;
    mintData.txHash = receipt.hash;
    mintData.tokenId = parsedEvent?.args?.tokenId?.toString() ?? null;
    mintData.metadataCid = nftURI;
    return mintData;
  }
}

// Fonction pour créer ou mettre à jour le Merkle Root associé à une adresse
export async function createTokenMerkleRoot(tokenId: number, merkleRoot: string, walletProvider: any) {
    // Connexion au contrat
    const { contract, signer } = await getMindchainContract(walletProvider);
    if (!contract || !signer) {
        console.error("[MerkleRoot] Impossible de se connecter au contrat ou au signataire.");
        return false;
    }
    try {
        const tx = await contract.setMerkleRootByTokenId(tokenId, merkleRoot);
        console.log("[MerkleRoot] Transaction envoyée, en attente…", tx.hash);
         // Attente du receipt
        const receipt = await tx.wait();
        console.log("[MerkleRoot] Transaction confirmée !", receipt.hash);
        // Extraction de l’event
        console.log("[MerkleRoot] Analyse des logs…");
        const parsedEvent = receipt.logs
            .map((log: any) => {
                try {
                    return contract.interface.parseLog(log);
                } catch {
                    return null;
                }
            })
            .find((evt: any) => evt && evt.name === "MerkleRootSet");
        if (!parsedEvent) {
            console.warn("[MerkleRoot] Impossible de trouver l’event MerkleRootSet !");
            return false;
        }
        return true;
    } catch (err) {
      console.error("[MerkleRoot] Error setting Merkle Root:", err);
      return false;
    }
}

// Fonction pour récupérer les IDs des tokens NFT possédés par un utilisateur
export async function getUserTokenIDs(address: string, walletProvider: any): Promise<NFTItem[] | undefined> {
    // Connexion au contrat
    const { contract, signer } = await getMindchainContract(walletProvider);
    if (!contract || !signer) {
        console.error("[UserTokens] Impossible de se connecter au contrat ou au signataire.");
        return [];
    }
    try {
        // Récupérer le nombre de NFTs possédés par l'utilisateur
        const tokens: number[] = await contract.getTokenIDsByOwner(address);
        // Récupérer les détails de chaque NFT
        const items = await Promise.all(
            tokens.map(async (tokenId: number) => {
                const uri = await contract.tokenURI(tokenId);              
                const httpUrl = await loadJsonFile(uri);
                const metadata = await fetch(httpUrl).then(r => r.json());
                return {
                    tokenId: tokenId.toString(),
                    metadata,
                };
            }
        )
        );  
        return items;   
    } catch (err) {
      console.error("[History] Error fetching NFTs:", err);
      return [];
    }
};

// Fonction pour vérifier si un utilisateur a des droits spéciaux (ex: whitelist)
export async function isUserAdmin(address: string, walletProvider: any):Promise<boolean | undefined> {
    // Connexion au contrat
    const { contract, signer } = await getMindchainContract(walletProvider);
    if (!contract || !signer) {
        console.error("[Rights] Impossible de se connecter au contrat ou au signataire.");
        return false;
    }
    try {
        return await contract.isAddressWhitelisted();
    } catch (err) {
      console.error("[Rights] Error checking whitelisted status:", err);
      return false;
    }
}
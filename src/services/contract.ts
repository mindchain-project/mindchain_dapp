import { loadJsonFile } from "@/services/storage";
import { NFTItem } from '@/utils/interfaces';
import { MintResult } from '@/utils/interfaces';
import { ethers } from "ethers";
import { MINDCHAIN_DEFAULT_ADDRESS, MINDCHAIN_DEFAULT_ABI } from "@/contracts/MindchainContract";
import { useSendTransaction } from 'wagmi'


// TODO remplacer par un singleton pour éviter de recréer l’instance à chaque appel
export async function getMindchainContract(
  walletProvider: any,
): Promise<{ contract: ethers.Contract | null; signer: ethers.Signer | null }> {
  
  if (!walletProvider) throw new Error("❌ Provider Reown manquant !");

  const contractAddress = MINDCHAIN_DEFAULT_ADDRESS;
  const contractABI = MINDCHAIN_DEFAULT_ABI;

  try {
    // Création du provider
    console.log("[Contract] Initialisation du provider…");
    const provider = new ethers.BrowserProvider(walletProvider);
    // Récupération du signataire
    console.log("[Contract] Récupération du signataire…");
    const signer = await provider.getSigner();
    // Création de l'instance du contrat
    console.log("[Contract] Initialisation du contrat Mindchain…");
    const contract = new ethers.Contract(
      contractAddress, contractABI, signer
    );
    console.log("[Contract] Instance du contrat Mindchain créée !");
    return { contract, signer };
  } catch (err) {
    console.error("[Contract] Erreur lors de l'initialisation du contrat :", err);
    throw err;
  }
}


// Fonction pour mint un token NFT avec les métadonnées hébergées sur IPFS
export async function mintCertification(nftURI: string, walletProvider: any, address: string) {

  const mintData: MintResult = {
    txHash: "",
    tokenId: null,
    metadataCid: "",
    imageCid: ""
  };
  try {
    // Connexion au contrat
    const { contract } = await getMindchainContract(walletProvider);
    // Transaction de mint
    console.log("[Mint] Envoi de la transaction mintCertification() …");
    if (!contract) {
      throw new Error("[Mint] Contrat non disponible !");
    }
    const tx = await contract.mintCertification(address, nftURI);
    if (!tx) {
      throw new Error("[Mint] Échec lors de l’envoi de la transaction !");
    }
    console.log("[Mint] Transaction envoyée, en attente…", tx.hash);
  } catch (err) {
    console.error("[Mint] Échec lors de l’envoi de la transaction :", err);
    throw err;
  }

  // Attente du receipt
  let receipt;
  try {
    receipt = await tx.wait();
    console.log("[Mint] Transaction mintée !", receipt.hash);
    mintData.status = true;
  } catch (err) {
    console.error("[Mint] Échec lors de la confirmation :", err);
    throw err;
  }

  try{
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
      .find((evt: any) => evt && evt.name === "CertificationMinted");

    if (!parsedEvent) {
      console.warn("[Mint] Impossible de trouver l’event CertificationMinted !");
      return mintData;
    } else {
      // Remplissage des données de mint
      mintData.status = true;
      mintData.txHash = receipt.hash;
      mintData.tokenId = parsedEvent?.args?.tokenId?.toString() ?? null;
      mintData.metadataCid = nftURI;
      return mintData;
    }
  } catch (err) {
    console.error("[Mint] Erreur lors de l’analyse des logs :", err);
    throw err;
  }
}



// Fonction pour récupérer les IDs des tokens NFT possédés par un utilisateur
export async function getCertificationTokenIdsByAddress(address: string, walletProvider: any): Promise<NFTItem[]> {
    // Connexion au contrat
    const { contract, signer } = await getMindchainContract(walletProvider);
    if (!contract || !signer) {
        console.error("[CertificationTokenIds] Impossible de se connecter au contrat ou au signataire.");
        return [];
    }
    try {
        // Récupérer le nombre de NFTs possédés par l'utilisateur
        const balance: number = await contract.balanceOf(address);
        // Récupérer les IDs des NFTs
        const tokenIds: string[] = [];
        for (let i = 0; i < balance; i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(address, i);
            tokenIds.push(tokenId.toString());
        }
        // Récupérer les détails de chaque NFT
        const items = await Promise.all(
            Array.from({ length: balance }, async (_, index) => {
                const tokenId = tokenIds[index];
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
      console.error("[CertificationTokenIds] Error fetching NFTs:", err);
      return [];
    }
};

// Fonction pour vérifier si un utilisateur est mebre admin (DAO)
export const isUserAdmin = async (walletProvider: any):Promise<boolean> => {
    const { contract, signer } = await getMindchainContract(walletProvider, "DAO");
    if (!contract || !signer) {
        console.error("[Rights] Impossible de se connecter au contrat ou au signataire.");
        return false;
    }
    try {
        return await contract.isUserAdmin(await signer.getAddress());
    } catch (err) {
      console.error("[Rights] Error checking whitelisted status:", err);
      return false;
    }
}
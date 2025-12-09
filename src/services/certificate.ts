import { v4 as uuidv4 } from "uuid";
import { CertificateFormData, MintResult, CertificateFileMetadata } from "../utils/interfaces";
import { uploadImageFile, uploadJsonFile, deleteFile } from "./storage";
import { ethers } from "ethers";
import { MINDCHAIN_NFT_ADDRESS, MINDCHAIN_NFT_ABI } from "../contracts/MindchainNFT";
// import { useReadContract } from "wagmi";

// async function tokenId() {
//   const result = useReadContract({
//     abi: MINDCHAIN_NFT_ABI[0].abi,
//     address: MINDCHAIN_NFT_ADDRESS,
//     functionName: "totalSupply",
//   });
//   console.log("Total Supply:", result.data);
//   return result.data-1;
// }

const MINDCHAIN_NFT_CID = "bafybeidpcbs5gklqwqgb22hsmb5vlyv242lvttlpenmapb72fxjrnsawde";

export async function getMindchainContract(walletProvider: any, userAddress: string) {
  console.log("[Contract] Initialisation du provider…");
  if (!walletProvider) throw new Error("❌ Provider Reown manquant !");
  if (!userAddress) throw new Error("❌ Adresse user manquante !");
  try {
    const provider = new ethers.BrowserProvider(walletProvider);
    console.log("[Contract] Récupération du signer…");
    const signer = await provider.getSigner();
    console.log("[Contract] Signer address :", await signer.getAddress());
    const contract = new ethers.Contract(
      MINDCHAIN_NFT_ADDRESS,
      MINDCHAIN_NFT_ABI[0].abi,
      signer
    );
    console.log("[Contract] Instance du contrat Mindchain NFT créée !");
    return { contract, signer };
  } catch (err) {
    console.error("[Contract] Erreur lors de l'initialisation du contrat :", err);
    return { contract: null, signer: null};
  }
}

export async function mintCertificate(metadataCid: string, walletProvider: any, address: string) {

  const { contract, signer } = await getMindchainContract(walletProvider, address);

  const mintData: MintResult = {
    status: false,
    txHash: "",
    tokenId: null,
    metadataCid: ""
  };

  if (!contract || !signer) {
    return mintData;
  }
  // 1. Transaction de mint
  let tx;
  try {
    console.log("[Mint] Envoi de la transaction mintMindchain() …");
    tx = await contract.mintMindchain(address, metadataCid);
    console.log("[Mint] Transaction envoyée, en attente…", tx.hash);
  } catch (err) {
    console.error("[Mint] Échec lors de l’envoi de la transaction :", err);
    return mintData;
  }

  // 2. Attente du receipt
  let receipt;
  try {
    receipt = await tx.wait();
    console.log("[Mint] Transaction mintée !", receipt.hash);
    mintData.status = true;
  } catch (err) {
    console.error("[Mint] Échec lors de la confirmation :", err);
    return mintData;
  }

  // 3. Extraction de l’event
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
    mintData.metadataCid = metadataCid;
    return mintData;
  }
}


export async function generateCertificate(form: CertificateFormData, address?: string, walletProvider?: any): Promise<MintResult> {

  if (!walletProvider) throw new Error("Provider wallet manquant !");
  if (!address) throw new Error("Adresse wallet manquante !");
  if (!form.finalArtworkFile || !(form.finalArtworkFile instanceof File)) throw new Error("Fichier de l'œuvre finale manquant ou invalide !");

  const certificateId = uuidv4();
  const attributes = [];
  let fileCID: string | null = null;

  // Fonction utilitaire pour générer les métadonnées d’un fichier
  const getFileMetadata = (file: File, role: string, cid: string): CertificateFileMetadata => {
    const _url = "ipfs://" + cid;
    const certificateFile = {
      url: _url,
      type: file.type,
      original_filename: file.name,
      size: file.size,
      role,
    };
    return certificateFile;
  };
  // Gestion du fichier de l’image finale
  if(form.finalArtworkFileIpfsPublish === false) {
    // Si l’utilisateur ne veut pas publier l’image finale sur IPFS, on utilise le CID par défaut
    fileCID = MINDCHAIN_NFT_CID;
    // TODO hash localement le fichier pour vérification future ?
  } else {
    // Generation du CID de l’image finale avec upload sur IPFS
    const filename = `${certificateId}_${form.finalArtworkFile.name}`;
    fileCID = await uploadImageFile(form.finalArtworkFile, filename);
    if (!fileCID) {
      throw new Error("Erreur lors de l’upload de l’image finale sur IPFS.");
    }
    form.finalArtworkFileCid = fileCID;
  }
  try {
    // Ajout des métadonnées du fichier de l’image finale
    const finalArtWorkMetadata = getFileMetadata(form.finalArtworkFile, "final_artwork", fileCID);
    attributes.push({
      trait_type: "image_metadata",
      value: finalArtWorkMetadata,
    });
    
    // Construction des attributs du certificat
    form.iterations.forEach((iteration, index) => {
      const idx = index; // s'assurer que index est bien défini
      // TODO ajouter gestion des fichiers sources et images d’itération, si upload IPFS = true
      const attribute_value = {
          index: idx,
          prompt: iteration.prompt,
          model: iteration.model,
          provider: iteration.provider,
          mode: iteration.mode,
          source_file_cid: null, // TODO à implémenter
          source_file_metadata: null, // TODO à implémenter
          source_file_description: iteration.sourceFileDesc,
          iteration_image_cid: index === 0 ? fileCID : null, // TODO à implémenter pour les itérations précédentes
          iteration_image_metadata: index === 0 ? finalArtWorkMetadata : null, // TODO à implémenter pour les itérations précédentes
          personalData: iteration.personalData,
        };
      attributes.push({
        trait_type: index === 0 ? "image_final_iteration_0" : "image_previous_iteration_" + idx,
        value: attribute_value,
      });
    });

    // Construction de l’objet certificat
    const certificate = {
      name: form.title,
      description: form.description,
      image: !fileCID ? MINDCHAIN_NFT_CID : fileCID,
      external_url:'',
      attributes: attributes,
      creation: {
        timestamp: Date.now(),
        certificate_id: certificateId,
        creator_wallet: address || "unknown"
        }
      };

    const uploadedJsonCID = await uploadJsonFile(certificate, certificateId);
    if (!uploadedJsonCID) {
      throw new Error("Erreur lors de l’upload des métadonnées du certificat sur IPFS.");
    }
    const tx:MintResult = await mintCertificate(uploadedJsonCID!, walletProvider, address);
    if (tx.status === false) {
      // En cas d’erreur lors du mint, on supprime les fichiers uploadés sur IPFS (si applicable)
      if(form.finalArtworkFileCid) {
        await deleteFile([form.finalArtworkFileCid, uploadedJsonCID]);
      }
      throw new Error("Erreur lors du mint du certificat NFT.");  
    }

    return tx;
  } catch (err) {
    console.error("Erreur lors de la génération du certificat :", err);
    if(form.finalArtworkFileCid) {
      await deleteFile([form.finalArtworkFileCid]);
      // TODO supprimer aussi les fichiers des itérations, si upload IPFS = true
    }
    throw err;
  }
}

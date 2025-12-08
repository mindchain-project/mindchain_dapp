import { v4 as uuidv4 } from "uuid";
import { CertificateFormData } from "../utils/interfaces";
import { uploadJsonFile, uploadImageFile } from "./storage";
import { ethers } from "ethers";
import { MINDCHAIN_NFT_ADDRESS, MINDCHAIN_NFT_ABI } from "../contracts/MindchainNFT";
import { useReadContract } from "wagmi";


export async function getMindchainContract(walletProvider: any, userAddress: string) {
  console.log("[Contract] Initialisation du provider…");

  if (!walletProvider) throw new Error("❌ Provider Reown manquant !");
  if (!userAddress) throw new Error("❌ Adresse user manquante !");

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
}


// async function tokenId() {
//   const result = useReadContract({
//     abi: MINDCHAIN_NFT_ABI[0].abi,
//     address: MINDCHAIN_NFT_ADDRESS,
//     functionName: "totalSupply",
//   });
//   console.log("Total Supply:", result.data);
//   return result.data-1;
// }

export async function mintCertificate(metadataCid: string, walletProvider: any, address: string) {
  console.log("[Mint] Démarrage du mint…");
  console.log("CID =", metadataCid);

  const { contract, signer } = await getMindchainContract(walletProvider, address);

  // 2. Transaction de mint
  let tx;
  try {
    console.log("[Mint] Envoi de la transaction mintMindchain() …");
    tx = await contract.mintMindchain(address, metadataCid);
    console.log("[Mint] Transaction envoyée, en attente…", tx.hash);
  } catch (err) {
    console.error("[Mint] Échec lors de l’envoi de la transaction :", err);
    throw err;
  }

  // 3. Attente du receipt
  let receipt;
  try {
    receipt = await tx.wait();
    console.log("[Mint] Transaction minée !", receipt.hash);
  } catch (err) {
    console.error("[Mint] Échec lors de la confirmation :", err);
    throw err;
  }

  // 4. Extraction de l’event
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
  } else {
    console.log("[Mint] Event détecté :", parsedEvent);
  }

  return {
    txHash: receipt.hash,
    tokenId: parsedEvent?.args?.tokenId?.toString() ?? null,
    metadataCid,
  };
}



export async function generateCertificate(form: CertificateFormData, address?: string, walletProvider?: any) {

  if (!walletProvider) throw new Error("Provider wallet manquant !");
  if (!address) throw new Error("Adresse wallet manquante !");

  // // Utilitaires pour obtenir des métadonnées fichiers
  // const getFileMetadata = (file: File | null, role: string, url: string) => {
  //   if (!file) return null;
  //   return {
  //     url: url,
  //     type: file.type,
  //     original_filename: file.name,
  //     size: file.size,
  //     role,
  //   };
  // };
  // let fileUrl: string | null = null;
  // let uploadedFileMetadata = null;
  // if (form.uploadedFile) {
  //   // Upload final artwork image to IPFS
  //   fileUrl = await uploadImageFile(form.uploadedFile);
  //   uploadedFileMetadata = getFileMetadata(form.uploadedFile, "final_artwork", fileUrl);
  //   console.log("Final Artwork metadata:", uploadedFileMetadata);
  // }

  const attributes = [];
  for (const iteration of form.iterations) {
    attributes.push({
      trait_type: "Iteration Step",
      value: {
        "prompt": iteration.prompt,
        "model": iteration.model,
        "provider": iteration.provider,
        "mode": iteration.mode,
        "sourceFileDesc": iteration.sourceFileDesc,
        "personalData": iteration.personalData,
        "ipfsPublish": iteration.ipfsPublish,
      }
    });
  }

  const certificate = {
    name: form.title,
    description: form.description,
    image: form.uploadedFileUrl,
    external_url:'',
    attributes: attributes,
    creation: {
      timestamp: Date.now(),
      certificate_id: uuidv4(),
      creator_wallet: address || "unknown"
      }
    };


  // TODO vérifier si le CID existe déjà et annuler la transaction
  const uploadedJson = await uploadJsonFile(certificate);
  const uploadedJsonCID = uploadedJson?.cid;
  console.log("NFT Certificate JSON:", uploadedJson);
  const tx = await mintCertificate(uploadedJsonCID!, walletProvider, address);
  console.log("Minting Transaction:", tx);
  return tx;
}

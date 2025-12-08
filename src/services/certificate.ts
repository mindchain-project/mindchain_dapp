import { v4 as uuidv4 } from "uuid";
import { CertificateFormData } from "../utils/interfaces";
import { uploadJsonFile } from "./storage";
import { ethers } from "ethers";
import { MINDCHAIN_NFT_ADDRESS, MINDCHAIN_NFT_ABI } from "../contracts/MindchainNFT";

async function mintMindchainCertificate(metadataCid: string) {

  const provider = new ethers.BrowserProvider((window as any).ethereum);

  // 4) Demander l'accès au portefeuille
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(MINDCHAIN_NFT_ADDRESS, MINDCHAIN_NFT_ABI[0].abi, signer);

  // 5) Récupérer l'adresse du créateur
  const creatorAddress = await signer.getAddress();

  // 6) Appel du smart contract
  const tx = await contract.mintMindchain(creatorAddress, metadataCid);
  const receipt = await tx.wait();

  // Récupérer l'event MindchainMinted dans les logs
  const event = receipt.logs
    .map((log: any) => {
      try {
        return contract.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find((parsed: any) => parsed && parsed.name === "MindchainMinted");

 // TODO généré un popup de succès avec les infos du NFT minté

  return {
    txHash: receipt.hash,
    tokenId: event?.args?.tokenId?.toString(),
    metadataCid
  };
}


export async function generateCertificate(form: CertificateFormData, address?: string) {

  // Utilitaires pour obtenir des métadonnées fichiers
  const getFileMetadata = (file: File | null, role: string) => {
    if (!file) return null;
    return {
      uri: `ipfs://TO_BE_REPLACED_AFTER_UPLOAD`, // tu pourras injecter le CID
      type: file.type,
      original_filename: file.name,
      size: file.size,
      role,
    };
  };

  // const certificate = {
  //   name: form.title,
  //   description: form.description,
  //   image: "ipfs://CID_FINAL_ARTWORK", // remplacé après upload sur IPFS
  //   external_url: `https://mindchain.ai/certificate/${uuidv4()}`,
  //   attributes: [
  //     { trait_type: "Model", value: form.model },
  //     { trait_type: "Provider", value: form.provider },
  //     { trait_type: "Mode", value: form.mode },
  //     { trait_type: "Personal Data", value: form.personalData },
  //     { trait_type: "IPFS Publication Allowed", value: form.ipfsPublish }
  //   ],
  //   properties: {
  //     files: [
  //       getFileMetadata(form.uploadedFile, "final_artwork"),
  //       getFileMetadata(form.sourceFile, "source_image"),
  //       getFileMetadata(form.iterationImage, "iteration_step")
  //     ].filter(Boolean),

  //     ai_parameters: {
  //       prompt: form.prompt,
  //       model: form.model,
  //       provider: form.provider,
  //       mode: form.mode,
  //     },

  //     source_file: {
  //       description: form.sourceFileDesc,
  //       original_filename: form.sourceFile?.name ?? null
  //     },

  //     legal: {
  //       process_confirmation: form.legal?.authorshipConfirmation ?? true,
  //       certification_validation: form.legal?.thirdPartyRights ?? true,
  //       privacy_acceptance: form.legal?.exploitationRights ?? true,
  //       terms_acceptance: form.legal?.license ?? true,
  //     },

  //     creation: {
  //       timestamp: Date.now(),
  //       certificate_id: uuidv4(),
  //       creator_wallet: address || "unknown"
  //     }
  //   }
  // };
  const certificate = {
    name: "Mindchain NFT Certificate",
    description: "Mindchain AI-generated NFT Certificate",
    image: "ipfs://bafybeif3vzfmlm5mpc3bbwlnj6eus4gaf2qifax36frrdxpj3b6ttg6req",
    attributes: []
  }

  const uploadedJson = await uploadJsonFile(certificate);
  const uploadedJsonCID = uploadedJson?.cid;
  console.log("NFT Certificate JSON:", uploadedJson);
  const tx = await mintMindchainCertificate(uploadedJsonCID!);
  console.log("Minting Transaction:", tx);
  return tx;
}

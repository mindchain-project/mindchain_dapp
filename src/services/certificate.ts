import { v4 as uuidv4 } from "uuid";
import { CertificateFormData, MintResult, CertificateFileMetadata } from "../utils/interfaces";
import { uploadImageFile, uploadJsonFile, deleteFile, loadJsonFile } from "./storage";
import { generateMerkleTree } from "./validate";
import { mintCertificateToken } from "./transaction";
import { keccak256, toUtf8Bytes } from "ethers";

const MINDCHAIN_NFT_CID = "bafybeidpcbs5gklqwqgb22hsmb5vlyv242lvttlpenmapb72fxjrnsawde";

// Fonction utilitaire pour générer les métadonnées d’un fichier
const getFileMetadata = (file: File): CertificateFileMetadata => {
  console.log("Generating file metadata for", file);
  const certificateFile = {
    type: file.type,
    original_filename: file.name.toLowerCase().trim(),
    size: file.size,
  };
  return certificateFile;
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function loadJsonFileAsBase64(cid: string): Promise<string> {
  const url = await loadJsonFile(cid);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch error for ${url}`);
    const jsonData = await res.json();
    const jsonString = JSON.stringify(jsonData);
    const base64 = btoa(jsonString);
    return base64;
  } catch (err) {
    console.error("[StorageLoad] Error loading JSON file:", err);
    return "";
  }
}


export async function generateCertificate(form: CertificateFormData, address?: string, walletProvider?: any): Promise<MintResult> {

  if (!walletProvider) throw new Error("[Certificat] Provider wallet manquant !");
  if (!address) throw new Error("[Certificat] Adresse wallet manquante !");
  if (!form.finalArtworkFile || !(form.finalArtworkFile instanceof File)) throw new Error("[Certificat] Fichier de l'œuvre finale manquant ou invalide !");

  const certificateId = uuidv4();
  const attributes: any[] = [];
  let imageFileCID: string | null = null;

  // Gestion du fichier de l’image finale
  if(form.finalArtworkFileIpfsPublish === false) {
    // Si l’utilisateur ne veut pas publier l’image finale sur IPFS, on utilise le CID par défaut
    imageFileCID = MINDCHAIN_NFT_CID;
    // TODO hash localement le fichier pour vérification future ?
  } else {
    // Generation du CID de l’image finale avec upload sur IPFS
    const filename = `${certificateId}_${form.finalArtworkFile.name}`;
    imageFileCID = await uploadImageFile(form.finalArtworkFile, filename);
    if (!imageFileCID) {
      throw new Error("[Certificat] Erreur lors de l’upload de l’image finale sur IPFS.");
    }
    form.finalArtworkFileCid = imageFileCID;
  }

  try {    
    // Construction des attributs du certificat
    form.iterations.forEach((iteration, index) => {
      const idx = index; 
      const attribute_value = {
          index: idx,
          prompt: iteration.prompt.toLowerCase().trim(),
          model: iteration.model.toLowerCase().trim(),
          provider: iteration.provider.toLowerCase().trim(),
          mode: iteration.mode.toLowerCase(),
          source_file_metadata: iteration.sourceFile instanceof File ? getFileMetadata(iteration.sourceFile) : null,
          source_file_description: iteration.sourceFileDesc?.toLowerCase().trim(),
          iteration_image_metadata: iteration.iterationImage instanceof File ? getFileMetadata(iteration.iterationImage) : null,
          personalData: iteration.personalData,
        };
      attributes.push({
        trait_type: index === 0 ? "final_image_iteration_0" : "previous_image_iteration_" + idx,
        value: attribute_value,
      });
    });

    // Construction de l’objet certificat
    const certificate = {
      name: form.title,
      description: form.description,
      image: !imageFileCID ? MINDCHAIN_NFT_CID : imageFileCID,
      external_url:'',
      attributes: attributes,
      creation: {
        timestamp: Date.now(),
        certificate_id: certificateId,
        creator_wallet: address || "unknown"
        }
      };
    // Upload des métadonnées du certificat sur IPFS
    const uploadJsonFilename = `certificate_metadata_${certificateId}.json`;
    const uploadedJsonCID = await uploadJsonFile(certificate, uploadJsonFilename);
    console.log("[Certificat] Metadata JSON uploaded to IPFS with CID:", uploadedJsonCID);
    if (!uploadedJsonCID) {
      throw new Error("[Certificat] Erreur lors de l’upload des métadonnées du certificat sur IPFS.");
    }
    // Mint du token NFT du certificat
    const tx:MintResult = await mintCertificateToken(uploadedJsonCID!, walletProvider, address);
    if (tx.status === false) {
      // En cas d’erreur lors du mint, on supprime les fichiers uploadés sur IPFS (si applicable)
      if(form.finalArtworkFileCid) {
        await deleteFile([form.finalArtworkFileCid, uploadedJsonCID]);
      }
      throw new Error("[Certificat] Erreur lors du mint du certificat NFT.");  
    }
    // Génération du Merkle Tree pour le token minté
    if (tx.tokenId) {
      if (form.finalArtworkFileOriginal instanceof File) {
        const imageBase64 = await fileToBase64(form.finalArtworkFileOriginal);
        const jsonBase64 = await loadJsonFileAsBase64(uploadedJsonCID);
        const imageHash: string = keccak256(toUtf8Bytes(imageBase64));
        const jsonHash: string = keccak256(toUtf8Bytes(jsonBase64));
        const leafData: [string, string][] = [
          ["image", imageHash],
          ["data", jsonHash],
        ];
        // Tri des feuilles par ordre alphabétique des clés
        leafData.sort((a, b) => a[0].localeCompare(b[0]));
        const merkleTreeRoot = await generateMerkleTree(tx.tokenId, leafData);
        console.log("MERKLE TREE GENERATED", merkleTreeRoot);
      }

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

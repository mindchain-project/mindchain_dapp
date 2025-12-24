'use server';
import { PinataSDK } from "pinata";

const MINDCHAIN_GROUP_ID = process.env.MINDCHAIN_GROUP_ID || "";
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT || "",
  pinataGateway: process.env.PINATA_GATEWAY || "",
});

// Example to get a public signature (Need to upgrade plan)
// const signature = await pinata.signatures.public.get(
//   "0x9e7dd23be678960fd1a4873c35a87d1ee4f3d63e"
// );

export async function deleteFiles(files: Array<string>) {
  for (const file of files) {
    try {
      const result = await pinata.files.public.delete([file]);
      if(result[0].status === 'HTTP error') {
        const cid_response = await pinata.gateways.public.get(file);
        if (cid_response.data === null) {
          console.log(`[IPFS] File with CID ${file} does not exist.`);
          continue;
        }
        throw new Error("[IPFS] Failed to delete file with CID " + file);
      } else {
        console.log(`[IPFS] Files with CID ${file} deleted successfully.`);
      }
    } catch (error) {
      console.log("[IPFS] Error while deleting file with CID " + file + " : " + error);
    }
  }
}

export async function uploadImageFile(file: File, filename: string) : Promise<string | null> {
  console.log("[IPFS] Starting upload Image to Pinata...");
  try {
    const result = await pinata.upload.public.file(file)
    .name(filename)
    const pinedImage = result as unknown as { is_duplicate: boolean; cid: string };
    // if (pinedImage.is_duplicate) {
    //   // Impossible de certifier l'image si elle existe déjà sur IPFS
    //   alert("[IPFS] Fichier déjà existant sur IPFS !");
    //   throw new Error("[IPFS] File already exists on IPFS");
    // }
    return pinedImage.cid;
  } catch (error) {
    // L'erreur n'empêche pas le fonctionnement de l'application
    console.log("[IPFS] Error while uploading image file: " + error);
    return null;
  }
}

export async function uploadJsonFile(content: object, filename: string) : Promise<string> {
  console.log("[IPFS] Starting upload Json file to Pinata...");
  try {
    const result = await pinata.upload.public.json(content)
    .name(filename)
  const pinedJson = result as unknown as { is_duplicate: boolean; cid: string };
  if (pinedJson.is_duplicate) {
      // Impossible de poursuivre la certification
      alert("[IPFS] Fichier déjà existant sur IPFS !");
      throw new Error("File already exists on IPFS");
    }
    return pinedJson.cid;
  } catch (error) {
    console.log("[IPFS] Error while uploading JSON file: " + error);
    throw error;
  }
}

// TODO vérifier le type de retour
export async function resolveURI(uri: string) {
  if (!uri) return "";
  // Format ipfs://CID
  if (uri.startsWith("ipfs://") || uri.startsWith("ipfs/")) {
    return `https://gateway.pinata.cloud/ipfs/${uri.slice(7)}`;
  }
  // Format CID brut
  if (/^[a-zA-Z0-9]{46,}$/.test(uri)) {
    return `https://gateway.pinata.cloud/ipfs/${uri}`;
  }
  return uri; 
}



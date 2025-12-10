'use server';
import { PinataSDK } from "pinata";

const MINDCHAIN_GROUP_ID = "91935178-cd37-480e-849b-255a49a334fc";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT || "",
  pinataGateway: process.env.PINATA_GATEWAY || "",
});

// Example to get a public signature (Need to upgrade plan)
// const signature = await pinata.signatures.public.get(
//   "0x9e7dd23be678960fd1a4873c35a87d1ee4f3d63e"
// );

export async function deleteFile(files: Array<string>) {
  for (const cid of files) {
    try {
      await pinata.files.public.delete([cid]);
      console.log(`[IPFS] Files with CID ${cid} deleted successfully.`);
    } catch (error) {
      console.log("[IPFS] Error while deleting file with CID " + cid + " : " + error);
    }
}
}

export async function uploadImageFile(file: File, filename: string) : Promise<string | null> {
  console.log("[IPFS] Starting upload to Pinata...");
  try {
    const result = await pinata.upload.public.file(file)
    .name(filename)
    .group(MINDCHAIN_GROUP_ID);
    const pinedImage = result as unknown as { is_duplicate: boolean; cid: string };
    if (pinedImage.is_duplicate) {
      alert("[IPFS] ⚠️ Fichier déjà existant sur IPFS/PINATA !");
      return null;
    }
    return pinedImage.cid;
  } catch (error) {
    console.log("[IPFS] Error while uploading image file: " + error);
    return null;
  }
}

export async function uploadJsonFile(content: object, filename: string) : Promise<string | null> {
  console.log("[IPFS] Starting upload to Pinata...");
  try {
    const uploadedJson = await pinata.upload.public.json(content)
    .name(filename)
    .group(MINDCHAIN_GROUP_ID);
    return uploadedJson.cid;
  } catch (error) {
    console.log("[IPFS] Error while uploading JSON file: " + error);
    return null;
  }
}

export async function loadJsonFile(uri: string) {
  if (!uri) return "";
  // Format ipfs://CID
  if (uri.startsWith("ipfs://")) {
    return `https://gateway.pinata.cloud/ipfs/${uri.slice(7)}`;
  }
  // Format CID brut
  if (/^[a-zA-Z0-9]{46,}$/.test(uri)) {
    return `https://gateway.pinata.cloud/ipfs/${uri}`;
  }
  return uri; 
}



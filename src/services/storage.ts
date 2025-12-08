'use server';
import { PinataSDK } from "pinata";
import { readFileSync }  from "node:fs";
import { Blob } from "buffer";
import { PinataUploadResponse } from "../utils/interfaces";
import { v4 as uuidv4 } from "uuid";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT || "",
  pinataGateway: process.env.PINATA_GATEWAY || "",
});

export async function uploadTextFile() {
  try {
    // Upload a public text file
    const txt_file = new File(["hello world!"], "hello.txt", { type: "text/plain" });
    const txt_upload = await pinata.upload.public.file(txt_file);
    console.log(txt_upload);
    // Upload a public text file with metadata
    const uploadWithMetadata = await pinata.upload.public
    .file(txt_file)
    .name("mindchain.txt")
    .keyvalues({
      env: "prod"
    })
    console.log(uploadWithMetadata);
  } catch (error) {
    console.log(error);
  }
}
//await uploadTextFile();

export async function uploadImageFile(img_file: File, title: string = "image.png", version = "0") {
  try {
    const uploadedImage: PinataUploadResponse = await pinata.upload.public.file(img_file)
    .name(img_file.name)
    .keyvalues({
      version: version
    })
    .group("91935178-cd37-480e-849b-255a49a334fc");
    console.log(uploadedImage);
    return uploadedImage.cid;
  } catch (error) {
    console.log(error);
  }
}
//img_cid = await uploadImageFile();


export async function uploadJsonFile(json_content: object) {
  try {
    const filename = `${uuidv4()}.json`;
    const uploadedJson = await pinata.upload.public.json(json_content)
    .name(filename)
    .keyvalues({
      app: "mindchain_dapp"
    })
    .group("91935178-cd37-480e-849b-255a49a334fc");
    console.log(uploadedJson);
    return uploadedJson;
  } catch (error) {
    console.log(error);
    return null;
  }
}
//await uploadJsonFile(img_cid);


export async function retrieveFile(cid = "") {
  try {
    // Get a public file using its CID
    const public_image_cid = cid;
    const public_data = await pinata.gateways.public.get(public_image_cid);
    console.log("ipfs data :",public_data)
    // // Get a private file using its CID
    // const private_image_cid = process.env.PRIVATE_IMAGE_CID || "";
    // const private_data = await pinata.gateways.private.get(private_image_cid);
    // console.log(private_data);
    // Alternatively, get a gateway URL
    // const url = await pinata.gateways.convert(image_cid)
    // console.log(url)
  } catch (error) {
    console.log("Error while retrieving file: " + error);
  }
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
  //return `https://gateway.pinata.cloud/ipfs/bafybeicnxivqsgfcbyfilz2x7de4u6aez7eps4trs63aeoe4fdkkisdcjm`;
}


//retrieveFile();

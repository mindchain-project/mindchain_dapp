"use server";

interface ERC721Metadata {
  title?: string;
  type?: string;
  properties: { [key: string]: { type: string; description: unknown } };
}

export async function certificateImage(metadata: ERC721Metadata) {
  const certificateJson = JSON.stringify(metadata, null, 2);
  const fileName = `${metadata.title || "certificate"}.json`;

  return {
    fileName,
    content: Buffer.from(certificateJson, "utf-8").toString("base64")
  };
}

'use server';
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fetch from "node-fetch";

type CertificateData = {
  name: string;
  description: string;
  image: string;
  license: string;
  contract_address: string;
  creation: {
    certification_timestamp: number;
    certificate_id: string;
  };
  attributes: any[];
};

function stringifyValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "object" && value !== null)
    return JSON.stringify(value);
  return "";
}


export async function POST(req: Request) {
  const data = await req.json();
  //console.log("[PDF] Generating certificate PDF...", data);
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  let y = height - 60;

  // === TITLE ===
  page.drawText("CERTIFICAT DE CREATION PAR IA", {
    x: 50,
    y,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  y -= 40;

  // === BASIC INFO ===
  const lines = [
    `Contrat: ${data.contract_address}`,
    `Nom de l'oeuvre: ${data.name}`,
    `Description: ${data.description}`,
    `Licence: ${data.license}`,
    `ID du certificat: ${data.creation.certificate_id}`,
    `Auteur: ${data.address}`, 
    `Certifié le: ${new Date(
      data.creation.certification_timestamp
    ).toLocaleDateString("fr-FR")}`,
  ];

  lines.forEach((line) => {
    page.drawText(line, {
      x: 50,
      y,
      size: 12,
      font,
    });
    y -= 20;
  });

  // === IMAGE FROM IPFS ===
  if (data.image?.startsWith("ipfs://")) {
    const cid = data.image.replace("ipfs://", "");
    const imageUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;

    const response = await fetch(imageUrl);
    const contentType = response.headers.get("content-type");
    const imageBytes = await response.arrayBuffer();

    let image;

    if (contentType?.includes("png")) {
    image = await pdfDoc.embedPng(imageBytes);
    } else if (
    contentType?.includes("jpeg") ||
    contentType?.includes("jpg")
    ) {
    image = await pdfDoc.embedJpg(imageBytes);
    } else {
    throw new Error(`Unsupported image type: ${contentType}`);
    }

    page.drawImage(image, {
      x: 50,
      y: y - 220,
      width: 220,
      height: 220,
    });

    y -= 240;
  }

  const finalIteration = data.attributes.find(
    (attr: any) => attr.trait_type === "final_image_iteration"
  );

  const lastIteration =
    finalIteration &&
    typeof finalIteration.value === "object" &&
    finalIteration.value !== null
      ? finalIteration.value
      : undefined;

  // Texte du prompt SOUS l’image
  if (lastIteration) {
    // Prompt de l'oeuvre finale
    page.drawText("Prompt de l'oeuvre finale :", {
      x: 50,
      y: y - 20,
      size: 10,
      font: boldFont,
    });
    page.drawText(lastIteration.prompt, {
      x: 50,
      y: y - 35,
      size: 10,
      font,
      maxWidth: 220,
      lineHeight: 14,
    });
    y -= 40;
    // Model et provider
    page.drawText("Modèle IA :", {
      x: 50,
      y: y - 20,
      size: 10,
      font: boldFont,
    });
    page.drawText(lastIteration.model+ " de " + lastIteration.provider, {
      x: 50,
      y: y - 35,
      size: 10,
      font,
      maxWidth: 220,
      lineHeight: 14,
    });
    y -= 240;
  }

  // === FOOTER ===
  page.drawText(
    "Ce certificat atteste que l'oeuvre ci-dessus a été générée par un modèle d'IA et enregistrée sur la blockchain à des fins de provenance et de vérification.",
    {
      x: 50,
      y: 80,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
      maxWidth: 400,     // largeur maximale du texte
      lineHeight: 14,    // hauteur entre lignes
    }
  );

    const pdfBytes = await pdfDoc.save();
    const arrayBuffer = new Uint8Array(pdfBytes).buffer;
    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          `attachment; filename="certificate_${data.creation.certificate_id}.pdf"`,
      },
    });
}

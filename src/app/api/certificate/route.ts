import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { PDFDocument, rgb, PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { z } from "zod";
import { readCertificateToken, TokenNotFoundError } from "@/lib/chain";
import {
  extractFinalIteration,
  fetchCertificateImage,
  fetchCertificateMetadata,
  MetadataError,
} from "@/lib/certificate/metadata";

export const runtime = "nodejs";

/**
 * Génération du certificat PDF (correctif SEC-03).
 *
 * Le principe qui gouverne cette route : **le client ne fournit qu'un
 * `tokenId`**. Tout le contenu du certificat est ensuite reconstruit par le
 * serveur à partir de la chaîne — `tokenURI()` et `ownerOf()` — puis des
 * métadonnées IPFS ainsi désignées.
 *
 * La version précédente rendait le PDF à partir du corps de la requête. Elle
 * permettait donc à n'importe qui d'obtenir un document à l'apparence d'un
 * certificat Mindchain attestant ce qu'il voulait, et de faire télécharger au
 * serveur n'importe quel CID. Les deux problèmes disparaissent avec le
 * changement de source de vérité : ce qui n'est pas on-chain n'est pas
 * certifiable.
 *
 * La route reste **publique et sans authentification**, à dessein : un
 * certificat n'a de valeur que s'il est vérifiable par un tiers.
 */

const requestSchema = z.object({
  tokenId: z.coerce.bigint().nonnegative(),
});

/* -------------------------------------------------------------------------- */
/*                                  Polices                                   */
/* -------------------------------------------------------------------------- */

/**
 * Liberation Sans est embarquée plutôt que d'utiliser les polices standard de
 * pdf-lib : celles-ci sont encodées en WinAnsi et **lèvent une exception** dès
 * qu'un caractère sort de ce jeu. Or les prompts d'IA contiennent couramment
 * des emojis ou des caractères non latins : la génération échouait alors en
 * erreur 500. Avec une police embarquée, un glyphe absent est simplement
 * ignoré au rendu.
 */
const FONT_DIR = path.join(process.cwd(), "src", "assets", "fonts");
let fontCache: { regular: Uint8Array; bold: Uint8Array } | null = null;

async function loadFonts() {
  if (!fontCache) {
    const [regular, bold] = await Promise.all([
      readFile(path.join(FONT_DIR, "LiberationSans-Regular.ttf")),
      readFile(path.join(FONT_DIR, "LiberationSans-Bold.ttf")),
    ]);
    fontCache = { regular: new Uint8Array(regular), bold: new Uint8Array(bold) };
  }
  return fontCache;
}

/* -------------------------------------------------------------------------- */
/*                                  Utilitaires                               */
/* -------------------------------------------------------------------------- */

/** Retire les caractères de contrôle, qui ne se dessinent pas et brouillent la mise en page. */
function clean(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").trim();
}

/**
 * Assainit le nom de fichier avant de l'insérer dans `Content-Disposition`.
 * L'identifiant venant des métadonnées IPFS, une valeur contenant un guillemet
 * ou un CRLF permettrait de manipuler l'en-tête de réponse.
 */
function safeFilename(value: string, fallback: string): string {
  const cleaned = value.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 64);
  return cleaned.length > 0 ? cleaned : fallback;
}

/* -------------------------------------------------------------------------- */
/*                                    Route                                   */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Un identifiant de token valide est requis." },
      { status: 400 },
    );
  }
  const { tokenId } = parsed.data;

  // 1. Ce qui fait foi : la chaîne.
  let token;
  try {
    token = await readCertificateToken(tokenId);
  } catch (error) {
    if (error instanceof TokenNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[PDF] Lecture on-chain impossible :", error);
    return NextResponse.json({ error: "Chaîne inaccessible." }, { status: 502 });
  }

  // 2. Les métadonnées désignées par la chaîne, validées avant usage.
  let metadata;
  try {
    metadata = await fetchCertificateMetadata(token.tokenUri);
  } catch (error) {
    if (error instanceof MetadataError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    throw error;
  }

  const { regular, bold } = await loadFonts();
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const font = await pdfDoc.embedFont(regular, { subset: true });
  const boldFont = await pdfDoc.embedFont(bold, { subset: true });

  const page = pdfDoc.addPage([595, 842]); // A4
  const { height } = page.getSize();
  let y = height - 60;

  const write = (
    text: string,
    { size = 12, bold: useBold = false, maxWidth = 495 } = {},
  ) => {
    const value = clean(text);
    if (!value) return;
    const usedFont: PDFFont = useBold ? boldFont : font;
    page.drawText(value, { x: 50, y, size, font: usedFont, maxWidth, lineHeight: size + 3 });
    // Hauteur consommée, en tenant compte du retour à la ligne automatique.
    const lines = Math.max(1, Math.ceil(usedFont.widthOfTextAtSize(value, size) / maxWidth));
    y -= lines * (size + 3) + 8;
  };

  write("CERTIFICAT DE CREATION PAR IA", { size: 22, bold: true });
  y -= 12;

  const finalIteration = extractFinalIteration(metadata);
  const certifiedAt = metadata.creation.certification_timestamp
    ? new Date(metadata.creation.certification_timestamp).toLocaleDateString("fr-FR")
    : "date non renseignee";

  write(`Token ID : #${token.tokenId.toString()}`, { bold: true });
  // L'auteur est le propriétaire on-chain, non plus une adresse fournie par
  // l'appelant : c'est la seule source qui ne puisse pas être falsifiée.
  write(`Auteur (proprietaire on-chain) : ${token.owner}`);
  write(`Contrat : ${metadata.contract_address}`);
  write(`Nom de l'oeuvre : ${metadata.name}`);
  write(`Description : ${metadata.description}`);
  write(`Licence : ${metadata.license}`);
  write(`ID du certificat : ${metadata.creation.certificate_id}`);
  write(`Certifie le : ${certifiedAt}`);

  // 3. L'image, bornée en taille et restreinte aux passerelles connues.
  const image = await fetchCertificateImage(metadata.image);
  if (image) {
    try {
      const embedded = image.contentType?.includes("png")
        ? await pdfDoc.embedPng(image.bytes)
        : image.contentType?.includes("jpeg") || image.contentType?.includes("jpg")
          ? await pdfDoc.embedJpg(image.bytes)
          : null;

      if (embedded) {
        const size = 220;
        page.drawImage(embedded, { x: 50, y: y - size, width: size, height: size });
        y -= size + 20;
      }
    } catch (error) {
      // Image illisible ou corrompue : le certificat reste valable sans elle.
      console.error("[PDF] Image non intégrable :", error);
    }
  }

  if (finalIteration) {
    write("Prompt de l'oeuvre finale :", { size: 10, bold: true });
    write(finalIteration.prompt, { size: 10 });
    write("Modele IA :", { size: 10, bold: true });
    write(`${finalIteration.model} de ${finalIteration.provider}`, { size: 10 });
  }

  page.drawText(
    "Ce certificat atteste que l'oeuvre ci-dessus a ete enregistree sur la blockchain " +
      "a des fins de provenance et de verification. Les informations qui y figurent sont " +
      "reconstruites a partir du contrat, et non fournies par le demandeur.",
    { x: 50, y: 70, size: 9, font, color: rgb(0.4, 0.4, 0.4), maxWidth: 495, lineHeight: 12 },
  );

  const pdfBytes = await pdfDoc.save();
  const filename = `certificate_${safeFilename(
    metadata.creation.certificate_id,
    token.tokenId.toString(),
  )}.pdf`;

  return new Response(pdfBytes as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, max-age=0, no-store",
    },
  });
}

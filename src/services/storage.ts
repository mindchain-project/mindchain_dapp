'use server';
import { PinataSDK } from "pinata";
import { requireSession, UnauthorizedError } from "@/lib/auth/session";
import { issueCidReceipt, verifyCidReceipt } from "@/lib/auth/cid-receipt";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
} from "@/lib/auth/config";
import type {
  CidReceipt,
  UploadErrorCode,
  UploadResult,
} from "@/utils/interfaces";

/**
 * Actions serveur de stockage IPFS.
 *
 * ⚠️ Rappel : toute fonction exportée depuis un module `'use server'` est un
 * point d'entrée HTTP public. Chaque export ci-dessous DOIT donc commencer par
 * `requireSession()`. Ne jamais exporter depuis ce fichier une fonction sans
 * ce contrôle — c'était la cause de la vulnérabilité SEC-01 (clés Pinata et
 * suppression de CID accessibles à tout visiteur).
 *
 * Les utilitaires purs (résolution d'URI) ont été déplacés dans
 * `@/lib/ipfs` : ils n'ont pas à traverser le réseau ni à élargir cette surface.
 */

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT || "",
  pinataGateway: process.env.PINATA_GATEWAY || "",
});

/** Réponse d'échec normalisée : jamais d'exception brute renvoyée au client. */
function failure(error: UploadErrorCode): UploadResult {
  return { ok: false, error };
}

/* -------------------------------------------------------------------------- */
/*                                   Upload                                   */
/* -------------------------------------------------------------------------- */

export async function uploadImageFile(
  file: File,
  filename: string,
): Promise<UploadResult> {
  let session;
  try {
    session = await requireSession();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return failure("unauthorized");
    }
    throw error;
  }

  if (!(file instanceof File) || file.size === 0) {
    return failure("invalid_file");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return failure("too_large");
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return failure("unsupported_type");
  }

  try {
    const result = await pinata.upload.public.file(file).name(filename);
    const pinned = result as unknown as { is_duplicate: boolean; cid: string };

    return {
      ok: true,
      cid: pinned.cid,
      isDuplicate: Boolean(pinned.is_duplicate),
      // Le reçu prouvera, lors d'une éventuelle suppression, que c'est bien
      // cette session qui a publié ce CID.
      receipt: await issueCidReceipt(pinned.cid, session.address),
    };
  } catch (error) {
    console.error("[IPFS] Échec de l'upload de l'image :", error);
    return failure("upload_failed");
  }
}

export async function uploadJsonFile(
  content: object,
  filename: string,
): Promise<UploadResult> {
  let session;
  try {
    session = await requireSession();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return failure("unauthorized");
    }
    throw error;
  }

  if (typeof content !== "object" || content === null) {
    return failure("invalid_file");
  }

  try {
    const result = await pinata.upload.public.json(content).name(filename);
    const pinned = result as unknown as { is_duplicate: boolean; cid: string };

    if (pinned.is_duplicate) {
      // Un certificat identique existe déjà : on remonte l'information au
      // client, à lui de l'afficher. (Auparavant : appel à `alert()` dans un
      // module serveur, qui levait un ReferenceError sous Node — cf. FE-07.)
      return failure("duplicate");
    }

    return {
      ok: true,
      cid: pinned.cid,
      isDuplicate: false,
      receipt: await issueCidReceipt(pinned.cid, session.address),
    };
  } catch (error) {
    console.error("[IPFS] Échec de l'upload du JSON :", error);
    return failure("upload_failed");
  }
}

/* -------------------------------------------------------------------------- */
/*                                 Suppression                                */
/* -------------------------------------------------------------------------- */

/**
 * Dépublie des fichiers IPFS.
 *
 * Double contrôle : session valide **et** reçu de propriété correspondant à
 * l'adresse connectée. Sans ce second contrôle, tout utilisateur authentifié
 * pourrait dépingler les certificats des autres.
 *
 * Note : la nature exacte de l'identifiant attendu par
 * `pinata.files.public.delete` (CID ou identifiant interne) reste à confirmer
 * en conditions réelles — constat FE-08 de l'audit, non traité ici.
 */
export async function deleteFiles(items: CidReceipt[]): Promise<void> {
  let session;
  try {
    session = await requireSession();
  } catch (error) {
    if (error instanceof UnauthorizedError) return;
    throw error;
  }

  if (!Array.isArray(items)) return;

  for (const item of items) {
    if (!item?.cid || !item?.receipt) continue;

    const allowed = await verifyCidReceipt(
      item.receipt,
      item.cid,
      session.address,
    );
    if (!allowed) {
      console.warn("[IPFS] Suppression refusée : reçu invalide ou expiré.");
      continue;
    }

    try {
      const result = await pinata.files.public.delete([item.cid]);
      if (result[0]?.status === "HTTP error") {
        const existing = await pinata.gateways.public.get(item.cid);
        if (existing.data === null) continue; // déjà absent
        console.error(`[IPFS] Suppression échouée pour ${item.cid}`);
      }
    } catch (error) {
      console.error(`[IPFS] Erreur de suppression pour ${item.cid} :`, error);
    }
  }
}

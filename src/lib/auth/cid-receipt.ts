import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { CID_RECEIPT_TTL_SECONDS, getAuthSecret } from "./config";
import { normalizeAddress } from "./siwe";

/**
 * Reçus de propriété des CID.
 *
 * Problème résolu : `deleteFiles` supprime un fichier du compte Pinata à
 * partir d'un simple CID. Authentifier l'appelant ne suffit pas — n'importe
 * quel utilisateur connecté pourrait alors supprimer les certificats des
 * autres, or un certificat dont l'image est dépinnée perd toute valeur
 * probante.
 *
 * Sans base de données, la propriété est prouvée par un jeton signé émis au
 * moment de l'upload : il lie le CID à l'adresse qui l'a publié, pour une
 * durée courte. Le serveur n'a rien à mémoriser, et seul l'auteur d'un upload
 * peut le révoquer — ce qui couvre le cas d'usage réel (annuler les fichiers
 * publiés quand la transaction de mint échoue).
 *
 * La fenêtre volontairement courte (30 min) évite qu'un reçu conservé
 * indéfiniment ne serve à supprimer, des mois plus tard, un certificat
 * entre-temps devenu opposable.
 */

export async function issueCidReceipt(
  cid: string,
  owner: string,
): Promise<string> {
  return new SignJWT({ cid, owner: normalizeAddress(owner) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${CID_RECEIPT_TTL_SECONDS}s`)
    .sign(getAuthSecret());
}

/**
 * Vérifie qu'un reçu autorise bien `owner` à agir sur `cid`.
 * Renvoie `false` en cas de signature invalide, de reçu expiré, ou si le
 * couple (CID, propriétaire) ne correspond pas.
 */
export async function verifyCidReceipt(
  receipt: string,
  cid: string,
  owner: string,
): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(receipt, getAuthSecret());
    return (
      payload.cid === cid &&
      payload.owner === normalizeAddress(owner)
    );
  } catch {
    return false;
  }
}

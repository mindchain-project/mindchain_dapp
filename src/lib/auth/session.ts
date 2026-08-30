import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import {
  CHALLENGE_COOKIE,
  CHALLENGE_TTL_SECONDS,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  getAuthSecret,
} from "./config";
import { normalizeAddress } from "./siwe";

/**
 * Gestion du défi SIWE et de la session, entièrement sans état serveur.
 *
 * Le défi et la session sont des JWT signés (HS256) déposés dans des cookies
 * `httpOnly`. Aucun stockage partagé n'est requis, ce qui convient à un
 * déploiement serverless.
 *
 * Limite assumée de cette approche : l'unicité du nonce repose sur le cookie
 * de défi, effacé dès sa consommation. Un rejeu supposerait donc de disposer
 * à la fois de la signature de la victime **et** de son cookie `httpOnly`.
 * Avec `SameSite=Lax` et une validité de 5 minutes, le risque résiduel est
 * faible, mais il n'est pas nul : un magasin partagé (Redis) reste la réponse
 * complète, et il sera nécessaire de toute façon pour le rate limiting.
 */

export class UnauthorizedError extends Error {
  constructor(message = "Authentification requise.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

const isProduction = process.env.NODE_ENV === "production";

const baseCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: isProduction,
  path: "/",
};

/* -------------------------------------------------------------------------- */
/*                                    Défi                                    */
/* -------------------------------------------------------------------------- */

interface ChallengePayload {
  /** Message EIP-4361 complet, tel qu'il devra être signé. */
  message: string;
  /** Adresse revendiquée au moment de la demande de défi. */
  address: string;
}

/** Dépose le défi dans un cookie signé et renvoie le message à signer. */
export async function storeChallenge(payload: ChallengePayload): Promise<void> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${CHALLENGE_TTL_SECONDS}s`)
    .sign(getAuthSecret());

  const jar = await cookies();
  jar.set(CHALLENGE_COOKIE, token, {
    ...baseCookieOptions,
    maxAge: CHALLENGE_TTL_SECONDS,
  });
}

/**
 * Lit le défi en cours et l'invalide immédiatement (usage unique),
 * que la vérification qui suit réussisse ou échoue.
 */
export async function consumeChallenge(): Promise<ChallengePayload | null> {
  const jar = await cookies();
  const token = jar.get(CHALLENGE_COOKIE)?.value;

  jar.delete(CHALLENGE_COOKIE);
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    const { message, address } = payload as unknown as ChallengePayload;
    if (typeof message !== "string" || typeof address !== "string") return null;
    return { message, address };
  } catch {
    // Signature invalide ou défi expiré.
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Session                                   */
/* -------------------------------------------------------------------------- */

export interface Session {
  address: `0x${string}`;
}

export async function createSession(address: string): Promise<void> {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(normalizeAddress(address))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getAuthSecret());

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    ...baseCookieOptions,
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

/** Renvoie la session courante, ou `null` si absente / expirée / falsifiée. */
export async function readSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    if (!payload.sub) return null;
    return { address: payload.sub as `0x${string}` };
  } catch {
    return null;
  }
}

/**
 * Variante impérative destinée aux Server Actions : échoue si l'appelant
 * n'est pas authentifié. À placer **en première ligne** de toute action ayant
 * un effet de bord (appel d'API payante, écriture ou suppression IPFS).
 */
export async function requireSession(): Promise<Session> {
  const session = await readSession();
  if (!session) throw new UnauthorizedError();
  return session;
}

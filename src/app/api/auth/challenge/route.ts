import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { isAddress } from "viem";
import { buildSiweMessage, generateNonce } from "@/lib/auth/siwe";
import { storeChallenge } from "@/lib/auth/session";
import {
  CHALLENGE_TTL_SECONDS,
  EXPECTED_CHAIN_ID,
  getAppOrigin,
} from "@/lib/auth/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Étape 1 de la connexion : émet un message EIP-4361 à signer.
 *
 * L'adresse transite en corps de requête (POST) et non en paramètre d'URL :
 * une adresse de wallet est une donnée personnelle pseudonymisée, elle n'a
 * pas à se retrouver dans les journaux d'accès ni dans l'historique.
 */
export async function POST(request: Request) {
  let address: unknown;
  try {
    ({ address } = await request.json());
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (typeof address !== "string" || !isAddress(address)) {
    return NextResponse.json(
      { error: "Adresse Ethereum invalide." },
      { status: 400 },
    );
  }

  const host = (await headers()).get("host");
  const origin = getAppOrigin(host);
  const domain = new URL(origin).host;

  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt.getTime() + CHALLENGE_TTL_SECONDS * 1000);

  const message = buildSiweMessage({
    domain,
    address: address as `0x${string}`,
    uri: origin,
    nonce: generateNonce(),
    issuedAt,
    expiresAt,
    chainId: EXPECTED_CHAIN_ID,
  });

  // Le message est conservé côté serveur (cookie signé) : c'est cette copie,
  // et non celle renvoyée par le client, qui fera foi à la vérification.
  await storeChallenge({ message, address });

  return NextResponse.json({ message });
}

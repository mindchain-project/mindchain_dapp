import { NextResponse } from "next/server";
import {
  createPublicClient,
  http,
  isHex,
  verifyMessage as verifyMessageOffline,
} from "viem";
import { sepolia } from "viem/chains";
import { consumeChallenge, createSession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.INFURA_SEPOLIA_RPC_URL),
});

/**
 * Vérifie la signature contre le message conservé côté serveur.
 *
 * Deux passes : récupération de clé hors ligne pour les comptes externes
 * (le cas courant), puis validation on-chain pour les comptes contrats
 * (ERC-1271 / ERC-6492), qu'AppKit permet de connecter. La seconde passe
 * dépend du RPC : son échec ne doit pas invalider la première.
 */
async function isSignatureValid(
  address: `0x${string}`,
  message: string,
  signature: `0x${string}`,
): Promise<boolean> {
  try {
    if (await verifyMessageOffline({ address, message, signature })) {
      return true;
    }
  } catch {
    // Signature malformée : on laisse la seconde passe trancher.
  }

  try {
    return await publicClient.verifyMessage({ address, message, signature });
  } catch {
    return false;
  }
}

/**
 * Étape 2 de la connexion : valide la signature et ouvre la session.
 */
export async function POST(request: Request) {
  let signature: unknown;
  try {
    ({ signature } = await request.json());
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (typeof signature !== "string" || !isHex(signature)) {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  // Le défi est invalidé dès sa lecture, y compris si la suite échoue :
  // une signature refusée ne doit pas laisser un nonce réutilisable.
  const challenge = await consumeChallenge();
  if (!challenge) {
    return NextResponse.json(
      { error: "Défi expiré ou absent. Relancez la connexion." },
      { status: 400 },
    );
  }

  const address = challenge.address as `0x${string}`;
  const valid = await isSignatureValid(
    address,
    challenge.message,
    signature as `0x${string}`,
  );

  if (!valid) {
    // Message volontairement générique : ne pas indiquer si l'échec vient
    // de l'adresse, du message ou de la signature.
    return NextResponse.json(
      { error: "Signature non vérifiée." },
      { status: 401 },
    );
  }

  await createSession(address);
  return NextResponse.json({ address });
}

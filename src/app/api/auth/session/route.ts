import { NextResponse } from "next/server";
import { destroySession, readSession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** État de la session courante, pour resynchroniser l'interface. */
export async function GET() {
  const session = await readSession();
  return NextResponse.json({ address: session?.address ?? null });
}

/** Déconnexion : appelée notamment quand l'utilisateur change de wallet. */
export async function DELETE() {
  await destroySession();
  return NextResponse.json({ address: null });
}

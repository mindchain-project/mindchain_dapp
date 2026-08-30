import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { isAddress } from "viem";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Preuve d'appartenance à la liste blanche (correctif SEC-02).
 *
 * Auparavant, `studio/page.tsx` importait `whitelist.json` dans un composant
 * « use client » : les cinq adresses membres se retrouvaient inlinées dans le
 * bundle JavaScript public. Une adresse de portefeuille est une donnée
 * personnelle pseudonymisée — elle permet de reconstituer tout l'historique
 * on-chain de son détenteur.
 *
 * L'arbre est désormais construit ici, et la réponse ne contient que la preuve
 * de l'adresse demandée. Un appelant ne peut donc apprendre que ce qu'il sait
 * déjà : si l'adresse qu'il fournit est membre ou non. Il ne peut pas obtenir
 * la liste.
 */

const requestSchema = z.object({
  address: z.string().refine(isAddress, "Adresse Ethereum invalide"),
});

interface WhitelistFile {
  members?: string[][];
}

/**
 * La liste vit hors du dépôt (`.gitignore`) : elle dépend du déploiement, pas
 * du code. Son absence n'est pas une erreur — elle signifie simplement qu'il
 * n'y a aucun membre, et l'onglet correspondant reste masqué.
 */
async function loadMembers(): Promise<string[][]> {
  try {
    const raw = await readFile(
      path.join(process.cwd(), "src", "data", "whitelist.json"),
      "utf-8",
    );
    const parsed = JSON.parse(raw) as WhitelistFile;
    return Array.isArray(parsed.members) ? parsed.members : [];
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Adresse invalide." }, { status: 400 });
  }

  const members = await loadMembers();
  if (members.length === 0) {
    return NextResponse.json({ isMember: false, proof: [], root: null });
  }

  const tree = StandardMerkleTree.of(members, ["address"]);
  const target = parsed.data.address.toLowerCase();

  for (const [index, value] of tree.entries()) {
    if (value[0].toLowerCase() === target) {
      // Seule la preuve de l'adresse demandée est renvoyée, jamais l'arbre
      // ni la liste des feuilles.
      return NextResponse.json({
        isMember: true,
        proof: tree.getProof(index),
        root: tree.root,
      });
    }
  }

  return NextResponse.json({ isMember: false, proof: [], root: tree.root });
}

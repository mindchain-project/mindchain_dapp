import "server-only";

/**
 * Récupération HTTP bornée en taille et en durée.
 *
 * Le serveur va chercher des fichiers sur une passerelle IPFS : des contenus
 * qu'il ne produit pas et dont il ne contrôle pas la taille. Un `arrayBuffer()`
 * nu chargerait en mémoire tout ce que la passerelle renvoie — un fichier de
 * plusieurs gigaoctets suffirait à faire tomber la fonction serverless
 * (constat SEC-03).
 *
 * On lit donc le flux morceau par morceau en s'arrêtant dès le dépassement,
 * plutôt que de faire confiance à l'en-tête `Content-Length` — qu'un serveur
 * hostile peut sous-déclarer.
 */

export class FetchLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchLimitError";
  }
}

interface BoundedFetchOptions {
  /** Taille maximale acceptée, en octets. */
  maxBytes: number;
  /** Délai maximal de la requête, en millisecondes. */
  timeoutMs: number;
  /** Hôtes autorisés. Toute autre destination est refusée. */
  allowedHosts: readonly string[];
}

export interface BoundedFetchResult {
  bytes: Uint8Array;
  contentType: string | null;
}

export async function boundedFetch(
  url: string,
  { maxBytes, timeoutMs, allowedHosts }: BoundedFetchOptions,
): Promise<BoundedFetchResult> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new FetchLimitError("URL invalide.");
  }

  // Liste blanche d'hôtes : empêche que le serveur soit détourné en relais
  // vers un service interne ou une adresse arbitraire (SSRF).
  if (parsed.protocol !== "https:" || !allowedHosts.includes(parsed.host)) {
    throw new FetchLimitError(`Hôte non autorisé : ${parsed.host}`);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(parsed.toString(), {
      signal: controller.signal,
      redirect: "error", // une redirection sortirait de la liste blanche
    });

    if (!response.ok) {
      throw new FetchLimitError(`Réponse ${response.status} de ${parsed.host}`);
    }

    // Rejet précoce quand la taille annoncée est déjà excessive : évite de
    // lire inutilement. Ce n'est qu'une optimisation, le vrai garde-fou est
    // le comptage ci-dessous.
    const declared = Number(response.headers.get("content-length"));
    if (Number.isFinite(declared) && declared > maxBytes) {
      throw new FetchLimitError("Contenu trop volumineux.");
    }

    const reader = response.body?.getReader();
    if (!reader) throw new FetchLimitError("Réponse sans corps.");

    const chunks: Uint8Array[] = [];
    let total = 0;

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > maxBytes) {
        await reader.cancel();
        throw new FetchLimitError("Contenu trop volumineux.");
      }
      chunks.push(value);
    }

    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }

    return { bytes, contentType: response.headers.get("content-type") };
  } catch (error) {
    if (error instanceof FetchLimitError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new FetchLimitError("Délai dépassé.");
    }
    throw new FetchLimitError("Récupération impossible.");
  } finally {
    clearTimeout(timer);
  }
}

'use client';
import { useReadContract } from "wagmi";
import { contractConfig, MindchainContractAddress } from "@/abi/MindchainContract";

/**
 * Prix d'un crédit, en wei — sans passer par `getCreditValue()`.
 *
 * Le contrat déclare `getCreditValue()` en `view` mais la protège par
 * `onlyRole(ROLE_ADMIN)`. L'appel révertait donc pour tout utilisateur
 * ordinaire, la valeur restait `undefined`, et le formulaire d'achat sortait
 * silencieusement : **personne d'autre qu'un administrateur ne pouvait acheter
 * de crédits** (constat SC-02).
 *
 * Ce `onlyRole` ne protégeait rien : la mémoire d'un contrat est publiquement
 * lisible, `private` compris. Il ne faisait que casser le parcours.
 *
 * Le prix se reconstitue exactement à partir de deux fonctions publiques :
 *
 *     requiredValue(t) = creditRequired(t) * creditValue
 *
 * d'où `creditValue = requiredValue(t) / creditRequired(t)`. La division est
 * exacte — `requiredValue` est un multiple entier de `creditValue` — donc
 * aucune approximation n'est introduite.
 *
 * Corriger le contrat resterait préférable, mais cela imposerait un
 * redéploiement, une nouvelle adresse et une nouvelle racine de Merkle. Ce
 * contournement rétablit le parcours sans y toucher.
 */
export function useCreditValue() {
  const query = { enabled: !!MindchainContractAddress };

  // Coût total du service de certification, en wei. Public.
  const { data: requiredValue, isLoading: loadingRequired } = useReadContract({
    ...contractConfig,
    functionName: "requiredValue",
    args: [0],
    query: { ...query, select: (data) => data as bigint },
  });

  // Nombre de crédits que ce service consomme. Variable d'état publique.
  const { data: creditsRequired, isLoading: loadingCredits } = useReadContract({
    ...contractConfig,
    functionName: "mintCertificationCreditRequired",
    args: [],
    query: { ...query, select: (data) => data as bigint },
  });

  const creditValue =
    requiredValue !== undefined &&
    creditsRequired !== undefined &&
    creditsRequired > BigInt(0)
      ? requiredValue / creditsRequired
      : undefined;

  return {
    creditValue,
    isLoading: loadingRequired || loadingCredits,
  };
}

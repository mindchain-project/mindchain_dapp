'use client';
import { useCallback, useEffect, useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useSignMessage } from "wagmi";
import type { Address } from "viem";

/**
 * Session applicative adossée au wallet (Sign-In With Ethereum).
 *
 * La connexion du wallet prouve seulement que l'utilisateur possède une
 * adresse côté navigateur ; elle n'apprend rien au serveur. Les actions
 * serveur qui engagent des ressources (épinglage IPFS, suppression) exigent
 * donc une session obtenue par signature, matérialisée par un cookie httpOnly.
 *
 * Le flux tient en deux appels : demande d'un message à signer, puis envoi de
 * la signature. Le message n'est jamais construit côté client — il est
 * fabriqué et conservé par le serveur, qui vérifie contre sa propre copie.
 */
/** Comparaison d'adresses insensible à la casse EIP-55. */
const matches = (a?: string | null, b?: string | null) =>
  !!a && !!b && a.toLowerCase() === b.toLowerCase();

export function useSiweSession() {
  const { address, isConnected } = useAppKitAccount();
  const { signMessageAsync } = useSignMessage();

  const [sessionAddress, setSessionAddress] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const isAuthenticated = matches(sessionAddress, address);

  const signOut = useCallback(async () => {
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
    } finally {
      setSessionAddress(null);
    }
  }, []);

  // État initial de la session (cookie posé lors d'une visite précédente).
  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setSessionAddress(data.address ?? null);
      })
      .catch(() => {
        if (!cancelled) setSessionAddress(null);
      })
      .finally(() => {
        if (!cancelled) setIsReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Changement de compte ou déconnexion du wallet : la session doit tomber,
  // sinon les uploads suivants seraient attribués à l'adresse précédente.
  useEffect(() => {
    if (!isReady || !sessionAddress) return;
    if (!isConnected || !matches(sessionAddress, address)) {
      void signOut();
    }
  }, [isReady, isConnected, address, sessionAddress, signOut]);

  /** Déclenche la signature et ouvre la session. Renvoie `true` si elle est active. */
  const signIn = useCallback(async (): Promise<boolean> => {
    if (!isConnected || !address) return false;

    setIsPending(true);
    try {
      const challengeResponse = await fetch("/api/auth/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      if (!challengeResponse.ok) return false;

      const { message } = await challengeResponse.json();
      const signature = await signMessageAsync({
        message,
        account: address as Address,
      });

      const verifyResponse = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature }),
      });
      if (!verifyResponse.ok) return false;

      const { address: verified } = await verifyResponse.json();
      setSessionAddress(verified);
      return true;
    } catch {
      // Signature refusée par l'utilisateur, ou réseau indisponible.
      return false;
    } finally {
      setIsPending(false);
    }
  }, [address, isConnected, signMessageAsync]);

  /** À appeler avant toute action serveur : réutilise la session ou en ouvre une. */
  const ensureSession = useCallback(async (): Promise<boolean> => {
    if (isAuthenticated) return true;
    return signIn();
  }, [isAuthenticated, signIn]);

  return {
    address,
    isConnected,
    isAuthenticated,
    isPending,
    isReady,
    signIn,
    signOut,
    ensureSession,
  };
}

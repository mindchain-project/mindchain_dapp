'use client';
import { useAppKitAccount } from "@reown/appkit/react";
import NavigationStudioTabs, { type StudioTabKey } from "@/components/shared/navigation/NavigationStudioTabs";
import { useState, useEffect } from "react";
import History from './history';
import Certification from './certification';
import Generation from './generation';
import Member from "./member";
import Pricing from "./pricing";
import { readContract, type Config } from '@wagmi/core'
import { useConfig } from 'wagmi'
import { contractConfig } from "@/abi/MindchainContract";


/**
 * Appartenance a la liste blanche (correctif SEC-02).
 *
 * La liste ne quitte plus le serveur : `studio/page.tsx` importait auparavant
 * `whitelist.json`, ce qui inlinait les adresses membres dans le bundle
 * public. On demande desormais au serveur la preuve de la seule adresse
 * connectee, puis on la fait valider par le contrat.
 */
const IsAddressMember = async (
  config: Config,
  address: `0x${string}`,
): Promise<boolean> => {
  try {
    const response = await fetch("/api/membership", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });
    if (!response.ok) return false;

    const { isMember, proof } = await response.json();
    if (!isMember || !Array.isArray(proof) || proof.length === 0) return false;

    // La preuve est verifiee on-chain : le serveur n'est pas cru sur parole.
    const member = await readContract(config, {
      ...contractConfig,
      functionName: "isMember",
      args: [address, proof],
      account: address,
    });
    return member as boolean;
  } catch {
    return false;
  }
};

const Studio = () => {
  const config = useConfig();
  const { isConnected, address } = useAppKitAccount();
  const [activeTab, setActiveTab] = useState<StudioTabKey>("certification");
  /*
   * On memorise l'adresse reconnue membre, et non un booleen : `isMember` est
   * alors derive de l'adresse courante. Changer de portefeuille invalide donc
   * le statut immediatement, sans fenetre pendant laquelle la nouvelle adresse
   * heriterait du statut de la precedente.
   */
  const [memberAddress, setMemberAddress] = useState<string | null>(null);
  const isMember =
    !!address && memberAddress?.toLowerCase() === address.toLowerCase();

  useEffect(() => {
    if (!isConnected || !address) return;
    let cancelled = false;

    IsAddressMember(config, address as `0x${string}`)
      .then((ok) => {
        if (!cancelled && ok) setMemberAddress(address);
      })
      .catch(() => {
        /* non membre : l'etat derive reste faux */
      });

    return () => {
      cancelled = true;
    };
  }, [isConnected, address, config]);


  if (!isConnected) {
    return (
    <>
      <h2 className='studio highlight'>Studio</h2>
      <div className="space-y-4 text-center text-muted-foreground mt-30 mb-30">Connectez votre portefeuille pour accéder au studio.</div>
    </>
      );
  }
  return (
    <>
      <h2 className='studio highlight'>Studio</h2>
      <NavigationStudioTabs 
        defaultTab={activeTab} 
        onChange={setActiveTab}
        isMember={isMember}
      />
      <div className="pt-10 pb-10 w-full">
        {activeTab === "generation" && (
          <Generation />
        )}
        {activeTab === "certification" && (
          <Certification />
        )}
        {activeTab === "history" && (
          <History />
        )}
        {activeTab === "pricing" && (
          <Pricing />
        )}
        {activeTab === "faq" && (
          <section className="space-y-4 justify-self-center">
            <h3 className="text-xl font-semibold">FAQ</h3>
            <p className="text-muted-foreground">Réponses aux questions fréquentes.</p>
          </section>
        )}
        {isMember && activeTab === "member" && (
          <Member />
        )}
      </div>
    </>
  )
}

export default Studio
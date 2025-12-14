'use client';
import { useAppKitAccount } from "@reown/appkit/react";
import NavigationStudioTabs, { type StudioTabKey } from "@/components/shared/navigation/NavigationStudioTabs";
import { useState, useEffect } from "react";
import History from './history';
import Certification from './certification';
import Generation from './generation';
import Member from "./member";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { readContract, type Config } from '@wagmi/core'
import { useConfig } from 'wagmi'
import { contractConfig } from "@/abi/MindchainContract";
import whitelist  from "@/abi/whitelist.json";


// Fonction pour définir la racine de Merkle sur le contrat
const GetMerkleRoot = async (config: Config) => {
    const root = await readContract(config , {
        ...contractConfig,
        functionName: "getMerkleRoot",
    });
    console.log("Current Merkle Root on contract:", root);
    return root;
}


const IsAddressMember = async (config: Config, address: `0x${string}`, proof: string[]) : Promise<boolean> => {
  try {
    //console.log("Checking if address is member:", address, proof);
    const member = await readContract(config , {
        ...contractConfig,
        functionName: "isMember",
        args: [address, proof],
        account: address,
    });
    console.log("IsAddressMember result for", address, ":", member);
    return member as boolean;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'adresse membre :", error);
    return false;
  }
}

// Fonction pour obtenir la liste blanche d’adresses depuis les variables d’environnement
function GetWhitelistedAddresses(): string[][] {
  const whitelisted = whitelist ? whitelist.members : [];
  return whitelisted;
}

const Studio = () => {
  const config = useConfig();
  const { isConnected, address } = useAppKitAccount();
  const [activeTab, setActiveTab] = useState<StudioTabKey>("certification");
  const [, setMerkleProof] = useState<string[]>([]);
  const [merkleRootError, ] = useState('');

  // Liste blanche d’adresses pour la génération de la preuve de Merkle
  const members = GetWhitelistedAddresses();
  const [isMember, setIsMember] = useState<boolean>(false);

  // Debug Merkle root error
  useEffect(() => {
      console.log(merkleRootError);
  }, [merkleRootError])

  useEffect(() => {
  if (!isConnected || !address) return;

  const run = async () => {
    try {
      const tree = StandardMerkleTree.of(members, ["address"]);
      //console.log("OFFCHAIN Merkle Root:", tree.root);
      const onchainRoot = await GetMerkleRoot(config);
      if (onchainRoot !== tree.root) {
        //console.error("Merkle root mismatch");
        setIsMember(false);
        return;
      }

      let proof: string[] = [];

      for (const [i, v] of tree.entries()) {
        if (v[0].toLowerCase() === address.toLowerCase()) {
          proof = tree.getProof(i);
          break;
        }
      }

      setMerkleProof(proof);

      if (proof.length === 0) {
        setIsMember(false);
        return;
      }

      const ok = await IsAddressMember(
        config,
        address as `0x${string}`,
        proof
      );

      setIsMember(ok);
    } catch (e) {
      console.error(e);
      setIsMember(false);
    }
  };

  run();
}, [isConnected, address, members, config]);


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
          <section className="space-y-4 justify-self-center">
            <h3 className="text-xl font-semibold">Tarifs</h3>
            <p className="text-muted-foreground">Choisissez votre offre adaptée à vos besoins.</p>
          </section>
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
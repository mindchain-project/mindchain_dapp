'use client';
import { useAppKitAccount } from "@reown/appkit/react";
import NavigationStudioTabs, { type StudioTabKey } from "@/components/shared/navigation/NavigationStudioTabs";
import { useState, useEffect } from "react";
import History from './history';
import Certification from './certification';
import Generation from './generation';
import Member from "./member";
import { MindchainContractABI } from "@/abi/MindchainContract";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { readContract } from '@wagmi/core'
import { useConfig } from 'wagmi'
import whitelist  from "@/abi/whitelist.json";

const MindchainContractAddress = process.env.NEXT_PUBLIC_MINDCHAIN_ADDRESS  as `0x${string}` || '';

const contractConfig = {
  abi: MindchainContractABI,
  address: MindchainContractAddress,
} as const

// Fonction pour définir la racine de Merkle sur le contrat
const SetMerkleRoot = async (config: any, _merkleRoot: `0x${string}`) => {
    await readContract(config , {
        ...contractConfig,
        functionName: "setMerkleRoot",
        args: [_merkleRoot],
    });
}

const IsAddressOwner = async (config: any, address: `0x${string}`) : Promise<boolean> => {
    const ownerAddress = await readContract(config , {
        ...contractConfig,
        functionName: "owner",
    });
    return (ownerAddress as string).toLowerCase() === address.toLowerCase();
}

const IsAddressMember = async (config: any, address: `0x${string}`, proof: string[]) : Promise<boolean> => {
  try {
    const member = await readContract(config , {
        ...contractConfig,
        functionName: "isWhitelisted",
        args: [address, proof],
    });
    return member as boolean;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'adresse membre :", error);
    return false;
  }
}

// Fonction pour obtenir la liste blanche d’adresses depuis les variables d’environnement
function GetWhitelistedAddresses(): any[] {
  const whitelisted = whitelist ? whitelist.members : [];
  console.log('Liste blanche d\'adresses :', whitelisted);
  return whitelisted;
}

const Studio = () => {
  const config = useConfig();
  const { isConnected, address } = useAppKitAccount();
  const [activeTab, setActiveTab] = useState<StudioTabKey>("certification");
  const [merkleProof, setMerkleProof] = useState<string[]>([]);
  const [merkleRootError, setMerkleRootError] = useState('');

  // Liste blanche d’adresses pour la génération de la preuve de Merkle
  const members = GetWhitelistedAddresses();
  const [isMember, setIsMember] = useState<boolean>(false);

  // Debug Merkle root error
  useEffect(() => {
      console.log(merkleRootError);
  }, [merkleRootError])

  useEffect(() => {
    if (!isConnected || !address) return;

    try {
      const tree = StandardMerkleTree.of(members, ["address"]);
      const root = tree.root;
      console.log("Merkle Root :", root);

      let proof: string[] = [];

      // Trouver l'index de l'adresse connectée
      for (const [i, v] of tree.entries()) {
        if (v[0].toLowerCase() === address.toLowerCase()) {
          proof = tree.getProof(i);
          break;
        }
      }

      setMerkleProof(proof);

      // Vérification côté smart contract
      if (proof.length > 0) {
        const checkMember = async () => {
          const ok = await IsAddressMember(
            config,
            address as `0x${string}`,
            proof
          );
          setIsMember(ok);
        };

        checkMember();
      } else {
        setIsMember(false);
      }
    } catch (err) {
      console.error(err);
      setMerkleRootError("Erreur lors de la génération de la preuve de Merkle.");
    }
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
        { isMember && (
          <Member />
        )}
      </div>
    </>
  )
}

export default Studio
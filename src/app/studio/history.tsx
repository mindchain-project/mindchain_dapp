import { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { retrieveFile } from "@/services/storage";
import { MINDCHAIN_NFT_ADDRESS, MINDCHAIN_NFT_ABI } from "@/contracts/MindchainNFT";
import Image from "next/image";

interface NFTItem {
  tokenId: string;
  metadata: any;
}

export default function History() {
  const [address, setAddress] = useState<string | null>(null);
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchUserNFTs() {
    try {
      setLoading(true);

      const provider = new BrowserProvider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);

      const contract = new Contract(MINDCHAIN_NFT_ADDRESS, MINDCHAIN_NFT_ABI[0].abi, provider);

      const balance = await contract.balanceOf(userAddress);
      console.log("User balance:", balance.toString());

      const results: NFTItem[] = [];

      for (let i = 0; i < Number(balance); i++) {
        // 1) Récupérer tokenId
        const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i);

        // 2) Récupérer la metadataCid / tokenURI
        const uri = await contract.tokenURI(tokenId);
        const ipfsData = await retrieveFile(uri);
        console.log("IPFS Data:", ipfsData);
        const response = await fetch(ipfsData);
        const json = await response.json();
        results.push({
          tokenId: tokenId.toString(),
          metadata: json,
        });
      }

      setNfts(results);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserNFTs();
  }, []);

  return (
    <section className="space-y-4 justify-self-center">
      <h3 className="text-xl font-semibold gradient-text">Historique</h3>
      <p className="text-muted-foreground">Consultez vos opérations et certificats passés.</p>

      {loading && <p>Chargement…</p>}

      {!loading && nfts.length === 0 && (
        <p>Aucun certificat trouvé pour cette adresse.</p>
      )}

      {nfts.length > 0 && (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Token ID</th>
              <th className="border px-4 py-2">Nom</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Image</th>
            </tr>
          </thead>
          <tbody>
            {nfts.map((nft) => (
              <tr key={nft.tokenId}>
                <td className="border px-4 py-2">{nft.tokenId}</td>
                <td className="border px-4 py-2">{nft.metadata.name}</td>
                <td className="border px-4 py-2">{nft.metadata.description}</td>
                <td className="border px-4 py-2">
                  {nft.metadata.image && (
                    <Image
                      src={nft.metadata.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")}
                      alt="NFT"
                      className="w-16 h-16 object-cover rounded" width={64} height={64}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

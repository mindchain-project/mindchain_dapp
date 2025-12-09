import { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { loadJsonFile } from "@/services/storage";
import { MINDCHAIN_NFT_ADDRESS, MINDCHAIN_NFT_ABI } from "@/contracts/MindchainNFT";
import { StudioTabProps, NFTItem} from '@/utils/interfaces';
import Image from "next/image";

function loadImageFile(uri: string) {
  if (!uri) return "";
  // Format ipfs://CID
  if (uri.startsWith("ipfs://")) {
    return `https://gateway.pinata.cloud/ipfs/${uri.slice(7)}`;
  }
  // Format CID brut
  if (/^[a-zA-Z0-9]{46,}$/.test(uri)) {
    return `https://gateway.pinata.cloud/ipfs/${uri}`;
  }
  return uri; 
}

export default function History(props: StudioTabProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);

  // ⬅ FIX 1 : mettre le setAddress dans un useEffect
  useEffect(() => {
    if (props.address) {
      setAddress(props.address);
    }
  }, [props.address]);

  async function fetchUserNFTs() {
    try {
      if (!address) {
        console.warn("No user address yet, skipping fetch.");
        return;
      }

      setLoading(true);

      const provider = new BrowserProvider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const contract = new Contract(MINDCHAIN_NFT_ADDRESS, MINDCHAIN_NFT_ABI[0].abi, provider);
      // Récupérer le nombre de NFTs possédés par l'utilisateur
      const balance = await contract.balanceOf(address);
      // Récupérer les détails de chaque NFT
      const items = await Promise.all(
        Array.from({ length: Number(balance) }).map(async (_, i) => {
          const tokenId = await contract.tokenOfOwnerByIndex(address, i);
          const uri = await contract.tokenURI(tokenId);              
          const httpUrl = await loadJsonFile(uri);
          const metadata = await fetch(httpUrl).then(r => r.json());
          return {
            tokenId: tokenId.toString(),
            metadata,
          };
        })
      );

      setNfts(items);

    } catch (err) {
      console.error("[History] Error fetching NFTs:", err);
    } finally {
      setLoading(false);
    }
  }

  // ⬅ FIX 2 : lancer fetchUserNFTs seulement quand address existe
  useEffect(() => {
    if (address) fetchUserNFTs();
  }, [address]);

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
              <th className="border px-4 py-2">Certificat</th>
              <th className="border px-4 py-2">Nom de l&apos;oeuvre</th>
              <th className="border px-4 py-2">Image</th>
            </tr>
          </thead>
          <tbody>
            {nfts.map((nft) => (
              <tr key={nft.tokenId}>
                <td className="border px-4 py-2 text-center">{nft.tokenId}</td>
                <td className="border px-4 py-2">{nft.metadata.creation ? nft.metadata.creation.certificate_id : ''}</td>
                <td className="border px-4 py-2">{nft.metadata.name}</td>
                <td className="border px-4 py-2 text-center">
                  {nft.metadata.image && (
                    <Image
                      src={loadImageFile(nft.metadata.image)}
                      alt="NFT"
                      className="w-16 h-16 object-cover rounded"
                      width={64}
                      height={64}
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

import { useEffect, useState } from "react";
import { StudioTabProps, NFTItem} from '@/utils/interfaces';
import Image from "next/image";
import { DownloadIcon } from "@radix-ui/react-icons";
import { getUserTokenIDs } from "@/services/transaction";

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

const HistoryTable = (props: StudioTabProps) => {

    const provider = props.walletProvider;
    const [address, setAddress] = useState<string | null>(null);
    const [nfts, setNfts] = useState<NFTItem[]>([]);
    const [loading, setLoading] = useState(false);

    async function fetchUserNFTs() {
        try {
            if (!address) {
                console.warn("[History] No user address yet, skipping fetch.");
                return;
            }
            // Début du chargement
            setLoading(true);
            const tokenIds = await getUserTokenIDs(address, provider);
            if (!tokenIds) {
                setNfts([]);
            } else {
                setNfts(tokenIds);
            }
        } catch (err) {
        console.error("[History] Error fetching NFTs:", err);
        } finally {
            setLoading(false);
        }
    }
    // ⬅ FIX 1 : mettre le setAddress dans un useEffect
    useEffect(() => {
        if (props.address) {
        setAddress(props.address);
        }
    }, [props.address]);
    // ⬅ FIX 2 : lancer fetchUserNFTs seulement quand address existe
    useEffect(() => {
        if (address) fetchUserNFTs();
    }, [address]);

    return (
        <>
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
                <th className="border px-4 py-2">Télécharger</th>
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
                    <td className="">
                    <button className="btn-action m-2 p-2 flex items-center space-x-2">
                        <DownloadIcon className="h-5 w-5" />
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </>
    );
}

export default HistoryTable;
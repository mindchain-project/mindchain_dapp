import { useEffect, useState } from "react";
import { NFTItem} from '@/utils/interfaces';
import Image from "next/image";
import { DownloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { useAppKitAccount } from "@reown/appkit/react";
import { readContract } from '@wagmi/core'
import { useConfig } from 'wagmi'
import { useReadContract } from 'wagmi'
import { contractConfig } from "@/abi/MindchainContract";


async function loadFile(uri: string) {
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

async function FetchNFTs(
  tokenUris: string[],
  tokenIds: number[]
): Promise<NFTItem[]> {
    const items = await Promise.all(
    tokenUris.map(async (tokenUri, index) => {
        const httpUrl = await loadFile(tokenUri);
        const metadata = await fetch(httpUrl).then((r) => r.json());

        // On résout aussi l’URL d’image ici pour que <Image> ait directement une URL HTTP
        if (metadata.image) {
            metadata.image = await loadFile(metadata.image);
        }

        return {
            tokenId: tokenIds[index],
            metadata,
        };
    })
  );

  return items;
}


const GetTokenId = async (config: any, tokenCount: bigint | undefined): Promise<number> => {
    const tokenId  = await readContract(config , {
        ...contractConfig,
        functionName: "tokenByIndex",
        args: [tokenCount ? tokenCount.toString() : 0],
    });
    return Number(tokenId);
}

const GetTokenUri = async (config: any, tokenId: number) => {
    const tokenUri  = await readContract(config , {
        ...contractConfig,
        functionName: "tokenURI",
        args: [tokenId],
    });
    console.log("Token URI inside ReadContract:", tokenUri);
    return tokenUri as string;
}


const HistoryTable = () => {
    const { address } = useAppKitAccount();
    const wagmiConfig = useConfig();
    const [nfts, setNfts] = useState<NFTItem[]>([]);
    const [loadingNfts, setLoadingNfts] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: tokenCount, isLoading: loadingTokenIds } = useReadContract({
        ...contractConfig,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
        query: {
        enabled: !!address && !!MindchainContractAddress,
        },
    });

    useEffect(() => {
        // Pas de wallet connecté ou pas d’adresse de contrat
        if (!address || !MindchainContractAddress) return;
        if (!tokenCount) {
            setNfts([]);
            return;
        }
        // Fetch des NFTs possédés par l’adresse
        const fetchAll = async () => {
            try {
                setLoadingNfts(true);
                setError(null);

                const total = Number(tokenCount);
                if (total === 0) {
                setNfts([]);
                return;
                }
                // 1. Récupérer tous les tokenIds
                const tokenIds: number[] = [];
                for (let i = 0; i < total; i++) {
                    const tokenId = await GetTokenId(wagmiConfig, BigInt(i));
                    tokenIds.push(tokenId);
                }
                // 2. Récupérer toutes les tokenURIs
                const tokenUris: string[] = [];
                for (const tokenId of tokenIds) {
                    const tokenUri = await GetTokenUri(wagmiConfig, tokenId);
                    tokenUris.push(tokenUri);
                }
                // 3. Fetch des métadatas IPFS
                const items = await FetchNFTs(tokenUris, tokenIds);
                setNfts(items);
            } catch (err) {
                console.error("[History] Error fetching NFTs:", err);
                setError("Erreur lors du chargement des certificats.");
                setNfts([]);
            } finally {
                setLoadingNfts(false);
            }
        };
        fetchAll();
    }, [address, tokenCount, wagmiConfig]);


    return (
        <>
        {loadingTokenIds && <p>Chargement…</p>}

        {!loadingTokenIds && nfts.length === 0 && (
            <p>Aucun certificat trouvé pour cette adresse.</p>
        )}

        {nfts.length > 0 && (
            <table className="w-full table-auto border-collapse">
            <thead className="border">
                <tr>
                    <th className="px-4 py-2 border mx-4">N° Certificat</th>
                    <th className="px-4 py-2 border mx-4">NFT ID</th>
                    <th className="px-4 py-2 border mx-4">Nom de l&apos;oeuvre</th>
                    <th className="px-4 py-2 border mx-4">Oeuvre</th>
                    <th className="px-4 py-2 border mx-4">Télécharger</th>
                    <th className="px-4 py-2 border mx-4">Supprimer</th>
                </tr>
            </thead>
            <tbody>
                {nfts.map((nft) => (
                <tr key={nft.tokenId}>
                    <td className="border-b px-2 py-1">{nft.metadata.creation ? nft.metadata.creation.certificate_id : ''}</td>
                    <td className="border-b px-2 py-1 text-center">{nft.tokenId}</td>
                    <td className="border-b px-2 py-1">{nft.metadata.name}</td>
                    <td className="border-b px-2 py-1 text-center">
                    {nft.metadata.image && (
                        <Image
                        src={nft.metadata.image}
                        alt="NFT"
                        className="w-16 h-16 object-cover rounded"
                        width={64}
                        height={64}
                        />
                    )}
                    </td>
                   <td className="border-b px-2 py-1">
                        <div className="flex flex-row justify-center">
                            <button className="btn-action m-2 p-2">
                                <DownloadIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </td>

                    <td className="border-b px-2 py-1">
                        <div className="flex flex-row justify-center">
                            <button className="btn-action m-2 p-2">
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
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
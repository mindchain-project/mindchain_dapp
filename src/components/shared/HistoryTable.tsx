import { useEffect, useState } from "react";
import { NFTItem } from '@/utils/interfaces';
import Image from "next/image";
import { DownloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { useAppKitAccount } from "@reown/appkit/react";
import { readContract } from '@wagmi/core'
import { useConfig, useReadContract } from 'wagmi'
import { contractConfig, MindchainContractAddress } from "@/abi/MindchainContract";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
                uri: httpUrl,
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
        {error && <p className="text-red-500">{error}</p>}
        {nfts.length > 0 && (
        <Table>
        <TableHeader className="">
            <TableRow>
            <TableHead className="w-[100px] text-white">Date</TableHead>
            <TableHead className="w-[100px] text-white">Token ID</TableHead>
            <TableHead className="text-white">N° Certificat</TableHead>
            <TableHead className="text-white">Nom de l&apos;oeuvre</TableHead>
            <TableHead className="text-white">Oeuvre</TableHead>
            <TableHead className="text-white">Télécharger</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {nfts.map((nft) => (
            <TableRow key={nft.tokenId}>
                <TableCell className="font-medium">{nft.metadata.creation ? new Date(Number(nft.metadata.creation.timestamp)).toLocaleDateString("fr-FR") : ''}</TableCell>
                <TableCell className="font-medium">{nft.tokenId ? nft.tokenId : '0'}</TableCell>
                <TableCell> <Link href={nft.uri} >{nft.metadata.creation ? nft.metadata.creation.certificate_id : ''}</Link></TableCell>
                <TableCell> <Link href={nft.uri}>{nft.metadata ? nft.metadata.name : ''}</Link></TableCell>
                <TableCell className="text-right">
                    {nft.metadata.image && (
                    <Link href={nft.metadata.image}>
                        <div>
                        <Image
                        src={nft.metadata.image}
                        alt="NFT"
                        className="w-16 h-16 object-cover rounded"
                        width={64}
                        height={64}
                        /></div>
                    </Link>)}
                </TableCell>
                <TableCell>
                    <button className="btn-action m-2 p-2">
                        <DownloadIcon className="h-5 w-5" />
                    </button>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        <TableFooter className="bg-color-red">
            <TableRow>
            <TableCell colSpan={5} className="font-medium text-left">Nombre de certificats : {nfts.length}</TableCell>
            </TableRow>
        </TableFooter>
        </Table>
        )}
    </>
    );
}

export default HistoryTable;
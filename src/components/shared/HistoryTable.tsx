import { useEffect, useState } from "react";
import { NFTItem } from '@/utils/interfaces';
import Image from "next/image";
import { DownloadIcon } from "@radix-ui/react-icons";
import { useAppKitAccount } from "@reown/appkit/react";
import { readContract, type Config } from '@wagmi/core'
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
import { resolveURI } from "@/lib/ipfs";

async function FetchNFTs(
  tokenUris: string[],
  tokenIds: number[]
): Promise<NFTItem[]> {
    const items = await Promise.all(
        tokenUris.map(async (tokenUri, index) => {
            const httpUrl = resolveURI(tokenUri);
            const metadata = await fetch(httpUrl).then((r) => r.json());
            // On résout aussi l’URL d’image ici pour que <Image> ait directement une URL HTTP
            if (metadata.image) {
                metadata.image = resolveURI(metadata.image);
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

const GetTokenId = async (config: Config, ownerAddress: string, tokenCount: bigint | undefined): Promise<number> => {
    const tokenId  = await readContract(config , {
        ...contractConfig,
        functionName: "tokenOfOwnerByIndex",
        args: [ownerAddress, tokenCount ? tokenCount.toString() : 0],
    });
    return Number(tokenId);
}

const GetTokenUri = async (config: Config, tokenId: number) => {
    const tokenUri  = await readContract(config , {
        ...contractConfig,
        functionName: "tokenURI",
        args: [tokenId],
    });
    return tokenUri as string;
}

/*
 * `downloadCertificate` a été retiré ici (constat FE-09 de l'audit) : la
 * fonction n'était appelée nulle part et pointait vers `/services/certificate`,
 * une route qui n'existe pas — la seule route de génération de PDF est
 * `/api/certificate`, utilisée plus bas par le bouton de téléchargement.
 */

const HistoryTable = () => {
    const { address } = useAppKitAccount();
    const wagmiConfig = useConfig();
    const [nfts, setNfts] = useState<NFTItem[]>([]);
    const [loadingNfts, setLoadingNfts] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Récupération du nombre de tokens possédés par l’adresse
    const { data: tokenCount } = useReadContract({
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

                // 1. Récupérer tous les tokenIds
                const tokenIds: number[] = [];
                for (let i = 0; i < Number(tokenCount); i++) {
                    const tokenId = await GetTokenId(wagmiConfig, address, BigInt(i));
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
        {loadingNfts && <p>Chargement…</p>}

        {!loadingNfts && nfts.length === 0 && (
            <p>Aucun certificat trouvé pour cette adresse.</p>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {nfts.length > 0 && (
        <Table>
        <TableHeader className="">
            <TableRow className="hover:bg-transparent">
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
            <TableRow key={nft.tokenId}
            className="hover:bg-transparent">
                <TableCell className="font-medium">
                    {nft.metadata.creation ? new Date(Number(nft.metadata.creation.certification_timestamp)).toLocaleDateString("fr-FR") : ''}
                </TableCell>
                <TableCell className="font-medium">
                    {nft.tokenId ? nft.tokenId : '0'}
                </TableCell>
                <TableCell ><Link 
                    href={nft.uri} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:text-chart-2 transition-colors">
                        {nft.metadata.creation ? nft.metadata.creation.certificate_id : ''} 
                    </Link></TableCell>
                <TableCell> 
                    {nft.metadata ? nft.metadata.name : ''}
                </TableCell>
                <TableCell className="text-right">
                    {nft.metadata.image && (
                    <Link href={nft.metadata.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <Image
                    src={nft.metadata.image}
                    alt="NFT"
                    className="w-16 h-16 object-cover rounded"
                    width={64}
                    height={64}
                    />
                    </Link>)}
                </TableCell>
                <TableCell>
                    <button className="btn-action m-2 p-2" 
                        onClick={async () => {
                        /*
                         * Seul le tokenId est transmis (correctif SEC-03) : le
                         * serveur reconstruit lui-même le contenu du certificat
                         * depuis la chaîne, plutôt que de faire confiance à des
                         * métadonnées envoyées par le navigateur.
                         */
                        try {
                            const pdfResponse = await fetch("/api/certificate", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ tokenId: nft.tokenId }),
                            });

                            if (!pdfResponse.ok) {
                                const { error: message } = await pdfResponse
                                    .json()
                                    .catch(() => ({ error: null }));
                                setError(message ?? "La génération du certificat a échoué.");
                                return;
                            }

                            const blob = await pdfResponse.blob();
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `certificate_${nft.tokenId}.pdf`;
                            a.click();
                            URL.revokeObjectURL(url);
                        } catch (err) {
                            console.error("[History] Téléchargement du certificat :", err);
                            setError("La génération du certificat a échoué.");
                        }
                    }}>
                        <DownloadIcon className="h-5 w-5" />
                    </button>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        <TableFooter className="bg-color-red">
            <TableRow className="hover:bg-transparent">
            <TableCell colSpan={6} className="font-medium text-left">Nombre de certificats : {nfts.length}</TableCell>
            </TableRow>
        </TableFooter>
        </Table>
        )}
    </>
    );
}

export default HistoryTable;
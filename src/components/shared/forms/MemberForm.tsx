import { useEffect, useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useConfig, useReadContract, useWriteContract, useBalance, useChainId } from 'wagmi'
import { contractConfig, MindchainContractAddress } from "@/abi/MindchainContract";
import { Form, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { toast } from "sonner";
import { waitForTransactionReceipt } from "@wagmi/core";
import { formatEther, parseEther } from "viem";

interface CreditFormData {
    creditsToAdd: number;
    typeOfCredit: 0 | 1;
    addressToCredit?: string;
}

interface BuyCreditFormData {
    creditsToBuy: number;
    typeOfCredit: 0 | 1;
}

type CreditBalance = readonly [bigint, bigint, bigint]

function useUserBalance(address?: `0x${string}`) {
  return useReadContract({
    ...contractConfig,
    functionName: "creditBalance",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!MindchainContractAddress,
    },
  });
}

const MemberForm = () => {
    const { address } = useAppKitAccount();
    const wagmiConfig = useConfig();
    const chainId = useChainId();

    const [targetAddress, setTargetAddress] = useState<`0x${string}` | undefined>(undefined);

    const {
        data: userCreditBalance,
        isLoading: userBalanceLoading,
        error : userBalanceError,
    } = useUserBalance(targetAddress) as {
        data: CreditBalance | undefined;
        isLoading: boolean;
        error: Error | null;
    };

    // Formulaire ajout de crédits
    const methodsAdd = useForm<CreditFormData>({
    mode: "onSubmit",
        defaultValues: {
            creditsToAdd: 1,
            typeOfCredit: 0,
            addressToCredit: address || '',
        },
    });
    const { control: controlAdd } = methodsAdd;

    // Formulaire achat de crédits
    const methodsBuy = useForm<BuyCreditFormData>({
    mode: "onSubmit",
        defaultValues: {
            creditsToBuy: 1,
            typeOfCredit: 0
        },
    });
    const { control: controlBuy } = methodsBuy; 
    const creditsToBuy = methodsBuy.watch("creditsToBuy");

    // Vérification du rôle admin
    const { data: isAdmin, error: isAdminError } = useReadContract({
        ...contractConfig,
        functionName: "hasRole",
        args: [
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            address as `0x${string}`,
        ],
        query: {
            enabled: !!address,
        },
    });

    // Récupération du solde ETH de l’adresse
    const {
        data: walletBalance,
        isLoading: walletBalanceLoading,
        error: walletError,
        } = useBalance({
        address: address as `0x${string}`,
    });

    // Récupération du nombre de crédits possédés par l’adresse
    const {
        data: creditBalance,
        refetch: refetchCredits,
        } = useReadContract({
        ...contractConfig,
        functionName: "creditBalance",
        args: [address as `0x${string}`],
        query: {
            enabled: !!address && !!MindchainContractAddress,
            select: (data) => data as CreditBalance | undefined,
        },
    });

    // Récupération du solde du contrat
    const {
        data: contractBalance,
        refetch: refetchContractBalance,
        } = useReadContract({
        ...contractConfig,
        functionName: "getContractBalance",
        args: [],
        query: {
            enabled: !!MindchainContractAddress,
            select: (data) => data as bigint,
        },
    });
    
    // Récupération de la total supply
    const {
        data: totalSupply,
        } = useReadContract({
        ...contractConfig,
        functionName: "totalSupply",
        args: [],
        query: {
            enabled: !!MindchainContractAddress,
            select: (data) => data as bigint,
        },
    });

    //Fonction pour récupérer le symbole du token
    const {
        data: tokenSymbol
        } = useReadContract({
        ...contractConfig,
        functionName: "symbol",
        args: [],
        query: {
            enabled: !!MindchainContractAddress,
            select: (data) => data as string,
        },
    });
    // Function pour récupérer le nom du token
    const {
        data: tokenName
        } = useReadContract({
        ...contractConfig,
        functionName: "name",
        args: [],
        query: {
            enabled: !!MindchainContractAddress,
            select: (data) => data as string,
        },
    });

    // Fonction pour récupérer la valeur requise pour 1 crédit
    const {
        data: creditValue
        } = useReadContract({
        ...contractConfig,
        functionName: "getCreditValue",
        args: [],
        query: {
            enabled: !!MindchainContractAddress,
            select: (data) => data as bigint,
        },
    });

    // Fonction pour écrire dans le contrat
    const { writeContract, isPending } = useWriteContract({
        mutation: {
            onSuccess: async (hash) => {
            const toastId = toast.loading("Transaction en cours...");
            try {
                await waitForTransactionReceipt(wagmiConfig, { hash });
                await Promise.all([
                refetchCredits(),
                refetchContractBalance(),
                ]);
                toast.success("Transaction confirmée", {
                id: toastId, // ✅ remplace le loading
                description: "Les soldes ont été mis à jour",
                });
            } catch (error) {
                toast.error("Erreur après transaction", {
                id: toastId, // ✅ ferme le loading
                });
            }
            },
            onError: (err) => {
            toast.error("Transaction échouée", {
                description: err.message,
            });
            },
        },
    });

    // Soumission du formulaire
    const addCredits = async (data: CreditFormData) => {
        //console.log("Form submitted with data:", data);
        if (!MindchainContractAddress) return;
        try {
            writeContract({
                ...contractConfig,
                chainId: chainId,
                functionName: 'updateCreditBalance',
                args: [
                    data.typeOfCredit, 
                    data.addressToCredit as `0x${string}`,
                    true,
                    BigInt(data.creditsToAdd) 
                ],
            });
            //console.log("Transaction submitted:", data);
        } catch (error) {
            console.error("Error submitting transaction:", error);
        }
    }

    // Acheter des crédits
    const buyCredits = async ( data: BuyCreditFormData) => {
        //console.log("Form submitted with data:", data);
        if (!MindchainContractAddress) return;
        if (!creditValue || creditValue <= BigInt(0)) {
            console.error("Credit value is undefined");
            return;
        }
        if (!creditsToBuy || creditsToBuy <= 0) {
            console.error("Invalid number of credits to buy");
            return;
        }
        const totalPriceWei =
            creditValue && creditsToBuy
                ? creditValue * BigInt(creditsToBuy)
                : BigInt(0);
        //console.log("Total price to pay:", totalPriceWei);
        try {
            writeContract({
            ...contractConfig,
            chainId: chainId,
            functionName: "buyCredits",
            args: [data.typeOfCredit],
            value: totalPriceWei,
            });
        } catch (error) {
            console.error("Error submitting transaction:", error);
        }
    }

    // Voir la balance d’un utilisateur
    const onSubmitViewBalance = (e: React.FormEvent) => {
        e.preventDefault();
    };

    // Mise à jour
    // useEffect(() => {
    //     // Pas de wallet connecté ou pas d’adresse de contrat
    //     if (!address || !MindchainContractAddress) return;
    //     console.log("Connected address:", address);
    //     console.log("contractBalance:", contractBalance);
    //     console.log("walletBalance:", walletBalance);
    //     console.log("creditValue:", creditValue);
    // }, [
    //     address, 
    //     contractBalance,
    //     walletBalance,
    //     creditValue
    // ]);

    return (
        <section className="w-[80%] mx-auto">
        <div className="mt-10 p-4 border border-purple-500 bg-white text-purple-800 rounded">
            <h4 className="font-bold highlight">Informations du contrat MindChain</h4>
            <p className="mt-2 text-base"><strong>Nom du token :</strong> {tokenName}</p>
            <p className="mt-2 text-base"><strong>Symbole du token :</strong> {tokenSymbol}</p>
            <p className="mt-2 text-base"><strong>Adresse du contrat :</strong> {MindchainContractAddress}</p>
            <p className="mt-2 text-base">
                <strong>Balance actuelle du contrat : </strong> 
                {(contractBalance !== undefined && contractBalance !== null)
                ? formatEther(contractBalance) + " ETH"
                : "0 ETH"}
            </p>
            <p className="mt-2 text-base"><strong>Nombre total de tokens :</strong> {totalSupply?.toString()}</p>
        </div>
        <div className="mt-10 p-4 border border-purple-500 bg-white text-purple-800 rounded">
            <h4 className="font-bold highlight">Vos informations</h4>
            <p className="mt-2 text-base"><strong>Rôle admin :</strong>{" "}{isAdmin === true ? "✅ Oui" : "❌ Non"}</p>
            <p className="mt-2 text-base"><strong>Votre adresse :</strong> {address}</p>
            <p className="mt-2 text-base">
            <strong>Solde ETH :</strong>{" "}
            {walletBalanceLoading
                ? "Chargement..."
                : walletError
                ? "Erreur"
                : `${walletBalance?.formatted} ${walletBalance?.symbol}`}
            </p>
            { (creditBalance !== undefined && creditBalance !== null) && (
            <>
            <p className="mt-2 text-base"><strong>Vos crédits disponibles :</strong></p>
                <ul>
                <li className="mt-1 text-base">- certification : {creditBalance[0].toString()}</li>
                <li className="mt-1 text-base">- generation : {creditBalance[1].toString()}</li>
                </ul>
            <p className="mt-2 text-base"><strong>Solde remboursable : </strong>{creditBalance[2].toString()} ETH</p>
            </>
            )}
        </div>

        <FormProvider {...methodsAdd}>
            <Form {...methodsAdd}>
                <form 
                onSubmit={methodsAdd.handleSubmit(addCredits)} 
                className="space-y-4"
                >
                <h3 className="mt-10 mb-2 block text-sm text-white before:content-['1._'] before:mr-2">
                    Ajouter des crédits
                </h3>
                <p>Utilisez le formulaire ci-dessous pour créditer votre balance ou celle d&apos;un autre utilisateur.</p>
                <FormItem>
                    <FormLabel>Adresse à créditer</FormLabel>
                    <FormControl>
                        <Controller
                            name="addressToCredit"
                            control={controlAdd}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    placeholder="0x..."
                                    {...field}
                                    className="w-full px-3 py-2 border border-gray-300 rounded bg-blue-50 text-black"
                                />
                            )}
                        />
                    </FormControl>
                </FormItem>
                <FormItem>
                    <FormLabel>Type de crédit</FormLabel>
                    <FormControl>
                        <Controller
                            name="typeOfCredit"
                            control={controlAdd}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className="w-full px-3 py-2 border border-gray-300 rounded bg-blue-50 text-black"
                                >
                                    <option value={0}>Crédit de certification</option>
                                    <option value={1}>Crédit de génération</option>
                                </select>
                            )}
                        />
                    </FormControl>
                </FormItem>
                <FormItem>
                    <FormLabel>Nombre de crédits</FormLabel>
                    <FormControl>
                        <Controller
                            name="creditsToAdd"
                            control={controlAdd}
                            render={({ field }) => (
                                <input
                                    type="number"
                                    min={1}
                                    max={100}
                                    {...field}
                                    className="w-full px-3 py-2 border border-gray-300 rounded bg-blue-50 text-black"
                                />
                            )}
                        />
                    </FormControl>
                </FormItem>
                <button
                    type="submit"
                    className="btn-action"
                    disabled={isPending}
                    >
                    {isPending ? "Transaction en cours..." : "Ajouter des crédits"}
                </button>
                </form>
            </Form>
        </FormProvider>

        <FormProvider {...methodsBuy}>
            <Form {...methodsBuy}>
                <form 
                onSubmit={methodsBuy.handleSubmit(buyCredits)} 
                className="space-y-4 mt-10"
                >
                <h3 className="mt-10 mb-2 block text-sm text-white before:content-['2._'] before:mr-2">
                    Acheter des crédits
                </h3>
                <p>Utilisez le formulaire ci-dessous pour acheter des crédits au prix de {creditValue ? formatEther(creditValue) : "..."}  ETH.</p>
                <FormItem>
                    <FormLabel>Type de crédit</FormLabel>
                    <FormControl>
                        <Controller
                            name="typeOfCredit"
                            control={controlBuy}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className="w-full px-3 py-2 border border-gray-300 rounded bg-blue-50 text-black"
                                >
                                    <option value={0}>Crédit de certification</option>
                                    <option value={1}>Crédit de génération</option>
                                </select>
                            )}
                        />
                    </FormControl>
                </FormItem>
                <FormItem>
                    <FormLabel>Nombre de crédits</FormLabel>
                    <FormControl>
                        <Controller
                        name="creditsToBuy"
                        control={controlBuy}
                        render={({ field }) => (
                            <input
                            type="number"
                            min={1}
                            {...field}
                            className="w-full px-3 py-2 border border-gray-300 rounded bg-blue-50 text-black"
                            />
                        )}
                        />
                    </FormControl>
                </FormItem>
                <p>
                Total à payer :{" "}
                {creditValue && creditsToBuy
                    ? `${formatEther(
                        creditValue * BigInt(creditsToBuy)
                    )} ETH`
                    : "Calcul..."}
                </p>
                <button
                    type="submit"
                    className="btn-action mt-10"
                    disabled={isPending}
                    >
                    {isPending ? "Transaction en cours..." : "Acheter des crédits"}
                </button>
                </form>
            </Form>
        </FormProvider>

        <h3 className="mt-10 mb-2 block text-sm text-white before:content-['3._'] before:mr-2">
        Consulter la balance de crédits d&apos;un utilisateur
        </h3>

        <form
        className="space-y-4 mt-10"
        onSubmit={onSubmitViewBalance}
        >
        <input
            type="text"
            placeholder="0x..."
            value={targetAddress ?? ""}
            onChange={(e) =>
            setTargetAddress(e.target.value as `0x${string}`)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded bg-blue-50 text-black"
        />

        <button type="submit" className="btn-action mt-10">
            Consulter la balance
        </button>
        </form>
        <div>
            {userBalanceLoading && <p>Chargement…</p>}
            {userBalanceError && <p className="text-red-500">Impossible d&apos;afficher la balance de l&apos;utilisateur</p>}
            {userCreditBalance && (
            <ul className="mt-4">
                <li>Certification : {userCreditBalance[0].toString()}</li>
                <li>Génération : {userCreditBalance[1].toString()}</li>
                <li>Remboursable : {parseEther(userCreditBalance[2].toString())} ETH</li>
            </ul>
            )}
        </div>    
        </section>
    );
}

export default MemberForm;
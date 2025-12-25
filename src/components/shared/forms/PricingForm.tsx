import { useEffect, useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useConfig, useReadContract, useWriteContract, useBalance, useChainId } from 'wagmi'
import { contractConfig, MindchainContractAddress } from "@/abi/MindchainContract";
import { Form, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { FormProvider, useForm, Controller, set } from 'react-hook-form';
import { toast } from "sonner";
import { waitForTransactionReceipt } from "@wagmi/core";
import { formatEther, parseEther } from "viem";

const FREE_CERTIFICATION_CREDITS = 0;
const FREE_GENERATION_CREDITS = 0;

interface BuyCreditFormData {
    creditsToBuy: number;
    typeOfCredit: 0 | 1;
};

type ServiceCount = readonly [bigint, bigint];

type CreditBalance = readonly [bigint, bigint, bigint];


const UserCreditForm = () => {
    const { address } = useAppKitAccount();
    const wagmiConfig = useConfig();
    const chainId = useChainId();
    const [certificationCreditsToUse, setCertificationCreditsToUse] = useState<number>(0);
    const [generationCreditsToUse, setGenerationCreditsToUse] = useState<number>(0);
    const [allCreditUsed, setAllCreditUsed] = useState<boolean>(true);

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

    // Vérification si l'adresse a déjà utilisé les services
    const {
        data: addressServiceCount,
        } = useReadContract({
        ...contractConfig,
        functionName: "serviceCount",
        args: [address as `0x${string}`],
        query: {
            enabled: !!address && !!MindchainContractAddress,
            select: (data) => data as ServiceCount | undefined,
        },
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
                ]);
                toast.success("Transaction confirmée", {
                id: toastId, // ✅ remplace le loading
                description: "Le solde a été mis à jour",
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


    const claimFreeCredits = () => {
        if (allCreditUsed) return;
        try {
            writeContract({
                ...contractConfig,
                chainId: chainId,
                functionName: 'updateCreditBalance',
                args: [
                    0, 
                    address as `0x${string}`,
                    true,
                    BigInt(FREE_CERTIFICATION_CREDITS) 
                ],
            });
            //console.log("Transaction submitted:", data);
        } catch (error) {
            console.error("Error submitting transaction:", error);
        }
        try {
            writeContract({
                ...contractConfig,
                chainId: chainId,
                functionName: 'updateCreditBalance',
                args: [
                    1,
                    address as `0x${string}`,
                    true,
                    BigInt(FREE_GENERATION_CREDITS)
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


    // Mise à jour
    useEffect(() => {
        // Pas de wallet connecté ou pas d’adresse de contrat
        if (!address || !MindchainContractAddress) return;
        // Adresse du wallet connectée
        if (addressServiceCount !== undefined) {
            // Récupération du nombre de services utilisés
            const usedCertificationCredits = Number(addressServiceCount[0]);
            const usedGenerationCredits = Number(addressServiceCount[1]);
            if (usedCertificationCredits >= FREE_CERTIFICATION_CREDITS && usedGenerationCredits >= FREE_GENERATION_CREDITS) {
                setAllCreditUsed(true);
                // Tous les crédits gratuits ont été utilisés
                setCertificationCreditsToUse(0);
                setGenerationCreditsToUse(0);
            } else {
                setAllCreditUsed(false);
                if (usedCertificationCredits !== 0 || usedGenerationCredits !== 0) {
                    // Calcul des crédits gratuits restants
                    setCertificationCreditsToUse(Math.max(0, FREE_CERTIFICATION_CREDITS - usedCertificationCredits));
                    setGenerationCreditsToUse(Math.max(0, FREE_GENERATION_CREDITS - usedGenerationCredits));
                }
            }
        }
    }, [address, addressServiceCount]);

    return (
        <section className="w-[80%] mx-auto">
        { certificationCreditsToUse === 0 && generationCreditsToUse === 0 && !allCreditUsed && (
            <form
            className="space-y-4 mt-10"
            onSubmit={() => {}}
            >
                <button type="submit" className="btn-action mt-10 flex justify-self-center" disabled={allCreditUsed}>
                    Réclamer vos crédits gratuits !
                </button>
            </form>
        )}
        { certificationCreditsToUse !== 0 && generationCreditsToUse !== 0 && !allCreditUsed && (
            <div className="mt-10 p-4 border border-green-500 bg-white text-green-800 rounded">
                <h4 className="font-bold highlight">Crédits gratuits disponibles</h4>
                <p className="mt-2 text-base">Vous avez {certificationCreditsToUse} crédits gratuits de certification et {generationCreditsToUse} crédits gratuits de génération à utiliser.</p>
            </div>
        )}
        { creditBalance !== undefined && (
            <>
            <h3 className="mt-10 mb-2 block text-sm text-white flex justify-self-left">
                Crédits disponibles
            </h3>
            <table className="w-full mt-6 table-auto border border-gray-300 bg-white text-black rounded">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">Service</th>
                        <th className="border border-gray-300 px-4 py-2">Solde</th>
                    </tr>   
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">Crédit de certification</td>
                        <td className="border border-gray-300 px-4 py-2 align-center">{creditBalance[0].toString()}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">Crédit de génération</td>
                        <td className="border border-gray-300 px-4 py-2 align-center">{creditBalance[1].toString()}</td>
                    </tr>
                </tbody>
            </table>

            <FormProvider {...methodsBuy}>
                <Form {...methodsBuy}>
                    <form 
                    onSubmit={methodsBuy.handleSubmit(buyCredits)} 
                    className="space-y-4 mt-10"
                    >
                    <h3 className="mt-10 mb-2 block text-sm text-white flex justify-self-left">
                        Acheter des crédits
                    </h3>
                    <p>Utilisez le formulaire ci-dessous pour acheter des crédits au prix de {creditValue ? formatEther(creditValue) : "..."}  ETH/crédit.</p>
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
                        )} ETH (hors frais de gas)`
                        : "Calcul..."}
                    </p>
                    <button
                        type="submit"
                        className="btn-action mt-10 flex justify-self-center"
                        disabled={isPending}
                        >
                        {isPending ? "Transaction en cours..." : "Acheter des crédits"}
                    </button>
                    </form>
                </Form>
            </FormProvider>
        </>
        )}
        </section>
    );
}

export default UserCreditForm;
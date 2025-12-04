'use client';
// import React, { createContext, useContext, useState } from 'react';
// import { generateImage } from '@/services/generate';
// import { uploadImageFile } from '@/services/storage';
// import { certificateImage } from '@/services/certificate';
// import { useSignMessage } from "wagmi";
// import { useAppKitAccount } from "@reown/appkit/react";
// import { type Address } from "viem";


// interface GenerativeContextProps {
//   promptRequest: GenerativeFormData;
//   promptResult: GenerativeResultData;
//   imageCid: string | undefined;
//   signature: string | null;
//   generatePrompt: () => Promise<void>;
//   generateCertificate: () => void;
//   newIteration: () => void;
//   handleSignMsg: (msg: string) => Promise<string | undefined>;
//   setPromptRequest: () => void;
//   reset: () => void;
// }

// interface GenerativeFormData {
//   title: string;
//   prompt: string;
//   engine: string;
//   model: string;
//   guidance: number | 0 ;
//   sampler: string | null;
//   uploadedFile: File | null;
//   uploadedFileUrl?: string | null;
//   ipfsConsent: boolean;
// }

// interface GenerativeResultData {
//   [key: string]: string | number | boolean | object | File;
// }

// // Create the context
// const GenerativeContext = createContext<GenerativeContextProps | undefined>(undefined);

// // Custom hook to use the GenerativeContext
// export const useGenerative = () => {
//   const context = useContext(GenerativeContext);
//   if (!context) throw new Error('useGenerative must be used within GenerativeProvider');
//   return context;
// };

// export const GenerativeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
//   const [signature, setSignature] = useState<string | undefined>(undefined);
//   const [promptRequest, setPromptRequest] = useState<GenerativeFormData>({
//     title: "",
//     prompt: "",
//     model: "",
//     uploadedFile: null,
//   });

//   const [promptResult, setPromptResult] = useState<GenerativeResultData>({
//     id: "",
//     url: "",
//     date: "",
//     cid: "",
//   });

//   // Wagmi hook to sign a message
//   const { signMessageAsync } = useSignMessage();
//   // AppKit hook to get the address and check if the user is connected
//   const { address, isConnected } = useAppKitAccount();

//   // Fonction de signature de message
//   const handleSignMsg = async (msg:string) => {
//     if (!isConnected || !address) {
//       console.warn("Wallet non connecté ou adresse absente");
//       return;
//     }
//     if (signature) {
//       console.log("Message déjà signé");
//       return signature;
//     }
//     try {
//       const signature = await signMessageAsync({ message: msg, account: address as Address });
//       setSignature(signature);
//       return signature;
//     } catch (err) {
//       return Promise.reject(err);
//     }
//   };
//     // 2. Generate image


//   return (
//     <GenerativeContext.Provider 
//     value={{ promptRequest, promptResult, imageCid: undefined, signature, generatePrompt: async () => {}, generateCertificate: () => {}, newIteration: () => {}, handleSignMsg, setPromptRequest: () => {}, reset: () => {} }}  
//     >
//       {children}
//     </GenerativeContext.Provider>
//   );
// };

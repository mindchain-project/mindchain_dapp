'use client';
import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
// import { uploadImageFile } from '@/services/storage';
import { useSignMessage } from "wagmi";
import { useAppKitAccount } from "@reown/appkit/react";
import { type Address } from "viem";


interface GenerativeContextProps {
  promptRequest: GenerativeFormData;
  promptResult: GenerativeResultData;
  signature: string | undefined;
  handleSignMsg: (msg: string) => Promise<string | undefined>;
  setPromptRequest: Dispatch<SetStateAction<GenerativeFormData>>;
  setPromptResult: Dispatch<SetStateAction<GenerativeResultData>>;
}

interface GenerativeFormData {
  title: string ;
  prompt: string ;
  model: string;
  uploadedFile: File | null;
}

export interface GenerativeResultData {
  id: string;
  url: string;
  date: string;
  cid?: string;
}

// Create the context
const GenerativeContext = createContext<GenerativeContextProps | undefined>(undefined);

// Custom hook to use the GenerativeContext
export const useGenerativeContext = () => {
  const context = useContext(GenerativeContext);
  if (!context) throw new Error('useGenerative must be used within GenerativeProvider');
  return context;
};

export default function GenerativeProvider({ children }: { children: React.ReactNode }) {

  const { signMessageAsync } = useSignMessage();
  const { address, isConnected } = useAppKitAccount();
  const [signature, setSignature] = useState<string | undefined>(undefined);

  const [promptRequest, setPromptRequest] = useState<GenerativeFormData>({
    title: '',
    prompt: '',
    model: '',
    uploadedFile: null,
  });
  const [promptResult, setPromptResult] = useState<GenerativeResultData>({
    id: '',
    url: '',
    date: '',
    cid: '',
  });


  // Fonction de signature de message
  const handleSignMsg = async (msg:string) => {
    if (!isConnected || !address) {
      console.warn("Wallet non connecté ou adresse absente");
      return undefined;
    }
    if (signature) {
      console.log("Message déjà signé");
      return signature;
    }
    try {
      const signature = await signMessageAsync({ message: msg, account: address as Address });
      setSignature(signature);
      return signature;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  // Réinitialisation du formulaire et de l’état
  const reset = () => {
    setPromptRequest({
      title: '',
      prompt: '',
      model: '',
      uploadedFile: null,
    });
    // if (promptRequest.uploadedFileUrl) {
    //   URL.revokeObjectURL(promptRequest.uploadedFileUrl);
    // }
    setPromptResult({
      id: '',
      url: '',
      date: '',
      cid: '',
    });
    setSignature(undefined);
    console.log('Réinitialisation du formulaire et de l’état');
  };

  return (
    <GenerativeContext.Provider
      value={{
        signature,
        handleSignMsg,
        promptRequest,
        setPromptRequest,
        promptResult,
        setPromptResult,
      }}
    >
      {children}
    </GenerativeContext.Provider>
  );
};

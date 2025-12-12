import { Dispatch, SetStateAction } from 'react';
import { UploadResponse } from "pinata";


export interface GenerativeContextProps {
  promptRequest: GenerativeFormData;
  promptResult: GenerativeResultData;
  signature: string | undefined;
  handleSignMsg: (msg: string) => Promise<string | undefined>;
  setPromptRequest: Dispatch<SetStateAction<GenerativeFormData>>;
  setPromptResult: Dispatch<SetStateAction<GenerativeResultData>>;
}

export interface GenerativeFormData {
  title: string ;
  prompt: string ;
  model: string;
  uploadedFile: File | null;
}

export interface GenerativeResultData {
  id: string;
  url: string;
  date: string;
  cid?: string | null;
}

// Certification interfaces
export interface CertificateFormProps {
  onResult?: (result: MintResult | null) => void;
}

export interface CertificateIteration {
  prompt: string;
  model: string;
  provider: string;
  mode: string;
  sourceFile: File | null;
  sourceFileDesc?: string;
  personalData: boolean;
  ipfsPublish: boolean;
  iterationImage: File | null;
}

export interface CertificationFormData {
  title: string;
  description: string;
  finalArtworkFile: File | null; // Fichier compressé de l'œuvre finale
  finalArtworkFileOriginal: File | null; // Fichier original de l'œuvre finale  
  finalArtworkFileCid: string | null;
  finalArtworkFileIpfsPublish: boolean;

  iterations: CertificateIteration[];
  
  legal: {
    authorshipConfirmation: boolean;
    thirdPartyRights: boolean;
    exploitationRights: boolean;
    license: string;
  };
  parameters: {
    mainProvider: string;
    modelData: string;
    logsFile: File | null;
  };
  validation: {
    processConfirmation: boolean;
    certification: boolean;
    privacy: boolean;
    terms: boolean;
    ownership: boolean;
  };
}

export interface NFTItem {
  tokenId: number;
  metadata: {
    name: string;
    description: string;
    image: string;
    creation?: {
      certificate_timestamp: string;
      certificate_id: string;
    };
  };
}

// Resultat du mint
export interface MintResult {
  txHash: string;
  tokenId: string | null;
  metadataCid: string;
  imageCid: string;
}

export interface FileMetadata {
  type: string,
  name: string,
  size: number,
}

export interface PinataUploadResponse extends UploadResponse {
  cid: string,
  is_duplicate: boolean,
}
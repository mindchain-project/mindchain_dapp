import { Dispatch, SetStateAction } from 'react';
import { UploadResponse } from "pinata";

export interface StudioTabProps {
  address: string;
  walletProvider: any;
}

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


export interface CertificateFormData {
  title: string;
  description: string;
  finalArtworkFile: File | CertificateFileMetadata | null;
  finalArtworkFileCid: string | null;
  finalArtworkFileIpfsPublish: boolean;
  finalArtworkFileOriginal: File | CertificateFileMetadata | null;

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
  tokenId: string;
  metadata: any;
}

export interface MintResult {
  status: boolean;
  txHash: string;
  tokenId: string | null;
  metadataCid: string;
}

export interface CertificateFileMetadata {
  type: string,
  original_filename: string,
  size: number,
}

export interface PinataUploadResponse extends UploadResponse {
  cid: string,
  is_duplicate: boolean,
}
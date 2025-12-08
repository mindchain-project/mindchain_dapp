import { Dispatch, SetStateAction } from 'react';
import { UploadResponse } from "pinata";

export interface StudioTabProps {
  address: string;
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
  cid?: string;
}


export interface CertificateFormData {
  title: string;
  description: string;
  uploadedFile: File | null;
  prompt: string;
  model: string;
  provider: string;
  mode: string;
  sourceFile: File | null;
  sourceFileDesc: string;
  personalData: boolean;
  ipfsPublish: boolean;
  iterationImage: File | null;
  legal: {
    authorshipConfirmation: boolean;
    thirdPartyRights: boolean;
    exploitationRights: boolean;
    license: string;
  };
  iterations: Array<{
    image: File | null;
    description: string;
  }>;
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


export interface PinataUploadResponse extends UploadResponse {
  cid: string;
}
import { Dispatch, SetStateAction } from 'react';
import { UploadResponse } from "pinata";


/* ---------   INTERFACES GENERATION  ------------------*/

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


/* ---------   INTERFACES CERTIFICATION  ------------------*/

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


export interface CertificateAttributes {
  trait_type: string;
  value: CertificateIteration[];
}

export interface FileMetadata {
  type: string,
  name: string,
  size: number,
}

export interface iterationFileMetadata {
  metadata :FileMetadata,
  cid : string,
  description: string | null,
}

export interface CertificateForTransaction {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: CertificateAttributes[];
  creation: {
    certification_timestamp: string;
    certificate_id: string;
  };
  contract_address: string;
  parameters: {
    mainProvider: string; 
    modelData: string;
    logsFileCid: string | null;
  };
}


/* ---------   INTERFACES RESULTATS  ------------------*/

export interface NFTItem {
  uri: string;
  tokenId: number;
  metadata: {
    name: string;
    image: string;
    creation?: {
      timestamp: number;
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


/* ---------   INTERFACES STOCKAGE  ------------------*/

export interface PinataUploadResponse extends UploadResponse {
  cid: string,
  is_duplicate: boolean,
}
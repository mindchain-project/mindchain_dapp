import { Dispatch, SetStateAction } from 'react';
// `import type` : évite d'embarquer la SDK Pinata dans le bundle client,
// ce fichier étant importé par des composants « use client ».
import type { UploadResponse } from "pinata";


/* ---------   INTERFACES GENERATION  ------------------*/

export interface GenerativeContextProps {
  promptRequest: GenerativeFormData;
  promptResult: GenerativeResultData;
  signature: string | undefined;
  handleSignMsg: (msg: string) => Promise<string | undefined>;
  setPromptRequest: Dispatch<SetStateAction<GenerativeFormData>>;
  setPromptResult: Dispatch<SetStateAction<GenerativeResultData>>;
  reset: () => void;
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
  attributes: CertificateAttributes[];
  creation: {
    certification_timestamp: number;
    certificate_id: string;
  };
  contract_address: string;
  parameters: {
    main_provider: string; 
    model_data: string;
    logs_file: {metadata: FileMetadata, cid: string} | null;
  };
  license: string;
}


/* ---------   INTERFACES RESULTATS  ------------------*/

export interface NFTItem {
  uri: string;
  tokenId: number;
  metadata: {
    name: string;
    image: string;
    creation?: {
      certification_timestamp: number;
      certificate_id: string;
    };
  };
}

// Resultat du mint
export interface MintResult {
  txHash: string | null;
  tokenId: string | null;
  metadataCid: string;
  imageCid: string;
}


/* ---------   INTERFACES STOCKAGE  ------------------*/

export interface PinataUploadResponse extends UploadResponse {
  cid: string,
  is_duplicate: boolean,
}

/** Causes d'échec d'un upload IPFS, remontées telles quelles au client. */
export type UploadErrorCode =
  | "unauthorized"     // session absente ou expirée
  | "invalid_file"     // entrée vide ou malformée
  | "too_large"        // au-delà de MAX_UPLOAD_BYTES
  | "unsupported_type" // type MIME hors liste blanche
  | "duplicate"        // contenu déjà épinglé sur IPFS
  | "upload_failed";   // erreur côté Pinata

/**
 * Résultat d'un upload. Le `receipt` est un jeton signé prouvant que la
 * session courante est à l'origine de ce CID ; il est exigé pour toute
 * suppression ultérieure.
 */
export type UploadResult =
  | { ok: true; cid: string; isDuplicate: boolean; receipt: string }
  | { ok: false; error: UploadErrorCode };

/** Couple (CID, preuve de propriété) attendu par `deleteFiles`. */
export interface CidReceipt {
  cid: string;
  receipt: string;
}
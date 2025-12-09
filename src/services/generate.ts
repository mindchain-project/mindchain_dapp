"use server";
// Models generation functions
import { GoogleGenAI } from "@google/genai";
import { InferenceClient } from "@huggingface/inference";
import { ImageToImageArgs, TextToImageArgs } from "@huggingface/inference";
import { uploadImageFile } from "./storage";
import { GenerativeResultData } from '@/utils/interfaces';


/* Google Gemini API */
async function generateImageGoogle(prompt: string, file: File | null, uuidImage: string) {
    let generationResult: GenerativeResultData = {
        "date": "",
        "id": "",
        "url": "",
        "cid": "",
    };
    let date = "";
    // Initialisation du client Google GenAI
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    let response;
    // Si un fichier est fourni, le convertir en base64 et l'ajouter au prompt
    if (file) {
        console.log("File provided for Google Gemini:", file.name);
        const buffer = Buffer.from(await file.arrayBuffer());
        const imageBase64 = buffer.toString("base64");
        const promptData: Array<{ text: string; inlineData?: { mimeType: string; data: string } }> = [];
        if (imageBase64) {
            promptData.push({
                text: prompt,
                inlineData: {
                    mimeType: file!.type,
                    data: imageBase64,
                }
            });
        }
        response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: promptData,
    });
    } else {
        console.log("No file provided for Google Gemini.");
        const promptData: Array<{ text: string; }> = [];
        promptData.push({ text: prompt });
        // Envoi de la requête de génération
        response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: promptData,
        });
    }
    // Vérification de la réponse
    if (!response.candidates || response.candidates.length === 0) {
        throw new Error("No candidates returned from Gemini API");
    }
    // Extraction des métadonnées d'utilisation
    if (!response.usageMetadata) {
        throw new Error("No usage metadata returned from Gemini API");
    }
    console.log("Usage Metadata:", response.usageMetadata);

    // Extraction de l’image et du texte
    if (!response.candidates) {
        throw new Error("No content parts returned from Gemini API");
    }
    if (response.candidates.length === 0) {
        throw new Error("No candidates returned from Gemini API");
    }
    if (!response.candidates[0].content) {
        throw new Error("No content parts in candidate from Gemini API");
    }
    if (!response.candidates[0].content.parts) {
        throw new Error("No content parts in candidate from Gemini API");
    }
    const part = response.candidates?.[0]?.content.parts.find(p => p.inlineData);
    if (!part || !part.inlineData) throw new Error("No inline image found");
    const img = part.inlineData;
    // Sauvegarde de l’image générée
    if (!img.data) {
        throw new Error("No image data found");
    }
    const imgBuffer = Buffer.from(img.data, "base64");
    // const outputPath = `./public/img/generated_${uuidImage}.png`;
    // await writeFile(outputPath, imgBuffer);
    // console.log("Image saved to:", outputPath);
    const img_file = new File([imgBuffer], `generated_${uuidImage}.png`, { type: "image/png" });
    const img_cid = await uploadImageFile(img_file, img_file.name);
    console.log("Image uploaded to IPFS with CID:", img_cid);
    // Récupération de la date de la réponse
    const headers = response.sdkHttpResponse?.headers ?? {};
    if (headers) {
        date = headers.date || new Date(Date.now()).toISOString();
    }
    // Retour des informations de génération
    generationResult = {
        "date": date,
        "id": response.responseId || `gg-${uuidImage}`,
        "url": "",
        "cid": img_cid,
    };
    return generationResult;
}


/* Hugging Face Inference API */
export async function generateImageHuggingFace(prompt: string, file: File | null, uuidImage: string): Promise<GenerativeResultData> {
    let generationResult: GenerativeResultData = {
        "date": "",
        "id": "",
        "url": "",
        "cid": "",
    };
    let promptArgs: ImageToImageArgs | TextToImageArgs;
    const modelName = "black-forest-labs/FLUX.1-dev";
    // Initialisation du client Hugging Face Inference
    const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN!;
    const client = new InferenceClient(HUGGINGFACE_TOKEN);
    let response;
    // Préparation des données du prompt
    if (!file) {
        // Text to Image
        promptArgs = {
            provider: "replicate",
            model: modelName,
            inputs: prompt,
            parameters: { num_inference_steps: 5 },
        }
        response = await client.textToImage(promptArgs);
        console.log("Generation response:", response);
    } else {
        // Image to Image
        const image = new Blob([await file.arrayBuffer()], { type: file.type });
        promptArgs = {     
            provider: "replicate",
            model: modelName,
            inputs: image,
            parameters: { prompt: prompt, },
        }
        response = await client.imageToImage(promptArgs);
        console.log("Generation response:", response);
    };

    // Vérification de la réponse
    console.log("Generation response:", response);
    if (!response || !(response instanceof Response)) {
        throw new Error("Invalid response from Hugging Face Inference API");
    }
    // Sauvegarde de l’image générée
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // const outputPath = `./public/img/generated_${uuidImage}.png`;
    // await writeFile(outputPath, buffer);
    // console.log("Image saved to:", outputPath);
    const img_file = new File([buffer], `generated_${uuidImage}.png`, { type: "image/png" });
    const img_cid = await uploadImageFile(img_file, img_file.name);
    console.log("Image uploaded to IPFS with CID:", img_cid);
    // Retour des informations de génération
    generationResult = {
        "date": new Date(Date.now()).toISOString(),
        "id": `hf-${uuidImage}`,
        "url": "",
        "cid": img_cid,
    };
    return generationResult;
};

export async function generateImage(model: string, prompt: string, file: File | null): Promise<GenerativeResultData> {
    let generationResult: GenerativeResultData = {
        "date": "",
        "id": "",
        "url": "",
        "cid": "",
    };
    // Storage uploaded file
    const uuidImage = crypto.randomUUID();

    try {
        // Initialisation du client selon le provider
        if(model === "gemini") {
            // Google Gemini API
            generationResult = await generateImageGoogle(prompt, file, uuidImage);
        }
        if (model === "flux") {
            // Hugging Face Inference API
            generationResult = await generateImageHuggingFace(prompt, file, uuidImage);
        }
    } catch (error) {
        throw new Error("Error during image generation:" + error);

    }
    console.log("Generation result:", generationResult);
    return generationResult;
};

export async function generateImageDemo(): Promise<GenerativeResultData> {    
    const generationResult: GenerativeResultData = {
        "date": new Date(Date.now()).toISOString(),
        "id": `demo-${crypto.randomUUID()}`,
        "url": "",
        "cid": `bafybeicnxivqsgfcbyfilz2x7de4u6aez7eps4trs63aeoe4fdkkisdcjm`,
    };
    console.log("Generation result:", generationResult);
    return generationResult;
};

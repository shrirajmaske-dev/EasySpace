import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const rawApiKey = process.env.GEMINI_API_KEY?.trim();
export const isGeminiConfigured = Boolean(
  rawApiKey &&
  !rawApiKey.includes('your_gemini') &&
  !rawApiKey.includes('placeholder') &&
  rawApiKey.length > 10
);

if (!isGeminiConfigured) {
  console.warn('[EasySpace AI Config] Warning: GEMINI_API_KEY is not defined or is a placeholder. Operating with deterministic academic curriculum synthesis engine for STEM topics.');
}

export const ai = isGeminiConfigured ? new GoogleGenAI({ apiKey: rawApiKey }) : null;

// Standard Gemini model constants
export const GEMINI_FLASH_MODEL = 'gemini-1.5-flash';
export const GEMINI_PRO_MODEL = 'gemini-1.5-pro';

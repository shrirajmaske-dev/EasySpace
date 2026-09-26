import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('[EasySpace AI Config] Warning: GEMINI_API_KEY is not defined in environment variables. Falling back to deterministic pedagogical AI synthesis engine for STEM topics.');
}

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Standard Gemini model constants
export const GEMINI_FLASH_MODEL = 'gemini-1.5-flash';
export const GEMINI_PRO_MODEL = 'gemini-1.5-pro';

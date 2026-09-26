import dotenv from 'dotenv';
dotenv.config();

export const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
export const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

if (!YOUTUBE_API_KEY) {
  console.warn('[YouTube API Config] Warning: YOUTUBE_API_KEY is not defined. Using curated academic seed repository with query matching.');
}

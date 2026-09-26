import dotenv from 'dotenv';
dotenv.config();

const rawYoutubeKey = process.env.YOUTUBE_API_KEY?.trim() || '';
export const YOUTUBE_API_KEY = (
  rawYoutubeKey &&
  !rawYoutubeKey.includes('your_youtube') &&
  !rawYoutubeKey.includes('placeholder') &&
  rawYoutubeKey.length > 15
) ? rawYoutubeKey : '';
export const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

if (!YOUTUBE_API_KEY) {
  console.warn('[YouTube API Config] Warning: YOUTUBE_API_KEY is not defined or is a placeholder. Using curated academic seed repository with query matching.');
}

import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const rawN8nUrl = process.env.N8N_SEARCH_WEBHOOK_URL?.trim();
const N8N_SEARCH_WEBHOOK_URL =
  (rawN8nUrl && rawN8nUrl.startsWith('http'))
    ? rawN8nUrl
    : 'https://ladepranav7.app.n8n.cloud/webhook/learnlens/search';

export class N8nService {
  /**
   * Transmits user search query to n8n Webhook (LearnLens search workflow)
   * and returns structured educational video recommendations.
   *
   * @param {Object} params
   * @param {string} params.query - Search query string
   * @param {string} params.topic - Academic topic
   * @param {string} [params.discipline] - Academic discipline (e.g. Mechanical Engineering)
   * @param {string} [params.difficulty] - Target difficulty (Beginner, Intermediate, Advanced)
   * @returns {Promise<Array|null>} Array of formatted video objects, or null if unreachable
   */
  static async searchEducationalVideos({ query, topic, discipline, difficulty }) {
    const searchQuery = query || topic;
    if (!searchQuery || !searchQuery.trim()) {
      return null;
    }

    try {
      console.log(`[n8n Webhook] Transmitting search payload to: ${N8N_SEARCH_WEBHOOK_URL}`);
      console.log(`[n8n Webhook] Payload:`, { query: searchQuery.trim() });

      const response = await axios.post(
        N8N_SEARCH_WEBHOOK_URL,
        {
          query: searchQuery.trim(),
          topic: topic || searchQuery.trim(),
          discipline: discipline || 'STEM',
          difficulty: difficulty || 'Intermediate',
          timestamp: new Date().toISOString()
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          timeout: 25000 // n8n AI agent workflows may take 5-15s to research & rank
        }
      );

      const data = response.data;
      console.log(`[n8n Webhook] Received response status ${response.status}`);

      // Extract recommendations array from various possible wrapper shapes
      let rawRecommendations = [];
      if (Array.isArray(data)) {
        rawRecommendations = data;
      } else if (Array.isArray(data?.recommendations)) {
        rawRecommendations = data.recommendations;
      } else if (Array.isArray(data?.videos)) {
        rawRecommendations = data.videos;
      } else if (Array.isArray(data?.data)) {
        rawRecommendations = data.data;
      }

      if (rawRecommendations.length === 0) {
        console.warn('[n8n Webhook] No recommendations array found in response payload');
        return null;
      }

      // Format n8n recommendations into EasySpace curriculum video objects
      const curatedVideos = rawRecommendations.map((item, index) => {
        const videoId = item.videoId || item.video_id || item.youtube_video_id || item.id;
        const concepts = Array.isArray(item.concepts)
          ? item.concepts
          : Array.isArray(item.core_concepts)
          ? item.core_concepts
          : typeof item.concepts === 'string'
          ? item.concepts.split(',').map((c) => c.trim())
          : [];

        return {
          id: crypto.randomUUID(),
          youtube_video_id: videoId,
          title: item.title || `${searchQuery} Lecture ${index + 1}`,
          channel_title: item.channel_title || item.channel || 'LearnLens AI Verified',
          description:
            item.reason ||
            item.description ||
            `Curated by n8n LearnLens pipeline for ${searchQuery} mastery.`,
          thumbnail_url:
            item.thumbnail_url ||
            (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80'),
          duration_seconds: item.duration_seconds || 1500,
          sequence_order: index + 1,
          core_concepts: concepts,
          target_difficulty: item.difficulty || difficulty || 'Intermediate',
          relevance: item.relevance,
          curation_source: 'n8n_learnlens'
        };
      });

      console.log(`[n8n Webhook] Successfully processed ${curatedVideos.length} recommendations from n8n`);
      return curatedVideos;
    } catch (err) {
      console.warn(`[n8n Webhook Error]: ${err.message}`);
      return null;
    }
  }
}

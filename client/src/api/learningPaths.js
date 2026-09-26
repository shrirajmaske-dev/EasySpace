import { apiClient } from './client.js';
import axios from 'axios';

const rawN8nUrl = import.meta.env.VITE_N8N_SEARCH_WEBHOOK_URL?.trim();
const N8N_WEBHOOK_URL =
  (rawN8nUrl && rawN8nUrl.startsWith('http'))
    ? rawN8nUrl
    : 'https://ladepranav7.app.n8n.cloud/webhook/learnlens/search';

export const learningPathsApi = {
  getDomains: async () => {
    const response = await apiClient.get('/curate/domains');
    return response.data;
  },

  /**
   * Curates an educational video learning path.
   * Transmits search query to the backend which triggers the n8n LearnLens search workflow.
   */
  curatePath: async ({ topic, discipline, domainId, difficulty, query }) => {
    const searchQuery = (query || topic || '').trim();
    const response = await apiClient.post('/curate/path', {
      topic: topic || searchQuery,
      query: searchQuery,
      discipline,
      domainId,
      difficulty,
    });
    return response.data;
  },

  /**
   * Directly transmits search query payload to the n8n webhook URL:
   * https://ladepranav7.app.n8n.cloud/webhook/learnlens/search
   */
  searchN8nWebhook: async ({ query, topic, discipline = 'Engineering', difficulty = 'Intermediate' }) => {
    const searchQuery = (query || topic || '').trim();
    const response = await axios.post(
      N8N_WEBHOOK_URL,
      {
        query: searchQuery,
        topic: topic || searchQuery,
        discipline,
        difficulty,
        timestamp: new Date().toISOString()
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 25000
      }
    );
    return response.data;
  },

  getPathById: async (pathId) => {
    const response = await apiClient.get(`/curate/path/${pathId}`);
    return response.data;
  },

  getUserPaths: async () => {
    const response = await apiClient.get('/curate/user-paths');
    return response.data;
  },
};

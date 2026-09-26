import { apiClient } from './client.js';

export const masteryApi = {
  getMasteryLedger: async () => {
    const response = await apiClient.get('/mastery/ledger');
    return response.data;
  },
};

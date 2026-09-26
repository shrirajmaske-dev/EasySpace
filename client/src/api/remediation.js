import { apiClient } from './client.js';

export const remediationApi = {
  generateRemediation: async ({ quizAttemptId, micro_concept, topic, accuracy, missedQuestionsSummary }) => {
    const response = await apiClient.post('/remediation/generate', {
      quizAttemptId,
      micro_concept,
      topic,
      accuracy,
      missedQuestionsSummary,
    });
    return response.data;
  },

  getRemediationById: async (id) => {
    const response = await apiClient.get(`/remediation/${id}`);
    return response.data;
  },

  getPendingRemediations: async () => {
    const response = await apiClient.get('/remediation/pending');
    return response.data;
  },

  verifyRemediation: async ({ remediationId, answers }) => {
    const response = await apiClient.post('/remediation/verify', {
      remediationId,
      answers,
    });
    return response.data;
  },
};

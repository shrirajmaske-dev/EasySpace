import { apiClient } from './client.js';

export const diagnosticsApi = {
  generateQuiz: async ({ videoId, videoTitle, videoDescription, topic, difficulty, learningPathId }) => {
    const response = await apiClient.post('/diagnostic/generate', {
      videoId,
      videoTitle,
      videoDescription,
      topic,
      difficulty,
      learningPathId,
    });
    return response.data;
  },

  getQuizById: async (quizId) => {
    const response = await apiClient.get(`/diagnostic/${quizId}`);
    return response.data;
  },

  submitQuiz: async ({ quizId, answers, timeTakenSeconds, confidenceRatings }) => {
    const response = await apiClient.post('/diagnostic/submit', {
      quizId,
      answers,
      timeTakenSeconds,
      confidenceRatings,
    });
    return response.data;
  },

  getAttemptResults: async (attemptId) => {
    const response = await apiClient.get(`/diagnostic/attempt/${attemptId}`);
    return response.data;
  },
};

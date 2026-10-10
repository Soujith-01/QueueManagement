import api from './api';

export const aiService = {
  getQueuePrediction: async () => {
    const res = await api.get('/ai/queue-prediction');
    return res.data;
  },

  getCrowdPrediction: async () => {
    const res = await api.get('/ai/queue-prediction');
    return res.data;
  },

  getRecommendations: async () => {
    const res = await api.get('/ai/recommendations');
    return res.data;
  },

  getMealRecommendations: async () => {
    const res = await api.get('/ai/recommendations');
    return res.data;
  },
};

export default aiService;

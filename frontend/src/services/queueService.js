import api from './api';

export const queueService = {
  getCurrentQueue: async () => {
    const res = await api.get('/queue/current');
    return res.data;
  },

  getCurrentQueueStatus: async () => {
    const res = await api.get('/queue/current');
    return res.data;
  },

  getOrderQueueStatus: async (orderId) => {
    const res = await api.get(`/queue/order/${orderId}`);
    return res.data;
  },

  getSettings: async () => {
    const res = await api.get('/queue/settings');
    return res.data;
  },
};

export default queueService;

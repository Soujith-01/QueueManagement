import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  getAnalytics: async () => {
    const res = await api.get('/admin/analytics');
    return res.data;
  },

  getAllUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },

  getAllSlots: async () => {
    const res = await api.get('/pickup-slots');
    return res.data;
  },

  createSlot: async (slotData) => {
    const res = await api.post('/pickup-slots', slotData);
    return res.data;
  },

  updateSlot: async (id, slotData) => {
    const res = await api.put(`/pickup-slots/${id}`, slotData);
    return res.data;
  },

  deleteSlot: async (id) => {
    const res = await api.delete(`/pickup-slots/${id}`);
    return res.data;
  },

  getAllCoupons: async () => {
    const res = await api.get('/coupons');
    return res.data;
  },

  createCoupon: async (couponData) => {
    const res = await api.post('/coupons', couponData);
    return res.data;
  },

  updateCoupon: async (id, couponData) => {
    const res = await api.put(`/coupons/${id}`, couponData);
    return res.data;
  },

  deleteCoupon: async (id) => {
    const res = await api.delete(`/coupons/${id}`);
    return res.data;
  },

  getAllReviews: async () => {
    const res = await api.get('/reviews');
    return res.data;
  },

  getSettings: async () => {
    const res = await api.get('/admin/settings');
    return res.data;
  },

  updateSettings: async (settings) => {
    const res = await api.put('/admin/settings', settings);
    return res.data;
  },

  advanceDemoOrderStatus: async (orderId) => {
    const res = await api.post(`/admin/demo/advance/${orderId}`);
    return res.data;
  },

  simulateNewOrder: async (role = 'STUDENT') => {
    const res = await api.post(`/admin/demo/simulate-order?role=${role}`);
    return res.data;
  },
};

export default adminService;

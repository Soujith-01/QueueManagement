import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    const res = await api.post('/orders', orderData);
    return res.data;
  },

  getOrderById: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },

  getMyOrders: async () => {
    const res = await api.get('/orders/user/me');
    return res.data;
  },

  getUserOrders: async () => {
    const res = await api.get('/orders/user/me');
    return res.data;
  },

  getActiveOrders: async () => {
    const res = await api.get('/orders/user/active');
    return res.data;
  },

  getKitchenOrders: async () => {
    const res = await api.get('/orders/kitchen/active');
    return res.data;
  },

  getAllOrders: async () => {
    const res = await api.get('/orders');
    return res.data;
  },

  updateOrderStatus: async (id, status, reason = '') => {
    const res = await api.put(`/orders/${id}/status`, { status, reason });
    return res.data;
  },

  cancelOrder: async (id, reason) => {
    const res = await api.post(`/orders/${id}/cancel`, { reason });
    return res.data;
  },

  lookupByQr: async (qrIdentifier) => {
    const res = await api.get(`/orders/lookup/qr?qrIdentifier=${encodeURIComponent(qrIdentifier)}`);
    return res.data;
  },

  lookupByToken: async (tokenNumber, date) => {
    const query = date ? `?tokenNumber=${encodeURIComponent(tokenNumber)}&date=${date}` : `?tokenNumber=${encodeURIComponent(tokenNumber)}`;
    const res = await api.get(`/orders/lookup/token${query}`);
    return res.data;
  },

  verifyQr: async (qrIdentifier) => {
    const res = await api.post(`/orders/verify/qr?qrIdentifier=${encodeURIComponent(qrIdentifier)}`);
    return res.data;
  },

  verifyQrCode: async (qrIdentifier) => {
    const res = await api.post(`/orders/verify/qr?qrIdentifier=${encodeURIComponent(qrIdentifier)}`);
    return res.data;
  },

  verifyToken: async (tokenNumber, date) => {
    const query = date ? `?tokenNumber=${tokenNumber}&date=${date}` : `?tokenNumber=${tokenNumber}`;
    const res = await api.post(`/orders/verify/token${query}`);
    return res.data;
  },

  getPickupSlots: async (date) => {
    const query = date ? `?date=${date}` : '';
    const res = await api.get(`/pickup-slots${query}`);
    return res.data;
  },

  applyCoupon: async (code, subtotal) => {
    const res = await api.post('/coupons/apply', { code, subtotal });
    return res.data;
  },

  getActiveCoupons: async () => {
    const res = await api.get('/coupons/active');
    return res.data;
  },

  submitReview: async (reviewData) => {
    const res = await api.post('/reviews', reviewData);
    return res.data;
  },

  getFoodReviews: async (foodId) => {
    const res = await api.get(`/reviews/food/${foodId}`);
    return res.data;
  },
};

export default orderService;

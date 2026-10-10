import api from './api';

export const foodService = {
  getFoods: async (params = {}) => {
    const res = await api.get('/foods', { params });
    return res.data;
  },

  getAllFoods: async (params = {}) => {
    const res = await api.get('/foods', { params });
    return res.data;
  },

  getPopularFoods: async () => {
    const res = await api.get('/foods/popular');
    return res.data;
  },

  getFoodById: async (id) => {
    const res = await api.get(`/foods/${id}`);
    return res.data;
  },

  getCategories: async () => {
    const res = await api.get('/categories');
    return res.data;
  },

  getAllCategories: async () => {
    const res = await api.get('/categories');
    return res.data;
  },

  createCategory: async (categoryData) => {
    const res = await api.post('/categories', categoryData);
    return res.data;
  },

  updateCategory: async (id, categoryData) => {
    const res = await api.put(`/categories/${id}`, categoryData);
    return res.data;
  },

  deleteCategory: async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  },

  createFood: async (foodData) => {
    const res = await api.post('/foods', foodData);
    return res.data;
  },

  updateFood: async (id, foodData) => {
    const res = await api.put(`/foods/${id}`, foodData);
    return res.data;
  },

  deleteFood: async (id) => {
    const res = await api.delete(`/foods/${id}`);
    return res.data;
  },

  updateStock: async (foodId, stock) => {
    const res = await api.put(`/inventory/${foodId}/stock?stock=${stock}`);
    return res.data;
  },

  toggleAvailability: async (foodId) => {
    const res = await api.put(`/inventory/${foodId}/toggle`);
    return res.data;
  },
};

export default foodService;

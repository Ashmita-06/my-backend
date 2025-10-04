import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

export const emissionsAPI = {
  getEmissions: (params) => api.get('/emissions', { params }),
  getRealtime: (plantId) => api.get('/emissions/realtime', { params: { plantId } }),
  getAnalytics: (params) => api.get('/emissions/analytics', { params }),
  getTrends: (params) => api.get('/emissions/trends', { params }),
  createEmission: (data) => api.post('/emissions', data),
  updateEmission: (id, data) => api.put(`/emissions/${id}`, data),
  deleteEmission: (id) => api.delete(`/emissions/${id}`),
};

export const optimizationAPI = {
  getOptimizations: (params) => api.get('/optimization', { params }),
  getOptimization: (id) => api.get(`/optimization/${id}`),
  createOptimization: (data) => api.post('/optimization', data),
  updateOptimization: (id, data) => api.put(`/optimization/${id}`, data),
  updateStatus: (id, status) => api.patch(`/optimization/${id}/status`, status),
  getAIRecommendations: (data) => api.post('/optimization/ai-recommendations', data),
  getAnalytics: (params) => api.get('/optimization/analytics/summary', { params }),
};

export const chatbotAPI = {
  chat: (data) => api.post('/chatbot/chat', data),
  getSuggestions: (plantId) => api.get('/chatbot/suggestions', { params: { plantId } }),
  getFAQ: () => api.get('/chatbot/faq'),
};

export const analyticsAPI = {
  getDashboard: (params) => api.get('/analytics/dashboard', { params }),
  getTrends: (params) => api.get('/analytics/trends', { params }),
  getComparative: (params) => api.get('/analytics/comparative', { params }),
  getCostBenefit: (params) => api.get('/analytics/cost-benefit', { params }),
};

export const costReductionAPI = {
  getOpportunities: (params) => api.get('/cost-reduction/opportunities', { params }),
  getAnalysis: (params) => api.get('/cost-reduction/analysis', { params }),
  getFuelOptimization: (plantId) => api.get('/cost-reduction/fuel-optimization', { params: { plantId } }),
  getMaintenanceOptimization: (plantId) => api.get('/cost-reduction/maintenance-optimization', { params: { plantId } }),
  getCarbonTaxOptimization: (plantId) => api.get('/cost-reduction/carbon-tax-optimization', { params: { plantId } }),
};

export default api;

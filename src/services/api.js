// frontend/src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://economy-dcpb.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken') || localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

// User Auth API calls
export const userLogin = async (email, password) => {
  const response = await api.post('/api/users/auth/login', { email, password });
  const data = response.data;

  localStorage.removeItem('userToken');
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');

  localStorage.setItem('userAuthToken', data.token);
  localStorage.setItem('userId', data.user.id);
  localStorage.setItem('userRole', data.user.role);
  localStorage.setItem('userName', data.user.name);

  return data;
};

export const userLogout = () => {
  localStorage.removeItem('userAuthToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
};

export const userRegister = async (name, email, password) => {
  const response = await api.post('/api/users/auth/register', { name, email, password });
  return response.data;
};

// News API calls
export const getNews = async (params) => {
  const response = await api.get('/api/news', { params });
  return response.data;
};

export const getNewsById = async (id) => {
  const response = await api.get(`/api/news/${id}`);
  return response.data;
};

export const createNews = async (newsData) => {
  const response = await api.post('/api/news', newsData);
  return response.data;
};

export const updateNews = async (id, newsData) => {
  const response = await api.put(`/api/news/${id}`, newsData);
  return response.data;
};

export const deleteNews = async (id) => {
  const response = await api.delete(`/api/news/${id}`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/api/news/dashboard/stats');
  return response.data;
};

export const getPublishedNews = async (params) => {
  const response = await api.get('/api/news/published', { params });
  return response.data;
};

export const getPublishedNewsById = async (id) => {
  const response = await api.get(`/api/news/published/${id}`);
  return response.data;
};

// Market Data API
export const getMarketData = async (type) => {
  const response = await api.get(`/api/market/${type}`);
  return response.data;
};

export const createMarketItem = async (type, data) => {
  const response = await api.post(`/api/market/${type}`, data);
  return response.data;
};

export const updateMarketItem = async (type, id, data) => {
  const response = await api.put(`/api/market/${type}/${id}`, data);
  return response.data;
};

export const deleteMarketItem = async (type, id) => {
  const response = await api.delete(`/api/market/${type}/${id}`);
  return response.data;
};

export const seedMarketData = async (type, items) => {
  const response = await api.post(`/api/market/${type}/seed`, { items });
  return response.data;
};

export const publishMarketNewData = async (type, id, payload) => {
  const { data } = await api.put(`/api/market/${type}/${id}/new-data`, payload);
  return data;
};

// ─── Admin API ──────────────────────────────────────────────────────────────

// Users
export const adminGetUsers = async (params) => {
  const response = await api.get('/api/admin/users', { params });
  return response.data;
};

export const adminGetUserDetail = async (userId) => {
  const response = await api.get(`/api/admin/users/${userId}`);
  return response.data;
};

// Conversations (all comments with source context)
export const adminGetConversations = async (params) => {
  const response = await api.get('/api/admin/conversations', { params });
  return response.data;
};

// News history (all articles, all statuses)
export const adminGetNewsHistory = async (params) => {
  const response = await api.get('/api/admin/news-history', { params });
  return response.data;
};

// Market history (live + archived)
export const adminGetMarketHistory = async (params) => {
  const response = await api.get('/api/admin/market-history', { params });
  return response.data;
};

export default api;
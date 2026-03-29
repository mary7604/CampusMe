import axios from 'axios';
import API_CONFIG from '../config/api.config';
import { getToken } from '../services/storageService';

// Instance Axios centrale — utilisée par tous les fichiers API
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur — ajoute automatiquement le JWT à chaque requête
axiosInstance.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur — gère les erreurs globales
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Token expiré — rediriger vers Login');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

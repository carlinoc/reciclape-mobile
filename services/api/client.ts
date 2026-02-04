// src/services/api/client.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../../src/navigation/api.config';

const client = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a todas las peticiones
client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('📤 API Request:', {
      method: config.method,
      url: config.url,
      data: config.data,
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
client.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });

    // Si es error 401 (no autorizado), limpiar sesión
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['authToken', 'userId', 'userData']);
    }

    return Promise.reject(error);
  }
);

export const setAuthToken = async (token: string) => {
  await AsyncStorage.setItem('authToken', token);
};

export const clearAuthToken = async () => {
  await AsyncStorage.removeItem('authToken');
};

export const hasValidToken = async (): Promise<boolean> => {
  const token = await AsyncStorage.getItem('authToken');
  return token !== null;
};

export default client;
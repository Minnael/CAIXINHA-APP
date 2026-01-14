import axios from 'axios';
import API_CONFIG from '../config/api';
import { getToken, clearAuth } from './storage';

/**
 * Instância configurada do Axios para requisições autenticadas à API principal
 */
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de requisição: adiciona token JWT automaticamente
 */
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de resposta: trata erros globalmente
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado - limpa autenticação
      await clearAuth();
      // Emite evento para redirecionar ao login
      // (será capturado pelo AuthContext)
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

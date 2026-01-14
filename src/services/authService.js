import axios from 'axios';
import API_CONFIG from '../config/api';
import { saveToken, saveUser } from './storage';

/**
 * Serviço de Autenticação integrado com microserviço Node.js
 * Endpoints: http://localhost:3000/api
 */
class AuthService {
  
  /**
   * Registra novo usuário
   * @param {string} login - Login do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<Object>} Dados do usuário criado
   */
  async register(login, password) {
    try {
      const response = await axios.post(
        `${API_CONFIG.AUTH_API}/register`,
        { login, password },
        { timeout: API_CONFIG.TIMEOUT }
      );
      
      return response.data; // { id, login }
    } catch (error) {
      this._handleError(error, 'Erro ao registrar usuário');
    }
  }

  /**
   * Realiza login e armazena token
   * @param {string} login - Login do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<Object>} Dados do usuário autenticado
   */
  async login(login, password) {
    try {
      const response = await axios.post(
        `${API_CONFIG.AUTH_API}/login`,
        { login, password },
        { timeout: API_CONFIG.TIMEOUT }
      );
      
      const { perfil, accessToken } = response.data;
      
      // Armazena token e dados do usuário de forma segura
      await saveToken(accessToken);
      await saveUser(perfil);
      
      return perfil; // { id, login }
    } catch (error) {
      this._handleError(error, 'Erro ao fazer login');
    }
  }

  /**
   * Trata erros de requisição de forma padronizada
   */
  _handleError(error, defaultMessage) {
    if (error.response) {
      // Servidor respondeu com status de erro
      const { status, data } = error.response;
      
      if (status === 400 && data.message) {
        throw new Error(data.message);
      }
      
      if (status === 401) {
        throw new Error('Login ou senha inválidos');
      }
      
      if (status === 500) {
        throw new Error('Erro no servidor. Tente novamente mais tarde.');
      }
      
      throw new Error(data.message || defaultMessage);
    } else if (error.request) {
      // Requisição feita mas sem resposta
      throw new Error('Servidor não está respondendo. Verifique sua conexão.');
    } else {
      // Erro na configuração da requisição
      throw new Error(error.message || defaultMessage);
    }
  }
}

export default new AuthService();

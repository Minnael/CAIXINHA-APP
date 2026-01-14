/**
 * Configuração centralizada da API
 * Define as URLs base para autenticação e API principal
 */

// ⚠️ CONFIGURAÇÃO ATUALIZADA PARA SEU IP LOCAL
// Use localhost apenas para emulador Android/iOS
// Para dispositivo físico, use o IP da sua máquina: 192.168.1.102
const API_BASE_URL = 'http://192.168.1.102:8080';
const AUTH_BASE_URL = 'http://192.168.1.102:3000';

export const API_CONFIG = {
  // Microserviço de Autenticação (Node.js)
  AUTH_API: `${AUTH_BASE_URL}/api`,
  
  // API Principal (Spring Boot)
  BASE_URL: API_BASE_URL,
  CATEGORIAS_URL: `${API_BASE_URL}/api/categorias`,
  GASTOS_URL: `${API_BASE_URL}/api/gastos`,
  
  // Configurações de timeout
  TIMEOUT: 10000, // 10 segundos
};

export default API_CONFIG;

import * as SecureStore from 'expo-secure-store';

/**
 * Chaves para armazenamento seguro
 */
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
};

/**
 * Armazena o token JWT de forma segura
 */
export const saveToken = async (token) => {
  try {
    await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token);
  } catch (error) {
    console.error('Erro ao salvar token:', error);
    throw error;
  }
};

/**
 * Recupera o token JWT armazenado
 */
export const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Erro ao recuperar token:', error);
    return null;
  }
};

/**
 * Armazena dados do usuário
 */
export const saveUser = async (user) => {
  try {
    await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    throw error;
  }
};

/**
 * Recupera dados do usuário armazenado
 */
export const getUser = async () => {
  try {
    const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Erro ao recuperar usuário:', error);
    return null;
  }
};

/**
 * Limpa todos os dados de autenticação
 */
export const clearAuth = async () => {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Erro ao limpar autenticação:', error);
    throw error;
  }
};

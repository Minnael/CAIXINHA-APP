import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { getToken, getUser, clearAuth } from '../services/storage';

/**
 * Context para gerenciamento de autenticação global
 */
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Carrega dados de autenticação ao iniciar o app
   */
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await getToken();
      const userData = await getUser();
      
      if (token && userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erro ao carregar autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Realiza login do usuário
   */
  const login = async (username, password) => {
    try {
      const userData = await authService.login(username, password);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Registra novo usuário
   */
  const register = async (username, password) => {
    try {
      await authService.register(username, password);
      // Após registro, faz login automaticamente
      return await login(username, password);
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Realiza logout do usuário
   */
  const logout = async () => {
    try {
      await clearAuth();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para acessar o contexto de autenticação
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  
  return context;
};

export default AuthContext;

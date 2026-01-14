import React, { createContext, useState, useContext, useCallback } from 'react';
import categoriaService from '../services/categoriaService';

/**
 * Context para gerenciamento de categorias
 */
const CategoriaContext = createContext({});

export const CategoriaProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Carrega todas as categorias do usuário
   */
  const carregarCategorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await categoriaService.listarTodas();
      setCategorias(data);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca categoria por ID com gastos
   */
  const buscarCategoria = useCallback(async (id) => {
    try {
      const data = await categoriaService.buscarPorId(id);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Cria nova categoria
   */
  const criarCategoria = useCallback(async (categoriaData) => {
    try {
      const data = await categoriaService.criar(categoriaData);
      // Adiciona na lista local
      setCategorias(prev => [...prev, data]);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Atualiza categoria existente
   */
  const atualizarCategoria = useCallback(async (id, categoriaData) => {
    try {
      const data = await categoriaService.atualizar(id, categoriaData);
      // Atualiza na lista local
      setCategorias(prev => 
        prev.map(cat => cat.id === id ? data : cat)
      );
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Deleta categoria
   */
  const deletarCategoria = useCallback(async (id) => {
    try {
      await categoriaService.deletar(id);
      // Remove da lista local
      setCategorias(prev => prev.filter(cat => cat.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  return (
    <CategoriaContext.Provider
      value={{
        categorias,
        loading,
        error,
        carregarCategorias,
        buscarCategoria,
        criarCategoria,
        atualizarCategoria,
        deletarCategoria,
      }}
    >
      {children}
    </CategoriaContext.Provider>
  );
};

/**
 * Hook para acessar o contexto de categorias
 */
export const useCategorias = () => {
  const context = useContext(CategoriaContext);
  
  if (!context) {
    throw new Error('useCategorias deve ser usado dentro de CategoriaProvider');
  }
  
  return context;
};

export default CategoriaContext;

import React, { createContext, useState, useContext, useCallback } from 'react';
import gastoService from '../services/gastoService';

/**
 * Context para gerenciamento de gastos
 */
const GastoContext = createContext({});

export const GastoProvider = ({ children }) => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Carrega todos os gastos do usuário
   */
  const carregarGastos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await gastoService.listarTodos();
      setGastos(data);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carrega gastos de uma categoria específica
   */
  const carregarGastosPorCategoria = useCallback(async (categoriaId) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await gastoService.listarPorCategoria(categoriaId);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca gasto por ID
   */
  const buscarGasto = useCallback(async (id) => {
    try {
      const data = await gastoService.buscarPorId(id);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Cria novo gasto
   */
  const criarGasto = useCallback(async (gastoData) => {
    try {
      const data = await gastoService.criar(gastoData);
      // Adiciona na lista local
      setGastos(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Atualiza gasto existente
   */
  const atualizarGasto = useCallback(async (id, gastoData) => {
    try {
      const data = await gastoService.atualizar(id, gastoData);
      // Atualiza na lista local
      setGastos(prev => 
        prev.map(gasto => gasto.id === id ? data : gasto)
      );
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Deleta gasto
   */
  const deletarGasto = useCallback(async (id) => {
    try {
      await gastoService.deletar(id);
      // Remove da lista local
      setGastos(prev => prev.filter(gasto => gasto.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  return (
    <GastoContext.Provider
      value={{
        gastos,
        loading,
        error,
        carregarGastos,
        carregarGastosPorCategoria,
        buscarGasto,
        criarGasto,
        atualizarGasto,
        deletarGasto,
      }}
    >
      {children}
    </GastoContext.Provider>
  );
};

/**
 * Hook para acessar o contexto de gastos
 */
export const useGastos = () => {
  const context = useContext(GastoContext);
  
  if (!context) {
    throw new Error('useGastos deve ser usado dentro de GastoProvider');
  }
  
  return context;
};

export default GastoContext;

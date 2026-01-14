import apiClient from './apiClient';

/**
 * Serviço de Gastos integrado com Spring Boot API
 * Endpoints: http://localhost:8080/api/gastos
 * Todas as requisições incluem automaticamente o Bearer token
 */
class GastoService {
  
  /**
   * Lista todos os gastos do usuário autenticado
   * @returns {Promise<Array>} Lista de gastos
   */
  async listarTodos() {
    try {
      const response = await apiClient.get('/api/gastos');
      return response.data;
    } catch (error) {
      this._handleError(error, 'Erro ao listar gastos');
    }
  }

  /**
   * Lista gastos de uma categoria específica
   * @param {string} categoriaId - ID da categoria
   * @returns {Promise<Array>} Lista de gastos da categoria
   */
  async listarPorCategoria(categoriaId) {
    try {
      const response = await apiClient.get(`/api/gastos/categoria/${categoriaId}`);
      return response.data;
    } catch (error) {
      this._handleError(error, 'Erro ao listar gastos da categoria');
    }
  }

  /**
   * Busca um gasto por ID
   * @param {string} id - ID do gasto
   * @returns {Promise<Object>} Dados do gasto
   */
  async buscarPorId(id) {
    try {
      const response = await apiClient.get(`/api/gastos/${id}`);
      return response.data;
    } catch (error) {
      this._handleError(error, 'Erro ao buscar gasto');
    }
  }

  /**
   * Cria novo gasto
   * @param {Object} gastoData - Dados do gasto
   * @param {string} gastoData.nome - Nome do gasto (obrigatório)
   * @param {string} gastoData.descricao - Descrição (opcional)
   * @param {number} gastoData.valor - Valor do gasto (obrigatório)
   * @param {string} gastoData.categoriaId - ID da categoria (obrigatório)
   * @returns {Promise<Object>} Gasto criado
   */
  async criar(gastoData) {
    try {
      const response = await apiClient.post('/api/gastos', gastoData);
      return response.data;
    } catch (error) {
      this._handleError(error, 'Erro ao criar gasto');
    }
  }

  /**
   * Atualiza gasto existente
   * @param {string} id - ID do gasto
   * @param {Object} gastoData - Dados atualizados
   * @returns {Promise<Object>} Gasto atualizado
   */
  async atualizar(id, gastoData) {
    try {
      const response = await apiClient.put(`/api/gastos/${id}`, gastoData);
      return response.data;
    } catch (error) {
      this._handleError(error, 'Erro ao atualizar gasto');
    }
  }

  /**
   * Deleta gasto
   * @param {string} id - ID do gasto
   * @returns {Promise<void>}
   */
  async deletar(id) {
    try {
      await apiClient.delete(`/api/gastos/${id}`);
    } catch (error) {
      this._handleError(error, 'Erro ao deletar gasto');
    }
  }

  /**
   * Trata erros de requisição de forma padronizada
   */
  _handleError(error, defaultMessage) {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 400 && data.message) {
        throw new Error(data.message);
      }
      
      if (status === 404) {
        throw new Error('Gasto não encontrado');
      }
      
      if (status === 401) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      
      throw new Error(data.message || defaultMessage);
    } else if (error.request) {
      throw new Error('Servidor não está respondendo. Verifique sua conexão.');
    } else {
      throw new Error(error.message || defaultMessage);
    }
  }
}

export default new GastoService();

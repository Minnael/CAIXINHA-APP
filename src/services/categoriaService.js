import apiClient from './apiClient';

/**
 * Serviço de Categorias integrado com Spring Boot API
 * Endpoints: http://localhost:8080/api/categorias
 * Todas as requisições incluem automaticamente o Bearer token
 */
class CategoriaService {
  
  /**
   * Lista todas as categorias do usuário autenticado
   * @returns {Promise<Array>} Lista de categorias
   */
  async listarTodas() {
    try {
      const response = await apiClient.get('/api/categorias');
      return response.data;
    } catch (error) {
      this._handleError(error, 'Erro ao listar categorias');
    }
  }

  /**
   * Busca uma categoria por ID com seus gastos
   * @param {string} id - ID da categoria
   * @returns {Promise<Object>} Dados da categoria com gastos
   */
  async buscarPorId(id) {
    try {
      const response = await apiClient.get(`/api/categorias/${id}`);
      return response.data;
    } catch (error) {
      this._handleError(error, 'Erro ao buscar categoria');
    }
  }

  /**
   * Cria nova categoria
   * @param {Object} categoriaData - Dados da categoria
   * @param {string} categoriaData.nome - Nome da categoria (obrigatório)
   * @param {string} categoriaData.icone - Ícone da categoria (opcional)
   * @param {string} categoriaData.descricao - Descrição (opcional)
   * @param {number} categoriaData.gastoMensal - Meta mensal (opcional)
   * @returns {Promise<Object>} Categoria criada
   */
  async criar(categoriaData) {
    try {
      const response = await apiClient.post('/api/categorias', categoriaData);
      return response.data;
    } catch (error) {
      this._handleError(error, 'Erro ao criar categoria');
    }
  }

  /**
   * Atualiza categoria existente
   * @param {string} id - ID da categoria
   * @param {Object} categoriaData - Dados atualizados
   * @returns {Promise<Object>} Categoria atualizada
   */
  async atualizar(id, categoriaData) {
    try {
      const response = await apiClient.put(`/api/categorias/${id}`, categoriaData);
      return response.data;
    } catch (error) {
      this._handleError(error, 'Erro ao atualizar categoria');
    }
  }

  /**
   * Deleta categoria (apenas se não houver gastos vinculados)
   * @param {string} id - ID da categoria
   * @returns {Promise<void>}
   */
  async deletar(id) {
    try {
      await apiClient.delete(`/api/categorias/${id}`);
    } catch (error) {
      this._handleError(error, 'Erro ao deletar categoria');
    }
  }

  /**
   * Trata erros de requisição de forma padronizada
   */
  _handleError(error, defaultMessage) {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 400 && data.message) {
        // Erro de validação ou regra de negócio
        throw new Error(data.message);
      }
      
      if (status === 404) {
        throw new Error('Categoria não encontrada');
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

export default new CategoriaService();

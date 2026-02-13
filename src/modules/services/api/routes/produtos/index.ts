import { api } from "../../axios";

interface IProdutoToCreate {
  nome: string;
  preco: string | number;
  descricao: string;
  quantidade: string | number;
  id_categoria: string;
  imagemproduto: File | null;
  status?: string;
}

interface IProdutoToEdit {
  nome?: string;
  preco?: string | number;
  descricao?: string;
  quantidade?: string | number;
  id_categoria?: string;
  imagemproduto?: File | null;
  status?: string;
}

interface ProdutoResponse {
   success: boolean;
    data: IProduto[];
    total: number;
}

interface IProduto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  precoDesconto?: number;
  quantidade: number;
  status: string;
  emDestaque: boolean;
  id_categoria: string;
  sku: string;
  criadoEm: string;
  atualizadoEm: string;
  categoria?: {
    id: string;
    nome: string;
  };
  imagemproduto?: Array<{
    id: string;
    filename: string;
    url: string;
    textoAlt: string;
    principal: boolean;
  }>;
}

class ProdutosRoute {

  async getProdutos() {
      const response = await api.get<ProdutoResponse>("/produtos/get");
      return response.data.data;
  }

  async criarProduto(produto: IProdutoToCreate) {

    const formData = new FormData();
    formData.append("nome", produto.nome.trim());
    formData.append("preco", produto.preco.toString());
    formData.append("descricao", produto.descricao?.trim() ?? "");
    formData.append("quantidade", produto.quantidade.toString());
    formData.append("id_categoria", produto.id_categoria);
    
    if (produto.status) {
      formData.append("status", produto.status);
    } else {
      formData.append("status", "ACTIVO");
    }

    if (produto.imagemproduto && produto.imagemproduto instanceof File) {
      formData.append("imagemproduto", produto.imagemproduto);
    } else if (produto.imagemproduto) {
      console.warn('⚠️  Imagem não é um arquivo válido');
    }

    try {
      const response = await api.post("/produtos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;

    } catch (error: any) {
      console.error('❌ Erro ao criar produto:', error);
      
      // Log detalhado do erro
      if (error.response) {
        console.error('📥 Resposta do servidor:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        // Erro específico 401 (Unauthorized)
        if (error.response.status === 401) {
          throw new Error("Sessão expirada. Faça login novamente.");
        }
        
        // Erro específico 400 (Bad Request)
        if (error.response.status === 400) {
          const serverMessage = error.response.data?.message || 
                               error.response.data?.error || 
                               "Dados inválidos";
          throw new Error(`Erro: ${serverMessage}`);
        }
        
        // Timeout ou outros erros
        if (error.response.status === 408 || error.response.status === 504) {
          throw new Error("Tempo limite excedido. Verifique sua conexão ou tente com uma imagem menor.");
        }
        
        throw new Error(error.response.data?.message || "Erro ao criar produto");
      }
      
      // Se não tiver resposta (erro de rede)
      if (error.request) {
        console.error('🌐 Erro de rede:', error.request);
        throw new Error("Erro de conexão com o servidor. Verifique sua internet.");
      }
      
      throw new Error(error.message || "Erro desconhecido ao criar produto");
    }
  }

  async getById(id: string) {
    try {
      const response = await api.get<IProduto>(`/produtos/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao buscar produto ${id}:`, error);
      throw new Error(error.response?.data?.message || "Erro ao buscar produto");
    }
  }

  async atualizarProduto(id: string, produto: IProdutoToEdit) {
    try {
      // Se tiver imagem, usar FormData
      if (produto.imagemproduto && produto.imagemproduto instanceof File) {
        const formData = new FormData();
        
        if (produto.nome) formData.append("nome", produto.nome.trim());
        if (produto.preco) formData.append("preco", produto.preco.toString());
        if (produto.descricao) formData.append("descricao", produto.descricao.trim());
        if (produto.quantidade) formData.append("quantidade", produto.quantidade.toString());
        if (produto.id_categoria) formData.append("id_categoria", produto.id_categoria);
        if (produto.status) formData.append("status", produto.status);
        
        formData.append("imagemproduto", produto.imagemproduto);

        const { data } = await api.put(`/produtos/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return data;
      } else {
        // Sem imagem, enviar JSON normal
        const { data } = await api.put(`/produtos/${id}`, produto);
        return data;
      }
    } catch (error: any) {
      console.error(`❌ Erro ao atualizar produto ${id}:`, error);
      
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      
      throw new Error(error.response?.data?.message || "Erro ao atualizar produto");
    }
  }

  async deletarProduto(id: string, userId: string) {
    try {
      const response = await api.delete(`/produtos/${id}`, {
        data: { userId }
      });
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao deletar produto ${id}:`, error);
      
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      
      if (error.response?.status === 400) {
        throw new Error("Não é possível deletar este produto pois está em uso.");
      }
      
      throw new Error(error.response?.data?.message || "Erro ao deletar produto");
    }
  }

  async getEstatisticas() {
    try {
      const response = await api.get("/produtos/estatisticas");
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      throw new Error("Erro ao carregar estatísticas");
    }
  }

  async getPorCategoria(categoriaId: string) {
    try {
      const response = await api.get(`/produtos?categoria=${categoriaId}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao buscar produtos da categoria ${categoriaId}:`, error);
      throw new Error("Erro ao carregar produtos");
    }
  }

  // Método adicional para listar produtos com filtros
  async listarProdutos(filtros?: {
    page?: number;
    limit?: number;
    busca?: string;
    categoria?: string;
    status?: string;
    ordenar?: string;
  }) {
    try {
      const params = new URLSearchParams();
      
      if (filtros?.page) params.append('page', filtros.page.toString());
      if (filtros?.limit) params.append('limit', filtros.limit.toString());
      if (filtros?.busca) params.append('busca', filtros.busca);
      if (filtros?.categoria) params.append('categoria', filtros.categoria);
      if (filtros?.status) params.append('status', filtros.status);
      if (filtros?.ordenar) params.append('ordenar', filtros.ordenar);

      const url = `/produtos${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao listar produtos:', error);
      throw new Error("Erro ao carregar produtos");
    }
  }
}

export const produtosRoute = new ProdutosRoute();
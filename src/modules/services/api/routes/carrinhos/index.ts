// src/services/carrinhos.service.ts
import { api } from "../../axios";

interface IItemCarrinho {
  id: string;
  produtoId: string;
  quantidade: number;
  preco: number;
  subtotal: number;
  produto: {
    id: string;
    nome: string;
    preco: number;
    precoDesconto?: number;
    quantidadeEstoque: number;
    imagem?: string;
    imagemAlt?: string;
  };
}

interface ICarrinho {
  id: string;
  usuarioId: string;
  criadoEm: string;
  atualizadoEm: string;
  itens: IItemCarrinho[];
  totalItens: number;
  subtotal: number;
  desconto: number;
  total: number;
}

interface IRespostaCarrinho {
  success: boolean;
  data?: ICarrinho;
  message?: string;
}

class CarrinhosRoute {
  // Obter carrinho do usuário autenticado
  async getCarrinho(): Promise<IRespostaCarrinho> {
    try {
      const response = await api.get("/carrinho");
      return response.data;
    } catch (error: any) {
      console.error('❌ [Frontend] Erro ao obter carrinho:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      // Em caso de erro, retornar carrinho vazio
      return {
        success: true,
        data: {
          id: '',
          usuarioId: '',
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString(),
          itens: [],
          totalItens: 0,
          subtotal: 0,
          desconto: 0,
          total: 0
        }
      };
    }
  }

  // Adicionar item ao carrinho
  async adicionarItem(produtoId: string, quantidade: number = 1): Promise<IRespostaCarrinho> {
    try {
      console.log(`➕ [Frontend] Adicionando produto ${produtoId} (quantidade: ${quantidade}) ao carrinho`);
      
      if (!produtoId) {
        return {
          success: false,
          message: "ID do produto é obrigatório"
        };
      }
      
      if (!quantidade || quantidade < 1) {
        return {
          success: false,
          message: "Quantidade deve ser maior que zero"
        };
      }

      const response = await api.post("/carrinho/item", {
        produtoId,
        quantidade
      });
    
      
      return response.data;
    } catch (error: any) {
      console.error('❌ [Frontend] Erro ao adicionar item ao carrinho:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Produto não encontrado"
        };
      }
      
      if (error.response?.status === 422) {
        return {
          success: false,
          message: "Quantidade solicitada maior que o estoque disponível"
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao adicionar item ao carrinho"
      };
    }
  }

  // Atualizar quantidade de um item no carrinho
  async atualizarItem(produtoId: string, quantidade: number): Promise<IRespostaCarrinho> {
    try {
      console.log(`✏️ [Frontend] Atualizando item ${produtoId} para quantidade: ${quantidade}`);
      
      if (!produtoId) {
        return {
          success: false,
          message: "ID do produto é obrigatório"
        };
      }
      
      if (quantidade < 0) {
        return {
          success: false,
          message: "Quantidade não pode ser negativa"
        };
      }

      // Se quantidade for 0, remove o item
      if (quantidade === 0) {
        return await this.removerItem(produtoId);
      }

      const response = await api.put(`/carrinho/item/${produtoId}`, { quantidade });
      console.log('✅ [Frontend] Item atualizado:', {
        success: response.data.success,
        totalItens: response.data.data?.totalItens || 0
      });
      return response.data;
    } catch (error: any) {
      console.error(`❌ [Frontend] Erro ao atualizar item ${produtoId} no carrinho:`, error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Item não encontrado no carrinho"
        };
      }
      
      if (error.response?.status === 422) {
        return {
          success: false,
          message: "Quantidade solicitada maior que o estoque disponível"
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao atualizar item no carrinho"
      };
    }
  }

  // Remover item do carrinho
  async removerItem(produtoId: string): Promise<IRespostaCarrinho> {
    try {
      console.log(`🗑️ [Frontend] Removendo item ${produtoId} do carrinho`);
      
      if (!produtoId) {
        return {
          success: false,
          message: "ID do produto é obrigatório"
        };
      }

      const response = await api.delete(`/carrinho/item/${produtoId}`);
      console.log('✅ [Frontend] Item removido:', {
        success: response.data.success,
        totalItens: response.data.data?.totalItens || 0
      });
      return response.data;
    } catch (error: any) {
      console.error(`❌ [Frontend] Erro ao remover item ${produtoId} do carrinho:`, error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Item não encontrado no carrinho"
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao remover item do carrinho"
      };
    }
  }

  // Limpar todo o carrinho
  async limparCarrinho(): Promise<IRespostaCarrinho> {
    try {
      console.log('🧹 [Frontend] Limpando carrinho');
      const response = await api.delete("/carrinho/limpar");
      console.log('✅ [Frontend] Carrinho limpo:', response.data.success);
      return response.data;
    } catch (error: any) {
      console.error('❌ [Frontend] Erro ao limpar carrinho:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao limpar carrinho"
      };
    }
  }

  // Obter quantidade total de itens no carrinho
  async getQuantidadeTotal(): Promise<{ success: boolean; quantidade: number; message?: string }> {
    try {
      console.log('🔢 [Frontend] Obtendo quantidade total do carrinho');
      const response = await api.get("/carrinho/quantidade");
      console.log('✅ [Frontend] Quantidade obtida:', response.data.quantidade);
      return response.data;
    } catch (error: any) {
      console.error('❌ [Frontend] Erro ao obter quantidade do carrinho:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          quantidade: 0,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      return {
        success: false,
        quantidade: 0,
        message: error.response?.data?.message || "Erro ao obter quantidade"
      };
    }
  }

  // Verificar disponibilidade dos itens no carrinho
  async verificarDisponibilidade(): Promise<{
    success: boolean;
    data?: {
      disponiveis: boolean;
      itensComProblema?: Array<{
        produtoId: string;
        produtoNome: string;
        quantidadeSolicitada: number;
        quantidadeDisponivel: number;
      }>;
    };
    message?: string;
  }> {
    try {
      const response = await api.get("/carrinho/verificar-disponibilidade");
      return response.data;
    } catch (error: any) {
      console.error('❌ [Frontend] Erro ao verificar disponibilidade do carrinho:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao verificar disponibilidade"
      };
    }
  }

  // Sincronizar carrinho local com o servidor
  async sincronizarCarrinho(itensLocal: Array<{produtoId: string, quantidade: number}>): Promise<IRespostaCarrinho> {
    try {
      const response = await api.post("/carrinho/sincronizar", { itens: itensLocal });
      return response.data;
    } catch (error: any) {
      console.error('❌ [Frontend] Erro ao sincronizar carrinho:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao sincronizar carrinho"
      };
    }
  }

  // Adicionar múltiplos itens de uma vez
  async adicionarMultiplosItens(itens: Array<{produtoId: string, quantidade: number}>): Promise<IRespostaCarrinho> {
    try {
      const response = await api.post("/carrinho/itens", { itens });
      return response.data;
    } catch (error: any) {
      console.error('❌ [Frontend] Erro ao adicionar múltiplos itens ao carrinho:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao adicionar itens"
      };
    }
  }
}

export const carrinhosRoute = new CarrinhosRoute();
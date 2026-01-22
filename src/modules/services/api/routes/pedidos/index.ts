// src/services/pedidos.service.ts
import { api } from "../../axios";

export interface IItemPedido {
  id: string;
  pedidoId: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
  criadoEm: string;
  produto?: {
    id: string;
    nome: string;
    sku: string;
    imagemproduto?: Array<{
      id: string;
      filename: string;
      url: string;
      textoAlt: string;
      principal: boolean;
    }>;
  };
}

export interface IEnderecoEntrega {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  referencia?: string;
}

export interface IPagamento {
  id: string;
  pedidoId: string;
  metodoPagamento: string;
  gatewayPagamento: string;
  valor: number;
  status: string;
  codigoTransacao?: string;
  dadosCartao?: {
    ultimosDigitos?: string;
    bandeira?: string;
  };
  criadoEm: string;
  atualizadoEm: string;
}

interface IPedido {
  id: string;
  numeroPedido: string;
  usuarioId: string;
  enderecoId?: string;
  status: string;
  subtotal: number;
  frete: number;
  imposto: number;
  desconto: number;
  total: number;
  metodoEnvio: string;
  codigoRastreamento?: string;
  observacoes?: string;
  criadoEm: string;
  atualizadoEm: string;
  itens: IItemPedido[];
  endereco?: IEnderecoEntrega;
  pagamentos?: IPagamento[];
  usuario?: {
    id: string;
    nome: string;
    email: string;
  };
}

interface IPedidoToCreate {
  enderecoId?:string;
  enderecoEntrega: IEnderecoEntrega;
  metodoPagamento: string;
  observacoes?: string;
  dadosCartao?: {
    numero: string;
    nome: string;
    validade: string;
    cvv: string;
  };
}

interface IListarPedidosParams {
  page?: number;
  limit?: number;
  status?: string;
  dataInicio?: string;
  dataFim?: string;
  ordenar?: 'criadoEm_desc' | 'criadoEm_asc' | 'total_desc' | 'total_asc';
}

export interface IPedidoResponse {
  success: boolean;
  data?: IPedido | IPedido[];
  message?: string;
  total?: number;
  page?: number;
  totalPages?: number;
}

class PedidosRoute {
  // Criar novo pedido
  async criarPedido(pedidoData: IPedidoToCreate): Promise<IPedidoResponse> {
    try {

       if (!pedidoData.enderecoId && !pedidoData.enderecoEntrega) {
      return {
        success: false,
        message: "É necessário fornecer um endereço (ID ou dados completos)"
      };
    }
      // Validações básicas
      if (!pedidoData.enderecoEntrega) {
        return {
          success: false,
          message: "Endereço de entrega é obrigatório"
        };
      }

      if (!pedidoData.metodoPagamento) {
        return {
          success: false,
          message: "Método de pagamento é obrigatório"
        };
      }

      // Validação do endereço
      const endereco = pedidoData.enderecoEntrega;
      const camposObrigatorios = ['nome', 'email', 'telefone', 'logradouro', 'numero', 'bairro', 'cidade', 'estado'];
      
      for (const campo of camposObrigatorios) {
        if (!endereco[campo as keyof IEnderecoEntrega]) {
          return {
            success: false,
            message: `Campo ${campo} do endereço é obrigatório`
          };
        }
      }

      // Validação do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(endereco.email)) {
        return {
          success: false,
          message: "E-mail inválido"
        };
      }

      // Validação do telefone
      const telefoneLimpo = endereco.telefone.replace(/\D/g, '');
      if (telefoneLimpo.length < 9) {
        return {
          success: false,
          message: "Telefone inválido"
        };
      }

      // Se for cartão, validar dados
      if (pedidoData.metodoPagamento === 'cartao' && pedidoData.dadosCartao) {
        const cartao = pedidoData.dadosCartao;
        if (!cartao.numero || cartao.numero.replace(/\D/g, '').length < 13) {
          return {
            success: false,
            message: "Número do cartão inválido"
          };
        }
        
        if (!cartao.nome) {
          return {
            success: false,
            message: "Nome no cartão é obrigatório"
          };
        }
        
        if (!cartao.validade || !/^\d{2}\/\d{2}$/.test(cartao.validade)) {
          return {
            success: false,
            message: "Validade do cartão inválida (use MM/AA)"
          };
        }
        
        if (!cartao.cvv || cartao.cvv.length < 3) {
          return {
            success: false,
            message: "CVV do cartão inválido"
          };
        }
      }

      const response = await api.post("/pedidos/criar", pedidoData);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar pedido:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      if (error.response?.status === 400) {
        const serverMessage = error.response.data?.message || 
                             error.response.data?.error || 
                             "Dados inválidos";
        return {
          success: false,
          message: `Erro: ${serverMessage}`
        };
      }
      
      if (error.response?.status === 422) {
        return {
          success: false,
          message: "Algum produto não está mais disponível na quantidade solicitada"
        };
      }
      
      if (error.response?.status === 409) {
        return {
          success: false,
          message: "Carrinho está vazio"
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao criar pedido"
      };
    }
  }

  // Listar pedidos do usuário
  async listarPedidos(params?: IListarPedidosParams): Promise<IPedidoResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.dataInicio) queryParams.append('dataInicio', params.dataInicio);
      if (params?.dataFim) queryParams.append('dataFim', params.dataFim);
      if (params?.ordenar) queryParams.append('ordenar', params.ordenar);

      const url = `/pedidos${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao listar pedidos:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao carregar pedidos"
      };
    }
  }

  // Buscar pedido por ID
  async getById(id: string): Promise<IPedidoResponse> {
    try {
      if (!id) {
        return {
          success: false,
          message: "ID do pedido é obrigatório"
        };
      }

      const response = await api.get(`/pedidos/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao buscar pedido ${id}:`, error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Pedido não encontrado"
        };
      }
      
      if (error.response?.status === 403) {
        return {
          success: false,
          message: "Você não tem permissão para ver este pedido"
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao buscar pedido"
      };
    }
  }

  // Buscar pedido por número do pedido
  async getByNumero(numeroPedido: string): Promise<IPedidoResponse> {
    try {
      if (!numeroPedido) {
        return {
          success: false,
          message: "Número do pedido é obrigatório"
        };
      }

      const response = await api.get(`/pedidos/numero/${numeroPedido}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao buscar pedido ${numeroPedido}:`, error);
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Pedido não encontrado"
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao buscar pedido"
      };
    }
  }

  // Cancelar pedido
  async cancelarPedido(id: string, motivo?: string): Promise<IPedidoResponse> {
    try {
      if (!id) {
        return {
          success: false,
          message: "ID do pedido é obrigatório"
        };
      }

      const response = await api.post(`/pedidos/${id}/cancelar`, { motivo });
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao cancelar pedido ${id}:`, error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Pedido não encontrado"
        };
      }
      
      if (error.response?.status === 403) {
        return {
          success: false,
          message: "Você não tem permissão para cancelar este pedido"
        };
      }
      
      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response.data?.message || "Este pedido não pode ser cancelado no status atual"
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao cancelar pedido"
      };
    }
  }

  // Atualizar status do pedido (admin)
  async atualizarStatus(id: string, status: string): Promise<IPedidoResponse> {
    try {
      if (!id) {
        return {
          success: false,
          message: "ID do pedido é obrigatório"
        };
      }

      if (!status) {
        return {
          success: false,
          message: "Status é obrigatório"
        };
      }

      const response = await api.patch(`/pedidos/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao atualizar status do pedido ${id}:`, error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      if (error.response?.status === 403) {
        return {
          success: false,
          message: "Você não tem permissão para atualizar pedidos"
        };
      }
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Pedido não encontrado"
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao atualizar status do pedido"
      };
    }
  }

  // Adicionar código de rastreamento (admin)
  async adicionarRastreamento(id: string, codigoRastreamento: string, transportadora?: string): Promise<IPedidoResponse> {
    try {
      if (!id) {
        return {
          success: false,
          message: "ID do pedido é obrigatório"
        };
      }

      if (!codigoRastreamento) {
        return {
          success: false,
          message: "Código de rastreamento é obrigatório"
        };
      }

      const response = await api.post(`/pedidos/${id}/rastreamento`, {
        codigoRastreamento,
        transportadora
      });
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao adicionar rastreamento ao pedido ${id}:`, error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      if (error.response?.status === 403) {
        return {
          success: false,
          message: "Você não tem permissão para atualizar pedidos"
        };
      }
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Pedido não encontrado"
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao adicionar rastreamento"
      };
    }
  }

  // Listar status disponíveis
  async listarStatusDisponiveis(): Promise<{
    success: boolean;
    data?: string[];
    message?: string;
  }> {
    try {
      const response = await api.get("/pedidos/status/disponiveis");
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao listar status disponíveis:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao carregar status"
      };
    }
  }

  // Buscar pedidos recentes
  async getRecentes(limite: number = 5): Promise<IPedidoResponse> {
    try {
      const response = await api.get(`/pedidos/recentes?limite=${limite}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar pedidos recentes:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao buscar pedidos recentes"
      };
    }
  }

  // Buscar resumo de pedidos (para dashboard)
  async getResumo(): Promise<{
    success: boolean;
    data?: {
      totalPedidos: number;
      pedidosHoje: number;
      valorTotal: number;
      pedidosPorStatus: Record<string, number>;
    };
    message?: string;
  }> {
    try {
      const response = await api.get("/pedidos/resumo");
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar resumo de pedidos:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao buscar resumo"
      };
    }
  }

  // Gerar fatura/recibo do pedido
  async gerarFatura(id: string): Promise<{
    success: boolean;
    data?: {
      pdfUrl: string;
      html: string;
    };
    message?: string;
  }> {
    try {
      if (!id) {
        return {
          success: false,
          message: "ID do pedido é obrigatório"
        };
      }

      const response = await api.get(`/pedidos/${id}/fatura`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao gerar fatura do pedido ${id}:`, error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Pedido não encontrado"
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao gerar fatura"
      };
    }
  }

  // Reordenar pedido (criar novo pedido com os mesmos itens)
  async reordenar(id: string): Promise<IPedidoResponse> {
    try {
      if (!id) {
        return {
          success: false,
          message: "ID do pedido é obrigatório"
        };
      }

      const response = await api.post(`/pedidos/${id}/reordenar`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao reordenar pedido ${id}:`, error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Pedido não encontrado"
        };
      }
      
      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response.data?.message || "Não foi possível reordenar este pedido"
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao reordenar pedido"
      };
    }
  }

  // Buscar histórico de status do pedido
  async getHistoricoStatus(id: string): Promise<{
    success: boolean;
    data?: Array<{
      status: string;
      alteradoEm: string;
      alteradoPor?: string;
      observacao?: string;
    }>;
    message?: string;
  }> {
    try {
      if (!id) {
        return {
          success: false,
          message: "ID do pedido é obrigatório"
        };
      }

      const response = await api.get(`/pedidos/${id}/historico`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao buscar histórico do pedido ${id}:`, error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Sessão expirada. Faça login novamente."
        };
      }
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Pedido não encontrado"
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao buscar histórico"
      };
    }
  }
}

export const pedidosRoute = new PedidosRoute();
// src/services/cupons.service.ts
import { api } from "../../axios";

interface ICupom {
  id: string;
  codigo: string;
  descricao: string;
  tipo: 'PORCENTAGEM' | 'VALOR_FIXO';
  valor: number;
  valorMinimo?: number;
  maximoUsos?: number;
  usado: number;
  ativo: boolean;
  validoAte: string;
  criadoEm: string;
  atualizadoEm: string;
  criadoPor?: {
    id: string;
    nome: string;
    email: string;
  };
}

interface ICupomToCreate {
  codigo: string;
  descricao: string;
  tipo: 'PORCENTAGEM' | 'VALOR_FIXO';
  valor: number;
  valorMinimo?: number;
  maximoUsos?: number;
  ativo?: boolean;
  validoAte: string;
}

interface ICupomToEdit {
  codigo?: string;
  descricao?: string;
  tipo?: 'PORCENTAGEM' | 'VALOR_FIXO';
  valor?: number;
  valorMinimo?: number;
  maximoUsos?: number;
  ativo?: boolean;
  validoAte?: string;
}

interface IVerificarCupomResponse {
  valido: boolean;
  cupom?: {
    id: string;
    codigo: string;
    descricao: string;
    tipo: 'PORCENTAGEM' | 'VALOR_FIXO';
    valor: number;
    valorMinimo?: number;
    descontoAplicado: number;
    mensagem: string;
  };
  message?: string;
}

class CuponsRoute {
  // Listar todos os cupons (admin)
  async listarCupons(filtros?: {
    ativo?: boolean;
    pagina?: number;
    limite?: number;
    busca?: string;
  }) {
    try {
      const params = new URLSearchParams();
      
      if (filtros?.ativo !== undefined) params.append('ativo', filtros.ativo.toString());
      if (filtros?.pagina) params.append('pagina', filtros.pagina.toString());
      if (filtros?.limite) params.append('limite', filtros.limite.toString());
      if (filtros?.busca) params.append('busca', filtros.busca);

      const url = `/cupons${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao listar cupons:', error);
      
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      
      if (error.response?.status === 403) {
        throw new Error("Você não tem permissão para acessar esta funcionalidade.");
      }
      
      throw new Error(error.response?.data?.message || "Erro ao carregar cupons");
    }
  }

  // Buscar cupom por ID
  async getById(id: string) {
    try {
      const response = await api.get<ICupom>(`/cupons/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao buscar cupom ${id}:`, error);
      
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      
      if (error.response?.status === 403) {
        throw new Error("Você não tem permissão para acessar esta funcionalidade.");
      }
      
      if (error.response?.status === 404) {
        throw new Error("Cupom não encontrado");
      }
      
      throw new Error(error.response?.data?.message || "Erro ao buscar cupom");
    }
  }

  // Criar novo cupom (admin)
  async criarCupom(cupom: ICupomToCreate) {
    try {
      // Validações básicas
      if (!cupom.codigo || !cupom.codigo.trim()) {
        throw new Error("Código do cupom é obrigatório");
      }
      
      if (!cupom.validoAte) {
        throw new Error("Data de validade é obrigatória");
      }
      
      const dados = {
        codigo: cupom.codigo.trim().toUpperCase(),
        descricao: cupom.descricao?.trim() || '',
        tipo: cupom.tipo,
        valor: cupom.valor,
        valorMinimo: cupom.valorMinimo || null,
        maximoUsos: cupom.maximoUsos || null,
        ativo: cupom.ativo !== undefined ? cupom.ativo : true,
        validoAte: cupom.validoAte
      };

      // Validação adicional do valor
      if (dados.tipo === 'PORCENTAGEM' && (dados.valor < 1 || dados.valor > 100)) {
        throw new Error("Desconto percentual deve estar entre 1% e 100%");
      }
      
      if (dados.tipo === 'VALOR_FIXO' && dados.valor <= 0) {
        throw new Error("Valor fixo deve ser maior que zero");
      }

      const response = await api.post("/cupons", dados);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar cupom:', error);
      
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      
      if (error.response?.status === 403) {
        throw new Error("Você não tem permissão para criar cupons.");
      }
      
      if (error.response?.status === 400) {
        const serverMessage = error.response.data?.message || 
                             error.response.data?.error || 
                             "Dados inválidos";
        throw new Error(`Erro: ${serverMessage}`);
      }
      
      if (error.response?.status === 409) {
        throw new Error("Cupom com este código já existe");
      }
      
      // Se for erro de validação do frontend, passa direto
      if (error.message && !error.response) {
        throw new Error(error.message);
      }
      
      throw new Error(error.response?.data?.message || "Erro ao criar cupom");
    }
  }

  // Atualizar cupom (admin)
  async atualizarCupom(id: string, cupom: ICupomToEdit) {
    try {
      const dadosAtualizacao: any = {};
      
      if (cupom.codigo) dadosAtualizacao.codigo = cupom.codigo.trim().toUpperCase();
      if (cupom.descricao) dadosAtualizacao.descricao = cupom.descricao.trim();
      if (cupom.tipo) dadosAtualizacao.tipo = cupom.tipo;
      if (cupom.valor !== undefined) dadosAtualizacao.valor = cupom.valor;
      if (cupom.valorMinimo !== undefined) dadosAtualizacao.valorMinimo = cupom.valorMinimo || null;
      if (cupom.maximoUsos !== undefined) dadosAtualizacao.maximoUsos = cupom.maximoUsos || null;
      if (cupom.ativo !== undefined) dadosAtualizacao.ativo = cupom.ativo;
      if (cupom.validoAte) dadosAtualizacao.validoAte = cupom.validoAte;

      // Validações
      if (dadosAtualizacao.valor !== undefined) {
        if (dadosAtualizacao.tipo === 'PORCENTAGEM' && (dadosAtualizacao.valor < 1 || dadosAtualizacao.valor > 100)) {
          throw new Error("Desconto percentual deve estar entre 1% e 100%");
        }
        
        if (dadosAtualizacao.tipo === 'VALOR_FIXO' && dadosAtualizacao.valor <= 0) {
          throw new Error("Valor fixo deve ser maior que zero");
        }
      }

      const response = await api.put(`/cupons/${id}`, dadosAtualizacao);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao atualizar cupom ${id}:`, error);
      
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      
      if (error.response?.status === 403) {
        throw new Error("Você não tem permissão para atualizar cupons.");
      }
      
      if (error.response?.status === 404) {
        throw new Error("Cupom não encontrado");
      }
      
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || "Dados inválidos");
      }
      
      if (error.response?.status === 409) {
        throw new Error("Cupom com este código já existe");
      }
      
      // Se for erro de validação do frontend, passa direto
      if (error.message && !error.response) {
        throw new Error(error.message);
      }
      
      throw new Error(error.response?.data?.message || "Erro ao atualizar cupom");
    }
  }

  // Deletar cupom (admin)
  async deletarCupom(id: string) {
    try {
      const response = await api.delete(`/cupons/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao deletar cupom ${id}:`, error);
      
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      
      if (error.response?.status === 403) {
        throw new Error("Você não tem permissão para deletar cupons.");
      }
      
      if (error.response?.status === 404) {
        throw new Error("Cupom não encontrado");
      }
      
      if (error.response?.status === 400) {
        throw new Error("Não é possível deletar este cupom pois está em uso.");
      }
      
      throw new Error(error.response?.data?.message || "Erro ao deletar cupom");
    }
  }

  // Verificar cupom (público)
  async verificarCupom(codigo: string, valorCarrinho: number = 0) {
    try {
      if (!codigo || !codigo.trim()) {
        return {
          success: false,
          data: null,
          message: "Informe o código do cupom"
        };
      }

      const response = await api.post<IVerificarCupomResponse>("/cupons/verificar", {
        codigo: codigo.trim().toUpperCase(),
        valorCarrinho
      });
      
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao verificar cupom ${codigo}:`, error);
      
      if (error.response?.status === 400) {
        return {
          success: false,
          data: null,
          message: error.response.data?.message || "Cupom inválido"
        };
      }
      
      if (error.response?.status === 404) {
        return {
          success: false,
          data: null,
          message: "Cupom não encontrado"
        };
      }
      
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Erro ao verificar cupom"
      };
    }
  }

  // Ativar/Desativar cupom (admin)
  async toggleAtivo(id: string, ativo: boolean) {
    try {
      const response = await api.patch(`/cupons/${id}/ativo`, { ativo });
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao alterar status do cupom ${id}:`, error);
      
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      
      if (error.response?.status === 403) {
        throw new Error("Você não tem permissão para alterar cupons.");
      }
      
      if (error.response?.status === 404) {
        throw new Error("Cupom não encontrado");
      }
      
      throw new Error(error.response?.data?.message || "Erro ao alterar status do cupom");
    }
  }

  // Buscar cupons disponíveis para usuário
  async getCuponsDisponiveis(valorMinimo?: number) {
    try {
      const params = new URLSearchParams();
      params.append('disponiveis', 'true');
      if (valorMinimo) params.append('valorMinimo', valorMinimo.toString());

      const url = `/cupons?${params.toString()}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar cupons disponíveis:', error);
      
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || "Erro ao buscar cupons disponíveis"
      };
    }
  }

  // Aplicar cupom no carrinho
  async aplicarCupom(codigo: string, carrinhoId: string) {
    try {
      const response = await api.post("/cupons/aplicar", {
        codigo: codigo.trim().toUpperCase(),
        carrinhoId
      });
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao aplicar cupom ${codigo}:`, error);
      
      if (error.response?.status === 400) {
        return {
          success: false,
          data: null,
          message: error.response.data?.message || "Não foi possível aplicar o cupom"
        };
      }
      
      if (error.response?.status === 404) {
        return {
          success: false,
          data: null,
          message: "Cupom não encontrado"
        };
      }
      
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Erro ao aplicar cupom"
      };
    }
  }

  // Remover cupom do carrinho
  async removerCupom(carrinhoId: string) {
    try {
      const response = await api.delete(`/carrinho/${carrinhoId}/cupom`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao remover cupom do carrinho ${carrinhoId}:`, error);
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Carrinho não encontrado"
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao remover cupom"
      };
    }
  }

  // Estatísticas de cupons (admin)
  async getEstatisticas() {
    try {
      const response = await api.get("/cupons/estatisticas");
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar estatísticas de cupons:', error);
      
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      
      if (error.response?.status === 403) {
        throw new Error("Você não tem permissão para acessar estatísticas.");
      }
      
      throw new Error(error.response?.data?.message || "Erro ao carregar estatísticas");
    }
  }

  // Buscar cupom por código
  async buscarPorCodigo(codigo: string) {
    try {
      const response = await api.get(`/cupons/codigo/${codigo.trim().toUpperCase()}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao buscar cupom pelo código ${codigo}:`, error);
      
      if (error.response?.status === 404) {
        return {
          success: false,
          data: null,
          message: "Cupom não encontrado"
        };
      }
      
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Erro ao buscar cupom"
      };
    }
  }
}

export const cuponsRoute = new CuponsRoute();
// src/services/enderecos.service.ts
import { api } from "../../axios";

interface IEndereco {
  id: string;
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
  tipo: 'CASA' | 'TRABALHO' | 'OUTRO';
  principal: boolean;
  usuarioId: string;
  criadoEm: string;
  atualizadoEm: string;
}

interface IEnderecoToCreate {
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
  tipo?: 'CASA' | 'TRABALHO' | 'OUTRO';
  principal?: boolean;
}

interface IEnderecoToEdit {
  nome?: string;
  email?: string;
  telefone?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  referencia?: string;
  tipo?: 'CASA' | 'TRABALHO' | 'OUTRO';
  principal?: boolean;
}

class EnderecosRoute {
  // Listar todos os endereços do usuário
  async getEnderecos() {
    try {
      const response = await api.get("/enderecos");
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar endereços:', error);
      
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      
      throw new Error(error.response?.data?.message || "Erro ao carregar endereços");
    }
  }

  // Buscar endereço por ID
  async getById(id: string) {
    try {
      const response = await api.get<IEndereco>(`/enderecos/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao buscar endereço ${id}:`, error);
      
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      
      if (error.response?.status === 404) {
        throw new Error("Endereço não encontrado");
      }
      
      throw new Error(error.response?.data?.message || "Erro ao buscar endereço");
    }
  }

  // Criar novo endereço
  async criarEndereco(endereco: IEnderecoToCreate) {
    try {
      const dados = {
        nome: endereco.nome.trim(),
        email: endereco.email.trim(),
        telefone: endereco.telefone.trim(),
        logradouro: endereco.logradouro.trim(),
        numero: endereco.numero.trim(),
        bairro: endereco.bairro.trim(),
        cidade: endereco.cidade.trim(),
        estado: endereco.estado.trim(),
        tipo: endereco.tipo || 'CASA',
        principal: endereco.principal || false,
        ...(endereco.complemento && { complemento: endereco.complemento.trim() }),
        ...(endereco.referencia && { referencia: endereco.referencia.trim() })
      };

      const response = await api.post("/enderecos", dados);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar endereço:', error);
      
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      
      if (error.response?.status === 400) {
        const serverMessage = error.response.data?.message || 
                             error.response.data?.error || 
                             "Dados inválidos";
        throw new Error(`Erro: ${serverMessage}`);
      }
      
      if (error.response?.status === 409) {
        throw new Error("Endereço já existe");
      }
      
      throw new Error(error.response?.data?.message || "Erro ao criar endereço");
    }
  }

  // Atualizar endereço
  async atualizarEndereco(id: string, endereco: IEnderecoToEdit) {
    try {
      const dadosAtualizacao: any = {};
      
      if (endereco.nome) dadosAtualizacao.nome = endereco.nome.trim();
      if (endereco.email) dadosAtualizacao.email = endereco.email.trim();
      if (endereco.telefone) dadosAtualizacao.telefone = endereco.telefone.trim();
      if (endereco.logradouro) dadosAtualizacao.logradouro = endereco.logradouro.trim();
      if (endereco.numero) dadosAtualizacao.numero = endereco.numero.trim();
      if (endereco.bairro) dadosAtualizacao.bairro = endereco.bairro.trim();
      if (endereco.cidade) dadosAtualizacao.cidade = endereco.cidade.trim();
      if (endereco.estado) dadosAtualizacao.estado = endereco.estado.trim();
      if (endereco.tipo) dadosAtualizacao.tipo = endereco.tipo;
      if (endereco.principal !== undefined) dadosAtualizacao.principal = endereco.principal;
      
      // Campos opcionais - só incluir se fornecidos
      if (endereco.complemento !== undefined) {
        dadosAtualizacao.complemento = endereco.complemento ? endereco.complemento.trim() : null;
      }
      if (endereco.referencia !== undefined) {
        dadosAtualizacao.referencia = endereco.referencia ? endereco.referencia.trim() : null;
      }

      const response = await api.put(`/enderecos/${id}`, dadosAtualizacao);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao atualizar endereço ${id}:`, error);
      
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      
      if (error.response?.status === 404) {
        throw new Error("Endereço não encontrado");
      }
      
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || "Dados inválidos");
      }
      
      throw new Error(error.response?.data?.message || "Erro ao atualizar endereço");
    }
  }

  // Deletar endereço
  async deletarEndereco(id: string) {
    try {
      const response = await api.delete(`/enderecos/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao deletar endereço ${id}:`, error);
      
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      
      if (error.response?.status === 404) {
        throw new Error("Endereço não encontrado");
      }
      
      if (error.response?.status === 400) {
        throw new Error("Não é possível deletar este endereço pois está em uso.");
      }
      
      throw new Error(error.response?.data?.message || "Erro ao deletar endereço");
    }
  }

  // Definir endereço como principal
  async definirComoPrincipal(id: string) {
    try {
      const response = await api.patch(`/enderecos/${id}/principal`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao definir endereço ${id} como principal:`, error);
      
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      
      if (error.response?.status === 404) {
        throw new Error("Endereço não encontrado");
      }
      
      throw new Error(error.response?.data?.message || "Erro ao definir endereço como principal");
    }
  }

  // Buscar endereço principal
  async getPrincipal() {
    try {
      const response = await api.get("/enderecos/principal");
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar endereço principal:', error);
      
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      
      if (error.response?.status === 404) {
        // Não é erro, apenas não tem endereço principal
        return { success: true, data: null };
      }
      
      throw new Error(error.response?.data?.message || "Erro ao buscar endereço principal");
    }
  }

  // Listar endereços com filtros
  async listarEnderecos(filtros?: {
    tipo?: 'CASA' | 'TRABALHO' | 'OUTRO';
    principal?: boolean;
    cidade?: string;
    estado?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const params = new URLSearchParams();
      
      if (filtros?.tipo) params.append('tipo', filtros.tipo);
      if (filtros?.principal !== undefined) params.append('principal', filtros.principal.toString());
      if (filtros?.cidade) params.append('cidade', filtros.cidade);
      if (filtros?.estado) params.append('estado', filtros.estado);
      if (filtros?.page) params.append('page', filtros.page.toString());
      if (filtros?.limit) params.append('limit', filtros.limit.toString());

      const url = `/enderecos${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao listar endereços:', error);
      
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      
      throw new Error(error.response?.data?.message || "Erro ao carregar endereços");
    }
  }


  // Buscar estados brasileiros (exemplo)
  async getEstados() {
    return {
      success: true,
      data: [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
      ]
    };
  }

  // Para Angola, use este método:
  async getProvinciasAngola() {
    return {
      success: true,
      data: [
        'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 
        'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 
        'Luanda', 'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico', 
        'Namibe', 'Uíge', 'Zaire'
      ]
    };
  }
}

export const enderecosRoute = new EnderecosRoute();
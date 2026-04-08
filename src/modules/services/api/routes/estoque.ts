// src/modules/services/api/routes/produtos.ts - ATUALIZADO

import { api } from "../axios";

export interface Estoque {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  foto?: string; // Agora armazena o caminho relativo no Supabase
  categoriaId?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export const estoqueRoute = {
  // Listar produtos
  getEstoque: async (): Promise<Estoque[]> => {
    const response = await api.get("/estoque/get");
    return response.data;
  },

  // Buscar produto por ID
  getEstoqueById: async (id: string): Promise<Estoque> => {
    const response = await api.get(`/estoque/${id}`);
    return response.data;
  },

  // Criar produto
  createProduto: async (data: FormData): Promise<Estoque> => {
    const response = await api.post("/estoque", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Atualizar produto
  updateProduto: async (id: string, data: FormData): Promise<Estoque> => {
    const response = await api.put(`/estoque/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Deletar produto
  deleteProduto: async (id: string): Promise<void> => {
    await api.delete(`/estoque/${id}`);
  },
};
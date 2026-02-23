// src/modules/services/api/routes/produtos.ts - ATUALIZADO

import { api } from "../axios";

export interface Produto {
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

export const produtosRoute = {
  // Listar produtos
  getProdutos: async (): Promise<Produto[]> => {
    const response = await api.get("/produtos");
    return response.data;
  },

  // Buscar produto por ID
  getProdutoById: async (id: string): Promise<Produto> => {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  },

  // Criar produto
  createProduto: async (data: FormData): Promise<Produto> => {
    const response = await api.post("/produtos", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Atualizar produto
  updateProduto: async (id: string, data: FormData): Promise<Produto> => {
    const response = await api.put(`/produtos/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Deletar produto
  deleteProduto: async (id: string): Promise<void> => {
    await api.delete(`/produtos/${id}`);
  },
};
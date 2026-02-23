// src/modules/services/api/routes/categorias.ts - ATUALIZADO

import { api } from "../axios";

export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  imagem?: string; // Caminho relativo no Supabase
  Produto?: any[];
  criadoEm?: string;
  atualizadoEm?: string;
}

export const categoriaRoutes = {
  // Listar categorias
  getAllCategoria: async (): Promise<Categoria[]> => {
    const response = await api.get("/categorias");
    return response.data;
  },

  // Buscar categoria por ID
  getCategoriaById: async (id: string): Promise<Categoria> => {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  },

  // Criar categoria
  createCategoria: async (data: FormData): Promise<Categoria> => {
    const response = await api.post("/categorias", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Atualizar categoria
  updateCategoria: async (id: string, data: FormData): Promise<Categoria> => {
    const response = await api.put(`/categorias/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Deletar categoria
  deleteCategoria: async (id: string): Promise<void> => {
    await api.delete(`/categorias/${id}`);
  },
};
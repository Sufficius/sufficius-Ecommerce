import { api } from "../../axios";

interface IProdutoToCreate {
  nome: string;
  preco: string;
  descricao: string;
  quantidade: string;
  id_categoria: string;
  imagemproduto: File | null;
  status?:string;
}

interface IProdutoToEdit {
  nome?: string;
  preco?: string;
  descricao?: string;
  quantidade?: string;
  id_categoria?: string;
}

class ProdutosRoute {
  async criarProduto(produto: IProdutoToCreate) {
    const formData = new FormData();
    formData.append("nome", produto.nome);
    formData.append("preco", produto.preco.toString());
    formData.append("descricao", produto.descricao ?? "");
    formData.append("quantidade", produto.quantidade.toString());
    formData.append("id_categoria", produto.id_categoria);

    if(produto.imagemproduto){
      formData.append("imagemproduto", produto.imagemproduto);
    }

    const response = await api.post("/produtos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  async getById(id: string) {
    const response = await api.get<IProduto>(`/produtos/${id}`);
    return response.data;
  }

  async atualizarProduto(id: string, produto: IProdutoToEdit) {
    const { data } = await api.put(`/produtos/${id}`, produto);
    return data;
  }

  async deletarProduto(id: string, userId: string) {
    const response = await api.delete(`/produtos/${id}`, {
      data: {
        userId
      }
    });
    return response.data;
  }

  async getEstatisticas() {
    const response = await api.get("/produtos/estatisticas");
    return response.data;
  }

  async getPorCategoria(categoriaId: string) {
    const response = await api.get(`/produtos/categoria/${categoriaId}`);
    return response.data;
  }
}
export const produtosRoute = new ProdutosRoute();
import { api } from "../../axios";

// ==================== INTERFACES ====================

interface Produto {
  id: string;
  nome: string;
  descricao?: string | null;
  preco: number;
  precoDesconto?: number | null;
  percentualDesconto?: number | null;
  descontoAte?: string | null;
  estoque: number;
  sku: string;
  ativo: boolean;
  emDestaque: boolean;
  criadoEm: string;
  categoria: string;
  categoriaId?: string | null;
  imagem?: string | null;
  imagemAlt?: string | null;
  status: string;
}

interface CreateProdutoDTO {
  nome: string;
  sku: string;
  preco: string;
  estoque: string;
  descricao?: string;
  precoDesconto?: string;
  percentualDesconto?: string;
  descontoAte?: string;
  categoriaId?: string;
  ativo?: boolean;
  emDestaque?: boolean;
  imagem?: File | null;
}

interface UpdateProdutoDTO extends Partial<CreateProdutoDTO> {
  id: string;
  deletarImagem?: boolean;
}

interface ProdutoFilters {
  page?: number;
  limit?: number;
  busca?: string;
  categoria?: string;
  status?: string;
  ordenar?: string;
}

interface Paginacao {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Estatisticas {
  totalProdutos: number;
  totalAtivos: number;
  totalEmPromocao: number;
  baixoEstoque: number;
  totalCategorias: number;
}

interface ListarProdutosResponse {
  success: boolean;
  data: {
    produtos: Produto[];
    paginacao: Paginacao;
    estatisticas: Estatisticas;
    filtros: {
      busca: string;
      categoria: string;
      status: string;
      ordenar: string;
    };
  };
}

interface EstatisticasResponse {
  success: boolean;
  data: {
    totalProdutos: number;
    totalAtivos: number;
    totalInativos: number;
    totalEmPromocao: number;
    baixoEstoque: number;
    semEstoque: number;
    totalVendidos: number;
    produtosMaisVendidos: any[];
    totalCategorias: number;
  };
}

// ==================== CLASS PRODUTOS ROUTE ====================

class ProdutosRoute {

  /**
   * Listar produtos com filtros e paginação
   */
  async listar(filters: ProdutoFilters = {}): Promise<ListarProdutosResponse> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.busca) params.append('busca', filters.busca);
    if (filters.categoria) params.append('categoria', filters.categoria);
    if (filters.status) params.append('status', filters.status);
    if (filters.ordenar) params.append('ordenar', filters.ordenar);

    const { data } = await api.get<ListarProdutosResponse>(`/produtos?${params.toString()}`);
    return data;
  }

  /**
   * Buscar produto por ID
   */
  async getById(id: string): Promise<Produto> {
    const { data } = await api.get<{ success: boolean; data: Produto }>(`/produtos/${id}`);
    return data.data;
  }

  /**
   * Criar novo produto (com suporte a upload de imagem)
   */
  async criarProduto(produto: CreateProdutoDTO, token:string): Promise<Produto> {
    const formData = new FormData();

    // Campos obrigatórios
    formData.append("nome", produto.nome.trim());
    formData.append("sku", produto.sku.trim().toUpperCase());
    formData.append("preco", produto.preco);
    formData.append("estoque", produto.estoque);

    // Campos opcionais
    if (produto.descricao) formData.append("descricao", produto.descricao.trim());
    if (produto.precoDesconto) formData.append("precoDesconto", produto.precoDesconto);
    if (produto.percentualDesconto) formData.append("percentualDesconto", produto.percentualDesconto);
    if (produto.categoriaId) formData.append("categoriaId", produto.categoriaId);
    if (produto.descontoAte) formData.append("descontoAte", produto.descontoAte);

    // Booleanos
    formData.append("ativo", (produto.ativo ?? true).toString());
    formData.append("emDestaque", (produto.emDestaque ?? false).toString());

    // Imagem
    if (produto.imagem) {
      formData.append("imagem", produto.imagem);
    }
    const { data } = await api.post<{ success: boolean; data: Produto; message: string }>(
      "/produtos",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      }
    );

    return data.data;
  }

  /**
   * Atualizar produto (com suporte a imagem)
   */
  async atualizarProduto(updateData: UpdateProdutoDTO): Promise<Produto> {
    const formData = new FormData();
    const { id, deletarImagem, ...produto } = updateData;

    // Campos que podem ser atualizados
    if (produto.nome) formData.append("nome", produto.nome.trim());
    if (produto.sku) formData.append("sku", produto.sku.trim().toUpperCase());
    if (produto.preco) formData.append("preco", produto.preco);
    if (produto.estoque) formData.append("estoque", produto.estoque);
    if (produto.descricao !== undefined) formData.append("descricao", produto.descricao?.trim() || "");
    if (produto.precoDesconto !== undefined) formData.append("precoDesconto", produto.precoDesconto?.toString() || "");
    if (produto.percentualDesconto !== undefined) formData.append("percentualDesconto", produto.percentualDesconto?.toString() || "");
    if (produto.categoriaId !== undefined) formData.append("categoriaId", produto.categoriaId || "");
    if (produto.descontoAte) formData.append("descontoAte", produto.descontoAte);

    // Booleanos
    if (produto.ativo !== undefined) formData.append("ativo", produto.ativo.toString());
    if (produto.emDestaque !== undefined) formData.append("emDestaque", produto.emDestaque.toString());

    // Imagem
    if (produto.imagem) {
      formData.append("imagem", produto.imagem);
    }

    // Flag para deletar imagem
    if (deletarImagem) {
      formData.append("deletarImagem", "true");
    }

    const { data } = await api.put<{ success: boolean; data: Produto; message: string }>(
      `/produtos/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      }
    );

    return data.data;
  }

  /**
   * Deletar produto
   */
  async deletarProduto(id: string): Promise<{ success: boolean; message: string }> {
    const { data } = await api.delete<{ success: boolean; message: string }>(`/produtos/${id}`);
    return data;
  }

  /**
   * Obter estatísticas de produtos
   */
  async getEstatisticas(): Promise<EstatisticasResponse> {
    const { data } = await api.get<EstatisticasResponse>("/produtos/estatisticas");
    return data;
  }

  /**
   * Deletar múltiplos produtos
   */
  async deletarMultiplos(ids: string[]): Promise<{ success: boolean; message: string }> {
    const { data } = await api.post<{ success: boolean; message: string }>("/produtos/deletar-multiplos", { ids });
    return data;
  }

  /**
   * Atualizar imagem do produto separadamente
   */
  async atualizarImagem(produtoId: string, imagem: File): Promise<Produto> {
    const formData = new FormData();
    formData.append("imagem", imagem);
    formData.append("produtoId", produtoId);

    const { data } = await api.post<{ success: boolean; data: Produto; message: string }>(
      `/produtos/${produtoId}/imagem`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      }
    );

    return data.data;
  }

  /**
   * Buscar produtos por categoria
   */
  async getPorCategoria(categoriaId: string): Promise<Produto[]> {
    const { data } = await api.get<{ success: boolean; data: Produto[] }>(
      `/produtos/categoria/${categoriaId}`
    );
    return data.data;
  }

  /**
   * Buscar produtos em destaque
   */
  async getDestaques(limit: number = 10): Promise<Produto[]> {
    const { data } = await api.get<{ success: boolean; data: Produto[] }>(
      `/produtos/destaques?limit=${limit}`
    );
    return data.data;
  }

  /**
   * Buscar produtos com desconto
   */
  async getEmPromocao(page: number = 1, limit: number = 10): Promise<ListarProdutosResponse> {
    const { data } = await api.get<ListarProdutosResponse>(
      `/produtos/promocao?page=${page}&limit=${limit}`
    );
    return data;
  }

  /**
   * Verificar se SKU já existe
   */
  async verificarSku(sku: string): Promise<{ exists: boolean }> {
    const { data } = await api.get<{ success: boolean; exists: boolean }>(
      `/produtos/verificar-sku/${sku}`
    );
    return { exists: data.exists };
  }

  /**
   * Atualizar estoque do produto
   */
  async atualizarEstoque(produtoId: string, quantidade: number): Promise<Produto> {
    const { data } = await api.patch<{ success: boolean; data: Produto; message: string }>(
      `/produtos/${produtoId}/estoque`,
      { quantidade }
    );
    return data.data;
  }

  /**
   * Ativar/desativar produto
   */
  async toggleAtivo(produtoId: string, ativo: boolean): Promise<Produto> {
    const { data } = await api.patch<{ success: boolean; data: Produto; message: string }>(
      `/produtos/${produtoId}/ativo`,
      { ativo }
    );
    return data.data;
  }

  /**
   * Toggle produto em destaque
   */
  async toggleDestaque(produtoId: string, emDestaque: boolean): Promise<Produto> {
    const { data } = await api.patch<{ success: boolean; data: Produto; message: string }>(
      `/produtos/${produtoId}/destaque`,
      { emDestaque }
    );
    return data.data;
  }
}

// ==================== EXPORT INSTANCE ====================

export const produtosRoute = new ProdutosRoute();
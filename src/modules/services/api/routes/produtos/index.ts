import { api } from "../../axios";
import { z } from "zod";

// ==================== SCHEMAS DE VALIDAÇÃO ====================

const produtoSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().nullable().optional(),
  preco: z.number().min(0, "Preço deve ser maior ou igual a zero"),
  precoDesconto: z.number().nullable().optional(),
  percentualDesconto: z.number().nullable().optional(),
  descontoAte: z.string().nullable().optional(),
  estoque: z.number().int().min(0, "Estoque não pode ser negativo"),
  sku: z.string().min(1, "SKU é obrigatório"),
  ativo: z.boolean(),
  emDestaque: z.boolean(),
  criadoEm: z.string().datetime(),
  categoria: z.string(),
  categoriaId: z.string().uuid().nullable().optional(),
  imagem: z.string().nullable().optional(),
  imagemAlt: z.string().nullable().optional(),
  status: z.string(),
});

const createProdutoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  sku: z.string().min(1, "SKU é obrigatório"),
  preco: z.string().refine(val => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  }, "Preço deve ser um número válido e maior ou igual a zero"),
  estoque: z.string().refine(val => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 0;
  }, "Estoque deve ser um número inteiro válido e maior ou igual a zero"),
  descricao: z.string().optional(),
  precoDesconto: z.string().optional().refine(val => {
    if (!val) return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  }, "Preço de desconto inválido"),
  percentualDesconto: z.string().optional().refine(val => {
    if (!val) return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Percentual de desconto deve estar entre 0 e 100"),
  descontoAte: z.string().optional(),
  categoriaId: z.string().uuid().optional(),
  ativo: z.boolean().optional().default(true),
  emDestaque: z.boolean().optional().default(false),
  imagem: z.instanceof(File).nullable().optional(),
});

const updateProdutoSchema = createProdutoSchema.partial().extend({
  id: z.string().uuid(),
  deletarImagem: z.boolean().optional(),
});

const produtoFiltersSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  busca: z.string().optional(),
  categoria: z.string().optional(),
  status: z.string().optional(),
  ordenar: z.string().optional(),
});

// ==================== INTERFACES ====================

interface Produto extends z.infer<typeof produtoSchema> { }

interface CreateProdutoDTO extends z.infer<typeof createProdutoSchema> { }

interface UpdateProdutoDTO extends z.infer<typeof updateProdutoSchema> { }

interface ProdutoFilters extends z.infer<typeof produtoFiltersSchema> { }

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
    produtosMaisVendidos: Produto[];
    totalCategorias: number;
  };
}

interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ==================== CLASS PRODUTOS ROUTE ====================

class ProdutosRoute {
  private token?: string;

  setToken(token: string): void {
    this.token = token;
  }

  clearToken(): void {
    this.token = undefined;
  }


  private getAuthHeaders(contentType?: string): Record<string, string> {
    const headers: Record<string, string> = {};

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    return headers;
  }

  private async handleRequest<T>(request: Promise<any>): Promise<T> {
    try {
      const response = await request;

      if (!response.data.success) {
        throw new Error(response.data.message || 'Operação falhou');
      }

      return response.data;
    } catch (error: any) {
      if (error.response) {
        const apiError = error.response.data as ApiError;
        throw new Error(
          `API Error (${error.response.status}): ${apiError.message || error.message}`
        );
      } else if (error.request) {
        throw new Error('Sem resposta do servidor. Verifique sua conexão.');
      } else {
        throw new Error(`Erro na requisição: ${error.message}`);
      }
    }
  }

  private validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validação falhou: ${error}`);
      }
      throw new Error(`Erro de validação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  private createFormData(produto: CreateProdutoDTO | UpdateProdutoDTO, isUpdate = false): FormData {
    const formData = new FormData();

    if (!isUpdate) {
      const produtoData = produto as CreateProdutoDTO;
      formData.append("nome", produtoData.nome.trim());
      formData.append("sku", produtoData.sku.trim().toUpperCase());
      formData.append("preco", produtoData.preco);
      formData.append("estoque", produtoData.estoque);
    } else {
      if (produto.nome) formData.append("nome", produto.nome.trim());
      if (produto.sku) formData.append("sku", produto.sku.trim().toUpperCase());
      if (produto.preco) formData.append("preco", produto.preco);
      if (produto.estoque) formData.append("estoque", produto.estoque);
    }

    if (produto.descricao !== undefined) {
      formData.append("descricao", produto.descricao?.trim() || "");
    }

    if (produto.precoDesconto !== undefined) {
      formData.append("precoDesconto", produto.precoDesconto?.toString() || "");
    }

    if (produto.percentualDesconto !== undefined) {
      formData.append("percentualDesconto", produto.percentualDesconto?.toString() || "");
    }

    if (produto.categoriaId !== undefined) {
      formData.append("categoriaId", produto.categoriaId || "");
    }

    if (produto.descontoAte) {
      formData.append("descontoAte", produto.descontoAte);
    }

    if (produto.ativo !== undefined) {
      formData.append("ativo", produto.ativo.toString());
    }

    if (produto.emDestaque !== undefined) {
      formData.append("emDestaque", produto.emDestaque.toString());
    }

    if (produto.imagem) {
      formData.append("imagem", produto.imagem);
    }

    if ('deletarImagem' in produto && produto.deletarImagem) {
      formData.append("deletarImagem", "true");
    }

    return formData;
  }

  async listar(filters: ProdutoFilters = {}): Promise<ListarProdutosResponse> {
    const validatedFilters = this.validateData(produtoFiltersSchema, filters);

    const params = new URLSearchParams();

    if (validatedFilters.page) params.append('page', validatedFilters.page.toString());
    if (validatedFilters.limit) params.append('limit', validatedFilters.limit.toString());
    if (validatedFilters.busca) params.append('busca', validatedFilters.busca);
    if (validatedFilters.categoria) params.append('categoria', validatedFilters.categoria);
    if (validatedFilters.status) params.append('status', validatedFilters.status);
    if (validatedFilters.ordenar) params.append('ordenar', validatedFilters.ordenar);

    return this.handleRequest<ListarProdutosResponse>(
      api.get(`/produtos?${params.toString()}`, {
        headers: this.getAuthHeaders()
      })
    );
  }

  async getById(id: string): Promise<Produto> {
    if (!id) {
      throw new Error('ID do produto é obrigatório');
    }

    const response = await this.handleRequest<ApiResponse<Produto>>(
      api.get(`/produtos/${id}`, {
        headers: this.getAuthHeaders()
      })
    );

    return response.data;
  }

  async criarProduto(produto: CreateProdutoDTO, token?: string): Promise<Produto> {
    const validatedData = this.validateData(createProdutoSchema, produto);

    const formData = this.createFormData(validatedData, false);

    const response = await this.handleRequest<ApiResponse<Produto>>(
      api.post("/produtos", formData, {

        headers: {
          "Authorization": `${token}`,
          "Content-Type": "multipart/form-data",
        }
      },
      ));

    return response.data;
  }

  async atualizarProduto(updateData: UpdateProdutoDTO): Promise<Produto> {
    const validatedData = this.validateData(updateProdutoSchema, updateData);

    const formData = this.createFormData(validatedData, true);

    const response = await this.handleRequest<ApiResponse<Produto>>(
      api.put(`/produtos/${validatedData.id}`, formData, {
        headers: this.getAuthHeaders("multipart/form-data")
      })
    );

    return response.data;
  }

  async deletarProduto(id: string): Promise<{ success: boolean; message: string }> {
    if (!id) {
      throw new Error('ID do produto é obrigatório');
    }

    return this.handleRequest<{ success: boolean; message: string }>(
      api.delete(`/produtos/${id}`, {
        headers: this.getAuthHeaders()
      })
    );
  }

  async getEstatisticas(): Promise<EstatisticasResponse> {
    return this.handleRequest<EstatisticasResponse>(
      api.get("/produtos/estatisticas", {
        headers: this.getAuthHeaders()
      })
    );
  }

 
  async deletarMultiplos(ids: string[]): Promise<{ success: boolean; message: string }> {
    if (!ids || ids.length === 0) {
      throw new Error('Nenhum ID fornecido para exclusão');
    }

    ids.forEach(id => {
      try {
        z.string().uuid().parse(id);
      } catch {
        throw new Error(`ID inválido: ${id}`);
      }
    });

    return this.handleRequest<{ success: boolean; message: string }>(
      api.post("/produtos/deletar-multiplos",
        { ids },
        { headers: this.getAuthHeaders("application/json") }
      )
    );
  }

  async atualizarImagem(produtoId: string, imagem: File): Promise<Produto> {
    if (!produtoId) {
      throw new Error('ID do produto é obrigatório');
    }

    if (!imagem) {
      throw new Error('Imagem é obrigatória');
    }

    const formData = new FormData();
    formData.append("imagem", imagem);
    formData.append("produtoId", produtoId);

    const response = await this.handleRequest<ApiResponse<Produto>>(
      api.post(`/produtos/${produtoId}/imagem`, formData, {
        headers: this.getAuthHeaders("multipart/form-data")
      })
    );

    return response.data;
  }

  async getPorCategoria(categoriaId: string): Promise<Produto[]> {
    if (!categoriaId) {
      throw new Error('ID da categoria é obrigatório');
    }

    const response = await this.handleRequest<ApiResponse<Produto[]>>(
      api.get(`/produtos/categoria/${categoriaId}`, {
        headers: this.getAuthHeaders()
      })
    );

    return response.data;
  }

  async getDestaques(limit: number = 10): Promise<Produto[]> {
    const validatedLimit = Math.min(Math.max(1, limit), 100); // Limita entre 1 e 100

    const response = await this.handleRequest<ApiResponse<Produto[]>>(
      api.get(`/produtos/destaques?limit=${validatedLimit}`, {
        headers: this.getAuthHeaders()
      })
    );

    return response.data;
  }


  async getEmPromocao(page: number = 1, limit: number = 10): Promise<ListarProdutosResponse> {
    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.min(Math.max(1, limit), 100);

    return this.handleRequest<ListarProdutosResponse>(
      api.get(`/produtos/promocao?page=${validatedPage}&limit=${validatedLimit}`, {
        headers: this.getAuthHeaders()
      })
    );
  }

  async verificarSku(sku: string): Promise<{ exists: boolean }> {
    if (!sku) {
      throw new Error('SKU é obrigatório');
    }

    const response = await this.handleRequest<{ success: boolean; exists: boolean }>(
      api.get(`/produtos/verificar-sku/${sku.trim().toUpperCase()}`, {
        headers: this.getAuthHeaders()
      })
    );

    return { exists: response.exists };
  }

  async atualizarEstoque(produtoId: string, quantidade: number): Promise<Produto> {
    if (!produtoId) {
      throw new Error('ID do produto é obrigatório');
    }

    if (typeof quantidade !== 'number' || isNaN(quantidade)) {
      throw new Error('Quantidade deve ser um número válido');
    }

    const response = await this.handleRequest<ApiResponse<Produto>>(
      api.patch(`/produtos/${produtoId}/estoque`,
        { quantidade },
        { headers: this.getAuthHeaders("application/json") }
      )
    );

    return response.data;
  }

  async toggleAtivo(produtoId: string, ativo: boolean): Promise<Produto> {
    if (!produtoId) {
      throw new Error('ID do produto é obrigatório');
    }

    const response = await this.handleRequest<ApiResponse<Produto>>(
      api.patch(`/produtos/${produtoId}/ativo`,
        { ativo },
        { headers: this.getAuthHeaders("application/json") }
      )
    );

    return response.data;
  }

  async toggleDestaque(produtoId: string, emDestaque: boolean): Promise<Produto> {
    if (!produtoId) {
      throw new Error('ID do produto é obrigatório');
    }

    const response = await this.handleRequest<ApiResponse<Produto>>(
      api.patch(`/produtos/${produtoId}/destaque`,
        { emDestaque },
        { headers: this.getAuthHeaders("application/json") }
      )
    );

    return response.data;
  }

  async buscar(termo: string, limit: number = 20): Promise<Produto[]> {
    if (!termo || termo.trim().length === 0) {
      throw new Error('Termo de busca é obrigatório');
    }

    const response = await this.handleRequest<ApiResponse<Produto[]>>(
      api.get(`/produtos/buscar/${encodeURIComponent(termo.trim())}?limit=${limit}`, {
        headers: this.getAuthHeaders()
      })
    );

    return response.data;
  }

  async exportar(filters: ProdutoFilters = {}): Promise<Blob> {
    const validatedFilters = this.validateData(produtoFiltersSchema, filters);

    const params = new URLSearchParams();

    if (validatedFilters.busca) params.append('busca', validatedFilters.busca);
    if (validatedFilters.categoria) params.append('categoria', validatedFilters.categoria);
    if (validatedFilters.status) params.append('status', validatedFilters.status);

    const response = await api.get(`/produtos/exportar?${params.toString()}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });

    return response.data;
  }
}

// ==================== EXPORT INSTANCE ====================

export const produtosRoute = new ProdutosRoute();
export type {
  Produto,
  CreateProdutoDTO,
  UpdateProdutoDTO,
  ProdutoFilters,
  Paginacao,
  Estatisticas,
  ListarProdutosResponse,
  EstatisticasResponse,
};
"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Package,
  Tag,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Filter,
  AlertTriangle
} from "lucide-react";
import { api } from "@/modules/services/api/axios";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { formatCurrency } from "@/lib/utils";

interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  precoDesconto?: number;
  percentualDesconto?: number;
  estoque: number;
  sku: string;
  ativo: boolean;
  emDestaque: boolean;
  criadoEm: string;
  categoria: string;
  categoriaId?: string;
  imagem?: string;
  imagemAlt?: string;
  status: string;
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

interface Categoria {
  id: string;
  nome: string;
  slug: string;
}

export default function AdminProdutos() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [ordenar, setOrdenar] = useState("criadoEm_desc");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);
  
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [paginacao, setPaginacao] = useState<Paginacao>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    totalProdutos: 0,
    totalAtivos: 0,
    totalEmPromocao: 0,
    baixoEstoque: 0,
    totalCategorias: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingEstatisticas, setLoadingEstatisticas] = useState(false);

  const statusProdutos = {
    ativo: { label: "Ativo", cor: "bg-green-100 text-green-800" },
    inativo: { label: "Inativo", cor: "bg-gray-100 text-gray-800" },
    baixo_estoque: { label: "Baixo Estoque", cor: "bg-yellow-100 text-yellow-800" },
    sem_estoque: { label: "Sem Estoque", cor: "bg-red-100 text-red-800" }
  };

  // Função para buscar produtos
  const fetchProdutos = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: paginaAtual.toString(),
        limit: itensPorPagina.toString(),
        ordenar
      });

      if (busca) params.append('busca', busca);
      if (filtroCategoria !== 'todos') params.append('categoria', filtroCategoria);
      if (filtroStatus !== 'todos') params.append('status', filtroStatus);

      const response = await api.get(`/produtos?${params.toString()}`);

      if (response.data.success) {
        setProdutos(response.data.data.produtos);
        setPaginacao(response.data.data.paginacao);
        // Atualiza estatísticas básicas da resposta
        if (response.data.data.estatisticas) {
          setEstatisticas(prev => ({
            ...prev,
            totalProdutos: response.data.data.estatisticas.totalProdutos,
            totalAtivos: response.data.data.estatisticas.totalAtivos,
            totalEmPromocao: response.data.data.estatisticas.totalEmPromocao,
            baixoEstoque: response.data.data.estatisticas.baixoEstoque,
            totalCategorias: response.data.data.estatisticas.totalCategorias
          }));
        }
      } else {
        throw new Error('Erro ao carregar produtos');
      }
    } catch (err: any) {
      console.error('Erro ao buscar produtos:', err);
      setError(err.message || 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar categorias
  const fetchCategorias = async () => {
    try {
      const response = await api.get('/categorias');
      if (response.data.success) {
        setCategorias(response.data.data);
      }
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
    }
  };

  // Função para buscar estatísticas (separada, opcional)
  const fetchEstatisticas = async () => {
    try {
      setLoadingEstatisticas(true);
      const response = await api.get('/produtos/estatisticas');
      if (response.data.success) {
        setEstatisticas(prev => ({
          ...prev,
          ...response.data.data
        }));
      }
    } catch (err: any) {
      console.error('Erro ao buscar estatísticas:', err);
      // Se a rota específica falhar, não mostra erro, usa os dados da listagem
    } finally {
      setLoadingEstatisticas(false);
    }
  };

  // Efeito para buscar dados
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchProdutos(),
        fetchCategorias()
      ]);
      // Busca estatísticas separadamente (se falhar, não afeta a listagem)
      fetchEstatisticas();
    };
    
    loadData();
  }, [paginaAtual, busca, filtroCategoria, filtroStatus, ordenar]);

  // Funções de navegação
  const handleNovoProduto = () => {
    navigate("/admin/produtos/novo");
  };

  const handleEditarProduto = (id: string) => {
    navigate(`/admin/produtos/editar/${id}`);
  };

  const handleVisualizarProduto = (id: string) => {
    navigate(`/admin/produtos/${id}`);
  };

  const handleExcluirProduto = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o produto "${nome}"?`)) {
      return;
    }

    try {
      const response = await api.delete(`/produtos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        alert('Produto excluído com sucesso!');
        fetchProdutos(); // Recarregar lista
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao excluir produto');
    }
  };

  // Função para obter ícone baseado na categoria
  const getCategoriaIcon = (categoria: string) => {
    const icons: Record<string, string> = {
      'Eletrônicos': '📱',
      'Smartphones': '📱',
      'Notebooks': '💻',
      'Áudio': '🎧',
      'Monitores': '🖥️',
      'Games': '🎮',
      'Wearables': '⌚',
      'Periféricos': '⌨️',
      'Eletrodomésticos': '🏠',
      'Moda': '👕',
      'Casa': '🛋️',
      'Beleza': '💄',
      'Livros': '📚',
      'Brinquedos': '🧸',
      'Sem categoria': '📦'
    };
    return icons[categoria] || '📦';
  };

  // Calcular estatísticas locais como fallback
  const calcularEstatisticasLocais = () => {
    return {
      totalProdutosLocais: produtos.length,
      totalEmPromocaoLocais: produtos.filter(p => p.precoDesconto && p.precoDesconto > 0).length,
      baixoEstoqueLocais: produtos.filter(p => p.estoque <= 10 && p.estoque > 0).length,
      semEstoqueLocais: produtos.filter(p => p.estoque === 0).length
    };
  };

  const estatisticasLocais = calcularEstatisticasLocais();

  if (loading && produtos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#D4AF37] mx-auto mb-4" />
          <p className="text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Produtos</h1>
          <p className="text-gray-600">Gerencie todos os produtos da loja</p>
        </div>
        
        <button
          onClick={handleNovoProduto}
          className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-3 rounded-lg hover:bg-[#c19b2c] transition"
        >
          <Plus className="h-5 w-5" />
          Novo Produto
        </button>
      </div>

      {/* Aviso de erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Filtros e Busca */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Busca */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setPaginaAtual(1); // Resetar para primeira página
                }}
                placeholder="Buscar por nome, descrição ou SKU..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          {/* Filtro Categoria */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filtroCategoria}
                onChange={(e) => {
                  setFiltroCategoria(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="todos">Todas categorias</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtro Status */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filtroStatus}
                onChange={(e) => {
                  setFiltroStatus(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="todos">Todos status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="baixo_estoque">Baixo estoque</option>
                <option value="sem_estoque">Sem estoque</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ordenação */}
        <div className="mt-4">
          <select
            value={ordenar}
            onChange={(e) => {
              setOrdenar(e.target.value);
              setPaginaAtual(1);
            }}
            className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            <option value="criadoEm_desc">Mais recentes</option>
            <option value="criadoEm_asc">Mais antigos</option>
            <option value="nome_asc">Nome (A-Z)</option>
            <option value="nome_desc">Nome (Z-A)</option>
            <option value="preco_asc">Preço (menor)</option>
            <option value="preco_desc">Preço (maior)</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Produtos</p>
              <p className="text-2xl font-bold">
                {loadingEstatisticas ? (
                  <Loader2 className="h-6 w-6 animate-spin inline" />
                ) : (
                  estatisticas.totalProdutos || estatisticasLocais.totalProdutosLocais
                )}
              </p>
            </div>
            <Package className="h-8 w-8 text-[#D4AF37]" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categorias</p>
              <p className="text-2xl font-bold">
                {loadingEstatisticas ? (
                  <Loader2 className="h-6 w-6 animate-spin inline" />
                ) : (
                  estatisticas.totalCategorias || categorias.length
                )}
              </p>
            </div>
            <Tag className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Em Promoção</p>
              <p className="text-2xl font-bold">
                {loadingEstatisticas ? (
                  <Loader2 className="h-6 w-6 animate-spin inline" />
                ) : (
                  estatisticas.totalEmPromocao || estatisticasLocais.totalEmPromocaoLocais
                )}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Baixo Estoque</p>
              <p className="text-2xl font-bold">
                {loadingEstatisticas ? (
                  <Loader2 className="h-6 w-6 animate-spin inline" />
                ) : (
                  estatisticas.baixoEstoque || estatisticasLocais.baixoEstoqueLocais
                )}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37] mr-2" />
            <span>Carregando produtos...</span>
          </div>
        ) : produtos.length === 0 ? (
          <div className="text-center p-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-600 mb-4">
              {busca || filtroCategoria !== 'todos' || filtroStatus !== 'todos'
                ? 'Tente ajustar seus filtros de busca'
                : 'Comece adicionando seu primeiro produto!'}
            </p>
            <button
              onClick={handleNovoProduto}
              className="bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#c19b2c]"
            >
              Adicionar Primeiro Produto
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Produto</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Categoria</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Preço</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Estoque</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map(produto => (
                    <tr key={produto.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center text-lg mr-3 overflow-hidden">
                            {produto.imagem ? (
                              <img
                                src={produto.imagem}
                                alt={produto.imagemAlt || produto.nome}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span>{getCategoriaIcon(produto.categoria)}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{produto.nome}</div>
                            <div className="text-sm text-gray-500">SKU: {produto.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {produto.categoria}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-bold">{formatCurrency(produto.preco)}</div>
                          {produto.precoDesconto && produto.precoDesconto > 0 && (
                            <>
                              <div className="text-sm text-green-600">
                                {formatCurrency(produto.precoDesconto)}
                              </div>
                              {produto.percentualDesconto && (
                                <div className="text-xs text-red-600">
                                  -{produto.percentualDesconto.toFixed(1)}%
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={`font-medium ${produto.estoque === 0 ? 'text-red-600' : produto.estoque < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {produto.estoque} unidades
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusProdutos[produto.status as keyof typeof statusProdutos]?.cor || 'bg-gray-100 text-gray-800'}`}>
                          {statusProdutos[produto.status as keyof typeof statusProdutos]?.label || produto.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVisualizarProduto(produto.id)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditarProduto(produto.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleExcluirProduto(produto.id, produto.nome)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {paginacao.totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-gray-600">
                  Mostrando {((paginacao.page - 1) * paginacao.limit) + 1}-{Math.min(paginacao.page * paginacao.limit, paginacao.total)} de {paginacao.total} produtos
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                    disabled={paginacao.page === 1}
                    className="p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, paginacao.totalPages) }, (_, i) => {
                    let pageNum;
                    if (paginacao.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (paginacao.page <= 3) {
                      pageNum = i + 1;
                    } else if (paginacao.page >= paginacao.totalPages - 2) {
                      pageNum = paginacao.totalPages - 4 + i;
                    } else {
                      pageNum = paginacao.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPaginaAtual(pageNum)}
                        className={`w-8 h-8 flex items-center justify-center rounded ${
                          paginacao.page === pageNum
                            ? 'bg-[#D4AF37] text-white'
                            : 'border hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setPaginaAtual(p => Math.min(paginacao.totalPages, p + 1))}
                    disabled={paginacao.page === paginacao.totalPages}
                    className="p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
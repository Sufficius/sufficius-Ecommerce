"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Package,
  Edit,
  Plus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  Trash2,
  Loader2,
  AlertOctagon,
  Download,
  Filter,
  X,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Warehouse,
  Box,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/modules/services/api/axios";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { Button } from "@/components/ui/button";
import { ModalNovoEstoque } from "./components/ModalNovoEstoque";
import { ModalEditarEstoque } from "./components/ModalEditarEstoque";

// ========== INTERFACES ==========

interface EstoqueItem {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  quantidade: number;
  foto?: string | null;
  imagemAlt?: string;
  status: "ATIVO" | "INATIVO";
  id_categoria: string;
  categoria?: string;
  Categoria?: {
    id: string;
    nome: string;
  };
  criadoEm: string;
  atualizadoEm?: string;
  ultimaEntrada?: string;
  ultimaSaida?: string;
}

interface EstatisticasEstoque {
  totalProdutos: number;
  valorTotalEstoque: number;
  produtosBaixoEstoque: number;
  produtosSemEstoque: number;
  produtosAtivos: number;
  produtosInativos: number;
}

// ========== MODAL DE VISUALIZAR ==========

const ModalVisualizarEstoque = ({
  isOpen,
  onClose,
  item,
}: {
  isOpen: boolean;
  onClose: () => void;
  item: EstoqueItem | null;
}) => {
  if (!isOpen || !item) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusInfo = (status: string) => {
    if (status === "ATIVO") {
      return { cor: "bg-green-100 text-green-800", texto: "Ativo", icone: <CheckCircle className="h-4 w-4" /> };
    }
    return { cor: "bg-gray-100 text-gray-800", texto: "Inativo", icone: <X className="h-4 w-4" /> };
  };

  const getEstoqueInfo = (quantidade: number) => {
    if (quantidade === 0) {
      return { cor: "bg-red-100 text-red-800", texto: "Esgotado", icone: <AlertOctagon className="h-4 w-4" /> };
    }
    if (quantidade < 10) {
      return { cor: "bg-yellow-100 text-yellow-800", texto: "Baixo Estoque", icone: <AlertCircle className="h-4 w-4" /> };
    }
    return { cor: "bg-green-100 text-green-800", texto: "Em Estoque", icone: <Package className="h-4 w-4" /> };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Warehouse className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Detalhes do Estoque</h3>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Imagem */}
              <div className="bg-gray-100 rounded-lg h-64 overflow-hidden flex items-center justify-center">
                {item.foto ? (
                  <img src={item.foto} alt={item.nome} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Package className="h-12 w-12" />
                    <span className="text-sm">Sem imagem</span>
                  </div>
                )}
              </div>

              {/* Informações */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold">{item.nome}</h4>
                  <p className="text-sm text-gray-500">ID: {item.id.slice(0, 8)}...</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Categoria</label>
                    <p className="font-medium">{item.Categoria?.nome || item.categoria || "Sem categoria"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Status</label>
                    <div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(item.status).cor}`}>
                        {getStatusInfo(item.status).icone}
                        {getStatusInfo(item.status).texto}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Preço</label>
                    <p className="text-2xl font-bold text-amber-600">{formatCurrency(item.preco)}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Quantidade</label>
                    <div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getEstoqueInfo(item.quantidade).cor}`}>
                        {getEstoqueInfo(item.quantidade).icone}
                        {item.quantidade} unidades
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500">Descrição</label>
                  <p className="text-gray-700 mt-1 text-sm">{item.descricao || "Sem descrição"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <label className="text-xs text-gray-500">Criado em</label>
                    <p className="text-sm">{new Date(item.criadoEm).toLocaleDateString("pt-BR")}</p>
                  </div>
                  {item.atualizadoEm && (
                    <div>
                      <label className="text-xs text-gray-500">Atualizado em</label>
                      <p className="text-sm">{new Date(item.atualizadoEm).toLocaleDateString("pt-BR")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== MODAL DE EXCLUSÃO ==========

const ModalExcluirEstoque = ({
  isOpen,
  onClose,
  onConfirm,
  item,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: EstoqueItem | null;
  loading?: boolean;
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertOctagon className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Excluir Item do Estoque</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Tem certeza que deseja excluir <strong>{item.nome}</strong> do estoque?
                  </p>
                  <p className="text-sm text-red-500 mt-1">Esta ação não pode ser desfeita.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sim, Excluir"}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== TABELA DE ESTOQUE ==========

const TabelaEstoque = ({
  items,
  loading,
  onVisualizar,
  onEditar,
  onExcluir,
}: {
  items: EstoqueItem[];
  loading: boolean;
  onVisualizar: (item: EstoqueItem) => void;
  onEditar: (item: EstoqueItem) => void;
  onExcluir: (item: EstoqueItem) => void;
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow">
        <Warehouse className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Estoque Vazio</h3>
        <p className="text-gray-600">Nenhum item encontrado no estoque.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => {
              const isBaixoEstoque = item.quantidade > 0 && item.quantidade < 10;
              const isSemEstoque = item.quantidade === 0;

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.foto ? (
                          <img src={item.foto} alt={item.nome} className="h-10 w-10 rounded-lg object-cover" />
                        ) : (
                          <Package className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.nome}</div>
                        <div className="text-xs text-gray-500">ID: {item.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{item.Categoria?.nome || item.categoria || "-"}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(item.preco)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isSemEstoque
                          ? "bg-red-100 text-red-800"
                          : isBaixoEstoque
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.quantidade} unid.
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === "ATIVO" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.status === "ATIVO" ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => onVisualizar(item)} className="text-gray-600 hover:text-gray-900 mr-3" title="Visualizar">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button onClick={() => onEditar(item)} className="text-blue-600 hover:text-blue-900 mr-3" title="Editar">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => onExcluir(item)} className="text-red-600 hover:text-red-900" title="Excluir">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ========== COMPONENTE PRINCIPAL ==========

export default function AdminEstoque() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  const [termoBusca, setTermoBusca] = useState("");
  const [debouncedTermo, setDebouncedTermo] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroEstoque, setFiltroEstoque] = useState("todos");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const [modalVisualizar, setModalVisualizar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<EstoqueItem | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [exportando, setExportando] = useState(false);

  // Debounce para busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTermo(termoBusca);
      setPaginaAtual(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [termoBusca]);

  // Buscar itens do estoque
  const { data: estoqueResponse, isLoading, refetch } = useQuery({
    queryKey: ["estoque", debouncedTermo, filtroStatus, filtroEstoque],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedTermo) params.append("search", debouncedTermo);
      if (filtroStatus !== "todos") params.append("status", filtroStatus);
      if (filtroEstoque !== "todos") params.append("estoque", filtroEstoque);
      
      const response = await api.get(`/estoque/get?${params.toString()}`);
      return response.data;
    },
  });

  const items: EstoqueItem[] = estoqueResponse?.data || estoqueResponse || [];

  // Buscar categorias
  const { data: categorias } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const response = await api.get("/categorias");
      return response.data?.data || response.data || [];
    },
  });

  // Estatísticas do estoque
  const estatisticas: EstatisticasEstoque = {
    totalProdutos: items.length,
    valorTotalEstoque: items.reduce((acc, item) => acc + (item.preco * item.quantidade), 0),
    produtosBaixoEstoque: items.filter(i => i.quantidade > 0 && i.quantidade < 10).length,
    produtosSemEstoque: items.filter(i => i.quantidade === 0).length,
    produtosAtivos: items.filter(i => i.status === "ATIVO").length,
    produtosInativos: items.filter(i => i.status === "INATIVO").length,
  };

  // Paginação
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const itemsPaginados = items.slice(inicio, fim);
  const totalPaginas = Math.ceil(items.length / itensPorPagina);

  const handleVisualizar = (item: EstoqueItem) => {
    setItemSelecionado(item);
    setModalVisualizar(true);
  };

  const handleEditar = (item: EstoqueItem) => {
    setItemSelecionado(item);
    setModalEditar(true);
  };

  const handleExcluir = (item: EstoqueItem) => {
    setItemSelecionado(item);
    setModalExcluir(true);
  };

  const confirmarExclusao = async () => {
    if (!itemSelecionado) return;
    setExcluindo(true);
    try {
      await api.delete(`/estoque/${itemSelecionado.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item removido do estoque!");
      await refetch();
      setModalExcluir(false);
      setItemSelecionado(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao excluir");
    } finally {
      setExcluindo(false);
    }
  };

  const handleExportar = async () => {
    setExportando(true);
    try {
      const csv = [
        ["ID", "Nome", "Categoria", "Preço", "Quantidade", "Status", "Criado em"],
        ...items.map(item => [
          item.id,
          item.nome,
          item.Categoria?.nome || item.categoria || "",
          item.preco,
          item.quantidade,
          item.status,
          new Date(item.criadoEm).toLocaleDateString("pt-BR"),
        ]),
      ].map(row => row.join(",")).join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `estoque-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Relatório exportado!");
    } catch (error) {
      toast.error("Erro ao exportar");
    } finally {
      setExportando(false);
    }
  };

  const handleProdutoAtualizado = async () => {
    await refetch();
    queryClient.invalidateQueries({ queryKey: ["estoque"] });
    toast.success("Estoque atualizado!");
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Warehouse className="h-7 w-7 text-amber-500" />
            Gestão de Estoque
          </h1>
          <p className="text-gray-600">Controle de inventário e movimentações</p>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleExportar} disabled={exportando} variant="outline" className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {exportando ? "Exportando..." : "Exportar"}
          </Button>

          <Button onClick={() => refetch()} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Atualizar
          </Button>

          <ModalNovoEstoque onProdutoCriado={handleProdutoAtualizado}>
            <Button className="flex items-center gap-2 bg-amber-500 text-white hover:bg-amber-600">
              <Plus className="h-5 w-5" />
              Novo Item
            </Button>
          </ModalNovoEstoque>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Itens</p>
              <p className="text-2xl font-bold">{estatisticas.totalProdutos}</p>
            </div>
            <Box className="h-8 w-8 text-amber-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Valor Estoque</p>
              <p className="text-lg font-bold text-amber-600">
                Kz {estatisticas.valorTotalEstoque.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Baixo Estoque</p>
              <p className="text-2xl font-bold text-yellow-600">{estatisticas.produtosBaixoEstoque}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Esgotados</p>
              <p className="text-2xl font-bold text-red-600">{estatisticas.produtosSemEstoque}</p>
            </div>
            <AlertOctagon className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Ativos</p>
              <p className="text-2xl font-bold text-green-600">{estatisticas.produtosAtivos}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Inativos</p>
              <p className="text-2xl font-bold text-gray-600">{estatisticas.produtosInativos}</p>
            </div>
            <X className="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome do produto..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="flex items-center gap-2 px-4 py-3 border rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-5 w-5" />
            Filtros
            <ChevronRight className={`h-4 w-4 transition-transform ${mostrarFiltros ? "rotate-90" : ""}`} />
          </button>
        </div>

        {mostrarFiltros && (
          <div className="mt-4 pt-4 border-t grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filtroStatus}
                onChange={(e) => { setFiltroStatus(e.target.value); setPaginaAtual(1); }}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="todos">Todos</option>
                <option value="ATIVO">Ativos</option>
                <option value="INATIVO">Inativos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nível de Estoque</label>
              <select
                value={filtroEstoque}
                onChange={(e) => { setFiltroEstoque(e.target.value); setPaginaAtual(1); }}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="todos">Todos</option>
                <option value="normal">Normal (&gt;10)</option>
                <option value="baixo">Baixo (1-9)</option>
                <option value="zero">Esgotado (0)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Tabela */}
      <TabelaEstoque
        items={itemsPaginados}
        loading={isLoading}
        onVisualizar={handleVisualizar}
        onEditar={handleEditar}
        onExcluir={handleExcluir}
      />

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
            disabled={paginaAtual === 1}
            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="px-4 py-2 text-sm">
            Página {paginaAtual} de {totalPaginas}
          </span>
          <button
            onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
            disabled={paginaAtual === totalPaginas}
            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Modais */}
      <ModalVisualizarEstoque
        isOpen={modalVisualizar}
        onClose={() => { setModalVisualizar(false); setItemSelecionado(null); }}
        item={itemSelecionado}
      />

      <ModalEditarEstoque
        isOpen={modalEditar}
        onClose={() => { setModalEditar(false); setItemSelecionado(null); }}
        item={itemSelecionado}
        categorias={categorias || []}
        onAtualizado={handleProdutoAtualizado}
      />

      <ModalExcluirEstoque
        isOpen={modalExcluir}
        onClose={() => { setModalExcluir(false); setItemSelecionado(null); }}
        onConfirm={confirmarExclusao}
        item={itemSelecionado}
        loading={excluindo}
      />
    </div>
  );
}
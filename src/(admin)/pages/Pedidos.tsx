"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  CreditCard,
  MoreVertical,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Clock,
  Loader2,
  AlertCircle,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { api } from "@/modules/services/api/axios";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface Pedido {
  id: string;
  numeroPedido: string;
  usuario: {
    nome: string;
    email: string;
  };
  status: string;
  total: number;
  criadoEm: string;
  pagamento: Array<{
    metodoPagamento: string;
    status: string;
  }>;
  itempedido: Array<{
    quantidade: number;
  }>;
}

interface Paginacao {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Estatisticas {
  totalPedidos: number;
  pedidosPorStatus: Record<string, number>;
}

export default function AdminPedidos() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroPagamento, setFiltroPagamento] = useState("todos");
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");
  const [ordenar, setOrdenar] = useState("criadoEm_desc");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [paginacao, setPaginacao] = useState<Paginacao>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    totalPedidos: 0,
    pedidosPorStatus: {},
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportando, setExportando] = useState(false);

  const statusPedidos = {
    PAGAMENTO_PENDENTE: {
      label: "Pagamento Pendente",
      cor: "bg-yellow-100 text-yellow-800",
      icon: <Clock className="h-4 w-4" />,
    },
    AGUARDANDO_PAGAMENTO: {
      label: "Aguardando Pagamento",
      cor: "bg-blue-100 text-blue-800",
      icon: <CreditCard className="h-4 w-4" />,
    },
    APROVADO: {
      label: "Aprovado",
      cor: "bg-green-100 text-green-800",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    PROCESSANDO: {
      label: "Processando",
      cor: "bg-purple-100 text-purple-800",
      icon: <Package className="h-4 w-4" />,
    },
    ENVIADO: {
      label: "Enviado",
      cor: "bg-orange-100 text-orange-800",
      icon: <Truck className="h-4 w-4" />,
    },
    ENTREGUE: {
      label: "Entregue",
      cor: "bg-green-100 text-green-800",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    CANCELADO: {
      label: "Cancelado",
      cor: "bg-red-100 text-red-800",
      icon: <XCircle className="h-4 w-4" />,
    },
  };

  const metodosPagamento = {
    PIX: { label: "PIX", cor: "bg-green-100 text-green-800" },
    CARTAO_CREDITO: {
      label: "Cartão Crédito",
      cor: "bg-blue-100 text-blue-800",
    },
    CARTAO_DEBITO: {
      label: "Cartão Débito",
      cor: "bg-purple-100 text-purple-800",
    },
    BOLETO: { label: "Boleto", cor: "bg-yellow-100 text-yellow-800" },
  };

  // Função para buscar pedidos
  const fetchPedidos = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: paginaAtual.toString(),
        limit: itensPorPagina.toString(),
      });

      if (busca) params.append("busca", busca);
      if (filtroStatus !== "todos") params.append("status", filtroStatus);
      if (filtroDataInicio) params.append("dataInicio", filtroDataInicio);
      if (filtroDataFim) params.append("dataFim", filtroDataFim);

      const response = await api.get(`/pedidos?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setPedidos(response.data.data);
        setPaginacao({
          total: response.data.total || 0,
          page: paginaAtual,
          limit: itensPorPagina,
          totalPages: Math.ceil((response.data.total || 0) / itensPorPagina),
        });
      } else {
        throw new Error(response.data.message || "Erro ao carregar pedidos");
      }
    } catch (err: any) {
      console.error("Erro ao buscar pedidos:", err);
      let errorMessage = "Erro ao carregar pedidos";
      if (err.response) {
        errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          `Erro ${err.response.status}: ${err.response.statusText}`;
      } else if (err.request) {
        errorMessage = "Sem resposta do servidor. Verifique sua conexão.";
      } else {
        errorMessage = err.message || "Erro desconhecido";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar estatísticas
  const fetchEstatisticas = async () => {
    try {
      const response = await api.get("/vendas/hoje", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setEstatisticas({
          totalPedidos: response.data.data.resumo?.totalPedidos || 0,
          pedidosPorStatus: response.data.data.pedidosPorStatus || {},
        });
      }
    } catch (err) {
      console.error("Erro ao buscar estatísticas:", err);
      // Fallback: calcular estatísticas dos pedidos carregados
      if (pedidos.length > 0) {
        const pedidosPorStatus: Record<string, number> = {};
        pedidos.forEach((pedido) => {
          pedidosPorStatus[pedido.status] =
            (pedidosPorStatus[pedido.status] || 0) + 1;
        });
        setEstatisticas({
          totalPedidos: pedidos.length,
          pedidosPorStatus,
        });
      }
    }
  };

  // Função para exportar pedidos
  const handleExportar = async () => {
    try {
      setExportando(true);

      const params = new URLSearchParams();
      if (busca) params.append("busca", busca);
      if (filtroStatus !== "todos") params.append("status", filtroStatus);
      if (filtroPagamento !== "todos")
        params.append("metodoPagamento", filtroPagamento);
      if (filtroDataInicio) params.append("dataInicio", filtroDataInicio);
      if (filtroDataFim) params.append("dataFim", filtroDataFim);

      const response = await api.get(`/pedidos/exportar?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      // Criar link para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `pedidos_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Pedidos exportados com sucesso!");
    } catch (err: any) {
      console.error("Erro ao exportar pedidos:", err);
      toast.error(err.response?.data?.message || "Erro ao exportar pedidos");
    } finally {
      setExportando(false);
    }
  };

  // Efeito para buscar dados
  useEffect(() => {
    if (!token) {
      setError("Faça login para acessar os pedidos");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      await fetchPedidos();
      fetchEstatisticas();
    };

    loadData();
  }, [
    paginaAtual,
    busca,
    filtroStatus,
    filtroPagamento,
    filtroDataInicio,
    filtroDataFim,
    ordenar,
    token,
  ]);

  // Funções de navegação
  const handleVisualizarPedido = (id: string) => {
    navigate(`/admin/pedidos/${id}`);
  };

  const handleAlterarStatus = async (id: string, novoStatus: string) => {
    if (
      !confirm(
        `Alterar status do pedido para ${
          statusPedidos[novoStatus as keyof typeof statusPedidos]?.label ||
          novoStatus
        }?`
      )
    ) {
      return;
    }

    try {
      const response = await api.put(
        `/pedidos/${id}/status`,
        {
          status: novoStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Status do pedido alterado com sucesso!");
        fetchPedidos(); // Recarregar lista
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Erro ao alterar status do pedido"
      );
    }
  };

  const handleImprimirNota = (id: string) => {
    // Lógica para imprimir nota fiscal
    window.open(`/admin/pedidos/${id}/nota`, "_blank");
  };

  // Calcular estatísticas locais como fallback
  const calcularEstatisticasLocais = () => {
    const stats: Record<string, number> = {};
    pedidos.forEach((pedido) => {
      stats[pedido.status] = (stats[pedido.status] || 0) + 1;
    });
    return stats;
  };

  const estatisticasLocais = calcularEstatisticasLocais();

  // Função para obter método de pagamento principal
  const getMetodoPagamentoPrincipal = (pagamentos: Array<any>) => {
    if (!pagamentos || pagamentos.length === 0) return "PIX";
    return pagamentos[0].metodoPagamento || "PIX";
  };

  // Função para obter quantidade total de produtos
  const getTotalProdutos = (itens: Array<any>) => {
    if (!itens) return 0;
    return itens.reduce((total, item) => total + (item.quantidade || 0), 0);
  };

  if (loading && pedidos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#D4AF37] mx-auto mb-4" />
          <p className="text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestão de Pedidos
          </h1>
          <p className="text-gray-600">Gerencie todos os pedidos da loja</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportar}
            disabled={exportando}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {exportando ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Exportar
          </button>
        </div>
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
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          {/* Busca */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setPaginaAtual(1);
                }}
                placeholder="Buscar por pedido, cliente ou e-mail..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
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
                {Object.entries(statusPedidos).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtro Pagamento */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filtroPagamento}
                onChange={(e) => {
                  setFiltroPagamento(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="todos">Todos pagamentos</option>
                {Object.entries(metodosPagamento).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filtros de Data e Ordenação */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Data Início */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Início
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={filtroDataInicio}
                onChange={(e) => {
                  setFiltroDataInicio(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          {/* Data Fim */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Fim
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={filtroDataFim}
                onChange={(e) => {
                  setFiltroDataFim(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          {/* Ordenação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordenar por
            </label>
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={ordenar}
                onChange={(e) => {
                  setOrdenar(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="criadoEm_desc">Mais recentes</option>
                <option value="criadoEm_asc">Mais antigos</option>
                <option value="total_desc">Maior valor</option>
                <option value="total_asc">Menor valor</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pedidos</p>
              <p className="text-2xl font-bold">
                {estatisticas.totalPedidos || pedidos.length}
              </p>
            </div>
            <Package className="h-8 w-8 text-[#D4AF37]" />
          </div>
        </div>

        {Object.entries(statusPedidos).map(([key, value]) => (
          <div key={key} className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{value.label}</p>
                <p className="text-2xl font-bold">
                  {estatisticas.pedidosPorStatus[key] ||
                    estatisticasLocais[key] ||
                    0}
                </p>
              </div>
              <div className={value.cor.split(" ")[0] + " p-2 rounded-full"}>
                {value.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabela de Pedidos */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37] mr-2" />
            <span>Carregando pedidos...</span>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="text-center p-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              {busca || filtroStatus !== "todos" || filtroPagamento !== "todos"
                ? "Tente ajustar seus filtros de busca"
                : "Ainda não há pedidos registrados!"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">
                      Pedido
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">
                      Cliente
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">
                      Valor
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">
                      Pagamento
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">
                      Data
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-bold truncate text-ellipsis whitespace-nowrap w-24">
                          {pedido.numeroPedido}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getTotalProdutos(pedido.itempedido)} produtos
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {pedido.usuario?.nome || "Cliente"}
                            </div>
                            <div className="text-sm truncate w-16 text-gray-500">
                              {pedido.usuario?.email || ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold">
                          {formatCurrency(pedido.total)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              statusPedidos[
                                pedido.status as keyof typeof statusPedidos
                              ]?.cor || "bg-gray-100 text-gray-800"
                            } flex items-center gap-1`}
                          >
                            {statusPedidos[
                              pedido.status as keyof typeof statusPedidos
                            ]?.icon || <Package className="h-4 w-4" />}
                            {statusPedidos[
                              pedido.status as keyof typeof statusPedidos
                            ]?.label || pedido.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            metodosPagamento[
                              getMetodoPagamentoPrincipal(
                                pedido.pagamento
                              ) as keyof typeof metodosPagamento
                            ]?.cor || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {metodosPagamento[
                            getMetodoPagamentoPrincipal(
                              pedido.pagamento
                            ) as keyof typeof metodosPagamento
                          ]?.label ||
                            getMetodoPagamentoPrincipal(pedido.pagamento)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(pedido.criadoEm)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVisualizarPedido(pedido.id)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleImprimirNota(pedido.id)}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                            title="Imprimir Nota"
                          >
                            <Printer className="h-4 w-4" />
                          </button>

                          {/* Dropdown de ações */}
                          <div className="relative group">
                            <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            <div className="absolute right-0 z-10 mt-1 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                              {pedido.status === "PAGAMENTO_PENDENTE" && (
                                <button
                                  onClick={() =>
                                    handleAlterarStatus(pedido.id, "ENVIADO")
                                  }
                                  className="w-full text-left px-4 py-2 hover:bg-green-50 text-green-600"
                                >
                                  Marcar como Pago
                                </button>
                              )}
                              {pedido.status === "APROVADO" && (
                                <button
                                  onClick={() =>
                                    handleAlterarStatus(
                                      pedido.id,
                                      "PROCESSANDO"
                                    )
                                  }
                                  className="w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-600"
                                >
                                  Iniciar Processamento
                                </button>
                              )}
                              {pedido.status === "PROCESSANDO" && (
                                <button
                                  onClick={() =>
                                    handleAlterarStatus(pedido.id, "ENVIADO")
                                  }
                                  className="w-full text-left px-4 py-2 hover:bg-orange-50 text-orange-600"
                                >
                                  Marcar como Enviado
                                </button>
                              )}
                              {pedido.status === "ENVIADO" && (
                                <button
                                  onClick={() =>
                                    handleAlterarStatus(pedido.id, "ENTREGUE")
                                  }
                                  className="w-full text-left px-4 py-2 hover:bg-green-50 text-green-600"
                                >
                                  Marcar como Entregue
                                </button>
                              )}
                              {pedido.status !== "CANCELADO" && (
                                <button
                                  onClick={() =>
                                    handleAlterarStatus(pedido.id, "CANCELADO")
                                  }
                                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                                >
                                  Cancelar Pedido
                                </button>
                              )}
                            </div>
                          </div>
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
                  Mostrando {(paginaAtual - 1) * itensPorPagina + 1}-
                  {Math.min(paginaAtual * itensPorPagina, paginacao.total)} de{" "}
                  {paginacao.total} pedidos
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                    disabled={paginaAtual === 1}
                    className="p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from(
                    { length: Math.min(5, paginacao.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (paginacao.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (paginaAtual <= 3) {
                        pageNum = i + 1;
                      } else if (paginaAtual >= paginacao.totalPages - 2) {
                        pageNum = paginacao.totalPages - 4 + i;
                      } else {
                        pageNum = paginaAtual - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPaginaAtual(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center rounded ${
                            paginaAtual === pageNum
                              ? "bg-[#D4AF37] text-white"
                              : "border hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  <button
                    onClick={() =>
                      setPaginaAtual((p) =>
                        Math.min(paginacao.totalPages, p + 1)
                      )
                    }
                    disabled={paginaAtual === paginacao.totalPages}
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

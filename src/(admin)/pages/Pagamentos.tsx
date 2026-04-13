"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Download,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  DollarSign,
  User,
  ShoppingBag,
  Phone,
  Printer,
  FileText,
  Banknote,
  Landmark,
  Smartphone,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/modules/services/api/axios";

interface Pagamento {
  data: Array<{
    id: string;
    metodo: string;
    status: "PENDENTE" | "APROVADO" | "CANCELADO";
    tipo: string;
    valor: number;
    criadoEm: string;
    atualizadoEm: string;
    pedidoId: string;
    pedido: {
      ItemPedido: Array<{
        id: string;
        quantidade: number;
        precoUnitario: number;
        precoTotal: number;
        produtoId: string;
      }>;
      HistoricoPedido: Array<{
        id: string;
        status: string;
        observacao: string | null;
        criadoEm: string;
      }>;
    };
    usuario: {
      id: string;
      nome: string;
      email: string;
      telefone: string;
      fotoUrl: string | null;
    };
  }>;
}

export default function PagamentosPage() {
  const queryClient = useQueryClient();
  const [filtros, setFiltros] = useState({
    status: "",
    metodo: "",
    dataInicio: "",
    dataFim: "",
    valorMin: "",
    valorMax: "",
    cliente: "",
  });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState<
    Pagamento["data"][0] | null
  >(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [atualizando, setAtualizando] = useState(false);

  const {
    data: pagamentosData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["pagamentos"],
    queryFn: async () => {
      const response = await api.get("/pagamentos");
      return response?.data as Pagamento;
    },
  });

  const pagamentos = pagamentosData?.data || [];

  // Estatísticas
  const estatisticas = {
    total: pagamentos?.reduce((acc, p) => acc + p.valor, 0),
    aprovado: pagamentos
      ?.filter((p) => p.status === "APROVADO")
      .reduce((acc, p) => acc + p.valor, 0),
    pendente: pagamentos
      ?.filter((p) => p.status === "PENDENTE")
      .reduce((acc, p) => acc + p.valor, 0),
    cancelado: pagamentos
      ?.filter((p) => p.status === "CANCELADO")
      .reduce((acc, p) => acc + p.valor, 0),
  };

  const percentualPago =
    estatisticas.total > 0
      ? (estatisticas.aprovado / estatisticas.total) * 100
      : 0;

  // Métodos de pagamento únicos
  const metodosUnicos = [...new Set(pagamentos?.map((p) => p.metodo))];

  // Calcular distribuição por método
  const distribuicaoMetodos = metodosUnicos.map((metodo) => {
    const total = pagamentos
      ?.filter((p) => p.metodo === metodo)
      .reduce((acc, p) => acc + p.valor, 0);
    const percentual =
      estatisticas.total > 0 ? (total / estatisticas.total) * 100 : 0;
    return { metodo, total, percentual };
  });

  // Filtrar pagamentos
  const pagamentosFiltrados = pagamentos?.filter((pagamento) => {
    if (filtros.status && pagamento.status !== filtros.status) return false;
    if (filtros.metodo && pagamento.metodo !== filtros.metodo) return false;
    if (
      filtros.cliente &&
      !pagamento.usuario.nome
        .toLowerCase()
        .includes(filtros.cliente.toLowerCase())
    )
      return false;
    if (filtros.valorMin && pagamento.valor < Number(filtros.valorMin))
      return false;
    if (filtros.valorMax && pagamento.valor > Number(filtros.valorMax))
      return false;

    if (filtros.dataInicio || filtros.dataFim) {
      const dataPagamento = new Date(pagamento.criadoEm).getTime();
      if (
        filtros.dataInicio &&
        dataPagamento < new Date(filtros.dataInicio).getTime()
      )
        return false;
      if (
        filtros.dataFim &&
        dataPagamento > new Date(filtros.dataFim + "T23:59:59").getTime()
      )
        return false;
    }
    return true;
  });

  // Paginação
  const totalPaginas = Math.ceil(pagamentosFiltrados?.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const pagamentosPaginados = pagamentosFiltrados?.slice(inicio, fim);

  const getStatusInfo = (status: Pagamento["data"][0]["status"]) => {
    switch (status) {
      case "APROVADO":
        return {
          cor: "bg-green-100 text-green-800",
          icone: <CheckCircle className="h-4 w-4" />,
          texto: "Aprovado",
        };
      case "PENDENTE":
        return {
          cor: "bg-yellow-100 text-yellow-800",
          icone: <Clock className="h-4 w-4" />,
          texto: "Pendente",
        };
      case "CANCELADO":
        return {
          cor: "bg-red-100 text-red-800",
          icone: <XCircle className="h-4 w-4" />,
          texto: "Cancelado",
        };
      default:
        return {
          cor: "bg-gray-100 text-gray-800",
          icone: <Clock className="h-4 w-4" />,
          texto: status,
        };
    }
  };

  const getMetodoIcon = (metodo: string) => {
    switch (metodo) {
      case "UNITEL_MONEY":
        return <Smartphone className="h-4 w-4 text-blue-600" />;
      case "TRANSFERENCIA_BANCARIA":
        return <Landmark className="h-4 w-4 text-green-600" />;
      case "DINHEIRO_ENTREGA":
        return <Banknote className="h-4 w-4 text-yellow-600" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMetodoCor = (metodo: string) => {
    switch (metodo) {
      case "UNITEL_MONEY":
        return "bg-blue-100";
      case "TRANSFERENCIA_BANCARIA":
        return "bg-green-100";
      case "DINHEIRO_ENTREGA":
        return "bg-yellow-100";
      default:
        return "bg-gray-100";
    }
  };

  const handleAtualizar = async () => {
    setAtualizando(true);
    await refetch();
    toast.success("Pagamentos atualizados!");
    setAtualizando(false);
  };

  const handleExportar = async () => {
    setExportando(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const csv = [
      ["ID", "Cliente", "Valor", "Método", "Status", "Data"],
      ...pagamentosFiltrados.map((p) => [
        p.id,
        p.usuario.nome,
        p.valor,
        p.metodo,
        p.status,
        new Date(p.criadoEm).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pagamentos_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Relatório exportado com sucesso!");
    setExportando(false);
  };

  const handleAprovarPagamento = async (id: string) => {
    try {
      await api.patch(`/pagamentos/${id}/aprovar`);
      queryClient.invalidateQueries({ queryKey: ["pagamentos"] });
      toast.success("Pagamento aprovado!");
    } catch (error) {
      toast.error("Erro ao aprovar pagamento");
    }
  };

  const handleCancelarPagamento = async (id: string) => {
    try {
      await api.patch(`/pagamentos/${id}/cancelar`);
      queryClient.invalidateQueries({ queryKey: ["pagamentos"] });
      toast.success("Pagamento cancelado!");
    } catch (error) {
      toast.error("Erro ao cancelar pagamento");
    }
  };

  const ModalDetalhes = ({
    pagamento,
    onClose,
  }: {
    pagamento: Pagamento["data"][number];
    onClose: () => void;
  }) => {
    const statusInfo = getStatusInfo(pagamento.status);
    const valorTotalItens = pagamento.pedido.ItemPedido.reduce(
      (acc, item) => acc + item.precoTotal,
      0,
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b sticky top-0 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Detalhes do Pagamento</h2>
                <p className="text-gray-600 text-sm font-mono">
                  {pagamento.id}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Informações do Pagamento
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1 ${statusInfo.cor}`}
                    >
                      {statusInfo.icone} {statusInfo.texto}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor:</span>
                    <span className="font-bold text-lg">
                      Kz {pagamento.valor.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método:</span>
                    <span className="flex items-center gap-2">
                      {getMetodoIcon(pagamento.metodo)} {pagamento.metodo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data:</span>
                    <span>
                      {new Date(pagamento.criadoEm).toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pedido:</span>
                    <span className="font-mono text-sm">
                      {pagamento.pedidoId}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Cliente
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                      {pagamento.usuario.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">
                        {pagamento.usuario.nome}
                      </div>
                      <div className="text-sm text-gray-600">
                        {pagamento.usuario.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{pagamento.usuario.telefone || "Não informado"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Itens do Pedido
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Produto
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Quantidade
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Preço Unitário
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {pagamento.pedido.ItemPedido.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 font-mono text-sm">
                          {item.produtoId.substring(0, 8)}...
                        </td>
                        <td className="px-4 py-3">{item.quantidade}</td>
                        <td className="px-4 py-3">
                          Kz {item.precoUnitario.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          Kz {item.precoTotal.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td colSpan={3} className="px-4 py-3 text-right">
                        Total:
                      </td>
                      <td className="px-4 py-3">
                        Kz {valorTotalItens.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {pagamento.pedido.HistoricoPedido?.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Histórico do Pedido
                </h3>
                <div className="space-y-2">
                  {pagamento.pedido.HistoricoPedido.map((historico, index) => (
                    <div
                      key={historico.id}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        {index === 0 ? "📦" : index === 1 ? "⚙️" : "🚚"}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">{historico.status}</span>
                        {historico.observacao && (
                          <span className="text-gray-500 ml-2">
                            - {historico.observacao}
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500">
                        {new Date(historico.criadoEm).toLocaleString("pt-BR")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <Printer className="h-4 w-4" /> Imprimir
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <FileText className="h-4 w-4" /> Comprovante
                </button>
              </div>
              <div className="flex items-center gap-3">
                {pagamento.status === "PENDENTE" && (
                  <>
                    <button
                      onClick={() => {
                        handleAprovarPagamento(pagamento.id);
                        onClose();
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4" /> Aprovar
                    </button>
                    <button
                      onClick={() => {
                        handleCancelarPagamento(pagamento.id);
                        onClose();
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <XCircle className="h-4 w-4" /> Cancelar
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pagamentos</h1>
          <p className="text-gray-600">
            Gerencie todos os pagamentos da sua loja
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAtualizar}
            disabled={atualizando}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <RefreshCw
              className={`h-5 w-5 ${atualizando ? "animate-spin" : ""}`}
            />
            {atualizando ? "Atualizando..." : "Atualizar"}
          </button>
          <button
            onClick={handleExportar}
            disabled={exportando}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
          >
            <Download className="h-5 w-5" />
            {exportando ? "Exportando..." : "Exportar"}
          </button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total Geral</div>
              <div className="text-2xl font-bold">
                Kz {estatisticas.total.toLocaleString()}
              </div>
            </div>
            <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Aprovados</div>
              <div className="text-2xl font-bold text-green-600">
                Kz {estatisticas.aprovado.toLocaleString()}
              </div>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">
            {percentualPago.toFixed(1)}% do total
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Pendentes</div>
              <div className="text-2xl font-bold text-yellow-600">
                Kz {estatisticas.pendente.toLocaleString()}
              </div>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Cancelados</div>
              <div className="text-2xl font-bold text-red-600">
                Kz {estatisticas.cancelado.toLocaleString()}
              </div>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Distribuição por Método */}
      {distribuicaoMetodos?.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="font-bold text-lg mb-4 flex items-center">
            <CreditCard className="h-5 w-5 mr-2" /> Distribuição por Método
          </h2>
          <div className="space-y-4">
            {distribuicaoMetodos.map(({ metodo, total, percentual }) => (
              <div key={metodo}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center ${getMetodoCor(metodo)}`}
                    >
                      {getMetodoIcon(metodo)}
                    </div>
                    <span className="font-medium">{metodo}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">Kz {total.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">
                      {percentual.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${metodo === "UNITEL_MONEY" ? "bg-blue-500" : metodo === "TRANSFERENCIA_BANCARIA" ? "bg-green-500" : "bg-amber-500"}`}
                    style={{ width: `${percentual}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cliente..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={filtros.cliente}
                onChange={(e) =>
                  setFiltros({ ...filtros, cliente: e.target.value })
                }
              />
            </div>
          </div>
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-5 w-5" /> Filtros{" "}
            <ChevronRight
              className={`h-5 w-5 transition-transform ${mostrarFiltros ? "rotate-90" : ""}`}
            />
          </button>
        </div>

        {mostrarFiltros && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full border rounded-lg px-4 py-2"
                  value={filtros.status}
                  onChange={(e) =>
                    setFiltros({ ...filtros, status: e.target.value })
                  }
                >
                  <option value="">Todos</option>
                  <option value="APROVADO">Aprovado</option>
                  <option value="PENDENTE">Pendente</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método
                </label>
                <select
                  className="w-full border rounded-lg px-4 py-2"
                  value={filtros.metodo}
                  onChange={(e) =>
                    setFiltros({ ...filtros, metodo: e.target.value })
                  }
                >
                  <option value="">Todos</option>
                  {metodosUnicos.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Início
                </label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-4 py-2"
                  value={filtros.dataInicio}
                  onChange={(e) =>
                    setFiltros({ ...filtros, dataInicio: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Fim
                </label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-4 py-2"
                  value={filtros.dataFim}
                  onChange={(e) =>
                    setFiltros({ ...filtros, dataFim: e.target.value })
                  }
                />
              </div>
              <button
                onClick={() =>
                  setFiltros({
                    status: "",
                    metodo: "",
                    dataInicio: "",
                    dataFim: "",
                    valorMin: "",
                    valorMax: "",
                    cliente: "",
                  })
                }
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Limpar Filtros
              </button>
              <button
                onClick={() => setMostrarFiltros(false)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
              >
                Aplicar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Data
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Valor
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Método
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pagamentosPaginados.map((pagamento) => {
                const statusInfo = getStatusInfo(pagamento.status);
                return (
                  <tr key={pagamento.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm">
                      {pagamento.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm">
                          {pagamento.usuario.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">
                            {pagamento.usuario.nome}
                          </div>
                          <div className="text-sm text-gray-600">
                            {pagamento.usuario.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(pagamento.criadoEm).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 font-bold">
                      Kz {pagamento.valor.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getMetodoIcon(pagamento.metodo)} {pagamento.metodo}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1 ${statusInfo.cor}`}
                      >
                        {statusInfo.icone} {statusInfo.texto}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setPagamentoSelecionado(pagamento)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Mostrando {inicio + 1} a{" "}
            {Math.min(fim, pagamentosFiltrados?.length)} de{" "}
            {pagamentosFiltrados?.length} resultados
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
              disabled={paginaAtual === 1}
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
              let paginaNum = i + 1;
              if (totalPaginas > 5 && paginaAtual > 3) {
                paginaNum = paginaAtual - 2 + i;
                if (paginaNum > totalPaginas) return null;
              }
              return (
                <button
                  key={paginaNum}
                  onClick={() => setPaginaAtual(paginaNum)}
                  className={`h-10 w-10 rounded-lg ${paginaAtual === paginaNum ? "bg-amber-500 text-white" : "border hover:bg-gray-50"}`}
                >
                  {paginaNum}
                </button>
              );
            })}
            <button
              onClick={() =>
                setPaginaAtual((p) => Math.min(totalPaginas, p + 1))
              }
              disabled={paginaAtual === totalPaginas}
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <select
              className="border rounded-lg px-3 py-2 ml-2"
              value={itensPorPagina}
              onChange={(e) => setItensPorPagina(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      {pagamentoSelecionado && (
        <ModalDetalhes
          pagamento={pagamentoSelecionado}
          onClose={() => setPagamentoSelecionado(null)}
        />
      )}
    </div>
  );
}

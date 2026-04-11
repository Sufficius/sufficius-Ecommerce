"use client";

import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Printer,
  Truck,
  Package,
  CreditCard,
  MapPin,
  Mail,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Eye,
  FileText,
  Banknote,
  Copy,
  Check,
} from "lucide-react";
import { api } from "@/modules/services/api/axios";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface Endereco {
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  pais: string;
}

interface ProdutoPedido {
  id: string;
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
  produto: {
    id: string;
    nome: string;
    preco: number;
    foto?: string;
    sku?: string;
    ImagemProduto?: Array<{ url: string; principal: boolean }>;
  };
}

interface PagamentoPedido {
  id: string;
  metodo: string;
  status: string;
  valor: number;
  comprovativoUrl?: string;
  criadoEm: string;
}

interface PedidoDetalhes {
  id: string;
  numeroPedido: string;
  status: string;
  total: number;
  frete: number;
  desconto: number;
  subtotal: number;
  observacoes?: string;
  criadoEm: string;
  atualizadoEm: string;
  usuarioId: string;
  enderecoId: string;
  statusPagamento: string;
  metodoPagamento: string;
  metodoEnvio: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
  };
  endereco: Endereco;
  ItemPedido: ProdutoPedido[];
  pagamentos?: PagamentoPedido[];
}

const statusPedidos: Record<
  string,
  { label: string; cor: string; icon: JSX.Element }
> = {
  PAGAMENTO_PENDENTE: {
    label: "Pagamento Pendente",
    cor: "bg-yellow-100 text-yellow-800",
    icon: <Clock className="h-5 w-5" />,
  },
  AGUARDANDO_CONFIRMACAO: {
    label: "Aguardando Confirmação",
    cor: "bg-blue-100 text-blue-800",
    icon: <CreditCard className="h-5 w-5" />,
  },
  APROVADO: {
    label: "Aprovado",
    cor: "bg-green-100 text-green-800",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  PROCESSANDO: {
    label: "Processando",
    cor: "bg-purple-100 text-purple-800",
    icon: <Package className="h-5 w-5" />,
  },
  ENVIADO: {
    label: "Enviado",
    cor: "bg-orange-100 text-orange-800",
    icon: <Truck className="h-5 w-5" />,
  },
  ENTREGUE: {
    label: "Entregue",
    cor: "bg-green-100 text-green-800",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  CANCELADO: {
    label: "Cancelado",
    cor: "bg-red-100 text-red-800",
    icon: <XCircle className="h-5 w-5" />,
  },
  ERRO_UPLOAD: {
    label: "Erro no Upload",
    cor: "bg-red-100 text-red-800",
    icon: <AlertCircle className="h-5 w-5" />,
  },
};

const metodosPagamento: Record<string, { label: string; icon: JSX.Element }> = {
  PIX: { label: "PIX", icon: <CreditCard className="h-4 w-4" /> },
  CARTAO_CREDITO: {
    label: "Cartão de Crédito",
    icon: <CreditCard className="h-4 w-4" />,
  },
  CARTAO_DEBITO: {
    label: "Cartão de Débito",
    icon: <CreditCard className="h-4 w-4" />,
  },
  BOLETO: { label: "Boleto Bancário", icon: <FileText className="h-4 w-4" /> },
  TRANSFERENCIA_BANCARIA: {
    label: "Transferência Bancária",
    icon: <Banknote className="h-4 w-4" />,
  },
};

const statusPagamento: Record<string, { label: string; cor: string }> = {
  PENDENTE: { label: "Pendente", cor: "bg-yellow-100 text-yellow-800" },
  AGUARDANDO_CONFIRMACAO: {
    label: "Aguardando Confirmação",
    cor: "bg-blue-100 text-blue-800",
  },
  CONFIRMADO: { label: "Confirmado", cor: "bg-green-100 text-green-800" },
  FALHOU: { label: "Falhou", cor: "bg-red-100 text-red-800" },
  REEMBOLSADO: { label: "Reembolsado", cor: "bg-gray-100 text-gray-800" },
};

export default function DetalhesPedido() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const [copiado, setCopiado] = useState(false);

  // Buscar pedido com useQuery
  const {
    data: pedido,
    isLoading,
    error: queryError,
  } = useQuery<PedidoDetalhes>({
    queryKey: ["pedido", id],
    queryFn: async () => {
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const response = await api.get(`/pedidos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📦 Resposta da API:", response.data.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Erro ao carregar pedido");
      }

      return response.data.data;
    },
    enabled: !!token && !!id,
    retry: 1,
  });

  console.log("📊 Pedido carregado:", pedido);
  console.log("📊 Itens:", pedido?.ItemPedido);
  console.log("📊 Pagamentos:", pedido?.pagamentos);

  // Mutation para alterar status
  const statusMutation = useMutation({
    mutationFn: async (novoStatus: string) => {
      const response = await api.put(
        `/pedidos/${id}/status`,
        { status: novoStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Status atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["pedido", id] });
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao atualizar status");
    },
  });

  const handleAlterarStatus = async (novoStatus: string) => {
    const statusLabel = statusPedidos[novoStatus]?.label || novoStatus;
    if (!confirm(`Alterar status do pedido para ${statusLabel}?`)) {
      return;
    }
    statusMutation.mutate(novoStatus);
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleCopiarComprovativo = (url: string) => {
    const fullUrl = url.startsWith("http")
      ? url
      : `https://rojyeqiqrvriknawugmt.supabase.co/storage/v1/object/public/sufficius-files/${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
    toast.success("Link copiado!");
  };

  const handleVerComprovativo = (url: string) => {
    const fullUrl = url.startsWith("http")
      ? url
      : `https://rojyeqiqrvriknawugmt.supabase.co/storage/v1/object/public/sufficius-files/${url}`;
    window.open(fullUrl, "_blank");
  };

  const safeFormatDate = (dateString?: string) => {
    if (!dateString) return "Data não disponível";
    try {
      return formatDate(dateString);
    } catch {
      return "Data inválida";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-gray-600">Carregando detalhes do pedido...</p>
        </div>
      </div>
    );
  }

  if (queryError || !pedido) {
    return (
      <div className="py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Erro ao carregar pedido
          </h2>
          <p className="text-red-600 mb-4">
            {queryError instanceof Error
              ? queryError.message
              : "Pedido não encontrado"}
          </p>
          <button
            onClick={() => navigate("/pedidos")}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 print:py-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/pedidos")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Detalhes do Pedido
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleImprimir}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            <Printer className="h-4 w-4" />
            Imprimir
          </button>

          {/* Menu de ações de status */}
          {pedido.status !== "CANCELADO" && pedido.status !== "ENTREGUE" && (
            <div className="relative group">
              <button
                disabled={statusMutation.isPending}
                className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 disabled:opacity-50"
              >
                {statusMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Alterar Status"
                )}
              </button>
              <div className="absolute right-0 z-10 mt-1 w-56 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {pedido.status === "PAGAMENTO_PENDENTE" && (
                  <button
                    onClick={() =>
                      handleAlterarStatus("AGUARDANDO_CONFIRMACAO")
                    }
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600"
                  >
                    Aguardando Confirmação
                  </button>
                )}
                {pedido.status === "AGUARDANDO_CONFIRMACAO" && (
                  <button
                    onClick={() => handleAlterarStatus("APROVADO")}
                    className="w-full text-left px-4 py-2 hover:bg-green-50 text-green-600"
                  >
                    Aprovar Pagamento
                  </button>
                )}
                {pedido.status === "APROVADO" && (
                  <button
                    onClick={() => handleAlterarStatus("PROCESSANDO")}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-600"
                  >
                    Iniciar Processamento
                  </button>
                )}
                {pedido.status === "PROCESSANDO" && (
                  <button
                    onClick={() => handleAlterarStatus("ENVIADO")}
                    className="w-full text-left px-4 py-2 hover:bg-orange-50 text-orange-600"
                  >
                    Marcar como Enviado
                  </button>
                )}
                {pedido.status === "ENVIADO" && (
                  <button
                    onClick={() => handleAlterarStatus("ENTREGUE")}
                    className="w-full text-left px-4 py-2 hover:bg-green-50 text-green-600"
                  >
                    Marcar como Entregue
                  </button>
                )}
                <button
                  onClick={() => handleAlterarStatus("CANCELADO")}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 border-t"
                >
                  Cancelar Pedido
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="space-y-6">
        {/* Informações do Pedido */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-gray-900">
                  Pedido #{pedido.numeroPedido}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                    statusPedidos[pedido.status]?.cor ||
                    "bg-gray-100 text-gray-800"
                  }`}
                >
                  {statusPedidos[pedido.status]?.icon}
                  {statusPedidos[pedido.status]?.label || pedido.status}
                </span>
              </div>
              <p className="text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Realizado em {safeFormatDate(pedido.criadoEm)}
              </p>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <p className="text-sm text-gray-500">Total do Pedido</p>
              <p className="text-3xl font-bold text-amber-600">
                {formatCurrency(pedido.total)}
              </p>
            </div>
          </div>

          {/* Progresso do Pedido */}
          <div className="mb-6 print:hidden">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Status do Pedido
            </p>
            <div className="flex items-center justify-between">
              {[
                "PAGAMENTO_PENDENTE",
                "APROVADO",
                "PROCESSANDO",
                "ENVIADO",
                "ENTREGUE",
              ].map((status, index) => {
                const statusAtual = pedido.status;
                const isCompleted =
                  status === "PAGAMENTO_PENDENTE" ||
                  (status === "APROVADO" &&
                    ["APROVADO", "PROCESSANDO", "ENVIADO", "ENTREGUE"].includes(
                      statusAtual,
                    )) ||
                  (status === "PROCESSANDO" &&
                    ["PROCESSANDO", "ENVIADO", "ENTREGUE"].includes(
                      statusAtual,
                    )) ||
                  (status === "ENVIADO" &&
                    ["ENVIADO", "ENTREGUE"].includes(statusAtual)) ||
                  (status === "ENTREGUE" && statusAtual === "ENTREGUE");

                const isActive = status === statusAtual;

                return (
                  <div key={status} className="flex-1 text-center">
                    <div
                      className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                            ? "bg-amber-500 text-white"
                            : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <div className="text-xs">{index + 1}</div>
                      )}
                    </div>
                    <p
                      className={`text-xs font-medium ${isActive ? "text-amber-600" : "text-gray-500"}`}
                    >
                      {statusPedidos[status]?.label || status}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Informações do Cliente */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Cliente</h3>
              </div>
              <div className="space-y-2">
                <p className="font-medium">
                  {pedido.usuario?.nome || "Cliente não informado"}
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {pedido.usuario?.email || "Email não informado"}
                </p>
              </div>
            </div>

            {/* Endereço de Entrega */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">
                  Endereço de Entrega
                </h3>
              </div>
              {pedido.endereco ? (
                <div className="space-y-1 text-gray-600">
                  <p>
                    {pedido.endereco.rua || ""}, {pedido.endereco.numero || ""}
                  </p>
                  {pedido.endereco.complemento && (
                    <p>{pedido.endereco.complemento}</p>
                  )}
                  <p>{pedido.endereco.bairro || ""}</p>
                  <p>
                    {pedido.endereco.cidade || ""} -{" "}
                    {pedido.endereco.estado || ""}
                  </p>
                  <p>CEP: {pedido.endereco.cep || ""}</p>
                  <p>{pedido.endereco.pais || "Angola"}</p>
                </div>
              ) : (
                <p className="text-gray-500">Endereço não informado</p>
              )}
            </div>
          </div>
        </div>

        {/* Itens do Pedido */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Itens do Pedido
            </h3>
          </div>

          {pedido.ItemPedido && pedido.ItemPedido.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">
                      Produto
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">
                      SKU
                    </th>
                    <th className="text-center p-4 text-sm font-medium text-gray-700">
                      Quantidade
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-gray-700">
                      Preço Unit.
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-gray-700">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.ItemPedido.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {item.produto?.foto && (
                            <img
                              src={item.produto.foto}
                              alt={item.produto.nome}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">
                              {item.produto?.nome || "Produto não encontrado"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        {item.produto?.sku || "-"}
                      </td>
                      <td className="p-4 text-center">{item.quantidade}</td>
                      <td className="p-4 text-right">
                        {formatCurrency(item.precoUnitario)}
                      </td>
                      <td className="p-4 text-right font-medium">
                        {formatCurrency(item.precoTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={4} className="p-4 text-right font-medium">
                      Subtotal:
                    </td>
                    <td className="p-4 text-right">
                      {formatCurrency(
                        pedido.subtotal ||
                          pedido.total -
                            (pedido.frete || 0) +
                            (pedido.desconto || 0),
                      )}
                    </td>
                  </tr>
                  {(pedido.frete || 0) > 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-right font-medium">
                        Frete:
                      </td>
                      <td className="p-4 text-right">
                        {formatCurrency(pedido.frete || 0)}
                      </td>
                    </tr>
                  )}
                  {(pedido.desconto || 0) > 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-4 text-right font-medium text-green-600"
                      >
                        Desconto:
                      </td>
                      <td className="p-4 text-right text-green-600">
                        -{formatCurrency(pedido.desconto || 0)}
                      </td>
                    </tr>
                  )}
                  <tr className="border-t">
                    <td
                      colSpan={4}
                      className="p-4 text-right font-bold text-lg"
                    >
                      Total:
                    </td>
                    <td className="p-4 text-right font-bold text-lg text-amber-600">
                      {formatCurrency(pedido.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>Nenhum item encontrado neste pedido</p>
            </div>
          )}
        </div>

        {/* Informações de Pagamento */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5" />
            Informações de Pagamento
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Método de Pagamento</p>
              <p className="font-medium flex items-center gap-2">
                {metodosPagamento[pedido.metodoPagamento]?.icon}
                {metodosPagamento[pedido.metodoPagamento]?.label ||
                  pedido.metodoPagamento ||
                  "Não informado"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Status do Pagamento</p>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusPagamento[pedido.statusPagamento]?.cor || "bg-gray-100"}`}
              >
                {statusPagamento[pedido.statusPagamento]?.label ||
                  pedido.statusPagamento ||
                  "Pendente"}
              </span>
            </div>
          </div>

          {/* Comprovativo de Pagamento */}
          {pedido.pagamentos &&
            pedido.pagamentos.length > 0 &&
            pedido.pagamentos[0].comprovativoUrl && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">
                  Comprovativo de Pagamento
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      handleVerComprovativo(
                        pedido.pagamentos![0].comprovativoUrl!,
                      )
                    }
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Eye className="h-4 w-4" />
                    Visualizar Comprovativo
                  </button>
                  <button
                    onClick={() =>
                      handleCopiarComprovativo(
                        pedido.pagamentos![0].comprovativoUrl!,
                      )
                    }
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-700"
                  >
                    {copiado ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copiado ? "Copiado!" : "Copiar Link"}
                  </button>
                </div>
              </div>
            )}

          {pedido.observacoes && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500 mb-1">Observações</p>
              <p className="text-gray-700">{pedido.observacoes}</p>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow p-6 print:hidden">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5" />
            Histórico do Pedido
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
              <div>
                <p className="font-medium">Pedido criado</p>
                <p className="text-sm text-gray-500">
                  {safeFormatDate(pedido.criadoEm)}
                </p>
              </div>
            </div>
            {pedido.atualizadoEm && pedido.atualizadoEm !== pedido.criadoEm && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-amber-500"></div>
                <div>
                  <p className="font-medium">
                    Status atualizado para{" "}
                    {statusPedidos[pedido.status]?.label || pedido.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    {safeFormatDate(pedido.atualizadoEm)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

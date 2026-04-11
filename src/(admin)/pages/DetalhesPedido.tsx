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
  FileText,
  Banknote,
  Phone,
  Eye,
  Copy,
  Check,
} from "lucide-react";
import { api } from "@/modules/services/api/axios";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

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

interface PedidoDetalhes {
  id: string;
  numeroPedido: string;
  status: string;
  total: number;
  frete: number;
  desconto: number;
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
    telefone?: string;
  };
  endereco: Endereco;
  ItemPedido: ProdutoPedido[];
  pagamentos?: Array<{
    id: string;
    comprovativoUrl?: string;
  }>;
}

const statusPedidos: Record<
  string,
  { label: string; cor: string; icon: JSX.Element; acao: string }
> = {
  PAGAMENTO_PENDENTE: {
    label: "Pagamento Pendente",
    cor: "bg-yellow-100 text-yellow-800",
    icon: <Clock className="h-5 w-5" />,
    acao: "Aguardando Confirmação",
  },
  AGUARDANDO_CONFIRMACAO: {
    label: "Aguardando Confirmação",
    cor: "bg-blue-100 text-blue-800",
    icon: <CreditCard className="h-5 w-5" />,
    acao: "Aprovar Pagamento",
  },
  APROVADO: {
    label: "Aprovado",
    cor: "bg-green-100 text-green-800",
    icon: <CheckCircle className="h-5 w-5" />,
    acao: "Processar",
  },
  PROCESSANDO: {
    label: "Processando",
    cor: "bg-purple-100 text-purple-800",
    icon: <Package className="h-5 w-5" />,
    acao: "Enviar",
  },
  ENVIADO: {
    label: "Enviado",
    cor: "bg-orange-100 text-orange-800",
    icon: <Truck className="h-5 w-5" />,
    acao: "Entregar",
  },
  ENTREGUE: {
    label: "Entregue",
    cor: "bg-green-100 text-green-800",
    icon: <CheckCircle className="h-5 w-5" />,
    acao: "Finalizado",
  },
  CANCELADO: {
    label: "Cancelado",
    cor: "bg-red-100 text-red-800",
    icon: <XCircle className="h-5 w-5" />,
    acao: "Cancelado",
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
  const printRef = useRef<HTMLDivElement>(null);
  const [copiado, setCopiado] = useState(false);

  const {
    data: pedido,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery<PedidoDetalhes>({
    queryKey: ["pedido", id],
    queryFn: async () => {
      if (!token) throw new Error("Token não encontrado");
      if (!id) throw new Error("ID do pedido não encontrado");

      const response = await api.get(`/pedidos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Erro ao carregar pedido");
      }

      if (!response.data.data) {
        throw new Error("Dados do pedido não encontrados");
      }

      return response.data.data;
    },
    enabled: !!token && !!id,
    retry: 1,
    staleTime: 0,
  });

  // Mutation para aprovar pedido
  const aprovarMutation = useMutation({
    mutationFn: async () => {
      const response = await api.put(
        `/pedidos/${id}/status`,
        { status: "APROVADO" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Pedido aprovado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["pedido", id] });
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao aprovar pedido");
    },
  });

  // Mutation para cancelar pedido
  const cancelarMutation = useMutation({
    mutationFn: async (motivo: string) => {
      const response = await api.put(
        `/pedidos/${id}/status`,
        { status: "CANCELADO", motivoCancelamento: motivo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Pedido cancelado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["pedido", id] });
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao cancelar pedido");
    },
  });

  const handleAprovar = () => {
    if (confirm("Deseja aprovar este pedido? O estoque será atualizado.")) {
      aprovarMutation.mutate();
    }
  };

  const handleCancelar = () => {
    const motivo = prompt("Informe o motivo do cancelamento:");
    if (motivo && motivo.trim()) {
      cancelarMutation.mutate(motivo);
    } else if (motivo !== null) {
      toast.error("Informe um motivo para o cancelamento");
    }
  };

  const handleImprimir = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Pedido_${pedido?.numeroPedido || "recibo"}`,
    onAfterPrint: () => {
      toast.success("Comprovante gerado com sucesso!");
    },
  });

  const handleCopiarComprovativo = (url: string) => {
    const fullUrl = url.startsWith("http")
      ? url
      : `https://rojyeqiqrvriknawugmt.supabase.co/storage/v1/object/public/sufficius-files/${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
    toast.success("Link copiado!");
  };

  const safeFormatDate = (dateString?: string) => {
    if (!dateString) return "Data não disponível";
    try {
      return formatDate(dateString);
    } catch {
      return "Data inválida";
    }
  };

  const getProdutoFoto = (produto: any) => {
    if (produto?.foto) return produto.foto;
    if (produto?.ImagemProduto && produto.ImagemProduto.length > 0) {
      const principal = produto.ImagemProduto.find((img: any) => img.principal);
      return principal?.url || produto.ImagemProduto[0]?.url;
    }
    return null;
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

  if (queryError || !pedido || !pedido.id) {
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

  const subtotal =
    pedido.ItemPedido?.reduce((sum, item) => sum + item.precoTotal, 0) || 0;

  // Verificar se pode aprovar (status Pendente ou Aguardando)
  const podeAprovar = ["PAGAMENTO_PENDENTE", "AGUARDANDO_CONFIRMACAO"].includes(
    pedido.status
  );
  const podeCancelar = !["CANCELADO", "ENTREGUE"].includes(pedido.status);
  const temComprovativo =
    pedido.pagamentos &&
    pedido.pagamentos.length > 0 &&
    pedido.pagamentos[0].comprovativoUrl;

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
            Imprimir Recibo
          </button>

          {podeAprovar && (
            <button
              onClick={handleAprovar}
              disabled={aprovarMutation.isPending}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {aprovarMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Aprovar Pedido
            </button>
          )}

          {podeCancelar && (
            <button
              onClick={handleCancelar}
              disabled={cancelarMutation.isPending}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              {cancelarMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Cancelar Pedido
            </button>
          )}
        </div>
      </div>

      {/* Conteúdo para impressão */}
      <div ref={printRef}>
        {/* Versão para impressão - Cabeçalho */}
        <div className="hidden print:block text-center mb-8">
          <h1 className="text-2xl font-bold">COMPROVANTE DE PEDIDO</h1>
          <p className="text-gray-600">Documento oficial de confirmação</p>
          <div className="border-t border-gray-300 my-4" />
        </div>

        {/* Conteúdo principal */}
        <div className="space-y-6">
          {/* Informações do Pedido */}
          <div className="bg-white rounded-xl shadow p-6 print:shadow-none print:p-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    Pedido #{pedido.numeroPedido || "N/A"}
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
                  {formatCurrency(pedido.total || 0)}
                </p>
              </div>
            </div>

            {/* Comprovativo de Pagamento */}
            {temComprovativo && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg print:hidden">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      Comprovativo de Pagamento
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        window.open(
                          `https://rojyeqiqrvriknawugmt.supabase.co/storage/v1/object/public/sufficius-files/${pedido.pagamentos?.[0].comprovativoUrl}`,
                          "_blank"
                        )
                      }
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="h-4 w-4" />
                      Visualizar
                    </button>
                    <button
                      onClick={() =>
                        handleCopiarComprovativo(
                          pedido.pagamentos?.[0].comprovativoUrl || ""
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
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4 print:border print:p-4">
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
                  <p className="text-gray-600 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {pedido.usuario?.telefone || "Telefone não informado"}
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4 print:border print:p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">Endereço</h3>
                </div>
                {pedido.endereco ? (
                  <div className="space-y-1 text-gray-600">
                    <p>Bairro - {pedido.endereco.bairro}</p>
                    <p>
                      {pedido.endereco.pais} - {pedido.endereco.cidade}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">Endereço não informado</p>
                )}
              </div>
            </div>
          </div>

          {/* Itens do Pedido */}
          <div className="bg-white rounded-xl shadow overflow-hidden print:shadow-none">
            <div className="p-6 border-b">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Itens do Pedido ({pedido.ItemPedido?.length || 0})
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
                      <th className="text-center p-4 text-sm font-medium text-gray-700">
                        Qtd
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
                            {getProdutoFoto(item.produto) && (
                              <img
                                src={getProdutoFoto(item.produto)!}
                                alt={item.produto?.nome}
                                className="w-12 h-12 object-cover rounded print:hidden"
                              />
                            )}
                            <p className="font-medium">
                              {item.produto?.nome || "Produto"}
                            </p>
                          </div>
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
                      <td colSpan={3} className="p-4 text-right font-medium">
                        Subtotal:
                      </td>
                      <td className="p-4 text-right">
                        {formatCurrency(subtotal)}
                      </td>
                    </tr>
                    {(pedido.frete || 0) > 0 && (
                      <tr>
                        <td colSpan={3} className="p-4 text-right font-medium">
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
                          colSpan={3}
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
                      <td colSpan={3} className="p-4 text-right font-bold text-lg">
                        TOTAL:
                      </td>
                      <td className="p-4 text-right font-bold text-lg text-amber-600">
                        {formatCurrency(pedido.total || 0)}
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
          <div className="bg-white rounded-xl shadow p-6 print:shadow-none">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5" />
              Informações de Pagamento
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Método de Pagamento</p>
                <p className="font-medium">
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

            {pedido.observacoes && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500 mb-1">Observações</p>
                <p className="text-gray-700">{pedido.observacoes}</p>
              </div>
            )}

            {/* Rodapé do comprovante */}
            <div className="mt-6 pt-4 border-t text-center text-gray-400 text-xs print:block hidden">
              <p>Este documento é um comprovante oficial do pedido</p>
              <p>Emitido em {new Date().toLocaleDateString("pt-BR")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
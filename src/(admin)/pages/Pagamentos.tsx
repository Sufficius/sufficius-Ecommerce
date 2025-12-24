"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Download,
  CreditCard,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  DollarSign,
  TrendingUp,
  TrendingDown,
  User,
  ShoppingBag,
  MapPin,
  Phone,
  Printer,
  Share2,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

interface Pagamento {
  id: string;
  cliente: {
    nome: string;
    email: string;
    telefone: string;
    avatar?: string;
  };
  pedido: string;
  data: Date;
  valor: number;
  metodo: string;
  status: "pago" | "pendente" | "estornado" | "cancelado" | "atrasado";
  gateway: string;
  parcelas: number;
  ultimaAtualizacao: Date;
  items: {
    nome: string;
    quantidade: number;
    preco: number;
  }[];
  enderecoEntrega?: {
    rua: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}

export default function PagamentosPage() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([
    {
      id: "PAY-001",
      cliente: {
        nome: "João Silva",
        email: "joao@email.com",
        telefone: "+244 923 456 789",
        avatar: "/avatars/joao.jpg",
      },
      pedido: "ORD-001",
      data: new Date(2024, 2, 15, 10, 30),
      valor: 150000,
      metodo: "Cartão de Crédito",
      status: "pago",
      gateway: "Stripe",
      parcelas: 3,
      ultimaAtualizacao: new Date(2024, 2, 15, 10, 35),
      items: [
        { nome: "iPhone 15 Pro", quantidade: 1, preco: 150000 },
        { nome: "Capa Protetora", quantidade: 1, preco: 5000 },
      ],
    },
    {
      id: "PAY-002",
      cliente: {
        nome: "Maria Santos",
        email: "maria@email.com",
        telefone: "+244 924 567 890",
      },
      pedido: "ORD-002",
      data: new Date(2024, 2, 14, 14, 20),
      valor: 75000,
      metodo: "PIX",
      status: "pendente",
      gateway: "Mercado Pago",
      parcelas: 1,
      ultimaAtualizacao: new Date(2024, 2, 14, 14, 20),
      items: [{ nome: "Notebook Dell", quantidade: 1, preco: 75000 }],
      enderecoEntrega: {
        rua: "Rua das Flores, 123",
        cidade: "Luanda",
        estado: "Luanda",
        cep: "12345-678",
      },
    },
    {
      id: "PAY-003",
      cliente: {
        nome: "Carlos Oliveira",
        email: "carlos@email.com",
        telefone: "+244 925 678 901",
      },
      pedido: "ORD-003",
      data: new Date(2024, 2, 13, 9, 15),
      valor: 45000,
      metodo: "Boleto",
      status: "atrasado",
      gateway: "PagSeguro",
      parcelas: 1,
      ultimaAtualizacao: new Date(2024, 2, 10, 9, 15),
      items: [{ nome: "Fone Bluetooth", quantidade: 2, preco: 22500 }],
    },
    {
      id: "PAY-004",
      cliente: {
        nome: "Ana Pereira",
        email: "ana@email.com",
        telefone: "+244 926 789 012",
      },
      pedido: "ORD-004",
      data: new Date(2024, 2, 12, 16, 45),
      valor: 120000,
      metodo: "Cartão de Débito",
      status: "estornado",
      gateway: "Stripe",
      parcelas: 1,
      ultimaAtualizacao: new Date(2024, 2, 13, 11, 20),
      items: [{ nome: 'TV Samsung 55"', quantidade: 1, preco: 120000 }],
    },
    {
      id: "PAY-005",
      cliente: {
        nome: "Pedro Costa",
        email: "pedro@email.com",
        telefone: "+244 927 890 123",
      },
      pedido: "ORD-005",
      data: new Date(2024, 2, 11, 11, 30),
      valor: 25000,
      metodo: "Transferência",
      status: "cancelado",
      gateway: "PayPal",
      parcelas: 1,
      ultimaAtualizacao: new Date(2024, 2, 11, 12, 0),
      items: [
        { nome: "Mouse Gamer", quantidade: 1, preco: 15000 },
        { nome: "Teclado Mecânico", quantidade: 1, preco: 10000 },
      ],
    },
  ]);

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
  const [pagamentoSelecionado, setPagamentoSelecionado] =
    useState<Pagamento | null>(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [atualizando, setAtualizando] = useState(false);

  // Estatísticas
  const estatisticas = {
    total: pagamentos.reduce((acc, p) => acc + p.valor, 0),
    pago: pagamentos
      .filter((p) => p.status === "pago")
      .reduce((acc, p) => acc + p.valor, 0),
    pendente: pagamentos
      .filter((p) => p.status === "pendente")
      .reduce((acc, p) => acc + p.valor, 0),
    atrasado: pagamentos
      .filter((p) => p.status === "atrasado")
      .reduce((acc, p) => acc + p.valor, 0),
    estornado: pagamentos
      .filter((p) => p.status === "estornado")
      .reduce((acc, p) => acc + p.valor, 0),
    cancelado: pagamentos
      .filter((p) => p.status === "cancelado")
      .reduce((acc, p) => acc + p.valor, 0),
  };

  const metodosPagamento = [
    {
      nome: "Cartão de Crédito",
      valor: pagamentos
        .filter((p) => p.metodo === "Cartão de Crédito")
        .reduce((acc, p) => acc + p.valor, 0),
      porcentagem: 45,
    },
    {
      nome: "PIX",
      valor: pagamentos
        .filter((p) => p.metodo === "PIX")
        .reduce((acc, p) => acc + p.valor, 0),
      porcentagem: 30,
    },
    {
      nome: "Boleto",
      valor: pagamentos
        .filter((p) => p.metodo === "Boleto")
        .reduce((acc, p) => acc + p.valor, 0),
      porcentagem: 15,
    },
    {
      nome: "Cartão de Débito",
      valor: pagamentos
        .filter((p) => p.metodo === "Cartão de Débito")
        .reduce((acc, p) => acc + p.valor, 0),
      porcentagem: 8,
    },
    {
      nome: "Transferência",
      valor: pagamentos
        .filter((p) => p.metodo === "Transferência")
        .reduce((acc, p) => acc + p.valor, 0),
      porcentagem: 2,
    },
  ];

  // Filtrar pagamentos
  const pagamentosFiltrados = pagamentos.filter((pagamento) => {
    if (filtros.status && pagamento.status !== filtros.status) return false;
    if (filtros.metodo && pagamento.metodo !== filtros.metodo) return false;
    if (
      filtros.cliente &&
      !pagamento.cliente.nome
        .toLowerCase()
        .includes(filtros.cliente.toLowerCase())
    )
      return false;
    if (filtros.valorMin && pagamento.valor < parseInt(filtros.valorMin))
      return false;
    if (filtros.valorMax && pagamento.valor > parseInt(filtros.valorMax))
      return false;
    if (filtros.dataInicio || filtros.dataFim) {
      const dataPagamento = pagamento.data.getTime();
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
  const totalPaginas = Math.ceil(pagamentosFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const pagamentosPaginados = pagamentosFiltrados.slice(inicio, fim);

  const getStatusInfo = (status: Pagamento["status"]) => {
    switch (status) {
      case "pago":
        return {
          cor: "bg-green-100 text-green-800",
          icone: <CheckCircle className="h-4 w-4" />,
          texto: "Pago",
        };
      case "pendente":
        return {
          cor: "bg-yellow-100 text-yellow-800",
          icone: <Clock className="h-4 w-4" />,
          texto: "Pendente",
        };
      case "estornado":
        return {
          cor: "bg-purple-100 text-purple-800",
          icone: <ArrowUpDown className="h-4 w-4" />,
          texto: "Estornado",
        };
      case "cancelado":
        return {
          cor: "bg-red-100 text-red-800",
          icone: <XCircle className="h-4 w-4" />,
          texto: "Cancelado",
        };
      case "atrasado":
        return {
          cor: "bg-orange-100 text-orange-800",
          icone: <AlertCircle className="h-4 w-4" />,
          texto: "Atrasado",
        };
    }
  };

  const handleAtualizarPagamentos = async () => {
    setAtualizando(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Pagamentos atualizados!");
    setAtualizando(false);
  };

  const handleExportar = async () => {
    setExportando(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Relatório exportado com sucesso!");
    setExportando(false);
  };

  const handleAprovarPagamento = (id: string) => {
    setPagamentos(
      pagamentos.map((p) => (p.id === id ? { ...p, status: "pago" } : p))
    );
    toast.success("Pagamento aprovado!");
  };

  const handleCancelarPagamento = (id: string) => {
    setPagamentos(
      pagamentos.map((p) => (p.id === id ? { ...p, status: "cancelado" } : p))
    );
    toast.success("Pagamento cancelado!");
  };

  const handleEstornarPagamento = (id: string) => {
    setPagamentos(
      pagamentos.map((p) => (p.id === id ? { ...p, status: "estornado" } : p))
    );
    toast.success("Pagamento estornado!");
  };

  const ModalDetalhesPagamento = ({
    pagamento,
    onClose,
  }: {
    pagamento: Pagamento;
    onClose: () => void;
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Detalhes do Pagamento</h2>
              <p className="text-gray-600">
                {pagamento.id} • {pagamento.pedido}
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

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Informações do Pagamento */}
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
                    className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1 ${
                      getStatusInfo(pagamento.status).cor
                    }`}
                  >
                    {getStatusInfo(pagamento.status).icone}
                    {getStatusInfo(pagamento.status).texto}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-bold">
                    Kz {pagamento.valor.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Método:</span>
                  <span>{pagamento.metodo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gateway:</span>
                  <span>{pagamento.gateway}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Parcelas:</span>
                  <span>{pagamento.parcelas}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data:</span>
                  <span>
                    {pagamento.data.toLocaleDateString("pt-BR")}{" "}
                    {pagamento.data.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Última Atualização:</span>
                  <span>
                    {pagamento.ultimaAtualizacao.toLocaleDateString("pt-BR")}{" "}
                    {pagamento.ultimaAtualizacao.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Informações do Cliente */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informações do Cliente
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {pagamento.cliente.avatar ? (
                      <img
                        src={pagamento.cliente.avatar}
                        alt={pagamento.cliente.nome}
                        className="h-full w-full rounded-full"
                      />
                    ) : (
                      <User className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{pagamento.cliente.nome}</div>
                    <div className="text-sm text-gray-600">
                      {pagamento.cliente.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{pagamento.cliente.telefone}</span>
                </div>
                {pagamento.enderecoEntrega && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Endereço de Entrega
                    </h4>
                    <div className="text-sm text-gray-600">
                      <div>{pagamento.enderecoEntrega.rua}</div>
                      <div>
                        {pagamento.enderecoEntrega.cidade},{" "}
                        {pagamento.enderecoEntrega.estado}
                      </div>
                      <div>CEP: {pagamento.enderecoEntrega.cep}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Itens do Pedido */}
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
                      Item
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
                  {pagamento.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3">{item.nome}</td>
                      <td className="px-4 py-3">{item.quantidade}</td>
                      <td className="px-4 py-3">
                        Kz {item.preco.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        Kz {(item.quantidade * item.preco).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td
                      colSpan={3}
                      className="px-4 py-3 text-right font-medium"
                    >
                      Total:
                    </td>
                    <td className="px-4 py-3 font-bold">
                      Kz {pagamento.valor.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Printer className="h-4 w-4" />
                Imprimir
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Share2 className="h-4 w-4" />
                Compartilhar
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                <FileText className="h-4 w-4" />
                Comprovante
              </button>
            </div>
            <div className="flex items-center gap-3">
              {pagamento.status === "pendente" && (
                <>
                  <button
                    onClick={() => {
                      handleAprovarPagamento(pagamento.id);
                      onClose();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Aprovar Pagamento
                  </button>
                  <button
                    onClick={() => {
                      handleCancelarPagamento(pagamento.id);
                      onClose();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancelar
                  </button>
                </>
              )}
              {pagamento.status === "pago" && (
                <button
                  onClick={() => {
                    handleEstornarPagamento(pagamento.id);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  Estornar Pagamento
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
            onClick={handleAtualizarPagamentos}
            disabled={atualizando}
            className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-70"
          >
            <RefreshCw
              className={`h-5 w-5 ${atualizando ? "animate-spin" : ""}`}
            />
            {atualizando ? "Atualizando..." : "Atualizar"}
          </button>

          <button
            onClick={handleExportar}
            disabled={exportando}
            className="flex items-center gap-2 px-4 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#c19b2c] disabled:opacity-70"
          >
            <Download className="h-5 w-5" />
            {exportando ? "Exportando..." : "Exportar Relatório"}
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total Recebido</div>
              <div className="text-2xl font-bold">
                Kz {estatisticas.total.toLocaleString()}
              </div>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +12% vs mês anterior
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Pagos</div>
              <div className="text-2xl font-bold">
                Kz {estatisticas.pago.toLocaleString()}
              </div>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-blue-600 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            85% dos pagamentos
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Pendentes</div>
              <div className="text-2xl font-bold">
                Kz {estatisticas.pendente.toLocaleString()}
              </div>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-yellow-600 flex items-center">
            15% dos pagamentos
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Atrasados</div>
              <div className="text-2xl font-bold">
                Kz {estatisticas.atrasado.toLocaleString()}
              </div>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-orange-600 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +5% vs mês anterior
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Estornados</div>
              <div className="text-2xl font-bold">
                Kz {estatisticas.estornado.toLocaleString()}
              </div>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ArrowUpDown className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-purple-600 flex items-center">
            2% dos pagamentos
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Cancelados</div>
              <div className="text-2xl font-bold">
                Kz {estatisticas.cancelado.toLocaleString()}
              </div>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-red-600 flex items-center">
            <TrendingDown className="h-4 w-4 mr-1" />
            -3% vs mês anterior
          </div>
        </div>
      </div>

      {/* Métodos de Pagamento */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Distribuição por Método de Pagamento
          </h2>
          <div className="text-sm text-gray-600">
            {metodosPagamento.length} métodos utilizados
          </div>
        </div>

        <div className="space-y-4">
          {metodosPagamento.map((metodo, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      metodo.nome === "Cartão de Crédito"
                        ? "bg-blue-100"
                        : metodo.nome === "PIX"
                        ? "bg-green-100"
                        : metodo.nome === "Boleto"
                        ? "bg-yellow-100"
                        : metodo.nome === "Cartão de Débito"
                        ? "bg-purple-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <CreditCard
                      className={`h-4 w-4 ${
                        metodo.nome === "Cartão de Crédito"
                          ? "text-blue-600"
                          : metodo.nome === "PIX"
                          ? "text-green-600"
                          : metodo.nome === "Boleto"
                          ? "text-yellow-600"
                          : metodo.nome === "Cartão de Débito"
                          ? "text-purple-600"
                          : "text-gray-600"
                      }`}
                    />
                  </div>
                  <span className="font-medium">{metodo.nome}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    Kz {metodo.valor.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {metodo.porcentagem}% do total
                  </div>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    metodo.nome === "Cartão de Crédito"
                      ? "bg-blue-500"
                      : metodo.nome === "PIX"
                      ? "bg-green-500"
                      : metodo.nome === "Boleto"
                      ? "bg-yellow-500"
                      : metodo.nome === "Cartão de Débito"
                      ? "bg-purple-500"
                      : "bg-gray-500"
                  }`}
                  style={{ width: `${metodo.porcentagem}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cliente, pedido ou ID..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                value={filtros.cliente}
                onChange={(e) =>
                  setFiltros({ ...filtros, cliente: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="flex items-center gap-2 px-4 py-3 border rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5" />
              Filtros
              {mostrarFiltros ? (
                <ChevronRight className="h-5 w-5 transform rotate-90" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>

            <button className="flex items-center gap-2 px-4 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#c19b2c]">
              <Plus className="h-5 w-5" />
              Novo Pagamento
            </button>
          </div>
        </div>

        {/* Filtros Avançados */}
        {mostrarFiltros && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  value={filtros.status}
                  onChange={(e) =>
                    setFiltros({ ...filtros, status: e.target.value })
                  }
                >
                  <option value="">Todos</option>
                  <option value="pago">Pago</option>
                  <option value="pendente">Pendente</option>
                  <option value="atrasado">Atrasado</option>
                  <option value="estornado">Estornado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método
                </label>
                <select
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  value={filtros.metodo}
                  onChange={(e) =>
                    setFiltros({ ...filtros, metodo: e.target.value })
                  }
                >
                  <option value="">Todos</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="PIX">PIX</option>
                  <option value="Boleto">Boleto</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Transferência">Transferência</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Mínimo
                </label>
                <input
                  type="number"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="Kz 0"
                  value={filtros.valorMin}
                  onChange={(e) =>
                    setFiltros({ ...filtros, valorMin: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Máximo
                </label>
                <input
                  type="number"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="Kz 1.000.000"
                  value={filtros.valorMax}
                  onChange={(e) =>
                    setFiltros({ ...filtros, valorMax: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Início
                </label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
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
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  value={filtros.dataFim}
                  onChange={(e) =>
                    setFiltros({ ...filtros, dataFim: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2 flex items-end gap-3">
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
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Limpar Filtros
                </button>
                <button
                  onClick={() => setMostrarFiltros(false)}
                  className="px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabela de Pagamentos */}
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
                  Pedido
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
                    <td className="px-6 py-4">
                      <div className="font-mono font-medium">
                        {pagamento.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          {pagamento.cliente.avatar ? (
                            <img
                              src={pagamento.cliente.avatar}
                              alt={pagamento.cliente.nome}
                              className="h-full w-full rounded-full"
                            />
                          ) : (
                            <User className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {pagamento.cliente.nome}
                          </div>
                          <div className="text-sm text-gray-600">
                            {pagamento.cliente.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono">{pagamento.pedido}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{pagamento.data.toLocaleDateString("pt-BR")}</div>
                      <div className="text-sm text-gray-600">
                        {pagamento.data.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold">
                        Kz {pagamento.valor.toLocaleString()}
                      </div>
                      {pagamento.parcelas > 1 && (
                        <div className="text-sm text-gray-600">
                          {pagamento.parcelas}x
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <span>{pagamento.metodo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1 ${statusInfo.cor}`}
                      >
                        {statusInfo.icone}
                        {statusInfo.texto}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPagamentoSelecionado(pagamento)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="Mais opções"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrando {inicio + 1} a {Math.min(fim, pagamentosFiltrados.length)}{" "}
            de {pagamentosFiltrados.length} resultados
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
              disabled={paginaAtual === 1}
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
              let paginaNum;
              if (totalPaginas <= 5) {
                paginaNum = i + 1;
              } else if (paginaAtual <= 3) {
                paginaNum = i + 1;
              } else if (paginaAtual >= totalPaginas - 2) {
                paginaNum = totalPaginas - 4 + i;
              } else {
                paginaNum = paginaAtual - 2 + i;
              }

              return (
                <button
                  key={paginaNum}
                  onClick={() => setPaginaAtual(paginaNum)}
                  className={`h-10 w-10 rounded-lg ${
                    paginaAtual === paginaNum
                      ? "bg-[#D4AF37] text-white"
                      : "border hover:bg-gray-50"
                  }`}
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
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Itens por página:</span>
            <select
              className="border rounded-lg px-3 py-2"
              value={itensPorPagina}
              onChange={(e) => setItensPorPagina(parseInt(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {pagamentoSelecionado && (
        <ModalDetalhesPagamento
          pagamento={pagamentoSelecionado}
          onClose={() => setPagamentoSelecionado(null)}
        />
      )}
    </div>
  );
}

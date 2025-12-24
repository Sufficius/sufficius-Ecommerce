"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  DollarSign,
  ShoppingBag,
  Users,
  CreditCard,
  Package,
  Truck,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface Metricas {
  receitaTotal: number;
  pedidosTotal: number;
  clientesTotal: number;
  ticketMedio: number;
  crescimentoReceita: number;
  crescimentoPedidos: number;
  taxaConversao: number;
}

interface RelatorioVendas {
  periodo: string;
  receita: number;
  pedidos: number;
  clientes: number;
  ticketMedio: number;
}

interface RelatorioProdutos {
  produto: string;
  categoria: string;
  vendas: number;
  quantidade: number;
  crescimento: number;
}

interface RelatorioClientes {
  segmento: string;
  quantidade: number;
  receita: number;
  ticketMedio: number;
  fidelidade: number;
}

interface RelatorioMetodosPagamento {
  metodo: string;
  quantidade: number;
  valor: number;
  taxaSucesso: number;
}

export default function RelatoriosPage() {
  const [periodo, setPeriodo] = useState("mes");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [relatorioAtivo, setRelatorioAtivo] = useState("vendas");

  // Dados de exemplo
  const [metricas] = useState<Metricas>({
    receitaTotal: 1250000,
    pedidosTotal: 1250,
    clientesTotal: 850,
    ticketMedio: 1000,
    crescimentoReceita: 12.5,
    crescimentoPedidos: 8.3,
    taxaConversao: 3.2,
  });

  const [relatorioVendas] = useState<RelatorioVendas[]>([
    {
      periodo: "Jan",
      receita: 98000,
      pedidos: 98,
      clientes: 85,
      ticketMedio: 1000,
    },
    {
      periodo: "Fev",
      receita: 105000,
      pedidos: 105,
      clientes: 92,
      ticketMedio: 1000,
    },
    {
      periodo: "Mar",
      receita: 125000,
      pedidos: 125,
      clientes: 108,
      ticketMedio: 1000,
    },
    {
      periodo: "Abr",
      receita: 118000,
      pedidos: 118,
      clientes: 102,
      ticketMedio: 1000,
    },
    {
      periodo: "Mai",
      receita: 135000,
      pedidos: 135,
      clientes: 117,
      ticketMedio: 1000,
    },
    {
      periodo: "Jun",
      receita: 142000,
      pedidos: 142,
      clientes: 123,
      ticketMedio: 1000,
    },
  ]);

  const [relatorioProdutos] = useState<RelatorioProdutos[]>([
    {
      produto: "iPhone 15 Pro",
      categoria: "Smartphones",
      vendas: 250000,
      quantidade: 25,
      crescimento: 15,
    },
    {
      produto: "Notebook Dell XPS",
      categoria: "Computadores",
      vendas: 187500,
      quantidade: 15,
      crescimento: 8,
    },
    {
      produto: 'TV Samsung 55"',
      categoria: "Eletrônicos",
      vendas: 162000,
      quantidade: 18,
      crescimento: 22,
    },
    {
      produto: "Fone Bluetooth Sony",
      categoria: "Áudio",
      vendas: 87500,
      quantidade: 35,
      crescimento: 5,
    },
    {
      produto: "Câmera Canon EOS",
      categoria: "Fotografia",
      vendas: 112000,
      quantidade: 8,
      crescimento: 18,
    },
  ]);

  const [relatorioClientes] = useState<RelatorioClientes[]>([
    {
      segmento: "Novos",
      quantidade: 250,
      receita: 187500,
      ticketMedio: 750,
      fidelidade: 0,
    },
    {
      segmento: "Recorrentes",
      quantidade: 450,
      receita: 675000,
      ticketMedio: 1500,
      fidelidade: 65,
    },
    {
      segmento: "VIP",
      quantidade: 150,
      receita: 387500,
      ticketMedio: 2583,
      fidelidade: 92,
    },
  ]);

  const [relatorioMetodosPagamento] = useState<RelatorioMetodosPagamento[]>([
    {
      metodo: "Cartão de Crédito",
      quantidade: 850,
      valor: 850000,
      taxaSucesso: 98,
    },
    { metodo: "PIX", quantidade: 250, valor: 250000, taxaSucesso: 99.5 },
    { metodo: "Boleto", quantidade: 100, valor: 100000, taxaSucesso: 85 },
    {
      metodo: "Cartão de Débito",
      quantidade: 50,
      valor: 50000,
      taxaSucesso: 97,
    },
  ]);

  const periodos = [
    { id: "dia", label: "Hoje" },
    { id: "semana", label: "Esta Semana" },
    { id: "mes", label: "Este Mês" },
    { id: "trimestre", label: "Este Trimestre" },
    { id: "ano", label: "Este Ano" },
    { id: "personalizado", label: "Personalizado" },
  ];

  const relatorios = [
    { id: "vendas", label: "Vendas", icone: <BarChart3 className="h-5 w-5" /> },
    {
      id: "produtos",
      label: "Produtos",
      icone: <Package className="h-5 w-5" />,
    },
    { id: "clientes", label: "Clientes", icone: <Users className="h-5 w-5" /> },
    {
      id: "pagamentos",
      label: "Pagamentos",
      icone: <CreditCard className="h-5 w-5" />,
    },
    { id: "entregas", label: "Entregas", icone: <Truck className="h-5 w-5" /> },
  ];

  const handleGerarRelatorio = async () => {
    setCarregando(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar relatório");
    } finally {
      setCarregando(false);
    }
  };

  const handleExportarRelatorio = async (formato: string) => {
    setExportando(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Relatório exportado em ${formato.toUpperCase()}!`);
    } catch (error) {
      toast.error("Erro ao exportar relatório");
    } finally {
      setExportando(false);
    }
  };

  const calcularCrescimento = (atual: number, anterior: number) => {
    if (anterior === 0) return 100;
    return ((atual - anterior) / anterior) * 100;
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const getCorCrescimento = (valor: number) => {
    return valor >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">Analise o desempenho da sua loja</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleGerarRelatorio()}
            disabled={carregando}
            className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-70"
          >
            <RefreshCw
              className={`h-5 w-5 ${carregando ? "animate-spin" : ""}`}
            />
            {carregando ? "Gerando..." : "Atualizar"}
          </button>

          <div className="relative">
            <button
              onClick={() => handleExportarRelatorio("pdf")}
              disabled={exportando}
              className="flex items-center gap-2 px-4 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#c19b2c] disabled:opacity-70"
            >
              <Download className="h-5 w-5" />
              {exportando ? "Exportando..." : "Exportar"}
            </button>
          </div>
        </div>
      </div>

      {/* Período */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Período do Relatório</h3>
            <div className="flex flex-wrap gap-2">
              {periodos.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPeriodo(p.id)}
                  className={`px-4 py-2 rounded-lg ${
                    periodo === p.id
                      ? "bg-[#D4AF37] text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {periodo === "personalizado" && (
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Início
                </label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="border rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="border rounded-lg px-4 py-2"
                />
              </div>
            </div>
          )}

          <button className="flex items-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
            <Filter className="h-5 w-5" />
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div
              className={`text-sm font-medium ${getCorCrescimento(
                metricas.crescimentoReceita
              )}`}
            >
              {metricas.crescimentoReceita >= 0 ? (
                <TrendingUp className="h-4 w-4 inline mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 inline mr-1" />
              )}
              {Math.abs(metricas.crescimentoReceita)}%
            </div>
          </div>
          <div className="text-2xl font-bold">
            {formatarMoeda(metricas.receitaTotal)}
          </div>
          <div className="text-sm text-gray-600">Receita Total</div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
            <div
              className={`text-sm font-medium ${getCorCrescimento(
                metricas.crescimentoPedidos
              )}`}
            >
              {metricas.crescimentoPedidos >= 0 ? (
                <TrendingUp className="h-4 w-4 inline mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 inline mr-1" />
              )}
              {Math.abs(metricas.crescimentoPedidos)}%
            </div>
          </div>
          <div className="text-2xl font-bold">
            {metricas.pedidosTotal.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total de Pedidos</div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-sm font-medium text-green-600">
              <TrendingUp className="h-4 w-4 inline mr-1" />
              8.2%
            </div>
          </div>
          <div className="text-2xl font-bold">
            {metricas.clientesTotal.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Clientes Ativos</div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-sm font-medium text-green-600">
              <TrendingUp className="h-4 w-4 inline mr-1" />
              5.4%
            </div>
          </div>
          <div className="text-2xl font-bold">
            {formatarMoeda(metricas.ticketMedio)}
          </div>
          <div className="text-sm text-gray-600">Ticket Médio</div>
        </div>
      </div>

      {/* Navegação de Relatórios */}
      <div className="bg-white rounded-xl shadow mb-8">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {relatorios.map((relatorio) => (
              <button
                key={relatorio.id}
                onClick={() => setRelatorioAtivo(relatorio.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  relatorioAtivo === relatorio.id
                    ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {relatorio.icone}
                {relatorio.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Relatório de Vendas */}
          {relatorioAtivo === "vendas" && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Gráfico de Vendas */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-6">Vendas por Período</h3>
                  <div className="space-y-4">
                    {relatorioVendas.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{item.periodo}</div>
                          <div className="font-bold">
                            {formatarMoeda(item.receita)}
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#D4AF37]"
                            style={{
                              width: `${(item.receita / 150000) * 100}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{item.pedidos} pedidos</span>
                          <span>{item.clientes} clientes</span>
                          <span>Tk: {formatarMoeda(item.ticketMedio)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Métricas de Vendas */}
                <div className="space-y-6">
                  <div className="bg-white border rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4">
                      Taxa de Conversão
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold">
                        {metricas.taxaConversao}%
                      </div>
                      <div className="text-sm text-green-600">
                        <TrendingUp className="h-4 w-4 inline mr-1" />
                        +0.8%
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${metricas.taxaConversao}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white border rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4">Vendas por Hora</h3>
                    <div className="space-y-2">
                      {[
                        { hora: "08:00-10:00", vendas: 45000, porcentagem: 30 },
                        { hora: "10:00-12:00", vendas: 75000, porcentagem: 50 },
                        { hora: "12:00-14:00", vendas: 60000, porcentagem: 40 },
                        { hora: "14:00-16:00", vendas: 90000, porcentagem: 60 },
                        {
                          hora: "16:00-18:00",
                          vendas: 105000,
                          porcentagem: 70,
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="text-sm">{item.hora}</div>
                          <div className="text-sm font-medium">
                            {formatarMoeda(item.vendas)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabela de Vendas Detalhada */}
              <div className="bg-white border rounded-xl overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="font-bold text-lg">Vendas Detalhadas</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Período
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Receita
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Pedidos
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Clientes
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Ticket Médio
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Crescimento
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {relatorioVendas.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 font-medium">
                            {item.periodo} 2024
                          </td>
                          <td className="px-6 py-4 font-bold">
                            {formatarMoeda(item.receita)}
                          </td>
                          <td className="px-6 py-4">{item.pedidos}</td>
                          <td className="px-6 py-4">{item.clientes}</td>
                          <td className="px-6 py-4">
                            {formatarMoeda(item.ticketMedio)}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-green-600 font-medium">
                              <TrendingUp className="h-4 w-4 inline mr-1" />
                              {calcularCrescimento(
                                item.receita,
                                100000
                              ).toFixed(1)}
                              %
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Relatório de Produtos */}
          {relatorioAtivo === "produtos" && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Top Produtos */}
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-6">
                    Produtos Mais Vendidos
                  </h3>
                  <div className="space-y-4">
                    {relatorioProdutos.map((produto, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{produto.produto}</div>
                            <div className="text-sm text-gray-600">
                              {produto.categoria}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">
                              {formatarMoeda(produto.vendas)}
                            </div>
                            <div
                              className={`text-sm ${
                                produto.crescimento >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {produto.crescimento >= 0 ? (
                                <TrendingUp className="h-3 w-3 inline mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 inline mr-1" />
                              )}
                              {Math.abs(produto.crescimento)}%
                            </div>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{
                              width: `${(produto.vendas / 250000) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estoque */}
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-6">Análise de Estoque</h3>
                  <div className="space-y-4">
                    {[
                      {
                        produto: "iPhone 15 Pro",
                        estoque: 15,
                        minimo: 10,
                        status: "normal",
                      },
                      {
                        produto: "Notebook Dell",
                        estoque: 8,
                        minimo: 5,
                        status: "alerta",
                      },
                      {
                        produto: "TV Samsung",
                        estoque: 3,
                        minimo: 5,
                        status: "critico",
                      },
                      {
                        produto: "Fone Bluetooth",
                        estoque: 25,
                        minimo: 15,
                        status: "normal",
                      },
                      {
                        produto: "Câmera Canon",
                        estoque: 12,
                        minimo: 8,
                        status: "normal",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{item.produto}</div>
                          <div className="text-sm text-gray-600">
                            Estoque: {item.estoque} • Mínimo: {item.minimo}
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.status === "normal"
                              ? "bg-green-100 text-green-800"
                              : item.status === "alerta"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status === "normal"
                            ? "Normal"
                            : item.status === "alerta"
                            ? "Alerta"
                            : "Crítico"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tabela de Produtos */}
              <div className="bg-white border rounded-xl overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="font-bold text-lg">Análise de Produtos</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Produto
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Categoria
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Vendas
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Quantidade
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Crescimento
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Margem
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {relatorioProdutos.map((produto, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 font-medium">
                            {produto.produto}
                          </td>
                          <td className="px-6 py-4">{produto.categoria}</td>
                          <td className="px-6 py-4 font-bold">
                            {formatarMoeda(produto.vendas)}
                          </td>
                          <td className="px-6 py-4">{produto.quantidade}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`font-medium ${
                                produto.crescimento >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {produto.crescimento >= 0 ? (
                                <TrendingUp className="h-4 w-4 inline mr-1" />
                              ) : (
                                <TrendingDown className="h-4 w-4 inline mr-1" />
                              )}
                              {Math.abs(produto.crescimento)}%
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-green-600 font-medium">
                              42%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Relatório de Clientes */}
          {relatorioAtivo === "clientes" && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Segmentação */}
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-6">
                    Segmentação de Clientes
                  </h3>
                  <div className="space-y-4">
                    {relatorioClientes.map((segmento, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              {segmento.segmento}
                            </div>
                            <div className="text-sm text-gray-600">
                              {segmento.quantidade} clientes
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">
                              {formatarMoeda(segmento.receita)}
                            </div>
                            <div className="text-sm text-gray-600">
                              Ticket: {formatarMoeda(segmento.ticketMedio)}
                            </div>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              segmento.segmento === "Novos"
                                ? "bg-blue-500"
                                : segmento.segmento === "Recorrentes"
                                ? "bg-green-500"
                                : "bg-purple-500"
                            }`}
                            style={{
                              width: `${(segmento.quantidade / 850) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fidelidade */}
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-6">Taxa de Fidelidade</h3>
                  <div className="space-y-6">
                    {relatorioClientes
                      .filter((s) => s.fidelidade > 0)
                      .map((segmento, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">
                              {segmento.segmento}
                            </div>
                            <div className="font-bold">
                              {segmento.fidelidade}%
                            </div>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                segmento.segmento === "Recorrentes"
                                  ? "bg-green-500"
                                  : "bg-purple-500"
                              }`}
                              style={{ width: `${segmento.fidelidade}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Relatório de Pagamentos */}
          {relatorioAtivo === "pagamentos" && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Métodos de Pagamento */}
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-6">
                    Métodos de Pagamento
                  </h3>
                  <div className="space-y-4">
                    {relatorioMetodosPagamento.map((metodo, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{metodo.metodo}</div>
                          <div className="text-right">
                            <div className="font-bold">
                              {formatarMoeda(metodo.valor)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {metodo.quantidade} transações
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Taxa de Sucesso: {metodo.taxaSucesso}%</span>
                          <span>
                            {(metodo.valor * 100).toFixed(1)}% do total
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              metodo.metodo === "Cartão de Crédito"
                                ? "bg-blue-500"
                                : metodo.metodo === "PIX"
                                ? "bg-green-500"
                                : metodo.metodo === "Boleto"
                                ? "bg-yellow-500"
                                : "bg-purple-500"
                            }`}
                            style={{ width: `${metodo.valor * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

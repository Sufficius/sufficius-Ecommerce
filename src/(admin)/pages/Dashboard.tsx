"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  MoreVertical,
  Loader2,
} from "lucide-react";
import SalesChart from "../components/Charts/SalesChart";
import RevenueChart from "../components/Charts/RevenueChart";
import TopProductsChart from "../components/Charts/TopProductChart";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { api } from "@/modules/services/api/axios";
import { formatCurrency, formatDate } from "@/lib/utils";

interface VendasResumo {
  totalVendas: number;
  totalPedidos: number;
  totalItens: number;
  ticketMedio: number;
}

interface PedidoResumo {
  id: string;
  numeroPedido: string;
  usuario: {
    nome: string;
    email: string;
  };
  status: string;
  total: number;
  criadoEm: string;
  itens: number;
}

interface ProdutoTop {
  id: string;
  nome: string;
  quantidade: number;
  total: number;
}

interface DashboardData {
  periodo: {
    inicio: string;
    fim: string;
  };
  resumo: VendasResumo;
  pedidosPorStatus: Record<string, number>;
  produtosMaisVendidos: ProdutoTop[];
  pedidos: PedidoResumo[];
}

// Dados iniciais padrão
const dadosIniciais: DashboardData = {
  periodo: {
    inicio: new Date().toISOString(),
    fim: new Date().toISOString(),
  },
  resumo: {
    totalVendas: 0,
    totalPedidos: 0,
    totalItens: 0,
    ticketMedio: 0,
  },
  pedidosPorStatus: {},
  produtosMaisVendidos: [],
  pedidos: [],
};

export default function AdminDashboard() {
  const [periodo, setPeriodo] = useState("hoje");
  const [dados, setDados] = useState<DashboardData>(dadosIniciais);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  // Função para buscar vendas de hoje
  const fetchVendasHoje = async (authToken: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!authToken) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.get("/vendas/hoje", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log("Resposta da API (/vendas/hoje):", response.data);

      if (response.data && response.data.data) {
        const dadosApi = response.data.data;
        
        // Verificar e garantir que todos os campos existam
        const dadosProcessados: DashboardData = {
          periodo: dadosApi.periodo || dadosIniciais.periodo,
          resumo: {
            totalVendas: dadosApi.resumo?.totalVendas || 0,
            totalPedidos: dadosApi.resumo?.totalPedidos || 0,
            totalItens: dadosApi.resumo?.totalItens || 0,
            ticketMedio: dadosApi.resumo?.ticketMedio || 0,
          },
          pedidosPorStatus: dadosApi.pedidosPorStatus || {},
          produtosMaisVendidos: dadosApi.produtosMaisVendidos || [],
          pedidos: dadosApi.pedidos || [],
        };

        // Se ticketMedio for NaN, calcular com base nos dados
        if (isNaN(dadosProcessados.resumo.ticketMedio) || dadosProcessados.resumo.ticketMedio === 0) {
          dadosProcessados.resumo.ticketMedio = dadosProcessados.resumo.totalPedidos > 0 
            ? dadosProcessados.resumo.totalVendas / dadosProcessados.resumo.totalPedidos 
            : 0;
        }

        setDados(dadosProcessados);
      } else {
        throw new Error("Estrutura de dados inválida da API");
      }
    } catch (err: any) {
      console.error("Erro ao buscar vendas:", err);
      
      // Se for erro 404, a rota pode não existir ainda
      if (err.response?.status === 404) {
        setError("Rota de vendas não disponível. Usando dados de demonstração.");
        setDados(gerarDadosDemonstracao());
      } else {
        setError(err.message || "Erro ao carregar dados do dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar vendas por período
  const fetchVendasPorPeriodo = async (
    authToken: string,
    inicio?: string,
    fim?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      if (!authToken) {
        throw new Error("Usuário não autenticado");
      }

      const params: any = {};
      if (inicio) params.inicio = inicio;
      if (fim) params.fim = fim;

      const response = await api.get("/vendas/periodo", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params,
      });

      console.log("Resposta da API (/vendas/periodo):", response.data);

      if (response.data && response.data.success && response.data.data) {
        const dadosApi = response.data.data;
        
        const dadosProcessados: DashboardData = {
          periodo: dadosApi.periodo || dadosIniciais.periodo,
          resumo: {
            totalVendas: dadosApi.totalVendas || 0,
            totalPedidos: dadosApi.totalPedidos || 0,
            totalItens: 0, // Não disponível nesta rota
            ticketMedio: dadosApi.totalPedidos > 0 
              ? (dadosApi.totalVendas || 0) / (dadosApi.totalPedidos || 1) 
              : 0,
          },
          pedidosPorStatus: {},
          produtosMaisVendidos: [],
          pedidos: dadosApi.pedidos || [],
        };

        setDados(dadosProcessados);
      } else {
        throw new Error("Erro ao carregar dados da API");
      }
    } catch (err: any) {
      console.error("Erro ao buscar vendas por período:", err);
      
      if (err.response?.status === 404) {
        setError("Rota de vendas por período não disponível. Usando dados de demonstração.");
        setDados(gerarDadosDemonstracao());
      } else {
        setError(err.message || "Erro ao carregar dados do dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar dashboard público
  const fetchDashboardPublico = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/vendas/dashboard");
      console.log("Resposta da API (/vendas/dashboard):", response.data);

      if (response.data && response.data.success) {
        const dashboardData = response.data.data;
        setDados({
          periodo: {
            inicio: new Date().toISOString(),
            fim: new Date().toISOString(),
          },
          resumo: {
            totalVendas: dashboardData.hoje?.total || 0,
            totalPedidos: dashboardData.hoje?.pedidos || 0,
            totalItens: 0,
            ticketMedio: dashboardData.hoje?.pedidos > 0
              ? (dashboardData.hoje?.total || 0) / dashboardData.hoje?.pedidos
              : 0,
          },
          pedidosPorStatus: {},
          produtosMaisVendidos: [],
          pedidos: [],
        });
      } else {
        throw new Error("Estrutura de dados inválida da API pública");
      }
    } catch (err: any) {
      console.error("Erro ao buscar dashboard público:", err);
      
      if (err.response?.status === 404) {
        setError("Dashboard público não disponível. Usando dados de demonstração.");
        setDados(gerarDadosDemonstracao());
      } else {
        setError("Erro ao carregar dados do dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  // Gerar dados de demonstração
  const gerarDadosDemonstracao = (): DashboardData => {
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);
    
    return {
      periodo: {
        inicio: hoje.toISOString(),
        fim: hoje.toISOString(),
      },
      resumo: {
        totalVendas: 12587.90,
        totalPedidos: 24,
        totalItens: 48,
        ticketMedio: 524.50,
      },
      pedidosPorStatus: {
        ENTREGUE: 15,
        PROCESSANDO: 5,
        CONFIRMADO: 4,
      },
      produtosMaisVendidos: [
        { id: "1", nome: "iPhone 15 Pro", quantidade: 12, total: 47988.00 },
        { id: "2", nome: "Notebook Dell", quantidade: 8, total: 31992.00 },
        { id: "3", nome: "AirPods Pro", quantidade: 15, total: 14985.00 },
        { id: "4", nome: "Monitor 4K", quantidade: 6, total: 11994.00 },
        { id: "5", nome: "Teclado Mecânico", quantidade: 10, total: 8990.00 },
      ],
      pedidos: Array.from({ length: 5 }, (_, i) => ({
        id: `ORD${1000 + i}`,
        numeroPedido: `#SC00${i + 1}`,
        usuario: {
          nome: ["João Silva", "Maria Santos", "Pedro Costa", "Ana Oliveira", "Carlos Lima"][i],
          email: `cliente${i + 1}@exemplo.com`,
        },
        status: ["ENTREGUE", "PROCESSANDO", "CONFIRMADO", "ENTREGUE", "CANCELADO"][i],
        total: [899.90, 1299.00, 2499.00, 549.90, 899.90][i],
        criadoEm: new Date(Date.now() - i * 86400000).toISOString(), // Dias atrás
        itens: [2, 3, 1, 4, 2][i],
      })),
    };
  };

  useEffect(() => {
    const loadData = async () => {
      // Se não tem token, tenta usar rota pública
      if (!token) {
        await fetchDashboardPublico();
        return;
      }

      try {
        switch (periodo) {
          case "hoje":
            await fetchVendasHoje(token);
            break;
          case "ontem":
            const ontem = new Date();
            ontem.setDate(ontem.getDate() - 1);
            const inicioOntem = ontem.toISOString().split("T")[0];
            const fimOntem = ontem.toISOString().split("T")[0];
            await fetchVendasPorPeriodo(token, inicioOntem, fimOntem);
            break;
          case "7dias":
            const seteDiasAtras = new Date();
            seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
            const inicio7dias = seteDiasAtras.toISOString().split("T")[0];
            const fim7dias = new Date().toISOString().split("T")[0];
            await fetchVendasPorPeriodo(token, inicio7dias, fim7dias);
            break;
          case "30dias":
            const trintaDiasAtras = new Date();
            trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
            const inicio30dias = trintaDiasAtras.toISOString().split("T")[0];
            const fim30dias = new Date().toISOString().split("T")[0];
            await fetchVendasPorPeriodo(token, inicio30dias, fim30dias);
            break;
          case "mes":
            const primeiroDiaMes = new Date();
            primeiroDiaMes.setDate(1);
            const inicioMes = primeiroDiaMes.toISOString().split("T")[0];
            const fimMes = new Date().toISOString().split("T")[0];
            await fetchVendasPorPeriodo(token, inicioMes, fimMes);
            break;
          default:
            await fetchVendasHoje(token);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setError("Erro ao carregar dados do dashboard. Usando dados de demonstração.");
        setDados(gerarDadosDemonstracao());
        setLoading(false);
      }
    };

    loadData();
  }, [periodo, token]);

  const getResumoCards = () => {
    // Garantir que os valores são números válidos
    const resumo = dados.resumo || dadosIniciais.resumo;
    
    const crescimentoVendas = 12.5;
    const crescimentoPedidos = 8.2;
    const crescimentoClientes = 5.7;

    return [
      {
        titulo: "Vendas Hoje",
        valor: formatCurrency(resumo.totalVendas || 0),
        variacao: `+${crescimentoVendas}%`,
        positivo: crescimentoVendas > 0,
        icone: <DollarSign className="h-6 w-6" />,
        cor: "bg-green-500",
      },
      {
        titulo: "Novos Pedidos",
        valor: (resumo.totalPedidos || 0).toString(),
        variacao: `+${crescimentoPedidos}%`,
        positivo: crescimentoPedidos > 0,
        icone: <ShoppingBag className="h-6 w-6" />,
        cor: "bg-blue-500",
      },
      {
        titulo: "Itens Vendidos",
        valor: (resumo.totalItens || 0).toString(),
        variacao: "+0%",
        positivo: true,
        icone: <Package className="h-6 w-6" />,
        cor: "bg-purple-500",
      },
      {
        titulo: "Ticket Médio",
        valor: formatCurrency(resumo.ticketMedio || 0),
        variacao: `+${crescimentoClientes}%`,
        positivo: crescimentoClientes > 0,
        icone: <Users className="h-6 w-6" />,
        cor: "bg-orange-500",
      },
    ];
  };

  const getPedidosRecentes = () => {
    const pedidos = dados.pedidos || [];
    
    return pedidos.slice(0, 5).map((pedido) => ({
      id: pedido.numeroPedido || `ORD${pedido.id}`,
      cliente: pedido.usuario?.nome || "Cliente",
      valor: pedido.total || 0,
      status: (pedido.status || "PENDENTE").toLowerCase(),
      data: formatDate(pedido.criadoEm || new Date().toISOString()),
    }));
  };

  const getProdutosTop = () => {
    const produtos = dados.produtosMaisVendidos || [];
    
    return produtos.slice(0, 5).map((produto) => ({
      nome: produto.nome || "Produto",
      vendas: produto.quantidade || 0,
      estoque: 45, // Mock para demonstração
    }));
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    const cores: any = {
      entregue: "bg-green-100 text-green-800",
      processando: "bg-blue-100 text-blue-800",
      confirmado: "bg-yellow-100 text-yellow-800",
      preparando: "bg-orange-100 text-orange-800",
      enviado: "bg-purple-100 text-purple-800",
      pago: "bg-green-100 text-green-800",
      pendente: "bg-gray-100 text-gray-800",
      cancelado: "bg-red-100 text-red-800",
      pagamento_pendente: "bg-red-100 text-red-800",
    };
    return cores[statusLower] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      entregue: "Entregue",
      processando: "Processando",
      confirmado: "Confirmado",
      preparando: "Preparando",
      enviado: "Enviado",
      pago: "Pago",
      pendente: "Pendente",
      cancelado: "Cancelado",
      pagamento_pendente: "Pagamento Pendente",
    };
    return statusMap[status.toLowerCase()] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#D4AF37] mx-auto mb-4" />
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const resumoCards = getResumoCards();
  const pedidosRecentes = getPedidosRecentes();
  const produtosTop = getProdutosTop();

  return (
    <div className="py-8">
      {/* Header do Dashboard */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Bem-vindo de volta, {user?.nome || "Usuário"}!
          {!token && (
            <span className="ml-2 text-amber-600 text-sm">
              (Modo visualização limitada)
            </span>
          )}
          {error && (
            <span className="ml-2 text-amber-600 text-sm">
              ({error})
            </span>
          )}
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            disabled={!token}
          >
            <option value="hoje">Hoje</option>
            <option value="ontem">Ontem</option>
            <option value="7dias">Últimos 7 dias</option>
            <option value="30dias">Últimos 30 dias</option>
            <option value="mes">Este mês</option>
          </select>
          {!token && (
            <span className="text-xs text-amber-600 ml-2">
              Faça login para usar todos os filtros
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!token}
          >
            <Filter className="h-4 w-4" />
            Filtrar
          </button>
          <button
            className="flex items-center gap-2 bg-[#D4AF37] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#c19b2c] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!token}
            onClick={() => {
              alert(`Exportando dados do período: ${periodo}`);
            }}
          >
            <Download className="h-4 w-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {resumoCards.map((item: any, index: number) => (
          <div key={index} className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  {item.titulo}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {item.valor}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${item.cor} bg-opacity-10`}>
                {item.icone}
              </div>
            </div>
            <div className="flex items-center">
              {item.positivo ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  item.positivo ? "text-green-500" : "text-red-500"
                }`}
              >
                {item.variacao}
              </span>
              <span className="text-sm text-gray-500 ml-2">vs. ontem</span>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Vendas por Período</h2>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <SalesChart periodo={periodo} dados={dados} />
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Receita Mensal</h2>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <RevenueChart dados={dados} />
        </div>
      </div>

      {/* Tabelas */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pedidos Recentes */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Pedidos Recentes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
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
                    Data
                  </th>
                </tr>
              </thead>
              <tbody>
                {pedidosRecentes.length > 0 ? (
                  pedidosRecentes.map((pedido: any) => (
                    <tr key={pedido.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{pedido.id}</td>
                      <td className="p-4">{pedido.cliente}</td>
                      <td className="p-4 font-medium">
                        KZ{" "}
                        {pedido.valor.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            pedido.status
                          )}`}
                        >
                          {getStatusText(pedido.status)}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{pedido.data}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      {token
                        ? "Nenhum pedido encontrado para o período selecionado"
                        : "Faça login para ver pedidos detalhados"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t text-center">
            <button
              className="text-[#D4AF37] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!token}
              onClick={() => {
                if (token) {
                  window.location.href = "/pedidos";
                }
              }}
            >
              Ver todos os pedidos →
            </button>
          </div>
        </div>

        {/* Produtos Mais Vendidos */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Produtos Mais Vendidos</h2>
          </div>
          <div className="p-6">
            {produtosTop.length > 0 ? (
              <TopProductsChart produtos={produtosTop} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                {token
                  ? "Nenhum dado de produtos disponível"
                  : "Faça login para ver produtos mais vendidos"}
              </div>
            )}
          </div>
          <div className="p-4 border-t text-center">
            <button
              className="text-[#D4AF37] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!token}
              onClick={() => {
                if (token) {
                  window.location.href = "/produtos";
                }
              }}
            >
              Ver todos os produtos →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
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
  AlertCircle,
  FileText,
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

// Função para exportar dados como CSV
const exportarParaCSV = (dados: DashboardData, periodo: string, tipoExportacao: string) => {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    
    let csvContent = "";
    let nomeArquivo = "";
    
    switch(tipoExportacao) {
      case 'pedidos':
        const cabecalhoPedidos = [
          "Número do Pedido",
          "Cliente",
          "Email",
          "Status",
          "Valor Total (KZ)",
          "Itens",
          "Data do Pedido"
        ];
        
        const linhasPedidos = dados.pedidos.map(pedido => [
          pedido.numeroPedido || pedido.id || "N/A",
          pedido.usuario?.nome || "Cliente",
          pedido.usuario?.email || "N/A",
          pedido.status || "PENDENTE",
          (pedido.total || 0).toFixed(2),
          (pedido.itens || 0).toString(),
          pedido.criadoEm ? formatDate(pedido.criadoEm) : "N/A"
        ]);
        
        csvContent = [
          cabecalhoPedidos.join(","),
          ...linhasPedidos.map(linha => linha.map(campo => `"${campo}"`).join(","))
        ].join("\n");
        
        nomeArquivo = `pedidos_${periodo}_${timestamp}.csv`;
        break;
        
      case 'produtos':
        const cabecalhoProdutos = [
          "Produto",
          "ID",
          "Quantidade Vendida",
          "Total Vendido (KZ)",
          "Ticket Médio"
        ];
        
        const linhasProdutos = dados.produtosMaisVendidos.map(produto => [
          produto.nome || "Produto",
          produto.id || "N/A",
          (produto.quantidade || 0).toString(),
          (produto.total || 0).toFixed(2),
          produto.quantidade > 0 ? (produto.total / produto.quantidade).toFixed(2) : "0.00"
        ]);
        
        csvContent = [
          cabecalhoProdutos.join(","),
          ...linhasProdutos.map(linha => linha.map(campo => `"${campo}"`).join(","))
        ].join("\n");
        
        nomeArquivo = `produtos_mais_vendidos_${periodo}_${timestamp}.csv`;
        break;
        
      case 'resumo':
        const cabecalhoResumo = [
          "Período",
          "Data Início",
          "Data Fim",
          "Total Vendas (KZ)",
          "Total Pedidos",
          "Total Itens",
          "Ticket Médio (KZ)"
        ];
        
        const linhaResumo = [
          periodo,
          formatDate(dados.periodo.inicio),
          formatDate(dados.periodo.fim),
          (dados.resumo.totalVendas || 0).toFixed(2),
          (dados.resumo.totalPedidos || 0).toString(),
          (dados.resumo.totalItens || 0).toString(),
          (dados.resumo.ticketMedio || 0).toFixed(2)
        ];
        
        csvContent = [
          cabecalhoResumo.join(","),
          linhaResumo.map(campo => `"${campo}"`).join(",")
        ].join("\n");
        
        nomeArquivo = `resumo_dashboard_${periodo}_${timestamp}.csv`;
        break;
        
      case 'completo':
        const sections = [
          "=== RESUMO DO DASHBOARD ===",
          `Período: ${periodo}`,
          `Data de Exportação: ${new Date().toLocaleString('pt-BR')}`,
          "",
          "=== RESUMO GERAL ===",
          [
            "Período,Data Início,Data Fim,Total Vendas (KZ),Total Pedidos,Total Itens,Ticket Médio (KZ)",
            `"${periodo}","${formatDate(dados.periodo.inicio)}","${formatDate(dados.periodo.fim)}","${(dados.resumo.totalVendas || 0).toFixed(2)}","${(dados.resumo.totalPedidos || 0)}","${(dados.resumo.totalItens || 0)}","${(dados.resumo.ticketMedio || 0).toFixed(2)}"`
          ].join("\n"),
          "",
          "=== STATUS DOS PEDIDOS ===",
          [
            "Status,Quantidade",
            ...Object.entries(dados.pedidosPorStatus || {}).map(([status, quantidade]) => 
              `"${status}","${quantidade}"`
            )
          ].join("\n"),
          "",
          "=== PEDIDOS RECENTES ===",
          [
            "Número do Pedido,Cliente,Email,Status,Valor Total (KZ),Itens,Data do Pedido",
            ...dados.pedidos.map(pedido => 
              `"${pedido.numeroPedido || pedido.id || 'N/A'}","${pedido.usuario?.nome || 'Cliente'}","${pedido.usuario?.email || 'N/A'}","${pedido.status || 'PENDENTE'}","${(pedido.total || 0).toFixed(2)}","${(pedido.itens || 0)}","${pedido.criadoEm ? formatDate(pedido.criadoEm) : 'N/A'}"`
            )
          ].join("\n"),
          "",
          "=== PRODUTOS MAIS VENDIDOS ===",
          [
            "Produto,ID,Quantidade Vendida,Total Vendido (KZ),Ticket Médio",
            ...dados.produtosMaisVendidos.map(produto => 
              `"${produto.nome || 'Produto'}","${produto.id || 'N/A'}","${produto.quantidade || 0}","${(produto.total || 0).toFixed(2)}","${produto.quantidade > 0 ? (produto.total / produto.quantidade).toFixed(2) : '0.00'}"`
            )
          ].join("\n")
        ];
        
        csvContent = sections.join("\n");
        nomeArquivo = `dashboard_completo_${periodo}_${timestamp}.csv`;
        break;
    }
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", nomeArquivo);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error("Erro ao exportar CSV:", error);
    return false;
  }
};

// Função para exportar dados como JSON
const exportarParaJSON = (dados: DashboardData, periodo: string) => {
  try {
    const dadosParaExportar = {
      metadata: {
        periodoExportacao: periodo,
        dataExportacao: new Date().toISOString(),
        tipo: "dashboard_data"
      },
      periodoAnalise: {
        inicio: dados.periodo.inicio,
        fim: dados.periodo.fim,
        descricao: periodo
      },
      resumo: dados.resumo,
      pedidosPorStatus: dados.pedidosPorStatus,
      produtosMaisVendidos: dados.produtosMaisVendidos,
      pedidos: dados.pedidos
    };

    const jsonStr = JSON.stringify(dadosParaExportar, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().split('T')[0];
    const nomeArquivo = `dashboard_${periodo}_${timestamp}.json`;
    
    link.setAttribute("href", url);
    link.setAttribute("download", nomeArquivo);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error("Erro ao exportar JSON:", error);
    return false;
  }
};

// Modal de exportação
const ModalExportacao = ({ 
  isOpen, 
  onClose, 
  onExportCSV, 
  onExportJSON,
  exportando 
}: {
  isOpen: boolean;
  onClose: () => void;
  onExportCSV: (tipo: string) => void;
  onExportJSON: () => void;
  exportando: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Exportar Dados</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            disabled={exportando}
          >
            ✕
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">Escolha o formato e tipo de exportação:</p>
        
        {exportando ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin mb-4" />
            <p className="text-gray-600">Exportando dados...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Formato CSV</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onExportCSV('completo')}
                    className="flex flex-col items-center p-3 border rounded hover:bg-gray-50 transition"
                  >
                    <FileText className="h-5 w-5 text-[#D4AF37] mb-1" />
                    <span className="text-sm font-medium">Completo</span>
                    <span className="text-xs text-gray-500">Todos os dados</span>
                  </button>
                  
                  <button
                    onClick={() => onExportCSV('pedidos')}
                    className="flex flex-col items-center p-3 border rounded hover:bg-gray-50 transition"
                  >
                    <ShoppingBag className="h-5 w-5 text-blue-500 mb-1" />
                    <span className="text-sm font-medium">Pedidos</span>
                    <span className="text-xs text-gray-500">Apenas pedidos</span>
                  </button>
                  
                  <button
                    onClick={() => onExportCSV('produtos')}
                    className="flex flex-col items-center p-3 border rounded hover:bg-gray-50 transition"
                  >
                    <Package className="h-5 w-5 text-green-500 mb-1" />
                    <span className="text-sm font-medium">Produtos</span>
                    <span className="text-xs text-gray-500">Produtos vendidos</span>
                  </button>
                  
                  <button
                    onClick={() => onExportCSV('resumo')}
                    className="flex flex-col items-center p-3 border rounded hover:bg-gray-50 transition"
                  >
                    <DollarSign className="h-5 w-5 text-orange-500 mb-1" />
                    <span className="text-sm font-medium">Resumo</span>
                    <span className="text-xs text-gray-500">Apenas resumo</span>
                  </button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Formato JSON</h4>
                <button
                  onClick={onExportJSON}
                  className="w-full flex items-center justify-between p-3 border rounded hover:bg-gray-50 transition"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded mr-3">
                      {`{}`}
                    </div>
                    <div>
                      <p className="font-medium">JSON Completo</p>
                      <p className="text-sm text-gray-500">Dados estruturados para APIs</p>
                    </div>
                  </div>
                  <span className="text-blue-600">✓</span>
                </button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [periodo, setPeriodo] = useState("hoje");
  const [dados, setDados] = useState<DashboardData>({
    periodo: { inicio: "", fim: "" },
    resumo: { totalVendas: 0, totalPedidos: 0, totalItens: 0, ticketMedio: 0 },
    pedidosPorStatus: {},
    produtosMaisVendidos: [],
    pedidos: []
  });
  const [loading, setLoading] = useState(true);
  const [exportando, setExportando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalExportacaoAberto, setModalExportacaoAberto] = useState(false);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  // Função principal para buscar dados das vendas
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        setError("Faça login para acessar o dashboard");
        setLoading(false);
        return;
      }

      const hoje = new Date();
      let inicio = "";
      let fim = hoje.toISOString().split('T')[0];
      
      // Definir datas baseadas no período selecionado
      switch (periodo) {
        case "hoje":
          inicio = fim;
          break;
        case "ontem":
          const ontem = new Date(hoje);
          ontem.setDate(ontem.getDate() - 1);
          inicio = ontem.toISOString().split('T')[0];
          fim = inicio;
          break;
        case "7dias":
          const seteDiasAtras = new Date(hoje);
          seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
          inicio = seteDiasAtras.toISOString().split('T')[0];
          break;
        case "30dias":
          const trintaDiasAtras = new Date(hoje);
          trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
          inicio = trintaDiasAtras.toISOString().split('T')[0];
          break;
        case "mes":
          const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
          inicio = primeiroDiaMes.toISOString().split('T')[0];
          break;
      }

      console.log(`Buscando vendas para período ${periodo}: ${inicio} - ${fim}`);

      // Primeiro, buscar estatísticas das vendas
      const vendasResponse = await api.get("/vendas/estatisticas", {
        headers: { Authorization: `Bearer ${token}` },
        params: { inicio, fim }
      });

      if (!vendasResponse.data?.success) {
        throw new Error("Erro ao buscar estatísticas de vendas");
      }

      const estatisticas = vendasResponse.data.data || {};
      
      // Buscar produtos mais vendidos
      let produtosMaisVendidos = [];
      try {
        const produtosResponse = await api.get("/vendas/produtos-mais-vendidos", {
          headers: { Authorization: `Bearer ${token}` },
          params: { inicio, fim, limit: 5 }
        });
        
        if (produtosResponse.data?.success) {
          produtosMaisVendidos = produtosResponse.data.data || [];
        }
      } catch (produtosError) {
        console.warn("Erro ao buscar produtos mais vendidos:", produtosError);
      }

      // Buscar pedidos recentes
      let pedidosRecentes = [];
      try {
        const pedidosResponse = await api.get("/pedidos", {
          headers: { Authorization: `Bearer ${token}` },
          params: { 
            inicio, 
            fim,
            limit: 5,
            orderBy: "criadoEm",
            orderDirection: "desc"
          }
        });
        
        if (pedidosResponse.data?.success) {
          pedidosRecentes = pedidosResponse.data.data || [];
        }
      } catch (pedidosError) {
        console.warn("Erro ao buscar pedidos recentes:", pedidosError);
      }

      // Buscar estatísticas por status
      let pedidosPorStatus = {};
      try {
        const statusResponse = await api.get("/vendas/status", {
          headers: { Authorization: `Bearer ${token}` },
          params: { inicio, fim }
        });
        
        if (statusResponse.data?.success) {
          pedidosPorStatus = statusResponse.data.data || {};
        }
      } catch (statusError) {
        console.warn("Erro ao buscar estatísticas por status:", statusError);
      }

      // Montar dados do dashboard
      setDados({
        periodo: { inicio, fim },
        resumo: {
          totalVendas: estatisticas.totalVendas || 0,
          totalPedidos: estatisticas.totalPedidos || 0,
          totalItens: estatisticas.totalItens || 0,
          ticketMedio: estatisticas.ticketMedio || 
            (estatisticas.totalPedidos > 0 ? 
              (estatisticas.totalVendas || 0) / estatisticas.totalPedidos : 0)
        },
        pedidosPorStatus,
        produtosMaisVendidos,
        pedidos: pedidosRecentes
      });

    } catch (err: any) {
      console.error("Erro ao buscar dados do dashboard:", err);
      
      // Mapear erros específicos
      let mensagemErro = "Erro ao carregar dados do dashboard";
      
      if (err.response?.status === 401) {
        mensagemErro = "Sessão expirada. Faça login novamente.";
      } else if (err.response?.status === 403) {
        mensagemErro = "Acesso não autorizado";
      } else if (err.response?.status === 404) {
        mensagemErro = "Endpoint não encontrado. Verifique as rotas disponíveis.";
      } else if (err.message) {
        mensagemErro = err.message;
      }
      
      setError(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  // Funções de exportação
  const handleExportarCSV = async (tipo: string) => {
    try {
      setExportando(true);
      
      // Verificar se há dados para exportar
      if (dados.pedidos.length === 0 && dados.produtosMaisVendidos.length === 0) {
        alert("Não há dados disponíveis para exportação");
        return;
      }
      
      const sucesso = exportarParaCSV(dados, periodo, tipo);
      
      if (sucesso) {
        // Mostrar mensagem de sucesso
        const toast = document.createElement("div");
        toast.className = "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
        toast.textContent = `Dados exportados com sucesso!`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 3000);
      } else {
        alert("Erro ao exportar dados. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro na exportação:", error);
      alert("Erro ao exportar dados");
    } finally {
      setExportando(false);
      setModalExportacaoAberto(false);
    }
  };

  const handleExportarJSON = async () => {
    try {
      setExportando(true);
      
      // Verificar se há dados para exportar
      if (dados.pedidos.length === 0 && dados.produtosMaisVendidos.length === 0) {
        alert("Não há dados disponíveis para exportação");
        return;
      }
      
      const sucesso = exportarParaJSON(dados, periodo);
      
      if (sucesso) {
        // Mostrar mensagem de sucesso
        const toast = document.createElement("div");
        toast.className = "fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
        toast.textContent = `JSON exportado com sucesso!`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 3000);
      } else {
        alert("Erro ao exportar JSON. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro na exportação JSON:", error);
      alert("Erro ao exportar JSON");
    } finally {
      setExportando(false);
      setModalExportacaoAberto(false);
    }
  };

  // Listar endpoints disponíveis (para debug)
  const listEndpointsDisponiveis = async () => {
    if (!token) return;
    
    try {
      console.log("🔍 Verificando endpoints disponíveis...");
      
      // Tentar acessar vários endpoints possíveis
      const endpoints = [
        "/vendas/estatisticas",
        "/vendas/hoje",
        "/vendas/periodo",
        "/vendas/produtos-mais-vendidos",
        "/vendas/status",
        "/pedidos",
        "/produtos"
      ];
      
      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log(`✅ ${endpoint}: Disponível`, response.status);
        } catch (err: any) {
          console.log(`❌ ${endpoint}: ${err.response?.status || err.message}`);
        }
      }
    } catch (error) {
      console.error("Erro ao verificar endpoints:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Para debug: listar endpoints disponíveis
    if (token) {
      listEndpointsDisponiveis();
    }
  }, [periodo, token]);

  const getResumoCards = () => {
    const resumo = dados.resumo;
    
    return [
      {
        titulo: "Vendas Totais",
        valor: formatCurrency(resumo.totalVendas),
        variacao: "+12.5%", // Simulado
        positivo: true,
        icone: <DollarSign className="h-6 w-6" />,
        cor: "bg-green-500",
      },
      {
        titulo: "Total de Pedidos",
        valor: resumo.totalPedidos.toString(),
        variacao: "+8.2%",
        positivo: true,
        icone: <ShoppingBag className="h-6 w-6" />,
        cor: "bg-blue-500",
      },
      {
        titulo: "Itens Vendidos",
        valor: resumo.totalItens.toString(),
        variacao: "+0%",
        positivo: true,
        icone: <Package className="h-6 w-6" />,
        cor: "bg-purple-500",
      },
      {
        titulo: "Ticket Médio",
        valor: formatCurrency(resumo.ticketMedio),
        variacao: "+5.7%",
        positivo: true,
        icone: <Users className="h-6 w-6" />,
        cor: "bg-orange-500",
      },
    ];
  };

  const getPedidosRecentes = () => {
    return dados.pedidos.slice(0, 5).map((pedido) => ({
      id: pedido.numeroPedido || pedido.id,
      cliente: pedido.usuario?.nome || "Cliente",
      valor: pedido.total,
      status: (pedido.status || "PENDENTE").toLowerCase(),
      data: pedido.criadoEm ? formatDate(pedido.criadoEm) : "N/A",
    }));
  };

  const getProdutosTop = () => {
    return dados.produtosMaisVendidos.slice(0, 5).map((produto) => ({
      nome: produto.nome || "Produto",
      vendas: produto.quantidade || 0,
      total: produto.total || 0,
    }));
  };

  const getStatusColor = (status: string) => {
    const cores: any = {
      entregue: "bg-green-100 text-green-800",
      processando: "bg-blue-100 text-blue-800",
      confirmado: "bg-yellow-100 text-yellow-800",
      preparando: "bg-orange-100 text-orange-800",
      enviado: "bg-purple-100 text-purple-800",
      pago: "bg-green-100 text-green-800",
      pendente: "bg-gray-100 text-gray-800",
      cancelado: "bg-red-100 text-red-800",
    };
    return cores[status.toLowerCase()] || "bg-gray-100 text-gray-800";
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
    };
    return statusMap[status.toLowerCase()] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#D4AF37] mx-auto mb-4" />
          <p className="text-gray-600">Carregando dados do dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <h2 className="text-lg font-semibold text-red-800">Erro ao carregar dashboard</h2>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#c19b2c]"
            >
              Tentar novamente
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Recarregar página
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p className="mb-2">Dicas:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Verifique se está logado</li>
              <li>Verifique se as rotas da API estão corretas</li>
              <li>Abra o console do navegador para mais detalhes</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const resumoCards = getResumoCards();
  const pedidosRecentes = getPedidosRecentes();
  const produtosTop = getProdutosTop();

  return (
    <div className="py-8">
      <ModalExportacao
        isOpen={modalExportacaoAberto}
        onClose={() => setModalExportacaoAberto(false)}
        onExportCSV={handleExportarCSV}
        onExportJSON={handleExportarJSON}
        exportando={exportando}
      />

      {/* Header do Dashboard */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Bem-vindo, {user?.nome || user?.email || "Administrador"}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Período: {formatDate(dados.periodo.inicio)} - {formatDate(dados.periodo.fim)}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            <option value="hoje">Hoje</option>
            <option value="ontem">Ontem</option>
            <option value="7dias">Últimos 7 dias</option>
            <option value="30dias">Últimos 30 dias</option>
            <option value="mes">Este mês</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalExportacaoAberto(true)}
            className="flex items-center gap-2 bg-[#D4AF37] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#c19b2c] transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={exportando || dados.pedidos.length === 0}
          >
            {exportando ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Exportar Dados
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
              <span className="text-sm text-gray-500 ml-2">vs. anterior</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabelas */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pedidos Recentes */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Pedidos Recentes</h2>
            <span className="text-sm text-gray-500">
              {dados.pedidos.length} pedidos
            </span>
          </div>
          <div className="overflow-x-auto">
            {pedidosRecentes.length > 0 ? (
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
                  {pedidosRecentes.map((pedido: any) => (
                    <tr key={pedido.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{pedido.id}</td>
                      <td className="p-4">{pedido.cliente}</td>
                      <td className="p-4 font-medium">
                        {formatCurrency(pedido.valor)}
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
                      <td className="p-4 text-gray-600 text-sm">{pedido.data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <ShoppingBag className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Nenhum pedido encontrado</p>
              </div>
            )}
          </div>
        </div>

        {/* Produtos Mais Vendidos */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Produtos Mais Vendidos</h2>
            <span className="text-sm text-gray-500">
              {dados.produtosMaisVendidos.length} produtos
            </span>
          </div>
          <div className="p-6">
            {produtosTop.length > 0 ? (
              <div className="space-y-4">
                {produtosTop.map((produto, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium">{produto.nome}</p>
                      <p className="text-sm text-gray-500">
                        {produto.vendas} unidades vendidas
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(produto.total)}</p>
                      <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div 
                          className="h-full bg-[#D4AF37] rounded-full" 
                          style={{ width: `${Math.min(100, (produto.vendas * 100) / 50)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status dos Pedidos */}
      {Object.keys(dados.pedidosPorStatus).length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Status dos Pedidos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(dados.pedidosPorStatus).map(([status, quantidade]) => (
              <div key={status} className="text-center p-4 border rounded-lg">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${getStatusColor(status)}`}>
                  {getStatusText(status)}
                </div>
                <div className="text-2xl font-bold">{quantidade}</div>
                <div className="text-sm text-gray-500">pedidos</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
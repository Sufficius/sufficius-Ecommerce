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
  MoreVertical
} from "lucide-react";
import SalesChart from "../components/Charts/SalesChart";
import RevenueChart from "../components/Charts/RevenueChart";
import TopProductsChart from "../components/Charts/TopProductChart";
import { useAuthStore } from "@/modules/services/store/auth-store";


export default function AdminDashboard() {
  const [periodo, setPeriodo] = useState("hoje");
  const [dados, setDados] = useState<any>(null);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    // Simular dados do dashboard
    const dadosDashboard = {
      resumo: [
        { 
          titulo: "Vendas Hoje", 
          valor: "KZ 12.458,90", 
          variacao: "+12.5%", 
          positivo: true,
          icone: <DollarSign className="h-6 w-6" />,
          cor: "bg-green-500"
        },
        { 
          titulo: "Novos Pedidos", 
          valor: "48", 
          variacao: "+8.2%", 
          positivo: true,
          icone: <ShoppingBag className="h-6 w-6" />,
          cor: "bg-blue-500"
        },
        { 
          titulo: "Produtos em Estoque", 
          valor: "1.254", 
          variacao: "-3.1%", 
          positivo: false,
          icone: <Package className="h-6 w-6" />,
          cor: "bg-purple-500"
        },
        { 
          titulo: "Novos Clientes", 
          valor: "23", 
          variacao: "+5.7%", 
          positivo: true,
          icone: <Users className="h-6 w-6" />,
          cor: "bg-orange-500"
        }
      ],
      pedidosRecentes: [
        { id: "#SC001", cliente: "João Silva", valor: 899.90, status: "entregue", data: "15 Nov 2024" },
        { id: "#SC002", cliente: "Maria Santos", valor: 1.299, status: "processando", data: "15 Nov 2024" },
        { id: "#SC003", cliente: "Pedro Costa", valor: 2.499, status: "pago", data: "14 Nov 2024" },
        { id: "#SC004", cliente: "Ana Oliveira", valor: 549.90, status: "pendente", data: "14 Nov 2024" },
        { id: "#SC005", cliente: "Carlos Lima", valor: 899.90, status: "cancelado", data: "13 Nov 2024" }
      ],
      produtosTop: [
        { nome: "iPhone 15 Pro", vendas: 234, estoque: 45 },
        { nome: "Notebook Dell", vendas: 189, estoque: 12 },
        { nome: "AirPods Pro", vendas: 456, estoque: 89 },
        { nome: "Monitor 4K", vendas: 123, estoque: 23 },
        { nome: "Teclado Mecânico", vendas: 312, estoque: 67 }
      ]
    };

    setDados(dadosDashboard);
  }, [periodo]);

  const getStatusColor = (status: string) => {
    const cores: any = {
      entregue: "bg-green-100 text-green-800",
      processando: "bg-blue-100 text-blue-800",
      pago: "bg-yellow-100 text-yellow-800",
      pendente: "bg-orange-100 text-orange-800",
      cancelado: "bg-red-100 text-red-800"
    };
    return cores[status] || "bg-gray-100 text-gray-800";
  };

  if (!dados) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header do Dashboard */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo de volta, {user?.nome}!</p>
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
          <button className="flex items-center gap-2 border rounded-lg px-4 py-2 text-sm hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filtrar
          </button>
          <button className="flex items-center gap-2 bg-[#D4AF37] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#c19b2c]">
            <Download className="h-4 w-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dados.resumo.map((item: any, index: number) => (
          <div key={index} className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">{item.titulo}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{item.valor}</p>
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
              <span className={`text-sm font-medium ${item.positivo ? 'text-green-500' : 'text-red-500'}`}>
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
          <SalesChart />
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Receita Mensal</h2>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <RevenueChart />
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
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Pedido</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Cliente</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Valor</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Data</th>
                </tr>
              </thead>
              <tbody>
                {dados.pedidosRecentes.map((pedido: any) => (
                  <tr key={pedido.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{pedido.id}</td>
                    <td className="p-4">{pedido.cliente}</td>
                    <td className="p-4 font-medium">KZ {pedido.valor.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pedido.status)}`}>
                        {pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{pedido.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t text-center">
            <button className="text-[#D4AF37] font-medium hover:underline">
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
            <TopProductsChart produtos={dados.produtosTop} />
          </div>
          <div className="p-4 border-t text-center">
            <button className="text-[#D4AF37] font-medium hover:underline">
              Ver todos os produtos →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
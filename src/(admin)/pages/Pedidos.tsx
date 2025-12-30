"use client";

import { useState } from "react";
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
  Clock
} from "lucide-react";

export default function AdminPedidos() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroPagamento, setFiltroPagamento] = useState("todos");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  // Dados de exemplo
  const pedidos = [
    {
      id: "SC20241125001",
      cliente: "João Silva",
      email: "joao@email.com",
      valor: 899.90,
      produtos: 3,
      status: "entregue",
      pagamento: "cartao",
      data: "15 Nov 2024",
      hora: "14:30",
      codigoRastreio: "BR123456789SP"
    },
    {
      id: "SC20241125002",
      cliente: "Maria Santos",
      email: "maria@email.com",
      valor: 1.299,
      produtos: 2,
      status: "processando",
      pagamento: "pix",
      data: "15 Nov 2024",
      hora: "11:15",
      codigoRastreio: null
    },
    {
      id: "SC20241125003",
      cliente: "Pedro Costa",
      email: "pedro@email.com",
      valor: 2.499,
      produtos: 1,
      status: "pago",
      pagamento: "cartao",
      data: "14 Nov 2024",
      hora: "09:45",
      codigoRastreio: null
    },
    {
      id: "SC20241125004",
      cliente: "Ana Oliveira",
      email: "ana@email.com",
      valor: 549.90,
      produtos: 4,
      status: "pendente",
      pagamento: "boleto",
      data: "14 Nov 2024",
      hora: "16:20",
      codigoRastreio: null
    },
    {
      id: "SC20241125005",
      cliente: "Carlos Lima",
      email: "carlos@email.com",
      valor: 899.90,
      produtos: 2,
      status: "cancelado",
      pagamento: "cartao",
      data: "13 Nov 2024",
      hora: "10:10",
      codigoRastreio: null
    },
    {
      id: "SC20241125006",
      cliente: "Fernanda Souza",
      email: "fernanda@email.com",
      valor: 1.799,
      produtos: 1,
      status: "enviado",
      pagamento: "pix",
      data: "13 Nov 2024",
      hora: "13:45",
      codigoRastreio: "BR987654321RJ"
    },
    {
      id: "SC20241125007",
      cliente: "Ricardo Almeida",
      email: "ricardo@email.com",
      valor: 3.299,
      produtos: 3,
      status: "entregue",
      pagamento: "cartao",
      data: "12 Nov 2024",
      hora: "15:30",
      codigoRastreio: "BR456789123MG"
    },
    {
      id: "SC20241125008",
      cliente: "Beatriz Lima",
      email: "beatriz@email.com",
      valor: 699.90,
      produtos: 5,
      status: "processando",
      pagamento: "cartao",
      data: "12 Nov 2024",
      hora: "11:00",
      codigoRastreio: null
    }
  ];

  const statusPedidos = {
    pendente: { label: "Pendente", cor: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-4 w-4" /> },
    pago: { label: "Pago", cor: "bg-blue-100 text-blue-800", icon: <CreditCard className="h-4 w-4" /> },
    processando: { label: "Processando", cor: "bg-purple-100 text-purple-800", icon: <Package className="h-4 w-4" /> },
    enviado: { label: "Enviado", cor: "bg-orange-100 text-orange-800", icon: <Truck className="h-4 w-4" /> },
    entregue: { label: "Entregue", cor: "bg-green-100 text-green-800", icon: <CheckCircle className="h-4 w-4" /> },
    cancelado: { label: "Cancelado", cor: "bg-red-100 text-red-800", icon: <XCircle className="h-4 w-4" /> }
  };

  const metodosPagamento = {
    cartao: { label: "Cartão", cor: "bg-blue-100 text-blue-800" },
    pix: { label: "PIX", cor: "bg-green-100 text-green-800" },
    boleto: { label: "Boleto", cor: "bg-yellow-100 text-yellow-800" }
  };

  // Filtrar pedidos
  const pedidosFiltrados = pedidos.filter(pedido => {
    const buscaMatch = pedido.id.toLowerCase().includes(busca.toLowerCase()) ||
                      pedido.cliente.toLowerCase().includes(busca.toLowerCase()) ||
                      pedido.email.toLowerCase().includes(busca.toLowerCase());
    const statusMatch = filtroStatus === "todos" || pedido.status === filtroStatus;
    const pagamentoMatch = filtroPagamento === "todos" || pedido.pagamento === filtroPagamento;
    
    return buscaMatch && statusMatch && pagamentoMatch;
  });

  // Paginação
  const totalPaginas = Math.ceil(pedidosFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const pedidosPagina = pedidosFiltrados.slice(inicio, fim);

  const handleVisualizarPedido = (id: string) => {
    navigate(`/pedidos/${id}`);
  };

//   const handleAlterarStatus = (id: string, novoStatus: string) => {
//     if (confirm(`Alterar status do pedido ${id} para ${novoStatus}?`)) {
//       // Lógica para alterar status
//       console.log(`Alterar pedido ${id} para ${novoStatus}`);
//     }
//   };

  const handleImprimirNota = (id: string) => {
    // Lógica para imprimir nota fiscal
    console.log(`Imprimir nota para pedido ${id}`);
  };

  const handleExportar = () => {
    // Lógica para exportar pedidos
    console.log("Exportar pedidos");
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Pedidos</h1>
          <p className="text-gray-600">Gerencie todos os pedidos da loja</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportar}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Busca */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por pedido, cliente ou e-mail..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          {/* Filtro Status */}
          <div>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="todos">Todos status</option>
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="processando">Processando</option>
              <option value="enviado">Enviado</option>
              <option value="entregue">Entregue</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          {/* Filtro Pagamento */}
          <div>
            <select
              value={filtroPagamento}
              onChange={(e) => setFiltroPagamento(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="todos">Todos pagamentos</option>
              <option value="cartao">Cartão</option>
              <option value="pix">PIX</option>
              <option value="boleto">Boleto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pedidos</p>
              <p className="text-2xl font-bold">{pedidos.length}</p>
            </div>
            <Package className="h-8 w-8 text-[#D4AF37]" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold">{pedidos.filter(p => p.status === 'pendente').length}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Em Processo</p>
              <p className="text-2xl font-bold">{pedidos.filter(p => p.status === 'processando').length}</p>
            </div>
            <Package className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Enviados</p>
              <p className="text-2xl font-bold">{pedidos.filter(p => p.status === 'enviado').length}</p>
            </div>
            <Truck className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Entregues</p>
              <p className="text-2xl font-bold">{pedidos.filter(p => p.status === 'entregue').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cancelados</p>
              <p className="text-2xl font-bold">{pedidos.filter(p => p.status === 'cancelado').length}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Tabela de Pedidos */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Pedido</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Cliente</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Valor</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Pagamento</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Data</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidosPagina.map(pedido => (
                <tr key={pedido.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-bold">{pedido.id}</div>
                    <div className="text-sm text-gray-500">{pedido.produtos} produtos</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-medium">{pedido.cliente}</div>
                        <div className="text-sm text-gray-500">{pedido.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold">KZ {pedido.valor.toLocaleString()}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusPedidos[pedido.status as keyof typeof statusPedidos].cor} flex items-center gap-1`}>
                        {statusPedidos[pedido.status as keyof typeof statusPedidos].icon}
                        {statusPedidos[pedido.status as keyof typeof statusPedidos].label}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm ${metodosPagamento[pedido.pagamento as keyof typeof metodosPagamento].cor}`}>
                      {metodosPagamento[pedido.pagamento as keyof typeof metodosPagamento].label}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{pedido.data} {pedido.hora}</span>
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
                      <div className="relative">
                        <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg hidden">
                          <button className="w-full text-left px-4 py-2 hover:bg-gray-50">Marcar como Pago</button>
                          <button className="w-full text-left px-4 py-2 hover:bg-gray-50">Marcar como Enviado</button>
                          <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Cancelar Pedido</button>
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
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-600">
              Mostrando {inicio + 1}-{Math.min(fim, pedidosFiltrados.length)} de {pedidosFiltrados.length} pedidos
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                disabled={paginaAtual === 1}
                className="p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => setPaginaAtual(num)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${
                    paginaAtual === num
                      ? 'bg-[#D4AF37] text-white'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  {num}
                </button>
              ))}
              
              <button
                onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                disabled={paginaAtual === totalPaginas}
                className="p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
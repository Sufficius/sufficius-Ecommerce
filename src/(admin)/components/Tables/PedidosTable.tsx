"use client";

import { useState } from "react";
import {
  Eye,
  Printer,
  Truck,
  Package,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Search,
  Download,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  RefreshCw,
  AlertCircle
} from "lucide-react";

interface Pedido {
  id: string;
  cliente: string;
  email: string;
  telefone?: string;
  valor: number;
  produtos: number;
  status: 'pendente' | 'pago' | 'processando' | 'enviado' | 'entregue' | 'cancelado';
  pagamento: 'cartao' | 'pix' | 'boleto' | 'debito';
  data: string;
  hora: string;
  codigoRastreio?: string;
  endereco?: string;
  observacoes?: string;
}

interface PedidosTableProps {
  pedidos: Pedido[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onStatusChange?: (id: string, novoStatus: string) => void;
  onPrint?: (id: string) => void;
  onExport?: () => void;
}

export default function PedidosTable({
  pedidos,
  onView,
  onEdit,
  onStatusChange,
  onPrint,
  onExport
}: PedidosTableProps) {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroPagamento, setFiltroPagamento] = useState("todos");
  const [filtroData, setFiltroData] = useState("todos");
  const [ordenacao, setOrdenacao] = useState<{ campo: string; direcao: 'asc' | 'desc' }>({ 
    campo: 'data', 
    direcao: 'desc' 
  });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  // Status dos pedidos
  const statusPedidos = {
    pendente: { 
      label: "Pendente", 
      cor: "bg-yellow-100 text-yellow-800", 
      icon: <Clock className="h-3 w-3" />,
      acoes: ['pago', 'cancelado']
    },
    pago: { 
      label: "Pago", 
      cor: "bg-blue-100 text-blue-800", 
      icon: <CreditCard className="h-3 w-3" />,
      acoes: ['processando', 'cancelado']
    },
    processando: { 
      label: "Processando", 
      cor: "bg-purple-100 text-purple-800", 
      icon: <Package className="h-3 w-3" />,
      acoes: ['enviado', 'cancelado']
    },
    enviado: { 
      label: "Enviado", 
      cor: "bg-orange-100 text-orange-800", 
      icon: <Truck className="h-3 w-3" />,
      acoes: ['entregue']
    },
    entregue: { 
      label: "Entregue", 
      cor: "bg-green-100 text-green-800", 
      icon: <CheckCircle className="h-3 w-3" />,
      acoes: []
    },
    cancelado: { 
      label: "Cancelado", 
      cor: "bg-red-100 text-red-800", 
      icon: <XCircle className="h-3 w-3" />,
      acoes: []
    }
  };

  // Métodos de pagamento
  const metodosPagamento = {
    cartao: { label: "Cartão", cor: "bg-blue-100 text-blue-800" },
    pix: { label: "PIX", cor: "bg-green-100 text-green-800" },
    boleto: { label: "Boleto", cor: "bg-yellow-100 text-yellow-800" },
    debito: { label: "Débito", cor: "bg-gray-100 text-gray-800" }
  };

  // Opções de data
  const opcoesData = [
    { value: "todos", label: "Todas as datas" },
    { value: "hoje", label: "Hoje" },
    { value: "ontem", label: "Ontem" },
    { value: "7dias", label: "Últimos 7 dias" },
    { value: "30dias", label: "Últimos 30 dias" },
    { value: "mes", label: "Este mês" }
  ];

  // Filtrar e ordenar pedidos
  const pedidosFiltrados = pedidos
    .filter(pedido => {
      const buscaMatch = pedido.id.toLowerCase().includes(busca.toLowerCase()) ||
                        pedido.cliente.toLowerCase().includes(busca.toLowerCase()) ||
                        pedido.email.toLowerCase().includes(busca.toLowerCase());
      const statusMatch = filtroStatus === "todos" || pedido.status === filtroStatus;
      const pagamentoMatch = filtroPagamento === "todos" || pedido.pagamento === filtroPagamento;
      const dataMatch = filtroData === "todos" || true; // Implementar lógica de data
      
      return buscaMatch && statusMatch && pagamentoMatch && dataMatch;
    })
    .sort((a, b) => {
      if (ordenacao.campo === 'cliente') {
        return ordenacao.direcao === 'asc' 
          ? a.cliente.localeCompare(b.cliente)
          : b.cliente.localeCompare(a.cliente);
      }
      if (ordenacao.campo === 'valor') {
        return ordenacao.direcao === 'asc'
          ? a.valor - b.valor
          : b.valor - a.valor;
      }
      if (ordenacao.campo === 'data') {
        return ordenacao.direcao === 'asc'
          ? new Date(a.data).getTime() - new Date(b.data).getTime()
          : new Date(b.data).getTime() - new Date(a.data).getTime();
      }
      return ordenacao.direcao === 'asc' ? 1 : -1;
    });

  // Paginação
  const totalPaginas = Math.ceil(pedidosFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const pedidosPagina = pedidosFiltrados.slice(inicio, fim);

  // Estatísticas
  const totalPedidos = pedidosFiltrados.length;
  const totalValor = pedidosFiltrados.reduce((acc, p) => acc + p.valor, 0);
  const pedidosPendentes = pedidosFiltrados.filter(p => p.status === 'pendente').length;
  const pedidosEntregues = pedidosFiltrados.filter(p => p.status === 'entregue').length;

  // Ordenar coluna
  const ordenarColuna = (campo: string) => {
    setOrdenacao(prev => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Renderizar seta de ordenação
  const renderSetaOrdenacao = (campo: string) => {
    if (ordenacao.campo !== campo) return null;
    return ordenacao.direcao === 'asc' ? '↑' : '↓';
  };

  // Ações de status
  const handleMudarStatus = (id: string, novoStatus: string) => {
    if (onStatusChange) {
      onStatusChange(id, novoStatus);
    }
  };

  // Filtro rápido por status
  const StatusFilterButtons = () => (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setFiltroStatus("todos")}
        className={`px-3 py-1 rounded-full text-sm ${
          filtroStatus === "todos"
            ? "bg-[#D4AF37] text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Todos
      </button>
      {Object.entries(statusPedidos).map(([key, status]) => (
        <button
          key={key}
          onClick={() => setFiltroStatus(key)}
          className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
            filtroStatus === key
              ? `${status.cor}`
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {status.icon}
          {status.label}
          <span className="ml-1 bg-white/20 px-1.5 rounded-full text-xs">
            {pedidos.filter(p => p.status === key).length}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow">
      {/* Header com estatísticas */}
      <div className="p-6 border-b">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h3 className="font-bold text-xl">Pedidos</h3>
            <p className="text-gray-600">Gerencie todos os pedidos da loja</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Total Pedidos</div>
              <div className="text-2xl font-bold">{totalPedidos}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Valor Total</div>
              <div className="text-2xl font-bold text-[#D4AF37]">
                R$ {totalValor.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Pendentes</div>
              <div className="text-2xl font-bold text-yellow-600">{pedidosPendentes}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Entregues</div>
              <div className="text-2xl font-bold text-green-600">{pedidosEntregues}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros rápidos */}
      <div className="p-4 border-b">
        <StatusFilterButtons />
      </div>

      {/* Filtros avançados */}
      <div className="p-4 border-b bg-gray-50">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar pedidos..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
            />
          </div>

          <div>
            <select
              value={filtroPagamento}
              onChange={(e) => setFiltroPagamento(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
            >
              <option value="todos">Todos pagamentos</option>
              <option value="cartao">Cartão</option>
              <option value="pix">PIX</option>
              <option value="boleto">Boleto</option>
              <option value="debito">Débito</option>
            </select>
          </div>

          <div>
            <select
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
            >
              {opcoesData.map(opcao => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onExport}
              className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100 text-sm"
            >
              <Download className="h-4 w-4" />
              Exportar
            </button>
            <button
              onClick={() => {
                setBusca("");
                setFiltroStatus("todos");
                setFiltroPagamento("todos");
                setFiltroData("todos");
              }}
              className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100 text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left p-4 text-sm font-medium text-gray-700">
                <button
                  onClick={() => ordenarColuna('id')}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  Pedido {renderSetaOrdenacao('id')}
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">
                <button
                  onClick={() => ordenarColuna('cliente')}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  Cliente {renderSetaOrdenacao('cliente')}
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">
                <button
                  onClick={() => ordenarColuna('valor')}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  Valor {renderSetaOrdenacao('valor')}
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">
                Pagamento
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">
                <button
                  onClick={() => ordenarColuna('data')}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  Data {renderSetaOrdenacao('data')}
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {pedidosPagina.map(pedido => (
              <tr key={pedido.id} className="border-b hover:bg-gray-50 group">
                <td className="p-4">
                  <div className="font-bold">{pedido.id}</div>
                  <div className="text-sm text-gray-500">{pedido.produtos} produtos</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-medium">{pedido.cliente}</div>
                      <div className="text-sm text-gray-500">{pedido.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-lg">R$ {pedido.valor.toLocaleString()}</div>
                </td>
                <td className="p-4">
                  <div className="relative">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 ${statusPedidos[pedido.status].cor}`}>
                      {statusPedidos[pedido.status].icon}
                      {statusPedidos[pedido.status].label}
                    </span>
                    
                    {/* Dropdown de alteração de status */}
                    {statusPedidos[pedido.status].acoes.length > 0 && (
                      <div className="absolute left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        {statusPedidos[pedido.status].acoes.map(acao => (
                          <button
                            key={acao}
                            onClick={() => handleMudarStatus(pedido.id, acao)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                          >
                            {statusPedidos[acao as keyof typeof statusPedidos].icon}
                            Alterar para {statusPedidos[acao as keyof typeof statusPedidos].label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-sm ${metodosPagamento[pedido.pagamento].cor}`}>
                    {metodosPagamento[pedido.pagamento].label}
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
                      onClick={() => onView?.(pedido.id)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onPrint?.(pedido.id)}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                      title="Imprimir"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                    {pedido.codigoRastreio && (
                      <button
                        onClick={() => window.open(`https://rastreamento/${pedido.codigoRastreio}`, '_blank')}
                        className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                        title="Rastrear"
                      >
                        <Truck className="h-4 w-4" />
                      </button>
                    )}
                    {pedido.observacoes && (
                      <button
                        onClick={() => alert(pedido.observacoes)}
                        className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                        title="Observações"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    )}
                    <div className="relative">
                      <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {/* Dropdown menu */}
                      <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <button
                          onClick={() => onEdit?.(pedido.id)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                        >
                          Editar Pedido
                        </button>
                        <button
                          onClick={() => handleMudarStatus(pedido.id, 'cancelado')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600"
                        >
                          Cancelar Pedido
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                          Enviar Notificação
                        </button>
                        {pedido.status === 'entregue' && (
                          <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                            Solicitar Avaliação
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

        {/* Mensagem de lista vazia */}
        {pedidosPagina.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum pedido encontrado</p>
            <p className="text-sm text-gray-400 mt-1">
              Tente ajustar os filtros ou buscar por outros termos
            </p>
          </div>
        )}
      </div>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="p-4 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              Mostrando {inicio + 1}-{Math.min(fim, pedidosFiltrados.length)} de {pedidosFiltrados.length} pedidos
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Itens por página:</span>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  disabled
                >
                  <option>{itensPorPagina}</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                  disabled={paginaAtual === 1}
                  className="p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <div className="flex items-center gap-1">
                  {(() => {
                    const paginas = [];
                    const maxBotoes = 5;
                    
                    if (totalPaginas <= maxBotoes) {
                      for (let i = 1; i <= totalPaginas; i++) {
                        paginas.push(i);
                      }
                    } else if (paginaAtual <= 3) {
                      for (let i = 1; i <= 4; i++) {
                        paginas.push(i);
                      }
                      paginas.push('...');
                      paginas.push(totalPaginas);
                    } else if (paginaAtual >= totalPaginas - 2) {
                      paginas.push(1);
                      paginas.push('...');
                      for (let i = totalPaginas - 3; i <= totalPaginas; i++) {
                        paginas.push(i);
                      }
                    } else {
                      paginas.push(1);
                      paginas.push('...');
                      for (let i = paginaAtual - 1; i <= paginaAtual + 1; i++) {
                        paginas.push(i);
                      }
                      paginas.push('...');
                      paginas.push(totalPaginas);
                    }

                    return paginas.map((pagina, index) => {
                      if (pagina === '...') {
                        return (
                          <span key={index} className="px-2">
                            ...
                          </span>
                        );
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => setPaginaAtual(pagina as number)}
                          className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                            paginaAtual === pagina
                              ? 'bg-[#D4AF37] text-white'
                              : 'border hover:bg-gray-50'
                          }`}
                        >
                          {pagina}
                        </button>
                      );
                    });
                  })()}
                </div>
                
                <button
                  onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                  disabled={paginaAtual === totalPaginas}
                  className="p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import {
  Search,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Edit,
  Plus,
  Minus,
  Download,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from "lucide-react";

export default function AdminEstoque() {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  // Dados de exemplo
  const produtosEstoque = [
    {
      id: 1,
      nome: "iPhone 15 Pro",
      sku: "SC-PH-001",
      categoria: "Smartphones",
      estoqueAtual: 45,
      estoqueMinimo: 10,
      estoqueIdeal: 50,
      status: "normal",
      ultimaMovimentacao: "Hoje, 14:30",
      movimentacao: "+5"
    },
    {
      id: 2,
      nome: "Notebook Dell XPS 15",
      sku: "SC-NB-002",
      categoria: "Notebooks",
      estoqueAtual: 12,
      estoqueMinimo: 5,
      estoqueIdeal: 20,
      status: "baixo",
      ultimaMovimentacao: "Ontem, 11:15",
      movimentacao: "-2"
    },
    {
      id: 3,
      nome: "AirPods Pro 2",
      sku: "SC-AP-003",
      categoria: "Áudio",
      estoqueAtual: 89,
      estoqueMinimo: 20,
      estoqueIdeal: 100,
      status: "normal",
      ultimaMovimentacao: "Hoje, 09:45",
      movimentacao: "+10"
    },
    {
      id: 4,
      nome: "Monitor Samsung 4K",
      sku: "SC-MN-004",
      categoria: "Monitores",
      estoqueAtual: 23,
      estoqueMinimo: 5,
      estoqueIdeal: 30,
      status: "normal",
      ultimaMovimentacao: "15/11, 16:20",
      movimentacao: "-3"
    },
    {
      id: 5,
      nome: "Console PlayStation 5",
      sku: "SC-GM-005",
      categoria: "Games",
      estoqueAtual: 8,
      estoqueMinimo: 5,
      estoqueIdeal: 15,
      status: "baixo",
      ultimaMovimentacao: "14/11, 10:10",
      movimentacao: "-1"
    },
    {
      id: 6,
      nome: "Smartwatch Apple",
      sku: "SC-SW-006",
      categoria: "Wearables",
      estoqueAtual: 34,
      estoqueMinimo: 10,
      estoqueIdeal: 40,
      status: "normal",
      ultimaMovimentacao: "13/11, 13:45",
      movimentacao: "+15"
    },
    {
      id: 7,
      nome: "Teclado Mecânico RGB",
      sku: "SC-TC-007",
      categoria: "Periféricos",
      estoqueAtual: 0,
      estoqueMinimo: 5,
      estoqueIdeal: 25,
      status: "esgotado",
      ultimaMovimentacao: "12/11, 15:30",
      movimentacao: "-10"
    },
    {
      id: 8,
      nome: "Mouse Gamer Pro",
      sku: "SC-MS-008",
      categoria: "Periféricos",
      estoqueAtual: 67,
      estoqueMinimo: 10,
      estoqueIdeal: 50,
      status: "excesso",
      ultimaMovimentacao: "12/11, 11:00",
      movimentacao: "+20"
    }
  ];

  // Filtrar produtos
  const produtosFiltrados = produtosEstoque.filter(produto => {
    const buscaMatch = produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      produto.sku.toLowerCase().includes(busca.toLowerCase());
    const statusMatch = filtroStatus === "todos" || produto.status === filtroStatus;
    
    return buscaMatch && statusMatch;
  });

  // Paginação
  const totalPaginas = Math.ceil(produtosFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const produtosPagina = produtosFiltrados.slice(inicio, fim);

  const getStatusInfo = (status: string) => {
    const info: any = {
      normal: { label: "Normal", cor: "bg-green-100 text-green-800", icon: <Package className="h-4 w-4" /> },
      baixo: { label: "Baixo", cor: "bg-yellow-100 text-yellow-800", icon: <AlertTriangle className="h-4 w-4" /> },
      esgotado: { label: "Esgotado", cor: "bg-red-100 text-red-800", icon: <AlertTriangle className="h-4 w-4" /> },
      excesso: { label: "Excesso", cor: "bg-blue-100 text-blue-800", icon: <Package className="h-4 w-4" /> }
    };
    return info[status] || info.normal;
  };

  const handleAdicionarEstoque = (id: number, quantidade: number) => {
    // Lógica para adicionar estoque
    console.log(`Adicionar ${quantidade} unidades ao produto ${id}`);
  };

  const handleRemoverEstoque = (id: number, quantidade: number) => {
    // Lógica para remover estoque
    console.log(`Remover ${quantidade} unidades do produto ${id}`);
  };

  const handleAtualizarEstoque = (id: number) => {
    const novaQuantidade = prompt("Nova quantidade de estoque:");
    if (novaQuantidade) {
      // Lógica para atualizar estoque
      console.log(`Atualizar produto ${id} para ${novaQuantidade} unidades`);
    }
  };

  const handleExportarRelatorio = () => {
    // Lógica para exportar relatório
    console.log("Exportar relatório de estoque");
  };

  // Calcular estatísticas
  const totalProdutos = produtosEstoque.length;
  const produtosBaixoEstoque = produtosEstoque.filter(p => p.status === "baixo" || p.status === "esgotado").length;
  const valorTotalEstoque = produtosEstoque.reduce((acc, p) => acc + (p.estoqueAtual * 1000), 0); // Simulação
  const produtosMovimentacaoPositiva = produtosEstoque.filter(p => p.movimentacao.startsWith("+")).length;

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Estoque</h1>
          <p className="text-gray-600">Controle e gerencie o estoque da loja</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportarRelatorio}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Exportar
          </button>
          <button className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#c19b2c]">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Busca */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por produto ou SKU..."
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
              <option value="normal">Normal</option>
              <option value="baixo">Baixo</option>
              <option value="esgotado">Esgotado</option>
              <option value="excesso">Excesso</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Produtos</p>
              <p className="text-2xl font-bold">{totalProdutos}</p>
            </div>
            <Package className="h-8 w-8 text-[#D4AF37]" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Baixo Estoque</p>
              <p className="text-2xl font-bold">{produtosBaixoEstoque}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold">R$ {valorTotalEstoque.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Em Movimentação</p>
              <p className="text-2xl font-bold">{produtosMovimentacaoPositiva}</p>
            </div>
            <RefreshCw className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Tabela de Estoque */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Produto</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Estoque Atual</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Estoque Mín.</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Última Mov.</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosPagina.map(produto => {
                const statusInfo = getStatusInfo(produto.status);
                const percentual = (produto.estoqueAtual / produto.estoqueIdeal) * 100;
                
                return (
                  <tr key={produto.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{produto.nome}</div>
                        <div className="text-sm text-gray-500">SKU: {produto.sku}</div>
                        <div className="text-xs text-gray-400">{produto.categoria}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className={`font-bold text-lg ${
                          produto.estoqueAtual === 0 
                            ? 'text-red-600' 
                            : produto.estoqueAtual < produto.estoqueMinimo
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}>
                          {produto.estoqueAtual} unidades
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className={`h-2 rounded-full ${
                              percentual < 20 ? 'bg-red-500' :
                              percentual < 50 ? 'bg-yellow-500' :
                              percentual > 100 ? 'bg-blue-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(percentual, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Ideal: {produto.estoqueIdeal} unidades
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{produto.estoqueMinimo} unidades</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.cor} flex items-center gap-1`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="text-sm">{produto.ultimaMovimentacao}</div>
                        <div className={`text-xs font-medium ${
                          produto.movimentacao.startsWith('+') 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {produto.movimentacao.startsWith('+') 
                            ? <TrendingUp className="h-3 w-3 inline mr-1" />
                            : <TrendingDown className="h-3 w-3 inline mr-1" />
                          }
                          {produto.movimentacao} unidades
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => handleRemoverEstoque(produto.id, 1)}
                            className="p-1 hover:bg-gray-100"
                            disabled={produto.estoqueAtual <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleAtualizarEstoque(produto.id)}
                            className="px-2 py-1 text-sm hover:bg-gray-100"
                          >
                            {produto.estoqueAtual}
                          </button>
                          <button
                            onClick={() => handleAdicionarEstoque(produto.id, 1)}
                            className="p-1 hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleAtualizarEstoque(produto.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Editar Estoque"
                        >
                          <Edit className="h-4 w-4" />
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
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-600">
              Mostrando {inicio + 1}-{Math.min(fim, produtosFiltrados.length)} de {produtosFiltrados.length} produtos
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

      {/* Alertas de Estoque Baixo */}
      {produtosBaixoEstoque > 0 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
              <h3 className="font-bold text-yellow-900">Alertas de Estoque</h3>
            </div>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              {produtosBaixoEstoque} produtos
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {produtosEstoque
              .filter(p => p.status === "baixo" || p.status === "esgotado")
              .slice(0, 4)
              .map(produto => (
                <div key={produto.id} className="bg-white p-3 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{produto.nome}</div>
                      <div className="text-sm text-gray-600">SKU: {produto.sku}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      produto.status === 'esgotado' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {produto.status === 'esgotado' ? 'ESGOTADO' : 'BAIXO'}
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    Estoque atual: <span className="font-bold">{produto.estoqueAtual}</span> / 
                    Mínimo: <span className="font-bold">{produto.estoqueMinimo}</span>
                  </div>
                </div>
              ))
            }
          </div>
          
          {produtosBaixoEstoque > 4 && (
            <div className="mt-4 text-center">
              <button className="text-yellow-700 font-medium hover:underline">
                Ver todos os {produtosBaixoEstoque} produtos com baixo estoque →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Package,
  Tag,
  DollarSign,
  ShoppingBag,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function AdminProdutos() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  // Dados de exemplo
  const produtos = [
    {
      id: 1,
      nome: "iPhone 15 Pro",
      categoria: "Smartphones",
      preco: 8999,
      precoPromo: 8599,
      estoque: 45,
      vendas: 234,
      status: "ativo",
      imagem: "📱",
      sku: "SC-PH-001"
    },
    {
      id: 2,
      nome: "Notebook Dell XPS 15",
      categoria: "Notebooks",
      preco: 12599,
      precoPromo: 0,
      estoque: 12,
      vendas: 89,
      status: "ativo",
      imagem: "💻",
      sku: "SC-NB-002"
    },
    {
      id: 3,
      nome: "AirPods Pro 2",
      categoria: "Áudio",
      preco: 1999,
      precoPromo: 1799,
      estoque: 89,
      vendas: 456,
      status: "ativo",
      imagem: "🎧",
      sku: "SC-AP-003"
    },
    {
      id: 4,
      nome: "Monitor Samsung 4K",
      categoria: "Monitores",
      preco: 3299,
      precoPromo: 2999,
      estoque: 23,
      vendas: 123,
      status: "ativo",
      imagem: "🖥️",
      sku: "SC-MN-004"
    },
    {
      id: 5,
      nome: "Console PlayStation 5",
      categoria: "Games",
      preco: 4599,
      precoPromo: 0,
      estoque: 8,
      vendas: 156,
      status: "baixo_estoque",
      imagem: "🎮",
      sku: "SC-GM-005"
    },
    {
      id: 6,
      nome: "Smartwatch Apple",
      categoria: "Wearables",
      preco: 2599,
      precoPromo: 2299,
      estoque: 34,
      vendas: 278,
      status: "ativo",
      imagem: "⌚",
      sku: "SC-SW-006"
    },
    {
      id: 7,
      nome: "Teclado Mecânico RGB",
      categoria: "Periféricos",
      preco: 599,
      precoPromo: 499,
      estoque: 67,
      vendas: 312,
      status: "ativo",
      imagem: "⌨️",
      sku: "SC-TC-007"
    },
    {
      id: 8,
      nome: "Mouse Gamer Pro",
      categoria: "Periféricos",
      preco: 399,
      precoPromo: 349,
      estoque: 0,
      vendas: 189,
      status: "sem_estoque",
      imagem: "🖱️",
      sku: "SC-MS-008"
    }
  ];

  const categorias = ["todos", "Smartphones", "Notebooks", "Áudio", "Monitores", "Games", "Wearables", "Periféricos"];

  const statusProdutos = {
    ativo: { label: "Ativo", cor: "bg-green-100 text-green-800" },
    inativo: { label: "Inativo", cor: "bg-gray-100 text-gray-800" },
    baixo_estoque: { label: "Baixo Estoque", cor: "bg-yellow-100 text-yellow-800" },
    sem_estoque: { label: "Sem Estoque", cor: "bg-red-100 text-red-800" }
  };

  // Filtrar produtos
  const produtosFiltrados = produtos.filter(produto => {
    const buscaMatch = produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      produto.sku.toLowerCase().includes(busca.toLowerCase());
    const categoriaMatch = filtroCategoria === "todos" || produto.categoria === filtroCategoria;
    const statusMatch = filtroStatus === "todos" || produto.status === filtroStatus;
    
    return buscaMatch && categoriaMatch && statusMatch;
  });

  // Paginação
  const totalPaginas = Math.ceil(produtosFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const produtosPagina = produtosFiltrados.slice(inicio, fim);

  const handleNovoProduto = () => {
    navigate("/produtos/novo");
  };

  const handleEditarProduto = (id: number) => {
    navigate(`/produtos/editar/${id}`);
  };

  const handleVisualizarProduto = (id: number) => {
    navigate(`/produtos/${id}`);
  };

  const handleExcluirProduto = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      // Lógica de exclusão
      console.log(`Excluir produto ${id}`);
    }
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Produtos</h1>
          <p className="text-gray-600">Gerencie todos os produtos da loja</p>
        </div>
        
        <button
          onClick={handleNovoProduto}
          className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-3 rounded-lg hover:bg-[#c19b2c] transition"
        >
          <Plus className="h-5 w-5" />
          Novo Produto
        </button>
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
                placeholder="Buscar por nome ou SKU..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          {/* Filtro Categoria */}
          <div>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria === "todos" ? "Todas categorias" : categoria}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Status */}
          <div>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="todos">Todos status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="baixo_estoque">Baixo estoque</option>
              <option value="sem_estoque">Sem estoque</option>
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
              <p className="text-2xl font-bold">{produtos.length}</p>
            </div>
            <Package className="h-8 w-8 text-[#D4AF37]" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categorias</p>
              <p className="text-2xl font-bold">{categorias.length - 1}</p>
            </div>
            <Tag className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Em Promoção</p>
              <p className="text-2xl font-bold">{produtos.filter(p => p.precoPromo > 0).length}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Vendas</p>
              <p className="text-2xl font-bold">{produtos.reduce((acc, p) => acc + p.vendas, 0)}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Produto</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Categoria</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Preço</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Estoque</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Vendas</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosPagina.map(produto => (
                <tr key={produto.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center text-lg mr-3">
                        {produto.imagem}
                      </div>
                      <div>
                        <div className="font-medium">{produto.nome}</div>
                        <div className="text-sm text-gray-500">SKU: {produto.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {produto.categoria}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-bold">KZ {produto.preco.toLocaleString()}</div>
                      {produto.precoPromo > 0 && (
                        <div className="text-sm text-green-600">
                          KZ {produto.precoPromo.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`font-medium ${produto.estoque === 0 ? 'text-red-600' : produto.estoque < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {produto.estoque} unidades
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{produto.vendas}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusProdutos[produto.status as keyof typeof statusProdutos].cor}`}>
                      {statusProdutos[produto.status as keyof typeof statusProdutos].label}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVisualizarProduto(produto.id)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditarProduto(produto.id)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleExcluirProduto(produto.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                        <MoreVertical className="h-4 w-4" />
                      </button>
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
    </div>
  );
}
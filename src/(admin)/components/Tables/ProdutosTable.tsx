"use client";

import { useState } from "react";
import {
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Package,
  Tag,
  DollarSign,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Copy,
  Star,
  AlertTriangle
} from "lucide-react";

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  precoPromo: number;
  estoque: number;
  vendas: number;
  status: 'ativo' | 'inativo' | 'baixo_estoque' | 'sem_estoque';
  imagem: string;
  sku: string;
  rating: number;
  dataCriacao: string;
}

interface ProdutosTableProps {
  produtos: Produto[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
  onAdd?: () => void;
}

export default function ProdutosTable({
  produtos,
  onEdit,
  onDelete,
  onView,
  onAdd
}: ProdutosTableProps) {
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [ordenacao, setOrdenacao] = useState<{ campo: string; direcao: 'asc' | 'desc' }>({ 
    campo: 'id', 
    direcao: 'desc' 
  });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const itensPorPagina = 10;

  // Extrair categorias únicas
  const categorias = ['todos', ...new Set(produtos.map(p => p.categoria))];

  // Status dos produtos
  const statusProdutos = {
    ativo: { label: "Ativo", cor: "bg-green-100 text-green-800", icon: <Package className="h-3 w-3" /> },
    inativo: { label: "Inativo", cor: "bg-gray-100 text-gray-800", icon: <Package className="h-3 w-3" /> },
    baixo_estoque: { label: "Baixo Estoque", cor: "bg-yellow-100 text-yellow-800", icon: <AlertTriangle className="h-3 w-3" /> },
    sem_estoque: { label: "Sem Estoque", cor: "bg-red-100 text-red-800", icon: <AlertTriangle className="h-3 w-3" /> }
  };

  // Filtrar e ordenar produtos
  const produtosFiltrados = produtos
    .filter(produto => {
      const buscaMatch = produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        produto.sku.toLowerCase().includes(busca.toLowerCase()) ||
                        produto.categoria.toLowerCase().includes(busca.toLowerCase());
      const categoriaMatch = filtroCategoria === "todos" || produto.categoria === filtroCategoria;
      const statusMatch = filtroStatus === "todos" || produto.status === filtroStatus;
      
      return buscaMatch && categoriaMatch && statusMatch;
    })
    .sort((a, b) => {
      if (ordenacao.campo === 'nome') {
        return ordenacao.direcao === 'asc' 
          ? a.nome.localeCompare(b.nome)
          : b.nome.localeCompare(a.nome);
      }
      if (ordenacao.campo === 'preco') {
        return ordenacao.direcao === 'asc'
          ? a.preco - b.preco
          : b.preco - a.preco;
      }
      if (ordenacao.campo === 'estoque') {
        return ordenacao.direcao === 'asc'
          ? a.estoque - b.estoque
          : b.estoque - a.estoque;
      }
      if (ordenacao.campo === 'vendas') {
        return ordenacao.direcao === 'asc'
          ? a.vendas - b.vendas
          : b.vendas - a.vendas;
      }
      return ordenacao.direcao === 'asc' ? a.id - b.id : b.id - a.id;
    });

  // Paginação
  const totalPaginas = Math.ceil(produtosFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const produtosPagina = produtosFiltrados.slice(inicio, fim);

  // Seleção
  const toggleSelecionarTodos = () => {
    if (selecionados.length === produtosPagina.length) {
      setSelecionados([]);
    } else {
      setSelecionados(produtosPagina.map(p => p.id));
    }
  };

  const toggleSelecionar = (id: number) => {
    setSelecionados(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Ações em massa
  const handleAcaoMassa = (acao: string) => {
    if (selecionados.length === 0) {
      alert("Selecione pelo menos um produto");
      return;
    }

    switch (acao) {
      case 'ativar':
        if (confirm(`Ativar ${selecionados.length} produtos?`)) {
          console.log("Ativar produtos:", selecionados);
        }
        break;
      case 'inativar':
        if (confirm(`Inativar ${selecionados.length} produtos?`)) {
          console.log("Inativar produtos:", selecionados);
        }
        break;
      case 'excluir':
        if (confirm(`Excluir ${selecionados.length} produtos? Esta ação não pode ser desfeita.`)) {
          console.log("Excluir produtos:", selecionados);
          setSelecionados([]);
        }
        break;
      case 'exportar':
        console.log("Exportar produtos:", selecionados);
        break;
    }
  };

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

  return (
    <div className="bg-white rounded-xl shadow">
      {/* Header da tabela com ações */}
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-bold text-lg">Produtos</h3>
            <p className="text-sm text-gray-600">
              {produtosFiltrados.length} produtos encontrados
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onAdd}
              className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#c19b2c] transition"
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </button>
          </div>
        </div>
      </div>

      {/* Filtros e busca */}
      <div className="p-4 border-b bg-gray-50">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
            />
          </div>

          <div>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
            >
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria === "todos" ? "Todas categorias" : categoria}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
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

      {/* Ações em massa */}
      {selecionados.length > 0 && (
        <div className="p-4 border-b bg-blue-50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="font-medium text-blue-900">
                {selecionados.length} produtos selecionados
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleAcaoMassa('ativar')}
                className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
              >
                Ativar
              </button>
              <button
                onClick={() => handleAcaoMassa('inativar')}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200"
              >
                Inativar
              </button>
              <button
                onClick={() => handleAcaoMassa('exportar')}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
              >
                Exportar
              </button>
              <button
                onClick={() => handleAcaoMassa('excluir')}
                className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selecionados.length === produtosPagina.length && produtosPagina.length > 0}
                    onChange={toggleSelecionarTodos}
                    className="h-4 w-4 text-[#D4AF37] rounded"
                  />
                </div>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">
                <button
                  onClick={() => ordenarColuna('nome')}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  Produto {renderSetaOrdenacao('nome')}
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">
                <button
                  onClick={() => ordenarColuna('preco')}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  Preço {renderSetaOrdenacao('preco')}
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">
                <button
                  onClick={() => ordenarColuna('estoque')}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  Estoque {renderSetaOrdenacao('estoque')}
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">
                <button
                  onClick={() => ordenarColuna('vendas')}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  Vendas {renderSetaOrdenacao('vendas')}
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {produtosPagina.map(produto => (
              <tr 
                key={produto.id} 
                className={`border-b hover:bg-gray-50 ${
                  selecionados.includes(produto.id) ? 'bg-blue-50' : ''
                }`}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selecionados.includes(produto.id)}
                    onChange={() => toggleSelecionar(produto.id)}
                    className="h-4 w-4 text-[#D4AF37] rounded"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center text-lg mr-3">
                      {produto.imagem}
                    </div>
                    <div>
                      <div className="font-medium">{produto.nome}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>SKU: {produto.sku}</span>
                        <span className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          {produto.rating}
                        </span>
                      </div>
                    </div>
                  </div>
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
                  <div className="flex items-center gap-2">
                    <div className={`font-medium ${produto.estoque === 0 ? 'text-red-600' : produto.estoque < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {produto.estoque}
                    </div>
                    <div className="text-sm text-gray-500">unidades</div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{produto.vendas}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusProdutos[produto.status].cor}`}>
                    {statusProdutos[produto.status].icon}
                    {statusProdutos[produto.status].label}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView?.(produto.id)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit?.(produto.id)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete?.(produto.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="relative">
                      <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {/* Dropdown menu */}
                      <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg hidden group-hover:block">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                          <Copy className="h-3 w-3 inline mr-2" />
                          Duplicar
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                          <Tag className="h-3 w-3 inline mr-2" />
                          Alterar Categoria
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                          <DollarSign className="h-3 w-3 inline mr-2" />
                          Alterar Preço
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação e footer */}
      <div className="p-4 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            Mostrando {inicio + 1}-{Math.min(fim, produtosFiltrados.length)} de {produtosFiltrados.length} produtos
          </div>
          
          <div className="flex items-center gap-4">
            {/* Itens por página */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Itens por página:</span>
              <select
                value={itensPorPagina}
                onChange={() => {
                  setPaginaAtual(1);
                  // Em um caso real, você atualizaria o estado
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>

            {/* Navegação */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                disabled={paginaAtual === 1}
                className="p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                  let numeroPagina;
                  if (totalPaginas <= 5) {
                    numeroPagina = i + 1;
                  } else if (paginaAtual <= 3) {
                    numeroPagina = i + 1;
                  } else if (paginaAtual >= totalPaginas - 2) {
                    numeroPagina = totalPaginas - 4 + i;
                  } else {
                    numeroPagina = paginaAtual - 2 + i;
                  }

                  return (
                    <button
                      key={numeroPagina}
                      onClick={() => setPaginaAtual(numeroPagina)}
                      className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                        paginaAtual === numeroPagina
                          ? 'bg-[#D4AF37] text-white'
                          : 'border hover:bg-gray-50'
                      }`}
                    >
                      {numeroPagina}
                    </button>
                  );
                })}
                
                {totalPaginas > 5 && paginaAtual < totalPaginas - 2 && (
                  <>
                    <span className="px-2">...</span>
                    <button
                      onClick={() => setPaginaAtual(totalPaginas)}
                      className="w-8 h-8 flex items-center justify-center rounded border hover:bg-gray-50 text-sm"
                    >
                      {totalPaginas}
                    </button>
                  </>
                )}
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
    </div>
  );
}
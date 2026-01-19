"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Tag,
  Percent,
  DollarSign,
  Calendar,
  Copy,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Users
} from "lucide-react";
import { toast } from "sonner";

export default function AdminCupons() {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  // Dados de exemplo
  const cupons = [
    {
      id: 1,
      codigo: "BLACKFRIDAY20",
      descricao: "Black Friday 2024",
      tipo: "percentual",
      valor: 20,
      minimoCompra: 100,
      maximoDesconto: 500,
      validade: "30/11/2024",
      usosMaximos: 1000,
      usosAtuais: 456,
      status: "ativo"
    },
    {
      id: 2,
      codigo: "FRETEGRATIS",
      descricao: "Frete Grátis",
      tipo: "frete_gratis",
      valor: 0,
      minimoCompra: 150,
      maximoDesconto: 0,
      validade: "31/12/2024",
      usosMaximos: 500,
      usosAtuais: 123,
      status: "ativo"
    },
    {
      id: 3,
      codigo: "BEMVINDO15",
      descricao: "Primeira Compra",
      tipo: "percentual",
      valor: 15,
      minimoCompra: 50,
      maximoDesconto: 200,
      validade: "31/12/2024",
      usosMaximos: 1000,
      usosAtuais: 789,
      status: "ativo"
    },
    {
      id: 4,
      codigo: "DESC50",
      descricao: "Desconto Especial",
      tipo: "fixo",
      valor: 50,
      minimoCompra: 200,
      maximoDesconto: 50,
      validade: "15/12/2024",
      usosMaximos: 200,
      usosAtuais: 198,
      status: "expirado"
    },
    {
      id: 5,
      codigo: "VERAO25",
      descricao: "Promoção Verão",
      tipo: "percentual",
      valor: 25,
      minimoCompra: 300,
      maximoDesconto: 300,
      validade: "28/02/2025",
      usosMaximos: 500,
      usosAtuais: 67,
      status: "ativo"
    },
    {
      id: 6,
      codigo: "NATAL2024",
      descricao: "Natal 2024",
      tipo: "fixo",
      valor: 100,
      minimoCompra: 500,
      maximoDesconto: 100,
      validade: "25/12/2024",
      usosMaximos: 300,
      usosAtuais: 45,
      status: "inativo"
    }
  ];

  const tiposCupons = {
    percentual: { label: "Percentual", cor: "bg-blue-100 text-blue-800", icon: <Percent className="h-4 w-4" /> },
    fixo: { label: "Valor Fixo", cor: "bg-green-100 text-green-800", icon: <DollarSign className="h-4 w-4" /> },
    frete_gratis: { label: "Frete Grátis", cor: "bg-purple-100 text-purple-800", icon: <Tag className="h-4 w-4" /> }
  };

  // Filtrar cupons
  const cuponsFiltrados = cupons.filter(cupom => {
    const buscaMatch = cupom.codigo.toLowerCase().includes(busca.toLowerCase()) ||
                      cupom.descricao.toLowerCase().includes(busca.toLowerCase());
    const statusMatch = filtroStatus === "todos" || cupom.status === filtroStatus;
    const tipoMatch = filtroTipo === "todos" || cupom.tipo === filtroTipo;
    
    return buscaMatch && statusMatch && tipoMatch;
  });

  // Paginação
  const totalPaginas = Math.ceil(cuponsFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const cuponsPagina = cuponsFiltrados.slice(inicio, fim);

  const handleNovoCupom = () => {
    // Lógica para novo cupom
    toast.success("Funcionalidade de criar novo cupom em breve!")
  };

  const handleEditarCupom = () => {
    // Lógica para editar cupom
   toast.success("Funcionalidade de editar cupom em breve!")
  };

  const handleExcluirCupom = () => {
    if (confirm("Tem certeza que deseja excluir este cupom?")) {
      // Lógica de exclusão
      toast.success("Cupom excluído com sucesso!");
    }
  };

  const handleCopiarCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    toast.success("Código do cupom copiado para a área de transferência!");
  };

  const formatarValorCupom = (cupom: any) => {
    if (cupom.tipo === "percentual") {
      return `${cupom.valor}%`;
    } else if (cupom.tipo === "frete_gratis") {
      return "Frete Grátis";
    } else {
      return `KZ ${cupom.valor}`;
    }
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Cupons</h1>
          <p className="text-gray-600">Crie e gerencie cupons de desconto</p>
        </div>
        
        <button
          onClick={handleNovoCupom}
          className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-3 rounded-lg hover:bg-[#c19b2c] transition"
        >
          <Plus className="h-5 w-5" />
          Novo Cupom
        </button>
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
                placeholder="Buscar por código ou descrição..."
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
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="expirado">Expirado</option>
            </select>
          </div>

          {/* Filtro Tipo */}
          <div>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="todos">Todos tipos</option>
              <option value="percentual">Percentual</option>
              <option value="fixo">Valor Fixo</option>
              <option value="frete_gratis">Frete Grátis</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cupons</p>
              <p className="text-2xl font-bold">{cupons.length}</p>
            </div>
            <Tag className="h-8 w-8 text-[#D4AF37]" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cupons Ativos</p>
              <p className="text-2xl font-bold">{cupons.filter(c => c.status === 'ativo').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Usos</p>
              <p className="text-2xl font-bold">{cupons.reduce((acc, c) => acc + c.usosAtuais, 0)}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expirados</p>
              <p className="text-2xl font-bold">{cupons.filter(c => c.status === 'expirado').length}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Tabela de Cupons */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Cupom</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Tipo</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Valor</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Validade</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Usos</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {cuponsPagina.map(cupom => (
                <tr key={cupom.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-bold text-lg">{cupom.codigo}</div>
                      <div className="text-sm text-gray-600">{cupom.descricao}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Mínimo: KZ {cupom.minimoCompra}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${tiposCupons[cupom.tipo as keyof typeof tiposCupons].cor} flex items-center gap-1`}>
                      {tiposCupons[cupom.tipo as keyof typeof tiposCupons].icon}
                      {tiposCupons[cupom.tipo as keyof typeof tiposCupons].label}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-lg">{formatarValorCupom(cupom)}</div>
                    {cupom.maximoDesconto > 0 && cupom.tipo === "percentual" && (
                      <div className="text-sm text-gray-600">
                        Máx: KZ {cupom.maximoDesconto}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className={cupom.status === 'expirado' ? 'text-red-600' : ''}>
                        {cupom.validade}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{cupom.usosAtuais} / {cupom.usosMaximos}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-[#D4AF37] h-2 rounded-full"
                          style={{ width: `${(cupom.usosAtuais / cupom.usosMaximos) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      cupom.status === 'ativo' 
                        ? 'bg-green-100 text-green-800' 
                        : cupom.status === 'inativo'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {cupom.status === 'ativo' ? 'Ativo' : cupom.status === 'inativo' ? 'Inativo' : 'Expirado'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopiarCodigo(cupom.codigo)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Copiar Código"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditarCupom()}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleExcluirCupom()}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
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
              Mostrando {inicio + 1}-{Math.min(fim, cuponsFiltrados.length)} de {cuponsFiltrados.length} cupons
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
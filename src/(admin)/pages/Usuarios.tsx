"use client";

import { useState } from "react";
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function AdminUsuarios() {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroNivel, setFiltroNivel] = useState("todos");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  // Dados de exemplo
  const usuarios = [
    {
      id: 1,
      nome: "João Silva",
      email: "joao.silva@email.com",
      telefone: "(11) 99999-9999",
      nivel: "cliente",
      status: "ativo",
      dataCadastro: "15/11/2024",
      totalCompras: 5,
      totalGasto: 4599.50
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria.santos@email.com",
      telefone: "(21) 98888-8888",
      nivel: "cliente",
      status: "ativo",
      dataCadastro: "10/11/2024",
      totalCompras: 3,
      totalGasto: 1299.00
    },
    {
      id: 3,
      nome: "Administrador",
      email: "admin@sufficius.com",
      telefone: "(11) 97777-7777",
      nivel: "admin",
      status: "ativo",
      dataCadastro: "01/11/2024",
      totalCompras: 0,
      totalGasto: 0
    },
    {
      id: 4,
      nome: "Pedro Costa",
      email: "pedro.costa@email.com",
      telefone: "(31) 96666-6666",
      nivel: "cliente",
      status: "inativo",
      dataCadastro: "05/11/2024",
      totalCompras: 1,
      totalGasto: 899.90
    },
    {
      id: 5,
      nome: "Ana Oliveira",
      email: "ana.oliveira@email.com",
      telefone: "(41) 95555-5555",
      nivel: "cliente",
      status: "ativo",
      dataCadastro: "08/11/2024",
      totalCompras: 2,
      totalGasto: 1599.80
    },
    {
      id: 6,
      nome: "Operador",
      email: "operador@sufficius.com",
      telefone: "(11) 94444-4444",
      nivel: "operador",
      status: "ativo",
      dataCadastro: "02/11/2024",
      totalCompras: 0,
      totalGasto: 0
    },
    {
      id: 7,
      nome: "Carlos Lima",
      email: "carlos.lima@email.com",
      telefone: "(51) 93333-3333",
      nivel: "cliente",
      status: "ativo",
      dataCadastro: "12/11/2024",
      totalCompras: 4,
      totalGasto: 3299.60
    },
    {
      id: 8,
      nome: "Fernanda Souza",
      email: "fernanda.souza@email.com",
      telefone: "(61) 92222-2222",
      nivel: "cliente",
      status: "ativo",
      dataCadastro: "14/11/2024",
      totalCompras: 1,
      totalGasto: 1999.00
    }
  ];

  const niveisUsuarios = {
    admin: { label: "Administrador", cor: "bg-red-100 text-red-800", icon: <Shield className="h-4 w-4" /> },
    operador: { label: "Operador", cor: "bg-blue-100 text-blue-800", icon: <UserCheck className="h-4 w-4" /> },
    cliente: { label: "Cliente", cor: "bg-green-100 text-green-800", icon: <UserCheck className="h-4 w-4" /> }
  };

  // Filtrar usuários
  const usuariosFiltrados = usuarios.filter(usuario => {
    const buscaMatch = usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      usuario.email.toLowerCase().includes(busca.toLowerCase());
    const statusMatch = filtroStatus === "todos" || usuario.status === filtroStatus;
    const nivelMatch = filtroNivel === "todos" || usuario.nivel === filtroNivel;
    
    return buscaMatch && statusMatch && nivelMatch;
  });

  // Paginação
  const totalPaginas = Math.ceil(usuariosFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const usuariosPagina = usuariosFiltrados.slice(inicio, fim);

  const handleNovoUsuario = () => {
    // Lógica para novo usuário
    console.log("Novo usuário");
  };

  const handleEditarUsuario = (id: number) => {
    // Lógica para editar usuário
    console.log(`Editar usuário ${id}`);
  };

  const handleExcluirUsuario = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      // Lógica de exclusão
      console.log(`Excluir usuário ${id}`);
    }
  };

  const handleAlterarStatus = (id: number, statusAtual: string) => {
    const novoStatus = statusAtual === "ativo" ? "inativo" : "ativo";
    if (confirm(`Alterar status do usuário para ${novoStatus}?`)) {
      // Lógica para alterar status
      console.log(`Alterar usuário ${id} para ${novoStatus}`);
    }
  };

  const handleResetarSenha = (id: number) => {
    if (confirm("Deseja resetar a senha deste usuário?")) {
      // Lógica para resetar senha
      console.log(`Resetar senha do usuário ${id}`);
    }
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h1>
          <p className="text-gray-600">Gerencie usuários e permissões</p>
        </div>
        
        <button
          onClick={handleNovoUsuario}
          className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-3 rounded-lg hover:bg-[#c19b2c] transition"
        >
          <UserPlus className="h-5 w-5" />
          Novo Usuário
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
                placeholder="Buscar por nome ou e-mail..."
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
            </select>
          </div>

          {/* Filtro Nível */}
          <div>
            <select
              value={filtroNivel}
              onChange={(e) => setFiltroNivel(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="todos">Todos níveis</option>
              <option value="admin">Administrador</option>
              <option value="operador">Operador</option>
              <option value="cliente">Cliente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Usuários</p>
              <p className="text-2xl font-bold">{usuarios.length}</p>
            </div>
            <UserCheck className="h-8 w-8 text-[#D4AF37]" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes</p>
              <p className="text-2xl font-bold">{usuarios.filter(u => u.nivel === 'cliente').length}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Administradores</p>
              <p className="text-2xl font-bold">{usuarios.filter(u => u.nivel === 'admin').length}</p>
            </div>
            <Shield className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ativos</p>
              <p className="text-2xl font-bold">{usuarios.filter(u => u.status === 'ativo').length}</p>
            </div>
            <UserCheck className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Usuário</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Contato</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Nível</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Cadastro</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Compras</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPagina.map(usuario => (
                <tr key={usuario.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="font-bold text-gray-600">
                          {usuario.nome.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{usuario.nome}</div>
                        <div className="text-sm text-gray-500">ID: {usuario.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">{usuario.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">{usuario.telefone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${niveisUsuarios[usuario.nivel as keyof typeof niveisUsuarios].cor} flex items-center gap-1`}>
                      {niveisUsuarios[usuario.nivel as keyof typeof niveisUsuarios].icon}
                      {niveisUsuarios[usuario.nivel as keyof typeof niveisUsuarios].label}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${usuario.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {usuario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </span>
                      <button
                        onClick={() => handleAlterarStatus(usuario.id, usuario.status)}
                        className={`p-1 rounded ${usuario.status === 'ativo' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                      >
                        {usuario.status === 'ativo' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{usuario.dataCadastro}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{usuario.totalCompras} pedidos</div>
                      <div className="text-sm text-gray-500">R$ {usuario.totalGasto.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditarUsuario(usuario.id)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleResetarSenha(usuario.id)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Resetar Senha"
                      >
                        <Shield className="h-4 w-4" />
                      </button>
                      {usuario.nivel !== 'admin' && (
                        <button
                          onClick={() => handleExcluirUsuario(usuario.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
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
              Mostrando {inicio + 1}-{Math.min(fim, usuariosFiltrados.length)} de {usuariosFiltrados.length} usuários
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
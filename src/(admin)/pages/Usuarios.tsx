"use client";

import { useState, useEffect } from "react";
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
  ChevronRight,
  Loader2,
  AlertCircle,
  Filter,
  Eye,
  RefreshCw
} from "lucide-react";
import { api } from "@/modules/services/api/axios";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  tipo: string;
  status?: string;
  criadoEm: string;
  atualizadoEm: string;
  foto?: string;
  pedidos?: any[];
}

interface Paginacao {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminUsuarios() {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);
  
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [paginacao, setPaginacao] = useState<Paginacao>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const token = useAuthStore((state) => state.token);

  const tiposUsuario = {
    ADMIN: { label: "Administrador", cor: "bg-red-100 text-red-800", icon: <Shield className="h-4 w-4" /> },
    OPERADOR: { label: "Operador", cor: "bg-blue-100 text-blue-800", icon: <UserCheck className="h-4 w-4" /> },
    CLIENTE: { label: "Cliente", cor: "bg-green-100 text-green-800", icon: <UserCheck className="h-4 w-4" /> }
  };

  // Função para buscar usuários
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: paginaAtual.toString(),
        limit: itensPorPagina.toString(),
      });

      if (busca) params.append('busca', busca);
      if (filtroTipo !== 'todos') params.append('tipo', filtroTipo);

      const response = await api.get(`/usuarios?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
        console.log('📦 Resposta da API:', response.data);

      if (response.data.success) {
        setUsuarios(response.data.data);
        setPaginacao({
          total: response.data.pagination?.total || response.data.data.length,
          page: response.data.pagination?.page || paginaAtual,
          limit:response.data.pagination?.limit || itensPorPagina ,
          totalPages: response.data.pagination?.totalPages || Math.ceil((response.data.pagination?.total || response.data.data.length) / itensPorPagina)
        });
      } else {
        throw new Error('Erro ao carregar usuários');
      }
    } catch (err: any) {
      console.error('Erro ao buscar usuários:', err);
      setError(err.response?.data?.error || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  // // Função para buscar estatísticas
  // const fetchEstatisticas = async () => {
  //   try {
  //     const response = await api.get('/usuarios/estatisticas', {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     return response.data;
  //   } catch (err) {
  //     console.error('Erro ao buscar estatísticas:', err);
  //     return null;
  //   }
  // };

  // Efeito para buscar dados
  useEffect(() => {
    if (!token) {
      setError('Faça login para acessar os usuários');
      setLoading(false);
      return;
    }

    fetchUsuarios();
  }, [paginaAtual, busca, filtroTipo, filtroStatus, token]);

  // Calcular estatísticas locais
  const calcularEstatisticas = () => {
    return {
      totalUsuarios: usuarios.length,
      totalClientes: usuarios.filter(u => u.tipo === 'CLIENTE').length,
      totalAdmins: usuarios.filter(u => u.tipo === 'ADMIN').length,
      totalAtivos: usuarios.filter(u => !u.status || u.status === 'ativo').length,
      totalInativos: usuarios.filter(u => u.status === 'inativo').length
    };
  };

  const estatisticas = calcularEstatisticas();

  // Funções de ação
  const handleNovoUsuario = () => {
    // Navegar para página de criação de usuário
    window.location.href = '/admin/usuarios/novo';
  };

  const handleEditarUsuario = (id: string) => {
    window.location.href = `/admin/usuarios/editar/${id}`;
  };

  const handleVisualizarUsuario = (id: string) => {
    window.location.href = `/admin/usuarios/${id}`;
  };

  const handleExcluirUsuario = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${nome}"?`)) {
      return;
    }

    try {
      setActionLoading(`excluir-${id}`);
      const response = await api.delete(`/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        alert('Usuário excluído com sucesso!');
        fetchUsuarios(); // Recarregar lista
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao excluir usuário');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAlterarStatus = async (id: string, nome: string, statusAtual: string) => {
    const novoStatus = statusAtual === 'ativo' ? 'inativo' : 'ativo';
    if (!confirm(`Alterar status do usuário "${nome}" para ${novoStatus}?`)) {
      return;
    }

    try {
      setActionLoading(`status-${id}`);
      const response = await api.put(`/usuarios/${id}/status`, {
        status: novoStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        alert('Status alterado com sucesso!');
        fetchUsuarios(); // Recarregar lista
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao alterar status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetarSenha = async (id: string, nome: string) => {
    if (!confirm(`Deseja resetar a senha do usuário "${nome}"?`)) {
      return;
    }

    try {
      setActionLoading(`senha-${id}`);
      const response = await api.post(`/usuarios/${id}/resetar-senha`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const novaSenha = response.data.data.novaSenha;
        alert(`Senha resetada com sucesso! Nova senha: ${novaSenha}`);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao resetar senha');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAlterarTipo = async (id: string, nome: string, tipoAtual: string) => {
    const tipos = ['CLIENTE', 'OPERADOR', 'ADMIN'];
    const currentIndex = tipos.indexOf(tipoAtual);
    const novoTipo = tipos[(currentIndex + 1) % tipos.length];
    
    if (!confirm(`Alterar tipo do usuário "${nome}" para ${tiposUsuario[novoTipo as keyof typeof tiposUsuario]?.label || novoTipo}?`)) {
      return;
    }

    try {
      setActionLoading(`tipo-${id}`);
      const response = await api.put(`/usuarios/${id}/tipo`, {
        tipo: novoTipo
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        alert('Tipo alterado com sucesso!');
        fetchUsuarios(); // Recarregar lista
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao alterar tipo');
    } finally {
      setActionLoading(null);
    }
  };

  // Função para obter inicial do nome
  const getInicialNome = (nome: string) => {
    return nome.charAt(0).toUpperCase();
  };

  // Função para calcular total de compras
  const getTotalCompras = (usuario: Usuario) => {
    return usuario.pedidos?.length || 0;
  };

  // Função para calcular total gasto
  const getTotalGasto = (usuario: Usuario) => {
    if (!usuario.pedidos) return 0;
    return usuario.pedidos.reduce((total, pedido) => total + (pedido.total || 0), 0);
  };

  if (loading && usuarios.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#D4AF37] mx-auto mb-4" />
          <p className="text-gray-600">Carregando usuários...</p>
        </div>
      </div>
    );
  }

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

      {/* Aviso de erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

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
                onChange={(e) => {
                  setBusca(e.target.value);
                  setPaginaAtual(1);
                }}
                placeholder="Buscar por nome ou e-mail..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          {/* Filtro Status */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filtroStatus}
                onChange={(e) => {
                  setFiltroStatus(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="todos">Todos status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>

          {/* Filtro Tipo */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filtroTipo}
                onChange={(e) => {
                  setFiltroTipo(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="todos">Todos tipos</option>
                {Object.entries(tiposUsuario).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Usuários</p>
              <p className="text-2xl font-bold">{estatisticas.totalUsuarios}</p>
            </div>
            <UserCheck className="h-8 w-8 text-[#D4AF37]" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes</p>
              <p className="text-2xl font-bold">{estatisticas.totalClientes}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Administradores</p>
              <p className="text-2xl font-bold">{estatisticas.totalAdmins}</p>
            </div>
            <Shield className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ativos</p>
              <p className="text-2xl font-bold">{estatisticas.totalAtivos}</p>
            </div>
            <UserCheck className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37] mr-2" />
            <span>Carregando usuários...</span>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="text-center p-8">
            <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
            <p className="text-gray-600 mb-4">
              {busca || filtroTipo !== 'todos' || filtroStatus !== 'todos'
                ? 'Tente ajustar seus filtros de busca'
                : 'Comece adicionando seu primeiro usuário!'}
            </p>
            <button
              onClick={handleNovoUsuario}
              className="bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#c19b2c]"
            >
              Adicionar Primeiro Usuário
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Usuário</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Contato</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Tipo</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Cadastro</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Compras</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(usuario => (
                    <tr key={usuario.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center">
                          {usuario.foto ? (
                            <img
                              src={usuario.foto}
                              alt={usuario.nome}
                              className="h-10 w-10 rounded-full mr-3 object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                              <span className="font-bold text-gray-600">
                                {getInicialNome(usuario.nome)}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{usuario.nome}</div>
                            <div className="text-sm text-gray-500">ID: {usuario.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{usuario.email}</span>
                          </div>
                          {usuario.telefone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{usuario.telefone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleAlterarTipo(usuario.id, usuario.nome, usuario.tipo)}
                          disabled={actionLoading === `tipo-${usuario.id}`}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            tiposUsuario[usuario.tipo as keyof typeof tiposUsuario]?.cor || 'bg-gray-100 text-gray-800'
                          } flex items-center gap-1 hover:opacity-80 disabled:opacity-50`}
                        >
                          {actionLoading === `tipo-${usuario.id}` ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            tiposUsuario[usuario.tipo as keyof typeof tiposUsuario]?.icon || <UserCheck className="h-4 w-4" />
                          )}
                          {tiposUsuario[usuario.tipo as keyof typeof tiposUsuario]?.label || usuario.tipo}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            usuario.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {usuario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                          </span>
                          <button
                            onClick={() => handleAlterarStatus(usuario.id, usuario.nome, usuario.status || 'ativo')}
                            disabled={actionLoading === `status-${usuario.id}`}
                            className={`p-1 rounded ${usuario.status === 'ativo' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'} disabled:opacity-50`}
                            title={usuario.status === 'ativo' ? 'Desativar' : 'Ativar'}
                          >
                            {actionLoading === `status-${usuario.id}` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : usuario.status === 'ativo' ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(usuario.criadoEm)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{getTotalCompras(usuario)} pedidos</div>
                          <div className="text-sm text-gray-500">{formatCurrency(getTotalGasto(usuario))}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVisualizarUsuario(usuario.id)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditarUsuario(usuario.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleResetarSenha(usuario.id, usuario.nome)}
                            disabled={actionLoading === `senha-${usuario.id}`}
                            className="p-1 text-yellow-600 hover:bg-yellow-50 rounded disabled:opacity-50"
                            title="Resetar Senha"
                          >
                            {actionLoading === `senha-${usuario.id}` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <RefreshCw className="h-4 w-4" />
                            )}
                          </button>
                          {usuario.tipo !== 'ADMIN' && (
                            <button
                              onClick={() => handleExcluirUsuario(usuario.id, usuario.nome)}
                              disabled={actionLoading === `excluir-${usuario.id}`}
                              className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                              title="Excluir"
                            >
                              {actionLoading === `excluir-${usuario.id}` ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
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
            {paginacao.totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-gray-600">
                  Mostrando {((paginaAtual - 1) * itensPorPagina) + 1}-{Math.min(paginaAtual * itensPorPagina, paginacao.total)} de {paginacao.total} usuários
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                    disabled={paginaAtual === 1}
                    className="p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, paginacao.totalPages) }, (_, i) => {
                    let pageNum;
                    if (paginacao.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (paginaAtual <= 3) {
                      pageNum = i + 1;
                    } else if (paginaAtual >= paginacao.totalPages - 2) {
                      pageNum = paginacao.totalPages - 4 + i;
                    } else {
                      pageNum = paginaAtual - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPaginaAtual(pageNum)}
                        className={`w-8 h-8 flex items-center justify-center rounded ${
                          paginaAtual === pageNum
                            ? 'bg-[#D4AF37] text-white'
                            : 'border hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setPaginaAtual(p => Math.min(paginacao.totalPages, p + 1))}
                    disabled={paginaAtual === paginacao.totalPages}
                    className="p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
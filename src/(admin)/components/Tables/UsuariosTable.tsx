"use client";

import { useState } from "react";
import {
  Edit,
  Trash2,
  Phone,
  Calendar,
  UserCheck,
  UserX,
  Shield,
  DollarSign,
  ShoppingBag,
  MoreVertical,
  Search,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Lock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  nivel: 'admin' | 'operador' | 'cliente' | 'moderador';
  status: 'ativo' | 'inativo' | 'pendente' | 'bloqueado';
  dataCadastro: string;
  ultimoAcesso?: string;
  totalCompras: number;
  totalGasto: number;
  endereco?: string;
  avatar?: string;
}

interface UsuariosTableProps {
  usuarios: Usuario[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onStatusChange?: (id: number, status: string) => void;
  onResetPassword?: (id: number) => void;
  onAdd?: () => void;
  onViewDetails?: (id: number) => void;
}

export default function UsuariosTable({
  usuarios,
  onEdit,
  onDelete,
  onStatusChange,
  onResetPassword,
  onAdd,
  onViewDetails
}: UsuariosTableProps) {
  const [busca, setBusca] = useState("");
  const [filtroNivel, setFiltroNivel] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [ordenacao, setOrdenacao] = useState<{ campo: string; direcao: 'asc' | 'desc' }>({ 
    campo: 'id', 
    direcao: 'desc' 
  });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [modoVisualizacao, setModoVisualizacao] = useState<'lista' | 'cartao'>('lista');
  const itensPorPagina = modoVisualizacao === 'lista' ? 10 : 8;

  // Níveis de usuário
  const niveisUsuario = {
    admin: { 
      label: "Administrador", 
      cor: "bg-red-100 text-red-800", 
      icon: <Shield className="h-3 w-3" />,
      descricao: "Acesso completo"
    },
    operador: { 
      label: "Operador", 
      cor: "bg-blue-100 text-blue-800", 
      icon: <UserCheck className="h-3 w-3" />,
      descricao: "Acesso limitado"
    },
    moderador: { 
      label: "Moderador", 
      cor: "bg-purple-100 text-purple-800", 
      icon: <UserCheck className="h-3 w-3" />,
      descricao: "Moderação de conteúdo"
    },
    cliente: { 
      label: "Cliente", 
      cor: "bg-green-100 text-green-800", 
      icon: <UserCheck className="h-3 w-3" />,
      descricao: "Usuário comum"
    }
  };

  // Status
  const statusUsuario = {
    ativo: { label: "Ativo", cor: "bg-green-100 text-green-800", icon: <CheckCircle className="h-3 w-3" /> },
    inativo: { label: "Inativo", cor: "bg-gray-100 text-gray-800", icon: <UserX className="h-3 w-3" /> },
    pendente: { label: "Pendente", cor: "bg-yellow-100 text-yellow-800", icon: <AlertCircle className="h-3 w-3" /> },
    bloqueado: { label: "Bloqueado", cor: "bg-red-100 text-red-800", icon: <XCircle className="h-3 w-3" /> }
  };

  // Filtrar e ordenar usuários
  const usuariosFiltrados = usuarios
    .filter(usuario => {
      const buscaMatch = usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        usuario.email.toLowerCase().includes(busca.toLowerCase()) ||
                        (usuario.telefone && usuario.telefone.includes(busca));
      const nivelMatch = filtroNivel === "todos" || usuario.nivel === filtroNivel;
      const statusMatch = filtroStatus === "todos" || usuario.status === filtroStatus;
      
      return buscaMatch && nivelMatch && statusMatch;
    })
    .sort((a, b) => {
      if (ordenacao.campo === 'nome') {
        return ordenacao.direcao === 'asc' 
          ? a.nome.localeCompare(b.nome)
          : b.nome.localeCompare(a.nome);
      }
      if (ordenacao.campo === 'dataCadastro') {
        return ordenacao.direcao === 'asc'
          ? new Date(a.dataCadastro).getTime() - new Date(b.dataCadastro).getTime()
          : new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime();
      }
      if (ordenacao.campo === 'totalGasto') {
        return ordenacao.direcao === 'asc'
          ? a.totalGasto - b.totalGasto
          : b.totalGasto - a.totalGasto;
      }
      if (ordenacao.campo === 'totalCompras') {
        return ordenacao.direcao === 'asc'
          ? a.totalCompras - b.totalCompras
          : b.totalCompras - a.totalCompras;
      }
      return ordenacao.direcao === 'asc' ? a.id - b.id : b.id - a.id;
    });

  // Paginação
  const totalPaginas = Math.ceil(usuariosFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const usuariosPagina = usuariosFiltrados.slice(inicio, fim);

  // Estatísticas
  const totalUsuarios = usuariosFiltrados.length;
  const usuariosAtivos = usuariosFiltrados.filter(u => u.status === 'ativo').length;
  const totalGasto = usuariosFiltrados.reduce((acc, u) => acc + u.totalGasto, 0);
  const totalCompras = usuariosFiltrados.reduce((acc, u) => acc + u.totalCompras, 0);

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

  // Avatar com inicial
  const renderAvatar = (usuario: Usuario) => {
    if (usuario.avatar) {
      return (
        <img
          src={usuario.avatar}
          alt={usuario.nome}
          className="h-10 w-10 rounded-full object-cover"
        />
      );
    }
    
    const inicial = usuario.nome.charAt(0).toUpperCase();
    const cores = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
    const corIndex = usuario.id % cores.length;
    
    return (
      <div className={`h-10 w-10 rounded-full ${cores[corIndex]} flex items-center justify-center text-white font-bold`}>
        {inicial}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h3 className="font-bold text-xl">Usuários</h3>
            <p className="text-gray-600">Gerencie usuários e permissões</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Total Usuários</div>
              <div className="text-2xl font-bold">{totalUsuarios}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Ativos</div>
              <div className="text-2xl font-bold text-green-600">{usuariosAtivos}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Total Compras</div>
              <div className="text-2xl font-bold text-[#D4AF37]">{totalCompras}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Valor Total</div>
              <div className="text-2xl font-bold text-blue-600">
                R$ {totalGasto.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e controles */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar usuários..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
              />
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
              <select
                value={filtroNivel}
                onChange={(e) => setFiltroNivel(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
              >
                <option value="todos">Todos níveis</option>
                <option value="admin">Administrador</option>
                <option value="operador">Operador</option>
                <option value="moderador">Moderador</option>
                <option value="cliente">Cliente</option>
              </select>

              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
              >
                <option value="todos">Todos status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="pendente">Pendente</option>
                <option value="bloqueado">Bloqueado</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Modo de visualização */}
            <div className="flex border rounded-lg">
              <button
                onClick={() => setModoVisualizacao('lista')}
                className={`px-3 py-2 ${modoVisualizacao === 'lista' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Modo lista"
              >
                <div className="flex flex-col gap-1">
                  <div className="h-1 w-4 bg-gray-600"></div>
                  <div className="h-1 w-4 bg-gray-600"></div>
                  <div className="h-1 w-4 bg-gray-600"></div>
                </div>
              </button>
              <button
                onClick={() => setModoVisualizacao('cartao')}
                className={`px-3 py-2 ${modoVisualizacao === 'cartao' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                title="Modo cartão"
              >
                <div className="grid grid-cols-2 gap-1">
                  <div className="h-2 w-2 bg-gray-600"></div>
                  <div className="h-2 w-2 bg-gray-600"></div>
                  <div className="h-2 w-2 bg-gray-600"></div>
                  <div className="h-2 w-2 bg-gray-600"></div>
                </div>
              </button>
            </div>

            {/* Botões de ação */}
            <button
              onClick={onAdd}
              className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#c19b2c] transition"
            >
              <UserPlus className="h-4 w-4" />
              Novo Usuário
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo - Modo Lista */}
      {modoVisualizacao === 'lista' ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left p-4 text-sm font-medium text-gray-700">
                  Usuário
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">
                  <button
                    onClick={() => ordenarColuna('nivel')}
                    className="flex items-center gap-1 hover:text-gray-900"
                  >
                    Nível {renderSetaOrdenacao('nivel')}
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">
                  <button
                    onClick={() => ordenarColuna('totalCompras')}
                    className="flex items-center gap-1 hover:text-gray-900"
                  >
                    Compras {renderSetaOrdenacao('totalCompras')}
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">
                  <button
                    onClick={() => ordenarColuna('totalGasto')}
                    className="flex items-center gap-1 hover:text-gray-900"
                  >
                    Valor {renderSetaOrdenacao('totalGasto')}
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">
                  <button
                    onClick={() => ordenarColuna('dataCadastro')}
                    className="flex items-center gap-1 hover:text-gray-900"
                  >
                    Cadastro {renderSetaOrdenacao('dataCadastro')}
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {usuariosPagina.map(usuario => (
                <tr key={usuario.id} className="border-b hover:bg-gray-50 group">
                  <td className="p-4">
                    <div className="flex items-center">
                      {renderAvatar(usuario)}
                      <div className="ml-3">
                        <div className="font-medium">{usuario.nome}</div>
                        <div className="text-sm text-gray-500">{usuario.email}</div>
                        {usuario.telefone && (
                          <div className="text-xs text-gray-400">{usuario.telefone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${niveisUsuario[usuario.nivel].cor}`}>
                      {niveisUsuario[usuario.nivel].icon}
                      {niveisUsuario[usuario.nivel].label}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusUsuario[usuario.status].cor}`}>
                        {statusUsuario[usuario.status].icon}
                        {statusUsuario[usuario.status].label}
                      </span>
                      <button
                        onClick={() => onStatusChange?.(usuario.id, usuario.status === 'ativo' ? 'inativo' : 'ativo')}
                        className={`p-1 rounded-full ${usuario.status === 'ativo' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                        title={usuario.status === 'ativo' ? 'Desativar' : 'Ativar'}
                      >
                        {usuario.status === 'ativo' ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{usuario.totalCompras}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">R$ {usuario.totalGasto.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{usuario.dataCadastro}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewDetails?.(usuario.id)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit?.(usuario.id)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onResetPassword?.(usuario.id)}
                        className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                        title="Resetar senha"
                      >
                        <Lock className="h-4 w-4" />
                      </button>
                      {usuario.nivel !== 'admin' && (
                        <button
                          onClick={() => onDelete?.(usuario.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      <div className="relative">
                        <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {/* Dropdown menu */}
                        <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                            Ver Histórico
                          </button>
                          <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                            Alterar Nível
                          </button>
                          <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                            Enviar E-mail
                          </button>
                          {usuario.status === 'bloqueado' && (
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-green-600">
                              Desbloquear
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
        </div>
      ) : (
        /* Modo Cartão */
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {usuariosPagina.map(usuario => (
              <div key={usuario.id} className="border rounded-xl p-4 hover:shadow-lg transition-shadow group">
                {/* Header do cartão */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {renderAvatar(usuario)}
                    <div className="ml-3">
                      <div className="font-medium">{usuario.nome}</div>
                      <div className="text-xs text-gray-500">{usuario.email}</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit?.(usuario.id)}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${niveisUsuario[usuario.nivel].cor}`}>
                    {niveisUsuario[usuario.nivel].label}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusUsuario[usuario.status].cor}`}>
                    {statusUsuario[usuario.status].label}
                  </span>
                </div>

                {/* Informações */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <span>{usuario.telefone || "Não informado"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span>Cadastro: {usuario.dataCadastro}</span>
                  </div>
                  {usuario.ultimoAcesso && (
                    <div className="flex items-center gap-2 text-sm">
                      <UserCheck className="h-3 w-3 text-gray-400" />
                      <span>Último acesso: {usuario.ultimoAcesso}</span>
                    </div>
                  )}
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Compras</div>
                    <div className="font-bold text-lg">{usuario.totalCompras}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Valor</div>
                    <div className="font-bold text-lg text-[#D4AF37]">
                      R$ {usuario.totalGasto.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <button
                    onClick={() => onViewDetails?.(usuario.id)}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100"
                  >
                    Detalhes
                  </button>
                  <button
                    onClick={() => onResetPassword?.(usuario.id)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                  >
                    <Lock className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="p-4 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
      )}
    </div>
  );
}
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
  X,
  Key,
  Info,
  Package,
  DollarSign,
  Eye as EyeIcon,
  EyeOff
} from "lucide-react";
import { api } from "@/modules/services/api/axios";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

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
  endereco?: string;
  dataNascimento?: string;
}

interface Paginacao {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ModalData {
  type: 'create' | 'edit' | 'view' | 'delete' | 'resetPassword' | null;
  usuario?: Usuario;
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
  const [modal, setModal] = useState<ModalData>({ type: null });
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    tipo: 'CLIENTE',
    dataNascimento: '',
    endereco: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  const token = useAuthStore((state) => state.token);

  const tiposUsuario = {
    ADMIN: { label: "Administrador", cor: "bg-red-100 text-red-800", icon: <Shield className="h-4 w-4" /> },
    OPERADOR: { label: "Operador", cor: "bg-blue-100 text-blue-800", icon: <UserCheck className="h-4 w-4" /> },
    CLIENTE: { label: "Cliente", cor: "bg-green-100 text-green-800", icon: <UserCheck className="h-4 w-4" /> }
  };

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

      if (response.data.success) {
        setUsuarios(response.data.data);
        setPaginacao({
          total: response.data.pagination?.total || response.data.data.length,
          page: response.data.pagination?.page || paginaAtual,
          limit:response.data.pagination?.limit || itensPorPagina,
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

  useEffect(() => {
    if (!token) {
      setError('Faça login para acessar os usuários');
      setLoading(false);
      return;
    }

    fetchUsuarios();
  }, [paginaAtual, busca, filtroTipo, filtroStatus, token]);

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

  const openModal = (type: ModalData['type'], usuario?: Usuario) => {
    if (usuario && type !== 'create') {
      if (type === 'edit') {
        setFormData({
          nome: usuario.nome,
          email: usuario.email,
          senha: '',
          telefone: usuario.telefone || '',
          tipo: usuario.tipo,
          dataNascimento: usuario.dataNascimento || '',
          endereco: usuario.endereco || ''
        });
      }
    } else if (type === 'create') {
      setFormData({
        nome: '',
        email: '',
        senha: '',
        telefone: '',
        tipo: 'CLIENTE',
        dataNascimento: '',
        endereco: ''
      });
    }
    setModal({ type, usuario });
    setShowPassword(false);
  };

  const closeModal = () => {
    setModal({ type: null });
  };

  const handleNovoUsuario = () => {
    openModal('create');
  };

  const handleEditarUsuario = (usuario: Usuario) => {
    openModal('edit', usuario);
  };

  const handleVisualizarUsuario = (usuario: Usuario) => {
    openModal('view', usuario);
  };

  const handleExcluirUsuario = (usuario: Usuario) => {
    openModal('delete', usuario);
  };

  const handleResetarSenha = (usuario: Usuario) => {
    openModal('resetPassword', usuario);
  };

  const confirmarExclusao = async () => {
    if (!modal.usuario) return;

    try {
      setActionLoading(`excluir-${modal.usuario.id}`);
      const response = await api.delete(`/usuarios/${modal.usuario.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Usuário excluído com sucesso!');
        fetchUsuarios();
        closeModal();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao excluir usuário');
    } finally {
      setActionLoading(null);
    }
  };

  const confirmarResetSenha = async () => {
    if (!modal.usuario) return;

    try {
      setActionLoading(`senha-${modal.usuario.id}`);
      const response = await api.post(`/usuarios/${modal.usuario.id}/resetar-senha`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const novaSenha = response.data.data.novaSenha;
        toast.success(`Senha resetada com sucesso! Nova senha: ${novaSenha}`);
        closeModal();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao resetar senha');
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
        toast.success('Status alterado com sucesso!');
        fetchUsuarios();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao alterar status');
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
        toast.success('Tipo de usuário alterado com sucesso!');
        fetchUsuarios();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao alterar tipo de usuário');
    } finally {
      setActionLoading(null);
    }
  };

  const salvarUsuario = async () => {
    try {
      setFormLoading(true);

      if (!formData.nome || !formData.email || !formData.tipo) {
        toast.error('Nome, e-mail e tipo são obrigatórios');
        setFormLoading(false);
        return;
      }

      if (modal.type === 'create' && !formData.senha) {
        toast.error('Senha é obrigatória para novo usuário');
        setFormLoading(false);
        return;
      }

      if (modal.type === 'create' && formData.senha.length < 6) {
        toast.error('Senha deve ter pelo menos 6 caracteres');
        setFormLoading(false);
        return;
      }

      const usuarioData: any = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone || undefined,
        tipo: formData.tipo,
        dataNascimento: formData.dataNascimento || undefined,
        endereco: formData.endereco || undefined
      };

      if (modal.type === 'create') {
        usuarioData.senha = formData.senha;
      } else if (modal.type === 'edit' && formData.senha) {
        usuarioData.senha = formData.senha;
      }

      let response;
      if (modal.type === 'create') {
        console.log('Enviando dados para criar usuário:', usuarioData);
        response = await api.post('/usuarios', usuarioData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else if (modal.type === 'edit' && modal.usuario) {
        console.log('Enviando dados para editar usuário:', usuarioData);
        response = await api.put(`/usuarios/${modal.usuario.id}`, usuarioData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      if (response?.data.success) {
        toast.success(
          modal.type === 'create' 
            ? 'Usuário criado com sucesso!' 
            : 'Usuário atualizado com sucesso!'
        );
        fetchUsuarios();
        closeModal();
      }
    } catch (err: any) {
      console.error('Erro detalhado:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Erro ao salvar usuário';
      toast.error(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const getInicialNome = (nome: string) => {
    return nome.charAt(0).toUpperCase();
  };

  const getTotalCompras = (usuario: Usuario) => {
    return usuario.pedidos?.length || 0;
  };

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
      {modal.type && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                {modal.type === 'create' && <UserPlus className="h-6 w-6 text-[#D4AF37]" />}
                {modal.type === 'edit' && <Edit className="h-6 w-6 text-[#D4AF37]" />}
                {modal.type === 'view' && <Eye className="h-6 w-6 text-[#D4AF37]" />}
                {modal.type === 'delete' && <Trash2 className="h-6 w-6 text-red-600" />}
                {modal.type === 'resetPassword' && <Key className="h-6 w-6 text-[#D4AF37]" />}
                <h2 className="text-xl font-bold">
                  {modal.type === 'create' && 'Novo Usuário'}
                  {modal.type === 'edit' && 'Editar Usuário'}
                  {modal.type === 'view' && 'Detalhes do Usuário'}
                  {modal.type === 'delete' && 'Excluir Usuário'}
                  {modal.type === 'resetPassword' && 'Resetar Senha'}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {modal.type === 'view' && modal.usuario && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    {modal.usuario.foto ? (
                      <img
                        src={modal.usuario.foto}
                        alt={modal.usuario.nome}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-600">
                          {getInicialNome(modal.usuario.nome)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold">{modal.usuario.nome}</h3>
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                        tiposUsuario[modal.usuario.tipo as keyof typeof tiposUsuario]?.cor || 'bg-gray-100 text-gray-800'
                      }`}>
                        {tiposUsuario[modal.usuario.tipo as keyof typeof tiposUsuario]?.icon}
                        {tiposUsuario[modal.usuario.tipo as keyof typeof tiposUsuario]?.label}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">E-mail</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{modal.usuario.email}</span>
                        </div>
                      </div>
                      
                      {modal.usuario.telefone && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Telefone</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{modal.usuario.telefone}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <div className="mt-1">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            modal.usuario.status === 'ATIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {modal.usuario.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-600">Data de Cadastro</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(modal.usuario.criadoEm)}</span>
                        </div>
                      </div>
                      
                      {modal.usuario.dataNascimento && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Data de Nascimento</label>
                          <div className="mt-1">{formatDate(modal.usuario.dataNascimento)}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {modal.usuario.endereco && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Endereço</label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                        {modal.usuario.endereco}
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-6">
                    <h4 className="font-medium text-lg mb-4">Estatísticas</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-gray-600" />
                          <span className="text-sm text-gray-600">Total de Compras</span>
                        </div>
                        <div className="text-2xl font-bold mt-2">{getTotalCompras(modal.usuario)}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-gray-600" />
                          <span className="text-sm text-gray-600">Total Gasto</span>
                        </div>
                        <div className="text-2xl font-bold mt-2">{formatCurrency(getTotalGasto(modal.usuario))}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <Info className="h-5 w-5 text-gray-600" />
                          <span className="text-sm text-gray-600">Membro desde</span>
                        </div>
                        <div className="text-lg font-medium mt-2">
                          {formatDate(modal.usuario.criadoEm)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(modal.type === 'create' || modal.type === 'edit') && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome *
                      </label>
                      <input
                        type="text"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        placeholder="Digite o nome completo"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        placeholder="exemplo@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Senha {modal.type === 'create' ? '*' : '(opcional)'}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.senha}
                          onChange={(e) => setFormData({...formData, senha: e.target.value})} 
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                          placeholder={modal.type === 'create' ? 'Digite a senha (mínimo 6 caracteres)' : 'Deixe em branco para manter a senha atual'}
                          required={modal.type === 'create'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {modal.type === 'create' && (
                        <p className="text-xs text-gray-500 mt-1">A senha deve ter pelo menos 6 caracteres.</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        value={formData.telefone}
                        onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Usuário *
                      </label>
                      <select
                        value={formData.tipo}
                        onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        required
                      >
                        {Object.entries(tiposUsuario).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Nascimento
                      </label>
                      <input
                        type="date"
                        value={formData.dataNascimento}
                        onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Endereço
                    </label>
                    <textarea
                      value={formData.endereco}
                      onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      placeholder="Digite o endereço completo"
                    />
                  </div>
                </div>
              )}

              {modal.type === 'delete' && modal.usuario && (
                <div className="text-center">
                  <Trash2 className="h-16 w-16 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Confirmar exclusão
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Tem certeza que deseja excluir o usuário{" "}
                    <span className="font-bold">{modal.usuario.nome}</span>?
                    <br />
                    Esta ação não pode ser desfeita.
                  </p>
                </div>
              )}

              {modal.type === 'resetPassword' && modal.usuario && (
                <div className="text-center">
                  <Key className="h-16 w-16 text-[#D4AF37] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Resetar Senha
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Deseja resetar a senha do usuário{" "}
                    <span className="font-bold">{modal.usuario.nome}</span>?
                    <br />
                    Uma nova senha será gerada automaticamente.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              
              {modal.type === 'view' && (
                <button
                  onClick={() => modal.usuario && handleEditarUsuario(modal.usuario)}
                  className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#c19b2c]"
                >
                  <Edit className="h-4 w-4" />
                  Editar Usuário
                </button>
              )}
              
              {(modal.type === 'create' || modal.type === 'edit') && (
                <button
                  onClick={salvarUsuario}
                  disabled={formLoading}
                  className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#c19b2c] disabled:opacity-50"
                >
                  {formLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : modal.type === 'create' ? (
                    <UserPlus className="h-4 w-4" />
                  ) : (
                    <Edit className="h-4 w-4" />
                  )}
                  {formLoading ? 'Salvando...' : modal.type === 'create' ? 'Criar Usuário' : 'Salvar Alterações'}
                </button>
              )}
              
              {modal.type === 'delete' && (
                <button
                  onClick={confirmarExclusao}
                  disabled={actionLoading === `excluir-${modal.usuario?.id}`}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading === `excluir-${modal.usuario?.id}` ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {actionLoading === `excluir-${modal.usuario?.id}` ? 'Excluindo...' : 'Excluir Usuário'}
                </button>
              )}
              
              {modal.type === 'resetPassword' && (
                <button
                  onClick={confirmarResetSenha}
                  disabled={actionLoading === `senha-${modal.usuario?.id}`}
                  className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#c19b2c] disabled:opacity-50"
                >
                  {actionLoading === `senha-${modal.usuario?.id}` ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Key className="h-4 w-4" />
                  )}
                  {actionLoading === `senha-${modal.usuario?.id}` ? 'Resetando...' : 'Resetar Senha'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="grid md:grid-cols-4 gap-4">
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
                            usuario.status === 'ATIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {usuario.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                          </span>
                          <button
                            onClick={() => handleAlterarStatus(usuario.id, usuario.nome, usuario.status || 'ATIVO')}
                            disabled={actionLoading === `status-${usuario.id}`}
                            className={`p-1 rounded ${usuario.status === 'ATIVO' ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'} disabled:opacity-50`}
                            title={usuario.status === 'ATIVO' ? 'Desativar' : 'Ativar'}
                          >
                            {actionLoading === `status-${usuario.id}` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : usuario.status === 'ATIVO' ? (
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
                            onClick={() => handleVisualizarUsuario(usuario)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditarUsuario(usuario)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleResetarSenha(usuario)}
                            className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                            title="Resetar Senha"
                          >
                            <Key className="h-4 w-4" />
                          </button>
                          {usuario.tipo !== 'ADMIN' && (
                            <button
                              onClick={() => handleExcluirUsuario(usuario)}
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
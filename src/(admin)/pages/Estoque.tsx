"use client";

import { useState } from "react";
import {
  Search,
  Package,
  AlertTriangle,
  TrendingUp,
  Edit,
  Plus,
  Minus,
  Download,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ShoppingCart,
  History,
  ArrowUpDown,
  XCircle,
  Truck,
  Store,
  Eye,
  Filter,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  PackagePlus,
  PackageMinus,
  RotateCcw,
  Mail,
  FileSpreadsheet,
  Camera,
  Tag,
  Layers,
  Copy,
  Trash2,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Clock,
  Shield,
  Users,
  Globe,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/modules/services/api/axios";
import { format, subDays, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import * as Select from "@radix-ui/react-select";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from "chart.js";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

// ========== INTERFACES ==========
interface ProdutoEstoque {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  quantidadeMinima: number;
  quantidadeMaxima: number;
  status: "ATIVO" | "INATIVO" | "BLOQUEADO";
  nivelEstoque: "CRITICO" | "BAIXO" | "NORMAL" | "ALTO" | "EXCESSO";
  foto: string | null;
  id_categoria: string;
  categoria?: {
    id: string;
    nome: string;
  };
  ImagemProduto?: Array<{
    id: string;
    url: string;
    principal: boolean;
  }>;
  movimentacoes?: Array<MovimentacaoEstoque>;
  ultimaMovimentacao?: string;
  diasSemMovimentacao?: number;
  previsaoEsgotamento?: number;
  pontoRessuprimento?: number;
  loteCompra?: number;
  localizacao?: string;
  fornecedor?: {
    id: string;
    nome: string;
    prazoEntrega: number;
    contato:number;
    email:string;
    telefone:number;
  };
  createdAt: string;
  updatedAt: string;
}

interface MovimentacaoEstoque {
  id: string;
  tipo: "ENTRADA" | "SAIDA" | "AJUSTE" | "TRANSFERENCIA" | "DEVOLUCAO" | "PERDA";
  quantidade: number;
  quantidadeAnterior: number;
  quantidadeNova: number;
  motivo: string;
  observacao?: string;
  documento?: string;
  usuario?: {
    id: string;
    nome: string;
    email: string;
  };
  pedidoId?: string;
  compraId?: string;
  transferenciaId?: string;
  created_at: string;
}

interface Fornecedor {
  id: string;
  nome: string;
  contato: string;
  email: string;
  telefone: string;
  prazoEntrega: number;
  produtos: Array<{
    id: string;
    nome: string;
  }>;
}

interface Categoria {
  id: string;
  nome: string;
  produtos: Array<{
    id: string;
    nome: string;
  }>;
}

interface RelatorioEstoque {
  totalProdutos: number;
  valorTotalEstoque: number;
  produtosCriticos: number;
  produtosBaixos: number;
  produtosNormais: number;
  produtosAltos: number;
  produtosExcesso: number;
  produtosInativos: number;
  mediaGiroEstoque: number;
  diasCobertura: number;
  produtosSemMovimento: number;
  produtosAbaixoMinimo: number;
  produtosAcimaMaximo: number;
  valorMedioProduto: number;
}

// ========== COMPONENTES ==========

// Modal de Movimentação
function ModalMovimentacao({ 
  produto, 
  open, 
  onOpenChange,
  onSuccess 
}: { 
  produto?: ProdutoEstoque; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [tipo, setTipo] = useState<MovimentacaoEstoque["tipo"]>("ENTRADA");
  const [quantidade, setQuantidade] = useState<number>(1);
  const [motivo, setMotivo] = useState("");
  const [observacao, setObservacao] = useState("");
  const [documento, setDocumento] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!produto) return;

    setLoading(true);
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`${tipo === "ENTRADA" ? "Entrada" : tipo === "SAIDA" ? "Saída" : "Ajuste"} registrada com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      queryClient.invalidateQueries({ queryKey: ["estoque-movimentacoes"] });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao registrar movimentação");
    } finally {
      setLoading(false);
    }
  };

  const getMaxQuantidade = () => {
    if (tipo === "SAIDA" || tipo === "PERDA") return produto?.quantidade || 0;
    return 9999;
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-50">
          <Dialog.Title className="text-xl font-bold mb-4">
            Movimentar Estoque - {produto?.nome}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo de Movimentação */}
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Movimentação</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "ENTRADA", label: "Entrada", icon: PackagePlus },
                  { value: "SAIDA", label: "Saída", icon: PackageMinus },
                  { value: "AJUSTE", label: "Ajuste", icon: Settings },
                  { value: "DEVOLUCAO", label: "Devolução", icon: RotateCcw },
                ].map((opcao) => {
                  const Icon = opcao.icon;
                  return (
                    <button
                      key={opcao.value}
                      type="button"
                      onClick={() => setTipo(opcao.value as any)}
                      className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                        tipo === opcao.value
                          ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                          : "hover:border-gray-300"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{opcao.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantidade */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Quantidade {tipo === "SAIDA" && `(Máx: ${getMaxQuantidade()})`}
              </label>
              <div className="flex items-center border rounded-lg">
                <button
                  type="button"
                  onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                  className="p-2 hover:bg-gray-100"
                  disabled={quantidade <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  value={quantidade}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (isNaN(val)) return;
                    setQuantidade(Math.min(val, getMaxQuantidade()));
                  }}
                  min={1}
                  max={getMaxQuantidade()}
                  className="w-20 text-center border-x py-2 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantidade(Math.min(quantidade + 1, getMaxQuantidade()))}
                  className="p-2 hover:bg-gray-100"
                  disabled={quantidade >= getMaxQuantidade()}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Motivo */}
            <div>
              <label className="block text-sm font-medium mb-2">Motivo</label>
              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="">Selecione um motivo</option>
                {tipo === "ENTRADA" && (
                  <>
                    <option value="COMPRA">Compra de fornecedor</option>
                    <option value="DEVOLUCAO">Devolução de cliente</option>
                    <option value="TRANSFERENCIA">Transferência de outra loja</option>
                    <option value="AJUSTE">Ajuste de inventário</option>
                  </>
                )}
                {tipo === "SAIDA" && (
                  <>
                    <option value="VENDA">Venda</option>
                    <option value="TRANSFERENCIA">Transferência para outra loja</option>
                    <option value="AMOSTRA">Amostra grátis</option>
                    <option value="BRINDE">Brinde promocional</option>
                  </>
                )}
                {tipo === "AJUSTE" && (
                  <>
                    <option value="INVENTARIO">Contagem de inventário</option>
                    <option value="CORRECAO">Correção de estoque</option>
                    <option value="REAVALIACAO">Reavaliação</option>
                  </>
                )}
                {tipo === "DEVOLUCAO" && (
                  <>
                    <option value="FORNECEDOR">Devolução para fornecedor</option>
                    <option value="TROCA">Troca de produto</option>
                    <option value="DEFEITO">Produto com defeito</option>
                  </>
                )}
              </select>
            </div>

            {/* Documento */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {tipo === "ENTRADA" ? "Nota Fiscal / Pedido" : 
                 tipo === "SAIDA" ? "Número do Pedido" : 
                 "Documento de Referência"}
              </label>
              <input
                type="text"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                placeholder="Ex: NF-12345, PED-6789"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            {/* Observação */}
            <div>
              <label className="block text-sm font-medium mb-2">Observação</label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                rows={3}
                placeholder="Informações adicionais..."
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            {/* Resumo */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Estoque atual:</span>
                <span className="font-bold">{produto?.quantidade} unidades</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Estoque após movimentação:</span>
                <span className={`font-bold ${
                  tipo === "ENTRADA" || tipo === "DEVOLUCAO"
                    ? "text-green-600"
                    : tipo === "SAIDA" || tipo === "PERDA"
                    ? "text-red-600"
                    : "text-blue-600"
                }`}>
                  {tipo === "ENTRADA" || tipo === "DEVOLUCAO"
                    ? (produto?.quantidade || 0) + quantidade
                    : tipo === "SAIDA" || tipo === "PERDA"
                    ? (produto?.quantidade || 0) - quantidade
                    : quantidade}
                </span>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#c19b2c] disabled:opacity-50"
                disabled={loading || !motivo || quantidade < 1}
              >
                {loading ? "Processando..." : "Confirmar Movimentação"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Modal de Cadastro/Edição de Produto
function ModalProdutoEstoque({ 
  produto, 
  open, 
  onOpenChange,
  onSuccess 
}: { 
  produto?: ProdutoEstoque; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    nome: produto?.nome || "",
    descricao: produto?.descricao || "",
    preco: produto?.preco || 0,
    quantidade: produto?.quantidade || 0,
    quantidadeMinima: produto?.quantidadeMinima || 5,
    quantidadeMaxima: produto?.quantidadeMaxima || 100,
    id_categoria: produto?.id_categoria || "",
    localizacao: produto?.localizacao || "",
    fornecedorId: produto?.fornecedor?.id || "",
    status: produto?.status || "ATIVO",
    loteCompra: produto?.loteCompra || 10,
    pontoRessuprimento: produto?.pontoRessuprimento || 10,
  });
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: categorias } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const response = await api.get("/categorias");
      return response.data;
    },
    enabled: open,
  });

  const { data: fornecedores } = useQuery({
    queryKey: ["fornecedores"],
    queryFn: async () => {
      const response = await api.get("/fornecedores");
      return response.data;
    },
    enabled: open,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(produto ? "Produto atualizado com sucesso!" : "Produto cadastrado no estoque!");
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(produto ? "Erro ao atualizar produto" : "Erro ao cadastrar produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 z-50">
          <Dialog.Title className="text-xl font-bold mb-4">
            {produto ? "Editar Produto" : "Novo Produto no Estoque"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2">Informações Básicas</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Nome do Produto *</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    rows={3}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preço (KZ) *</label>
                  <input
                    type="number"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) })}
                    required
                    min={0}
                    step="0.01"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Categoria *</label>
                  <select
                    value={formData.id_categoria}
                    onChange={(e) => setFormData({ ...formData, id_categoria: e.target.value })}
                    required
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option value="">Selecione</option>
                    {categorias?.data?.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option value="ATIVO">Ativo</option>
                    <option value="INATIVO">Inativo</option>
                    <option value="BLOQUEADO">Bloqueado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Configurações de Estoque */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2">Configurações de Estoque</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quantidade Inicial</label>
                  <input
                    type="number"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) })}
                    min={0}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quantidade Mínima *</label>
                  <input
                    type="number"
                    value={formData.quantidadeMinima}
                    onChange={(e) => setFormData({ ...formData, quantidadeMinima: parseInt(e.target.value) })}
                    required
                    min={0}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quantidade Máxima *</label>
                  <input
                    type="number"
                    value={formData.quantidadeMaxima}
                    onChange={(e) => setFormData({ ...formData, quantidadeMaxima: parseInt(e.target.value) })}
                    required
                    min={0}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ponto de Ressuprimento</label>
                  <input
                    type="number"
                    value={formData.pontoRessuprimento}
                    onChange={(e) => setFormData({ ...formData, pontoRessuprimento: parseInt(e.target.value) })}
                    min={0}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Lote de Compra</label>
                  <input
                    type="number"
                    value={formData.loteCompra}
                    onChange={(e) => setFormData({ ...formData, loteCompra: parseInt(e.target.value) })}
                    min={1}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Localização</label>
                  <input
                    type="text"
                    value={formData.localizacao}
                    onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                    placeholder="Ex: Prateleira A, Corredor 1"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Fornecedor */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2">Fornecedor</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">Fornecedor Padrão</label>
                <select
                  value={formData.fornecedorId}
                  onChange={(e) => setFormData({ ...formData, fornecedorId: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option value="">Selecione um fornecedor</option>
                  {fornecedores?.data?.map((forn: any) => (
                    <option key={forn.id} value={forn.id}>{forn.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#c19b2c] disabled:opacity-50"
                disabled={loading || !formData.nome || !formData.id_categoria}
              >
                {loading ? "Salvando..." : produto ? "Atualizar" : "Cadastrar"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Histórico de Movimentações
function HistoricoMovimentacoes({ produtoId }: { produtoId: string }) {
  const { data: movimentacoes, isLoading } = useQuery({
    queryKey: ["estoque-movimentacoes", produtoId],
    queryFn: async () => {
      const response = await api.get(`/estoque/${produtoId}/movimentacoes`);
      return response.data;
    },
  });

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "ENTRADA": return <PackagePlus className="h-4 w-4 text-green-600" />;
      case "SAIDA": return <PackageMinus className="h-4 w-4 text-red-600" />;
      case "AJUSTE": return <Settings className="h-4 w-4 text-blue-600" />;
      case "DEVOLUCAO": return <RotateCcw className="h-4 w-4 text-purple-600" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  if (isLoading) return <div className="text-center py-4">Carregando...</div>;

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {movimentacoes?.data?.map((mov: MovimentacaoEstoque) => (
        <div key={mov.id} className="border rounded-lg p-3 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getTipoIcon(mov.tipo)}
              <div>
                <span className="font-medium">
                  {mov.tipo === "ENTRADA" ? "Entrada" :
                   mov.tipo === "SAIDA" ? "Saída" :
                   mov.tipo === "AJUSTE" ? "Ajuste" :
                   mov.tipo === "DEVOLUCAO" ? "Devolução" : mov.tipo}
                </span>
                <div className="text-xs text-gray-500">
                  {format(new Date(mov.created_at), "dd/MM/yyyy HH:mm")}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className={`font-bold ${
                mov.tipo === "ENTRADA" || mov.tipo === "DEVOLUCAO"
                  ? "text-green-600"
                  : mov.tipo === "SAIDA"
                  ? "text-red-600"
                  : "text-blue-600"
              }`}>
                {mov.tipo === "ENTRADA" || mov.tipo === "DEVOLUCAO" ? "+" : "-"}{mov.quantidade}
              </span>
              <div className="text-xs text-gray-500">
                {mov.quantidadeAnterior} → {mov.quantidadeNova}
              </div>
            </div>
          </div>
          {mov.motivo && (
            <div className="mt-2 text-sm">
              <span className="text-gray-600">Motivo: {mov.motivo}</span>
              {mov.observacao && (
                <div className="text-xs text-gray-500 mt-1">{mov.observacao}</div>
              )}
            </div>
          )}
          {mov.documento && (
            <div className="mt-1 text-xs text-gray-500">
              Documento: {mov.documento}
            </div>
          )}
          {mov.usuario && (
            <div className="mt-1 text-xs text-gray-500">
              Usuário: {mov.usuario.nome}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Gráfico de Movimentações
function GraficoMovimentacoes({ produtoId }: { produtoId: string }) {
  const { data: movimentacoes } = useQuery({
    queryKey: ["estoque-movimentacoes-grafico", produtoId],
    queryFn: async () => {
      const response = await api.get(`/estoque/${produtoId}/movimentacoes/grafico`);
      return response.data;
    },
  });

  const data = {
    labels: movimentacoes?.labels || ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Entradas",
        data: movimentacoes?.entradas || [65, 59, 80, 81, 56, 55],
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
      },
      {
        label: "Saídas",
        data: movimentacoes?.saidas || [28, 48, 40, 19, 86, 27],
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
}

// Modal de Detalhes do Produto
function ModalDetalhesProduto({ 
  produto, 
  open, 
  onOpenChange 
}: { 
  produto?: ProdutoEstoque; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState("detalhes");

  if (!produto) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto z-50">
          <Dialog.Title className="sr-only">Detalhes do Produto</Dialog.Title>
          
          <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            {/* Header com abas */}
            <div className="border-b sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between p-4">
                <div>
                  <h2 className="text-xl font-bold">{produto.nome}</h2>
                  <p className="text-sm text-gray-500">{produto.categoria?.nome}</p>
                </div>
                <Dialog.Close asChild>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <XCircle className="h-5 w-5" />
                  </button>
                </Dialog.Close>
              </div>
              
              <Tabs.List className="flex px-4 gap-1">
                {[
                  { value: "detalhes", label: "Detalhes", icon: Eye },
                  { value: "movimentacoes", label: "Movimentações", icon: History },
                  { value: "grafico", label: "Gráfico", icon: BarChart3 },
                  { value: "alertas", label: "Alertas", icon: AlertTriangle },
                  { value: "fornecedores", label: "Fornecedores", icon: Truck },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Tabs.Trigger
                      key={tab.value}
                      value={tab.value}
                      className={`px-4 py-2 border-b-2 flex items-center gap-2 text-sm font-medium transition-colors ${
                        activeTab === tab.value
                          ? "border-[#D4AF37] text-[#D4AF37]"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </Tabs.Trigger>
                  );
                })}
              </Tabs.List>
            </div>

            {/* Conteúdo das abas */}
            <div className="p-6">
              <Tabs.Content value="detalhes" className="space-y-6">
                {/* Informações do Produto */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Coluna Esquerda */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Informações Gerais</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">ID:</span>
                          <span className="font-mono text-sm">{produto.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            produto.status === "ATIVO" ? "bg-green-100 text-green-800" :
                            produto.status === "INATIVO" ? "bg-gray-100 text-gray-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {produto.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nível Estoque:</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            produto.nivelEstoque === "CRITICO" ? "bg-red-100 text-red-800" :
                            produto.nivelEstoque === "BAIXO" ? "bg-yellow-100 text-yellow-800" :
                            produto.nivelEstoque === "NORMAL" ? "bg-green-100 text-green-800" :
                            produto.nivelEstoque === "ALTO" ? "bg-blue-100 text-blue-800" :
                            "bg-purple-100 text-purple-800"
                          }`}>
                            {produto.nivelEstoque}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Criado em:</span>
                          <span>{format(new Date(produto.createdAt), "dd/MM/yyyy")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Atualizado em:</span>
                          <span>{format(new Date(produto.updatedAt), "dd/MM/yyyy HH:mm")}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Descrição</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700">{produto.descricao || "Sem descrição"}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Imagens</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {produto.ImagemProduto && produto.ImagemProduto.length > 0 ? (
                          <div className="grid grid-cols-4 gap-2">
                            {produto.ImagemProduto.map((img) => (
                              <img
                                key={img.id}
                                src={img.url}
                                alt={produto.nome}
                                className="w-full h-20 object-cover rounded border"
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4">Nenhuma imagem cadastrada</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Coluna Direita - Estoque */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Níveis de Estoque</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                        {/* Barra de progresso */}
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Estoque atual</span>
                            <span className="font-bold">{produto.quantidade} unidades</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full ${
                                produto.quantidade <= produto.quantidadeMinima ? "bg-red-500" :
                                produto.quantidade >= produto.quantidadeMaxima ? "bg-blue-500" :
                                "bg-green-500"
                              }`}
                              style={{
                                width: `${Math.min(
                                  (produto.quantidade / produto.quantidadeMaxima) * 100,
                                  100
                                )}%`
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Mín: {produto.quantidadeMinima}</span>
                            <span>Ideal</span>
                            <span>Máx: {produto.quantidadeMaxima}</span>
                          </div>
                        </div>

                        {/* Indicadores */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="border rounded p-2">
                            <div className="text-xs text-gray-500">Ponto Ressuprimento</div>
                            <div className="font-bold">{produto.pontoRessuprimento || produto.quantidadeMinima}</div>
                          </div>
                          <div className="border rounded p-2">
                            <div className="text-xs text-gray-500">Lote Compra</div>
                            <div className="font-bold">{produto.loteCompra || 0}</div>
                          </div>
                          <div className="border rounded p-2">
                            <div className="text-xs text-gray-500">Localização</div>
                            <div className="font-bold text-sm">{produto.localizacao || "Não definida"}</div>
                          </div>
                          <div className="border rounded p-2">
                            <div className="text-xs text-gray-500">Dias sem mov.</div>
                            <div className="font-bold">{produto.diasSemMovimentacao || 0}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Valores</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Preço unitário:</span>
                          <span className="font-bold">KZ {produto.preco.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Valor total em estoque:</span>
                          <span className="font-bold text-green-600">
                            KZ {(produto.preco * produto.quantidade).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Previsões</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Previsão de esgotamento:</span>
                          <span className={`font-medium ${
                            produto.previsaoEsgotamento && produto.previsaoEsgotamento < 7
                              ? "text-red-600"
                              : "text-gray-900"
                          }`}>
                            {produto.previsaoEsgotamento 
                              ? `${produto.previsaoEsgotamento} dias`
                              : "Não calculado"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="movimentacoes">
                <HistoricoMovimentacoes produtoId={produto.id} />
              </Tabs.Content>

              <Tabs.Content value="grafico">
                <GraficoMovimentacoes produtoId={produto.id} />
              </Tabs.Content>

              <Tabs.Content value="alertas">
                <div className="space-y-4">
                  {produto.quantidade <= produto.quantidadeMinima && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-red-800">Estoque Crítico</h4>
                          <p className="text-red-700 text-sm">
                            Estoque atual ({produto.quantidade}) está abaixo do mínimo ({produto.quantidadeMinima}).
                            Recomendamos fazer um pedido de reposição imediatamente.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {produto.quantidade >= produto.quantidadeMaxima && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Package className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-blue-800">Estoque Excedente</h4>
                          <p className="text-blue-700 text-sm">
                            Estoque atual ({produto.quantidade}) excede o máximo ({produto.quantidadeMaxima}).
                            Considere promover ou reduzir pedidos de compra.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {produto.diasSemMovimentacao && produto.diasSemMovimentacao > 30 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-yellow-800">Sem Movimentação</h4>
                          <p className="text-yellow-700 text-sm">
                            Este produto não tem movimentação há {produto.diasSemMovimentacao} dias.
                            Pode ser um item de baixa rotatividade.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Tabs.Content>

              <Tabs.Content value="fornecedores">
                <div className="space-y-4">
                  {produto.fornecedor ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Truck className="h-5 w-5 text-gray-500" />
                        <div>
                          <h4 className="font-bold">{produto.fornecedor.nome}</h4>
                          <p className="text-sm text-gray-600">Fornecedor Padrão</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Contato:</span>
                          <span className="ml-2 font-medium">{produto.fornecedor.contato}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <span className="ml-2 font-medium">{produto.fornecedor.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Telefone:</span>
                          <span className="ml-2 font-medium">{produto.fornecedor.telefone}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Prazo entrega:</span>
                          <span className="ml-2 font-medium">{produto.fornecedor.prazoEntrega} dias</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      Nenhum fornecedor cadastrado para este produto
                    </p>
                  )}
                </div>
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Componente Principal
export default function AdminEstoque() {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroNivel, setFiltroNivel] = useState("todos");
  const [ordenarPor, setOrdenarPor] = useState("nome");
  const [ordenarDirecao, setOrdenarDirecao] = useState<"asc" | "desc">("asc");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(20);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalMovimentacaoAberto, setModalMovimentacaoAberto] = useState(false);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoEstoque | undefined>();
  const [produtosSelecionados, setProdutosSelecionados] = useState<string[]>([]);
  const [tipoRelatorio, setTipoRelatorio] = useState("completo");
  
  const queryClient = useQueryClient();

  // Buscar dados
  const { data: estoque, isLoading } = useQuery({
    queryKey: ["estoque"],
    queryFn: async () => {
      const response = await api.get("/estoque");
      return response.data;
    },
  });

  const { data: categorias } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const response = await api.get("/categorias");
      return response.data;
    },
  });

  const { data: relatorio } = useQuery({
    queryKey: ["estoque-relatorio"],
    queryFn: async () => {
      const response = await api.get("/estoque/relatorio");
      return response.data;
    },
  });

  // Calcular estatísticas em tempo real
  const calcularNivelEstoque = (quantidade: number, minima: number, maxima: number) => {
    if (quantidade === 0) return "CRITICO";
    if (quantidade < minima) return "BAIXO";
    if (quantidade > maxima) return "EXCESSO";
    if (quantidade >= maxima * 0.8) return "ALTO";
    return "NORMAL";
  };

  // Filtrar e ordenar produtos
  const produtosProcessados = estoque?.data
    ?.map((p: ProdutoEstoque) => ({
      ...p,
      nivelEstoque: calcularNivelEstoque(p.quantidade, p.quantidadeMinima || 5, p.quantidadeMaxima || 100),
    }))
    ?.filter((produto: ProdutoEstoque) => {
      const buscaMatch = produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        produto.descricao?.toLowerCase().includes(busca.toLowerCase());
      const statusMatch = filtroStatus === "todos" || produto.status === filtroStatus;
      const categoriaMatch = filtroCategoria === "todas" || produto.id_categoria === filtroCategoria;
      const nivelMatch = filtroNivel === "todos" || produto.nivelEstoque === filtroNivel;
      return buscaMatch && statusMatch && categoriaMatch && nivelMatch;
    })
    ?.sort((a: ProdutoEstoque, b: ProdutoEstoque) => {
      let comparacao = 0;
      switch (ordenarPor) {
        case "nome":
          comparacao = a.nome.localeCompare(b.nome);
          break;
        case "quantidade":
          comparacao = a.quantidade - b.quantidade;
          break;
        case "preco":
          comparacao = a.preco - b.preco;
          break;
        case "valorTotal":
          comparacao = (a.preco * a.quantidade) - (b.preco * b.quantidade);
          break;
        case "atualizadoEm":
          comparacao = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          break;
        default:
          comparacao = a.nome.localeCompare(b.nome);
      }
      return ordenarDirecao === "asc" ? comparacao : -comparacao;
    });

  const totalPaginas = Math.ceil((produtosProcessados?.length || 0) / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const produtosPagina = produtosProcessados?.slice(inicio, fim);

  // Handlers
  const handleSelecionarTodos = () => {
    if (produtosSelecionados.length === produtosPagina?.length) {
      setProdutosSelecionados([]);
    } else {
      setProdutosSelecionados(produtosPagina?.map((p: ProdutoEstoque) => p.id) || []);
    }
  };

  const handleSelecionarProduto = (id: string) => {
    if (produtosSelecionados.includes(id)) {
      setProdutosSelecionados(produtosSelecionados.filter(pId => pId !== id));
    } else {
      setProdutosSelecionados([...produtosSelecionados, id]);
    }
  };

  const handleMovimentacaoEmMassa = (tipo: string) => {
    if (produtosSelecionados.length === 0) {
      toast.error("Selecione pelo menos um produto");
      return;
    }
    toast.success(`Movimentação em massa de ${produtosSelecionados.length} produtos em breve!`);
  };

  const handleExportarRelatorio = () => {
    toast.success(`Relatório ${tipoRelatorio} exportado com sucesso!`);
  };

  const handleAtualizarTodos = () => {
    queryClient.invalidateQueries({ queryKey: ["estoque"] });
    toast.success("Dados atualizados com sucesso!");
  };

  // Cores para níveis de estoque
  const getNivelInfo = (nivel: string) => {
    const info: any = {
      CRITICO: { label: "Crítico", cor: "bg-red-100 text-red-800", icon: AlertTriangle },
      BAIXO: { label: "Baixo", cor: "bg-yellow-100 text-yellow-800", icon: AlertTriangle },
      NORMAL: { label: "Normal", cor: "bg-green-100 text-green-800", icon: Package },
      ALTO: { label: "Alto", cor: "bg-blue-100 text-blue-800", icon: Package },
      EXCESSO: { label: "Excesso", cor: "bg-purple-100 text-purple-800", icon: Package },
    };
    return info[nivel] || info.NORMAL;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header com Ações Rápidas */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Estoque</h1>
          <p className="text-gray-600">Controle completo de entradas, saídas e níveis de estoque</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Ações em Massa - só aparece quando há produtos selecionados */}
          {produtosSelecionados.length > 0 && (
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
              <span className="text-sm font-medium">{produtosSelecionados.length} selecionados</span>
              <button
                onClick={() => handleMovimentacaoEmMassa("entrada")}
                className="p-1 hover:bg-white rounded"
                title="Entrada em massa"
              >
                <PackagePlus className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleMovimentacaoEmMassa("saida")}
                className="p-1 hover:bg-white rounded"
                title="Saída em massa"
              >
                <PackageMinus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setProdutosSelecionados([])}
                className="p-1 hover:bg-white rounded"
                title="Limpar seleção"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Botões de Ação */}
          <button
            onClick={() => {
              setProdutoSelecionado(undefined);
              setModalAberto(true);
            }}
            className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#c19b2c]"
          >
            <PackagePlus className="h-4 w-4" />
            Novo Produto
          </button>

          <button
            onClick={() => setModalMovimentacaoAberto(true)}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
            disabled={!produtoSelecionado}
          >
            <ArrowUpDown className="h-4 w-4" />
            Movimentar
          </button>

          <Select.Root value={tipoRelatorio} onValueChange={setTipoRelatorio}>
            <Select.Trigger className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
              <Select.Value />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white border rounded-lg shadow-lg overflow-hidden z-50">
                <Select.Viewport className="p-1">
                  {["completo", "movimentacoes", "alertas", "previsao"].map((tipo) => (
                    <Select.Item
                      key={tipo}
                      value={tipo}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
                    >
                      <Select.ItemText>
                        {tipo === "completo" ? "Relatório Completo" :
                         tipo === "movimentacoes" ? "Movimentações" :
                         tipo === "alertas" ? "Alertas" :
                         "Previsão de Estoque"}
                      </Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          <button
            onClick={handleExportarRelatorio}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Exportar
          </button>

          <button
            onClick={handleAtualizarTodos}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </button>
        </div>
      </div>

      {/* Cards de Estatísticas Avançadas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4 border-l-4 border-[#D4AF37]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total em Estoque</p>
              <p className="text-2xl font-bold">KZ {relatorio?.data?.valorTotalEstoque?.toLocaleString() || "0"}</p>
            </div>
            <DollarSign className="h-8 w-8 text-[#D4AF37]" />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {relatorio?.data?.totalProdutos || 0} produtos
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Crítico / Baixo</p>
              <p className="text-2xl font-bold">
                {(relatorio?.data?.produtosCriticos || 0) + (relatorio?.data?.produtosBaixos || 0)}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {relatorio?.data?.produtosCriticos || 0} críticos · {relatorio?.data?.produtosBaixos || 0} baixos
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Giro de Estoque</p>
              <p className="text-2xl font-bold">{relatorio?.data?.mediaGiroEstoque?.toFixed(1) || "0"}x</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {relatorio?.data?.diasCobertura || 0} dias de cobertura
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sem Movimento</p>
              <p className="text-2xl font-bold">{relatorio?.data?.produtosSemMovimento || 0}</p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            há mais de 30 dias
          </div>
        </div>
      </div>

      {/* Filtros Avançados */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="grid md:grid-cols-12 gap-4">
          {/* Busca */}
          <div className="md:col-span-4">
            <label className="block text-sm font-medium mb-2">Buscar Produto</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Nome, descrição, código..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          {/* Filtro Categoria */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Categoria</label>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="todas">Todas categorias</option>
              {categorias?.data?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
          </div>

          {/* Filtro Nível Estoque */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Nível Estoque</label>
            <select
              value={filtroNivel}
              onChange={(e) => setFiltroNivel(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="todos">Todos níveis</option>
              <option value="CRITICO">Crítico</option>
              <option value="BAIXO">Baixo</option>
              <option value="NORMAL">Normal</option>
              <option value="ALTO">Alto</option>
              <option value="EXCESSO">Excesso</option>
            </select>
          </div>

          {/* Filtro Status */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="todos">Todos status</option>
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
              <option value="BLOQUEADO">Bloqueado</option>
            </select>
          </div>

          {/* Ordenação */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Ordenar por</label>
            <div className="flex items-center gap-2">
              <select
                value={ordenarPor}
                onChange={(e) => setOrdenarPor(e.target.value)}
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="nome">Nome</option>
                <option value="quantidade">Quantidade</option>
                <option value="preco">Preço</option>
                <option value="valorTotal">Valor Total</option>
                <option value="atualizadoEm">Última atualização</option>
              </select>
              <button
                onClick={() => setOrdenarDirecao(ordenarDirecao === "asc" ? "desc" : "asc")}
                className="p-2 border rounded-lg hover:bg-gray-50"
                title={ordenarDirecao === "asc" ? "Ordenar descendente" : "Ordenar ascendente"}
              >
                {ordenarDirecao === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Filtros Ativos */}
        {(busca || filtroCategoria !== "todas" || filtroNivel !== "todos" || filtroStatus !== "todos") && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-gray-600">Filtros ativos:</span>
            {busca && (
              <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                Busca: {busca}
                <button onClick={() => setBusca("")} className="hover:text-red-500">
                  <XCircle className="h-3 w-3" />
                </button>
              </span>
            )}
            {filtroCategoria !== "todas" && (
              <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                Categoria: {categorias?.data?.find((c: any) => c.id === filtroCategoria)?.nome}
                <button onClick={() => setFiltroCategoria("todas")} className="hover:text-red-500">
                  <XCircle className="h-3 w-3" />
                </button>
              </span>
            )}
            {filtroNivel !== "todos" && (
              <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                Nível: {filtroNivel}
                <button onClick={() => setFiltroNivel("todos")} className="hover:text-red-500">
                  <XCircle className="h-3 w-3" />
                </button>
              </span>
            )}
            {filtroStatus !== "todos" && (
              <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                Status: {filtroStatus}
                <button onClick={() => setFiltroStatus("todos")} className="hover:text-red-500">
                  <XCircle className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tabela de Estoque */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={produtosSelecionados.length === produtosPagina?.length && produtosPagina?.length > 0}
                    onChange={handleSelecionarTodos}
                    className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Produto</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Categoria</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Estoque Atual</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Mín / Máx</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Nível</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Valor Total</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Última Mov.</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosPagina?.map((produto: ProdutoEstoque) => {
                const NivelIcon = getNivelInfo(produto.nivelEstoque).icon;
                const valorTotal = produto.preco * produto.quantidade;
                
                return (
                  <tr 
                    key={produto.id} 
                    className={`border-b hover:bg-gray-50 ${
                      produtosSelecionados.includes(produto.id) ? "bg-[#D4AF37]/5" : ""
                    }`}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={produtosSelecionados.includes(produto.id)}
                        onChange={() => handleSelecionarProduto(produto.id)}
                        className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {produto.ImagemProduto?.[0]?.url ? (
                            <img
                              src={produto.ImagemProduto[0].url}
                              alt={produto.nome}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <button
                            onClick={() => {
                              setProdutoSelecionado(produto);
                              setModalDetalhesAberto(true);
                            }}
                            className="font-medium hover:text-[#D4AF37] text-left"
                          >
                            {produto.nome}
                          </button>
                          <div className="text-xs text-gray-400">{produto.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{produto.categoria?.nome || "-"}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className={`font-bold text-lg ${
                          produto.quantidade === 0 ? "text-red-600" :
                          produto.quantidade < (produto.quantidadeMinima || 5) ? "text-yellow-600" :
                          produto.quantidade > (produto.quantidadeMaxima || 100) ? "text-blue-600" :
                          "text-green-600"
                        }`}>
                          {produto.quantidade}
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className={`h-1.5 rounded-full ${
                              produto.quantidade === 0 ? "bg-red-500" :
                              produto.quantidade < (produto.quantidadeMinima || 5) ? "bg-yellow-500" :
                              produto.quantidade > (produto.quantidadeMaxima || 100) ? "bg-blue-500" :
                              "bg-green-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                (produto.quantidade / (produto.quantidadeMaxima || 100)) * 100,
                                100
                              )}%`
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>Mín: {produto.quantidadeMinima || 5}</div>
                        <div>Máx: {produto.quantidadeMaxima || 100}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getNivelInfo(produto.nivelEstoque).cor} flex items-center gap-1 w-fit`}>
                        <NivelIcon className="h-3 w-3" />
                        {getNivelInfo(produto.nivelEstoque).label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">KZ {valorTotal.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">KZ {produto.preco}/un</div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="text-sm">{produto.ultimaMovimentacao || "Nunca"}</div>
                        {produto.diasSemMovimentacao && produto.diasSemMovimentacao > 0 && (
                          <div className="text-xs text-gray-500">
                            {produto.diasSemMovimentacao} dias sem mov.
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        produto.status === "ATIVO" ? "bg-green-100 text-green-800" :
                        produto.status === "INATIVO" ? "bg-gray-100 text-gray-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {produto.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Tooltip.Provider>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <button
                                onClick={() => {
                                  setProdutoSelecionado(produto);
                                  setModalDetalhesAberto(true);
                                }}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                Ver detalhes
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>

                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <button
                                onClick={() => {
                                  setProdutoSelecionado(produto);
                                  setModalMovimentacaoAberto(true);
                                }}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <ArrowUpDown className="h-4 w-4" />
                              </button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                Movimentar
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>

                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <button
                                onClick={() => {
                                  setProdutoSelecionado(produto);
                                  setModalAberto(true);
                                }}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                Editar
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>

                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <button
                                onClick={() => {
                                  if (confirm(`Deseja realmente excluir ${produto.nome}?`)) {
                                    toast.success("Produto excluído com sucesso!");
                                  }
                                }}
                                className="p-1 hover:bg-red-50 text-red-600 rounded"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
                                Excluir
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        </Tooltip.Provider>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginação e Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Mostrando {inicio + 1}-{Math.min(fim, produtosProcessados?.length || 0)} de {produtosProcessados?.length || 0} produtos
            </div>
            
            <select
              value={itensPorPagina}
              onChange={(e) => {
                setItensPorPagina(parseInt(e.target.value));
                setPaginaAtual(1);
              }}
              className="border rounded-lg px-2 py-1 text-sm"
            >
              <option value="10">10 por página</option>
              <option value="20">20 por página</option>
              <option value="50">50 por página</option>
              <option value="100">100 por página</option>
            </select>
          </div>

          {totalPaginas > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaginaAtual(1)}
                disabled={paginaAtual === 1}
                className="p-2 border rounded disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                <ChevronLeft className="h-4 w-4 -ml-2" />
              </button>
              <button
                onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                disabled={paginaAtual === 1}
                className="p-2 border rounded disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                  let pageNum;
                  if (totalPaginas <= 5) {
                    pageNum = i + 1;
                  } else if (paginaAtual <= 3) {
                    pageNum = i + 1;
                  } else if (paginaAtual >= totalPaginas - 2) {
                    pageNum = totalPaginas - 4 + i;
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
              </div>
              
              <button
                onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                disabled={paginaAtual === totalPaginas}
                className="p-2 border rounded disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPaginaAtual(totalPaginas)}
                disabled={paginaAtual === totalPaginas}
                className="p-2 border rounded disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
                <ChevronRight className="h-4 w-4 -ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Alertas de Estoque */}
      {relatorio?.data?.produtosCriticos > 0 && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="font-bold text-red-900">Alertas Críticos</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                {relatorio.data.produtosCriticos} críticos
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {relatorio.data.produtosBaixos} baixos
              </span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {produtosProcessados
              ?.filter((p: ProdutoEstoque) => p.nivelEstoque === "CRITICO" || p.nivelEstoque === "BAIXO")
              ?.slice(0, 6)
              ?.map((produto: ProdutoEstoque) => (
                <div key={produto.id} className="bg-white p-4 rounded-lg border-l-4 border-red-500 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{produto.nome}</h4>
                      <p className="text-xs text-gray-500 mt-1">{produto.categoria?.nome}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      produto.nivelEstoque === "CRITICO" 
                        ? "bg-red-100 text-red-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {produto.nivelEstoque}
                    </span>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Atual:</span>
                      <span className="ml-2 font-bold">{produto.quantidade}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Mínimo:</span>
                      <span className="ml-2 font-bold">{produto.quantidadeMinima || 5}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        setProdutoSelecionado(produto);
                        setModalMovimentacaoAberto(true);
                      }}
                      className="flex-1 text-sm bg-[#D4AF37] text-white px-3 py-1.5 rounded hover:bg-[#c19b2c]"
                    >
                      Repor
                    </button>
                    <button
                      onClick={() => {
                        setProdutoSelecionado(produto);
                        setModalDetalhesAberto(true);
                      }}
                      className="text-sm border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50"
                    >
                      Ver
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Modais */}
      <ModalProdutoEstoque
        produto={produtoSelecionado}
        open={modalAberto}
        onOpenChange={setModalAberto}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["estoque"] });
          setProdutoSelecionado(undefined);
        }}
      />

      <ModalMovimentacao
        produto={produtoSelecionado}
        open={modalMovimentacaoAberto}
        onOpenChange={setModalMovimentacaoAberto}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["estoque"] });
          setProdutoSelecionado(undefined);
        }}
      />

      <ModalDetalhesProduto
        produto={produtoSelecionado}
        open={modalDetalhesAberto}
        onOpenChange={setModalDetalhesAberto}
      />
    </div>
  );
}
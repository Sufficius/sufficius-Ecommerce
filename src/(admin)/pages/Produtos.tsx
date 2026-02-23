import { useEffect, useState } from "react";
import {
  Plus,
  Package,
  Tag,
  DollarSign,
  Loader2,
  Filter,
  Search,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  X,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  AlertOctagon,
  Download,
  RefreshCw,
} from "lucide-react";
import { api } from "@/modules/services/api/axios";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { NovoProdutoModal } from "@/app/produtos/criarProduto";
import { produtosRoute } from "@/modules/services/api/routes/produtos";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { toast } from "sonner";

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
}

interface Categoria {
  id: string;
  nome: string;
  slug: string;
}

interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  precoDesconto?: number;
  percentualDesconto?: number;
  quantidade: number;
  foto?: string;
  imagemAlt?: string;
  status: "ATIVO" | "INATIVO";
  id_categoria?: string;
  categoria?: string;
  Categoria?: {
    nome: string;
  };
  criadoEm: string;
  atualizadoEm?: string;
  destaque?: boolean;
}

interface Paginacao {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ModalData {
  type: "create" | "edit" | "view" | "delete" | "resetPassword" | null;
  produto?: Produto;
}

export const ProductImage = ({
  src,
  alt,
  className = "",
}: ProductImageProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!src || error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
      >
        <ImageIcon className="h-1/2 w-1/2 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
      <img
        src={`http://localhost:3000${src}`}
        alt={alt}
        className={`${className} ${loading ? "opacity-0" : "opacity-100"} transition-opacity duration-300 object-cover`}
        onLoad={() => {
          setLoading(false);
        }}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </div>
  );
};

// Modal de Visualizar Produto
const VisualizarProdutoModal = ({
  isOpen,
  onClose,
  produto,
}: {
  isOpen: boolean;
  onClose: () => void;
  produto: Produto | null;
}) => {
  if (!isOpen || !produto) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Detalhes do Produto
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Imagem */}
              <div>
                <div className="bg-gray-100 rounded-lg h-64 overflow-hidden flex items-center justify-center">
                  <ProductImage
                    src={produto.foto}
                    alt={produto.imagemAlt || produto.nome}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Informações */}
              <div>
                <h4 className="text-lg font-semibold mb-4">{produto.nome}</h4>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Categoria</label>
                    <p className="font-medium">
                      {produto.Categoria?.nome || produto.categoria || "Sem categoria"}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Preço</label>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold ${
                          produto.precoDesconto
                            ? "text-gray-400 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {formatCurrency(produto.preco)}
                      </span>
                      {produto.precoDesconto && produto.precoDesconto > 0 && (
                        <>
                          <span className="font-bold text-green-600">
                            {formatCurrency(produto.precoDesconto)}
                          </span>
                          {produto.percentualDesconto && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              -{produto.percentualDesconto.toFixed(1)}%
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Estoque</label>
                    <p
                      className={`font-medium ${
                        produto.quantidade === 0
                          ? "text-red-600"
                          : produto.quantidade < 10
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {produto.quantidade} unidades
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Status</label>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          produto.status === "ATIVO"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {produto.status === "ATIVO" ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Descrição</label>
                    <p className="text-gray-700 mt-1 whitespace-pre-line">
                      {produto.descricao || "Sem descrição"}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      Data de Criação
                    </label>
                    <p className="font-medium">
                      {new Date(produto.criadoEm).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de Confirmação de Exclusão
const ConfirmarExclusaoModal = ({
  isOpen,
  onClose,
  onConfirm,
  produto,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  produto: Produto | null;
  loading?: boolean;
}) => {
  if (!isOpen || !produto) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertOctagon className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Confirmar Exclusão
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Tem certeza que deseja excluir o produto{" "}
                    <strong>{produto.nome}</strong>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Excluindo...
                </>
              ) : (
                "Sim, Excluir"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Tabela de Produtos
const TabelaProdutos = ({
  produtos,
  loading,
  onVisualizar,
  onEditar,
  onExcluir,
}: {
  produtos: Produto[] | any;
  loading: boolean;
  onVisualizar: (produto: Produto) => void;
  onEditar: (produto: Produto) => void;
  onExcluir: (produto: Produto) => void;
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  const produtosArray = Array.isArray(produtos) 
    ? produtos 
    : produtos?.data 
      && Array.isArray(produtos.data) 
      ? produtos.data : [];


  if (produtosArray?.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl">
        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum produto encontrado
        </h3>
        <p className="text-gray-600">
          Comece adicionando um novo produto ou ajuste os filtros.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estoque
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {produtosArray?.map((produto: Produto) => (
              <tr key={produto.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <ProductImage
                        src={produto.foto}
                        alt={produto.nome}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {produto.nome}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {produto.id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {produto.Categoria?.nome || produto.categoria || "Sem categoria"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatCurrency(produto.preco)}
                  </div>
                  {produto.precoDesconto && (
                    <div className="text-sm text-green-600">
                      {formatCurrency(produto.precoDesconto)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      produto.quantidade === 0
                        ? "bg-red-100 text-red-800"
                        : produto.quantidade < 10
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {produto.quantidade} unid.
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      produto.status === "ATIVO"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {produto.status === "ATIVO" ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onVisualizar(produto)}
                    className="text-gray-600 hover:text-gray-900 mr-3"
                    title="Visualizar"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onEditar(produto)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    title="Editar"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onExcluir(produto)}
                    className="text-red-600 hover:text-red-900"
                    title="Excluir"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente Principal
export default function AdminProdutos() {
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [ordenar, setOrdenar] = useState("criadoEm_desc");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [termoBusca, setTermoBusca] = useState("");
  const [debouncedTermo, setDebouncedTermo] = useState("");
  const [modalVisualizar, setModalVisualizar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(
    null,
  );

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [paginacao, setPaginacao] = useState<Paginacao>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [, setError] = useState<string | null>(null);
  const [, setModal] = useState<ModalData>({ type: null });
  const [excluindo, setExcluindo] = useState(false);
  const token = useAuthStore((state) => state.token);
  const itensPorPagina = 10;
  const [, setFormData] = useState({
    nome: "",
    categoria: "Beleza",
    preco: 0,
    quantidade: 0,
    status: "",
  });

  // Debounce para busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTermo(termoBusca);
      setPaginaAtual(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [termoBusca]);

  const fetchProdutos = async () => {
    try {
      const params = new URLSearchParams({
        page: paginaAtual.toString(),
        limit: itensPorPagina.toString(),
      });
      
      if (debouncedTermo) params.append("busca", debouncedTermo);
      if (filtroCategoria !== "todos") params.append("categoria", filtroCategoria);
      if (filtroStatus !== "todos") params.append("status", filtroStatus);
      if (ordenar) params.append("ordenar", ordenar);
      
      const response = await api.get(`/produtos?${params.toString()}`);

        console.log("Resposta da API:", response.data);

         let produtosData = [];
    let total = 0;

      if (response.data?.success && response.data?.data) {
        if (Array.isArray(response.data.data)) {
        produtosData = response.data.data;
        total = response.data.pagination?.total || produtosData.length;
      }
      else if (typeof response.data.data === 'object') {
        if(response.data.data.produtos && Array.isArray(response.data.data.produtos)){
          produtosData = response.data.data.produtos;
          total = response.data.data.total || produtosData.length;
        }
        else {
          produtosData = [];
          total = 0;
        }
      }
    }
       else if (Array.isArray(response.data)) {
        produtosData = response.data;
        total = produtosData.length;
      }
        setProdutos(produtosData);
        setPaginacao({
          total: total,
          page:  paginaAtual,
          limit: itensPorPagina,
          totalPages: Math.ceil(total / itensPorPagina),
        });
    } catch (err: any) {
      console.error("Erro ao buscar produtos:", err);
      setError(err.response?.data?.error || "Erro ao carregar produtos");
      toast.error("Erro ao carregar produtos");
    }
  };

  useEffect(() => {
    if (!token) {
      setError("Faça login para acessar os produtos");
      return;
    }

    fetchProdutos();
  }, [paginaAtual, debouncedTermo, filtroCategoria, filtroStatus, ordenar, token]);

  const openModal = (type: ModalData["type"], produto?: Produto) => {
    if (produto && type !== "create") {
      if (type === "edit") {
        setFormData({
          nome: produto.nome,
          preco: Number(produto.preco),
          categoria: produto.categoria || produto.Categoria?.nome || "",
          quantidade: Number(produto.quantidade),
          status: produto.status,
        });
      }
    } else if (type === "create") {
      setFormData({
        nome: "",
        preco: 0,
        quantidade: 0,
        categoria: "Beleza",
        status: "",
      });
    }
    setModal({ type, produto });
  };

  // // const closeModal = () => {
  // //   setModal({ type: null });
  // // };


const { data: categorias, isLoading: loadingCategorias } = useQuery({
  queryKey: ["categorias"],
  queryFn: async () => {
    try {
      const response = await api.get("/categorias");
      
      if (response.data?.success && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      return [];
    }
  },
});

  const handleAlterarStatus = async (id: string, statusAtual: string) => {
    const novoStatus = statusAtual === "ATIVO" ? "INATIVO" : "ATIVO";

    try {
      const response = await api.patch(
        `produtos/${id}/status`,
        {
          status: novoStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Status alterado com sucesso!");
        fetchProdutos();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao alterar status");
    }
  };

  const {
    data: estatisticas,
    isLoading: loadingEstatisticas,
    refetch: refetchEstatisticas,
  } = useQuery({
    queryKey: ["estatisticas_produtos"],
    queryFn: async () => {
      try{
      const response = await api.get("/produtos");
       console.log("Resposta da API (estatísticas):", response.data);

       if (response.data?.success) {
        if (Array.isArray(response.data.data)) {
          return response.data.data;
        } else if (response.data.data?.produtos && Array.isArray(response.data.data.produtos)) {
          return response.data.data.produtos;
        }
      }

          else if (Array.isArray(response.data)) {
          return response.data;
        }
    return [];
  } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      return [];
    }
  },
    staleTime: 5 * 60 * 1000,
  });


  const estatisticasArray = Array.isArray(estatisticas) 
  ? estatisticas : [];

  // Calcular estatísticas
  const totalProdutos = estatisticasArray?.length || 0;
  const produtosEmPromocao =
    estatisticasArray?.filter((p: any) => p.precoDesconto && p.precoDesconto > 0)
      .length || 0;
  const produtosSemEstoque =
    estatisticasArray?.filter((p: any) => p.quantidade === 0).length || 0;
  const produtosBaixoEstoque =
    estatisticasArray?.filter((p: any) => p.quantidade > 0 && p.quantidade < 10)
      .length || 0;

  const handleVisualizar = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setModalVisualizar(true);
  };

  const handleEditar = (produto: Produto) => {
    // Implementar lógica de edição
    toast.info("Funcionalidade de edição em desenvolvimento");
    console.log("Editar produto:", produto);
  };

  const handleExcluir = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setModalExcluir(true);
  };

  const confirmarExclusao = async () => {
    if (!produtoSelecionado) return;

    setExcluindo(true);
    try {
      await api.delete(`/produtos/${produtoSelecionado.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Produto excluído com sucesso!");
      fetchProdutos();
      refetchEstatisticas();
      setModalExcluir(false);
      setProdutoSelecionado(null);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao excluir produto";
      toast.error(errorMessage);
    } finally {
      setExcluindo(false);
    }
  };

  const handleExportar = () => {
    if (!produtos || produtos.length === 0) return;

    const csv = [
      [
        "ID",
        "Nome",
        "Categoria",
        "Preço",
        "Preço com Desconto",
        "Estoque",
        "Status",
      ],
      ...produtos.map((p: Produto) => [
        p.id,
        p.nome,
        p.Categoria?.nome || p.categoria || "",
        p.preco.toString(),
        p.precoDesconto?.toString() || "",
        p.quantidade.toString(),
        p.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `produtos-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalPaginas = paginacao.totalPages;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestão de Produtos
          </h1>
          <p className="text-gray-600">Gerencie todos os produtos da loja</p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleExportar}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            Exportar
          </Button>

          <Button
            onClick={() => {
              fetchProdutos();
              refetchEstatisticas();
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Atualizar
          </Button>

          <NovoProdutoModal
            onProdutoCriado={() => {
              fetchProdutos();
              refetchEstatisticas();
            }}
          >
            <Button className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-3 rounded-lg hover:bg-[#c19b2c] transition">
              <Plus className="h-5 w-5" />
              Novo Produto
            </Button>
          </NovoProdutoModal>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Produtos</p>
              <p className="text-2xl font-bold">
                {loadingEstatisticas ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  totalProdutos
                )}
              </p>
            </div>
            <Package className="h-8 w-8 text-[#D4AF37]" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categorias</p>
              <p className="text-2xl font-bold">
                {loadingCategorias ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  categorias?.length || 0
                )}
              </p>
            </div>
            <Tag className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Em Promoção</p>
              <p className="text-2xl font-bold">
                {loadingEstatisticas ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  produtosEmPromocao
                )}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Baixo Estoque</p>
              <p className="text-2xl font-bold">
                {loadingEstatisticas ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  produtosBaixoEstoque
                )}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sem Estoque</p>
              <p className="text-2xl font-bold">
                {loadingEstatisticas ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  produtosSemEstoque
                )}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          {/* Busca */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar produtos por nome, descrição..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          {/* Filtro Categoria */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filtroCategoria}
                onChange={(e) => {
                  setFiltroCategoria(e.target.value);
                  setPaginaAtual(1);
                }}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="todos">Todas categorias</option>
                {Array.isArray(categorias) && categorias.length >  0 ? (
                  categorias.map((categoria: Categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))
              ): (
                 <option value="" disabled>Carregando categorias...</option>
              )}
              </select>
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
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ordenação e Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-sm text-gray-600">
            {paginacao.total} produtos encontrados
          </div>

          <div className="flex items-center gap-4">
            <select
              value={ordenar}
              onChange={(e) => {
                setOrdenar(e.target.value);
                setPaginaAtual(1);
              }}
              className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="criadoEm_desc">Mais recentes</option>
              <option value="criadoEm_asc">Mais antigos</option>
              <option value="nome_asc">Nome (A-Z)</option>
              <option value="nome_desc">Nome (Z-A)</option>
              <option value="preco_asc">Preço (menor p/ maior)</option>
              <option value="preco_desc">Preço (maior p/ menor)</option>
              <option value="quantidade_asc">Estoque (menor p/ maior)</option>
              <option value="quantidade_desc">Estoque (maior p/ menor)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <TabelaProdutos
        produtos={produtos}
        loading={false}
        onVisualizar={handleVisualizar}
        onEditar={handleEditar}
        onExcluir={handleExcluir}
      />

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
            disabled={paginaAtual === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          <span className="px-4 py-2 text-sm">
            Página {paginaAtual} de {totalPaginas}
          </span>

          <Button
            variant="outline"
            onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
            disabled={paginaAtual === totalPaginas}
            className="flex items-center gap-2"
          >
            Próxima
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Modais */}
      <VisualizarProdutoModal
        isOpen={modalVisualizar}
        onClose={() => {
          setModalVisualizar(false);
          setProdutoSelecionado(null);
        }}
        produto={produtoSelecionado}
      />

      <ConfirmarExclusaoModal
        isOpen={modalExcluir}
        onClose={() => {
          setModalExcluir(false);
          setProdutoSelecionado(null);
        }}
        onConfirm={confirmarExclusao}
        produto={produtoSelecionado}
        loading={excluindo}
      />
    </>
  );
}
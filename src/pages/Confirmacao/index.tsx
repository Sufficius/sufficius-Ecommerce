"use client";

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  Package,
  Truck,
  Home,
  ShoppingBag,
  Download,
  Share2,
  Star,
  Clock,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Shield,
  Gift,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {
  IEnderecoEntrega,
  IItemPedido,
  IPagamento,
  pedidosRoute,
} from "@/modules/services/api/routes/pedidos";
import { api } from "@/modules/services/api/axios";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { enderecosRoute } from "@/modules/services/api/routes/enderecos";
import { produtosRoute } from "@/modules/services/api/routes/produtos";

interface IUsuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: string;
  dataNascimento?: string;
  criadoEm: string;
  atualizadoEm: string;
}

interface IProduto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  quantidadeEstoque: number;
  imagem?: string | null;
  categoria?: {
    id: string;
    nome: string;
  };
}

interface IPedido {
  id: string;
  numeroPedido: string;
  usuarioId: string;
  enderecoId?: string;
  status: string;
  subtotal: number;
  frete: number;
  desconto: number;
  total: number;
  metodoEnvio: string;
  codigoRastreio?: string;
  dataEntrega?: string;
  entregueEm?: string;
  metodoPagamento: string;
  statusPagamento: string;
  referenciaPagamento?: string;
  observacoes?: string;
  criadoEm: string;
  atualizadoEm: string;
  usuario?: {
    id: string;
    nome: string;
    email: string;
  };
  endereco?: IEnderecoEntrega;
  itens?: IItemPedido[];
  pagamentos?: IPagamento[];
}

interface IEnderecoCompleto extends IEnderecoEntrega {
  usuario?: {
    nome: string;
    email: string;
    telefone: string;
  };
}

// Função helper para extrair array de qualquer formato
const extrairArrayData = <T,>(data: any, arrayProps: string[] = ['data', 'items', 'results']): T[] => {
  if (!data) return [];
  
  // Se já é um array
  if (Array.isArray(data)) {
    return data as T[];
  }
  
  // Se é um objeto, procurar por propriedades de array
  if (data && typeof data === 'object') {
    for (const prop of arrayProps) {
      if (prop in data && Array.isArray(data[prop])) {
        return data[prop] as T[];
      }
    }
    
    // Se o objeto parece ser um item único (tem propriedade id)
    if ('id' in data) {
      return [data] as T[];
    }
  }
  
  return [];
};

export default function ConfirmacaoCompra() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const  pedidoId  = searchParams.get('pedido') || searchParams.get('pedidoId');
  console.log("Id: ",pedidoId);

  // console.log("📍 URL atual:", location.pathname);
  // console.log("📌 Parâmetros:", useParams());
  // console.log("🔍 pedidoId:", pedidoId);
  // console.log("📂 Query string:", location.search);

  const [pedidoSelecionado, setPedidoSelecionado] = useState<IPedido | null>(
    null
  );
  const [etapaEntrega, setEtapaEntrega] = useState(0);
  const [produtosDetalhados, setProdutosDetalhados] = useState<IProduto[]>([]);

  const user = useAuthStore((state) => state.user);
  const logged = useAuthStore((state) => state.isAuthenticated);

  // Buscar usuário logado
  const { data: usuarioLogado } = useQuery<IUsuario>({
    queryKey: ["usuarioLogado"],
    queryFn: async () => {
      try {
        const response = await api.get("/usuarios");
        return response.data?.data || response.data;
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return undefined;
      }
    },
    enabled: logged,
  });

  // Buscar pedidos do usuário
  const { data: pedidosData, isLoading: isLoadingPedidos } = useQuery({
    queryKey: ["pedidosUsuario", user?.id_usuario],
    queryFn: async () => {
      try {
        const response = await pedidosRoute.listarPedidos();
        return extrairArrayData<IPedido>(response.data, ['data', 'pedidos', 'itens']);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        return [];
      }
    },
    enabled: !!user?.id_usuario,
  });

  
  // Buscar detalhes do pedido específico se tiver ID na URL
  const { data: pedidoDetalhado } = useQuery<IPedido>({
    queryKey: ["pedido", pedidoId],
    queryFn: async () => {
      if (!pedidoId) return null;
      try {
        const response = await api.get(`/pedidos/${pedidoId}`);
        return response.data?.data || response.data;
      } catch (error) {
        console.error(`Erro ao buscar pedido ${pedidoId}:`, error);
        return null;
      }
    },
    enabled: !!pedidoId,
  });
  console.log(pedidoDetalhado);

  // Buscar produtos para as recomendações - CORRIGIDO
  const { data: produtosRecomendadosData } = useQuery({
    queryKey: ["produtosRecomendados"],
    queryFn: async () => {
      try {
        const response = await produtosRoute.listarProdutos();
        return extrairArrayData<IProduto>(response.data, ['data', 'produtos', 'items']);
      } catch (error) {
        console.error("Erro ao buscar produtos recomendados:", error);
        return [];
      }
    },
    enabled: true,
  });

  // Garantir que produtosRecomendados sempre seja um array
  const produtosRecomendados = Array.isArray(produtosRecomendadosData) 
    ? produtosRecomendadosData 
    : [];

  // Buscar endereços do usuário
  const { data: enderecosData = [] } = useQuery<IEnderecoCompleto[]>({
    queryKey: ["enderecosUsuario", user?.id_usuario],
    queryFn: async () => {
      try {
        const response = await enderecosRoute.listarEnderecos();
        return extrairArrayData<IEnderecoCompleto>(response.data, ['data', 'enderecos']);
      } catch (error) {
        console.log("Endereços não disponíveis");
        return [];
      }
    },
    enabled: !!user?.id_usuario,
  });

  // Buscar detalhes dos produtos do pedido
  useEffect(() => {
    const buscarProdutosDetalhados = async () => {
      if (!pedidoSelecionado?.itens || pedidoSelecionado.itens.length === 0) {
        setProdutosDetalhados([]);
        return;
      }

      try {
        const produtosPromises = pedidoSelecionado.itens.map(async (item) => {
          try {
            const response = await api.get(`/produtos/${item.produtoId}`);
            const produtoData = response.data?.data || response.data;
            
            // Garantir que temos um objeto de produto válido
            return {
              id: item.produtoId,
              nome: produtoData?.nome || item.produto?.nome || "Produto não encontrado",
              descricao: produtoData?.descricao,
              preco: produtoData?.preco || item.precoUnitario || 0,
              quantidadeEstoque: produtoData?.quantidadeEstoque || item.quantidade || 1,
              imagem: produtoData?.imagem,
              categoria: produtoData?.categoria || { id: "1", nome: "Categoria" },
            };
          } catch (error) {
            console.error(`Erro ao buscar produto ${item.produtoId}:`, error);
            // Retornar dados básicos do item do pedido
            return {
              id: item.produtoId,
              nome: item.produto?.nome || "Produto não encontrado",
              preco: item.precoUnitario || 0,
              quantidadeEstoque: item.quantidade || 1,
              imagem: null,
              categoria: { id: "1", nome: "Categoria" },
            };
          }
        });

        const produtos = await Promise.all(produtosPromises);
        setProdutosDetalhados(produtos?.filter((p:any) => p !== null)
        .map((produto: any)=> ({
        id: produto.id,
        nome:produto.nome,
        descricao:produto.descricao,
        preco:produto.preco,
        quantidadeEstoque: produto.quantidadeEstoque,
        imagem: produto.imagem || undefined,
        categoria: produto.categoria
        }))
        );
      } catch (error) {
        console.error("Erro ao buscar produtos detalhados:", error);
        setProdutosDetalhados([]);
      }
    };

    buscarProdutosDetalhados();
  }, [pedidoSelecionado]);

  // Selecionar pedido - CORRIGIDO
  useEffect(() => {
    // Pedido detalhado tem prioridade
    if (pedidoDetalhado) {
      setPedidoSelecionado(pedidoDetalhado);
      atualizarEtapaEntrega(pedidoDetalhado.status);
      return;
    }

    // Se não temos pedidosData ou usuário, sair
    if (!pedidosData || !user?.id_usuario) return;

    // Filtrar pedidos do usuário logado
    const pedidosDoUsuario = pedidosData.filter(
      (pedido: IPedido) => pedido.usuarioId === user.id_usuario
    );

    // Ordenar por data (mais recente primeiro)
    const pedidosOrdenados = pedidosDoUsuario.sort(
      (a: IPedido, b: IPedido) =>
        new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
    );

    // Selecionar o pedido mais recente
    if (pedidosOrdenados.length > 0) {
      setPedidoSelecionado(pedidosOrdenados[0]);
      atualizarEtapaEntrega(pedidosOrdenados[0].status);
    }
  }, [pedidosData, pedidoDetalhado, user]);

  const atualizarEtapaEntrega = (status: string) => {
    let etapaInicial = 0;
    switch (status) {
      case "PAGAMENTO_PENDENTE":
        etapaInicial = 0;
        break;
      case "EM_PROCESSAMENTO":
      case "AGUARDANDO_PAGAMENTO":
        etapaInicial = 1;
        break;
      case "ENVIADO":
      case "EM_TRANSITO":
        etapaInicial = 2;
        break;
      case "ENTREGUE":
      case "CONCLUIDO":
        etapaInicial = 3;
        break;
      default:
        etapaInicial = 0;
    }
    setEtapaEntrega(etapaInicial);
  };

  const etapasEntrega = [
    {
      titulo: "Pedido Confirmado",
      descricao: "Seu pedido foi recebido e confirmado",
      icon: <CheckCircle className="h-6 w-6" />,
      cor: "bg-green-500",
    },
    {
      titulo: "Em Preparação",
      descricao: "Seus produtos estão sendo preparados",
      icon: <Package className="h-6 w-6" />,
      cor: "bg-blue-500",
    },
    {
      titulo: "Enviado",
      descricao: "Seu pedido saiu para entrega",
      icon: <Truck className="h-6 w-6" />,
      cor: "bg-orange-500",
    },
    {
      titulo: "Entregue",
      descricao: "Pedido entregue com sucesso!",
      icon: <Home className="h-6 w-6" />,
      cor: "bg-[#D4AF37]",
    },
  ];

  const handleDownloadComprovante = async () => {
    if (!pedidoSelecionado) return;

    try {
      const response = await api.get(
        `/pedidos/${pedidoSelecionado.id}/comprovante`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `comprovante-${pedidoSelecionado.numeroPedido}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Comprovante baixado com sucesso!");
    } catch (error) {
      console.error("Erro ao baixar comprovante:", error);
      toast.error("Erro ao baixar comprovante");
    }
  };

  const handleCompartilhar = async () => {
    if (!pedidoSelecionado) return;

    const shareData = {
      title: `Meu pedido #${pedidoSelecionado.numeroPedido}`,
      text: `Acabei de fazer um pedido na Sufficius Commerce! Pedido #${pedidoSelecionado.numeroPedido}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success("Compartilhado com sucesso!");
      } catch (error) {
        console.error("Erro ao compartilhar:", error);
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copiado para a área de transferência!");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  const handleAvaliar = () => {
    if (!pedidoSelecionado) return;
    navigate(`/avaliar/${pedidoSelecionado.id}`);
  };

  const handleVerMaisProdutos = () => {
    navigate("/");
  };

  const formatarValor = (valor: number | undefined) => {
    if (!valor) return "KZ 0,00";
    const valorEmKwanza = valor / 100;
    return valorEmKwanza.toLocaleString("pt-BR", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 2,
    });
  };

  const formatarData = (dataString?: string) => {
    if (!dataString) return "Data não disponível";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatarDataHora = (dataString?: string) => {
    if (!dataString) return "Data não disponível";
    const data = new Date(dataString);
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calcularPrevisaoEntrega = (dataCriacao: string) => {
    const data = new Date(dataCriacao);
    data.setDate(data.getDate() + 3);
    return formatarData(data.toISOString());
  };

  // Obter URL da imagem do Cloudinary
  const getImageUrl = (imagePath?: string, size: number = 150) => {
    if (!imagePath) return null;

    let cleanedPath = imagePath;
    if (cleanedPath.startsWith("/")) {
      cleanedPath = cleanedPath.substring(1);
    }

    const cloudName = "sufficius-commerce";
    const transformations = `c_fill,w_${size},h_${size},q_auto,f_auto`;

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${cleanedPath}`;
  };

  // Encontrar endereço do pedido
  const enderecoPedido =
    pedidoSelecionado?.endereco ||
    (pedidoSelecionado?.enderecoId
      ? enderecosData.find((e) => e.id === pedidoSelecionado.enderecoId)
      : undefined);

  if (isLoadingPedidos) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  if (!pedidoSelecionado) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Package className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          Nenhum pedido encontrado
        </h2>
        <p className="text-gray-600 mb-6">Você ainda não fez nenhum pedido.</p>
        <button
          onClick={() => navigate("/produtos")}
          className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg font-semibold hover:bg-[#c19b2c] transition"
        >
          Ver Produtos
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar para a loja
            </button>

            <div className="flex items-center">
              <div className="h-10 w-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <span className="font-bold text-white text-lg">S</span>
              </div>
              <span className="ml-2 font-bold text-gray-900">
                Sufficius Commerce
              </span>
            </div>

            <button className="hidden md:flex items-center text-sm text-gray-600 hover:text-[#D4AF37]">
              <Shield className="h-5 w-5 mr-2" />
              Ajuda
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Banner de Sucesso */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-8 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center mr-6">
                <CheckCircle className="h-12 w-12" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {pedidoSelecionado.status === "ENTREGUE"
                    ? "Pedido entregue com sucesso!"
                    : "Compra realizada com sucesso!"}
                </h1>
                <p className="text-green-100">
                  {`Seu pedido ${pedidoSelecionado.numeroPedido} foi confirmado e já está sendo processado.`}
                </p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm mb-1">Código do Pedido</div>
              <div className="text-2xl font-mono font-bold">
                {pedidoSelecionado.numeroPedido}
              </div>
              <div className="text-sm mt-1">
                {formatarData(pedidoSelecionado.criadoEm)} às{" "}
                {formatarDataHora(pedidoSelecionado.criadoEm)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2">
            {/* Status da Entrega */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Truck className="h-6 w-6 mr-2 text-[#D4AF37]" />
                Acompanhe seu pedido
              </h2>

              <div className="relative">
                {/* Linha de progresso */}
                <div className="absolute left-0 right-0 top-6 h-1 bg-gray-200 -translate-y-1/2">
                  <div
                    className="h-full bg-[#D4AF37] transition-all duration-1000"
                    style={{ width: `${(etapaEntrega / 3) * 100}%` }}
                  />
                </div>

                {/* Etapas */}
                <div className="grid grid-cols-4 gap-4">
                  {etapasEntrega.map((etapa, index) => (
                    <div key={index} className="text-center relative">
                      <div
                        className={`h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                          index <= etapaEntrega ? etapa.cor : "bg-gray-200"
                        } ${
                          index <= etapaEntrega ? "text-white" : "text-gray-400"
                        }`}
                      >
                        {etapa.icon}
                      </div>
                      <div className="font-medium mb-1">{etapa.titulo}</div>
                      <div className="text-sm text-gray-600">
                        {etapa.descricao}
                      </div>
                      {index <= etapaEntrega && (
                        <div className="text-xs text-green-600 font-medium mt-1">
                          {index === etapaEntrega
                            ? "Em andamento..."
                            : "Concluído ✓"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="font-medium">Previsão de Entrega</span>
                  </div>
                  <div className="text-2xl font-bold text-[#D4AF37]">
                    {pedidoSelecionado.dataEntrega
                      ? formatarData(pedidoSelecionado.dataEntrega)
                      : calcularPrevisaoEntrega(pedidoSelecionado.criadoEm)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Entre 2-4 dias úteis
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Package className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="font-medium">Código de Rastreio</span>
                  </div>
                  <div className="text-2xl font-mono font-bold">
                    {pedidoSelecionado.codigoRastreio || "Aguardando código..."}
                  </div>
                  {pedidoSelecionado.codigoRastreio && (
                    <button
                      onClick={() =>
                        window.open(
                          `https://www.correios.com.br/enviar-e-receber/ferramentas/rastreamento?objetos=${pedidoSelecionado.codigoRastreio}`,
                          "_blank"
                        )
                      }
                      className="text-sm text-[#D4AF37] font-medium mt-1 hover:underline"
                    >
                      Acompanhar envio →
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Detalhes do Pedido */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-6">Detalhes do Pedido</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 text-gray-600 font-medium">
                        Produto
                      </th>
                      <th className="text-left py-3 text-gray-600 font-medium">
                        Quantidade
                      </th>
                      <th className="text-left py-3 text-gray-600 font-medium">
                        Preço Unitário
                      </th>
                      <th className="text-left py-3 text-gray-600 font-medium">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidoSelecionado.itens?.map((item, index) => {
                      const produtoDetalhado = produtosDetalhados[index];
                      const itemTotal = (item.precoUnitario || 0) * (item.quantidade || 0);
                      const imageUrl = getImageUrl(produtoDetalhado?.imagem || undefined || "");

                      return (
                        <tr
                          key={`${item.produtoId}-${index}`}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-4">
                            <div className="flex items-center">
                              <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mr-4">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={item.produto?.nome || `Produto ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                      e.currentTarget.parentElement!.innerHTML = `
                                        <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                                          <span class="text-gray-400 text-xs">${item.produto?.nome || `Produto ${index + 1}`}</span>
                                        </div>
                                      `;
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">
                                      Sem imagem
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {item.produto?.nome || `Produto ${index + 1}`}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {produtoDetalhado?.categoria?.nome ||
                                    "Categoria não informada"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="font-medium">{item.quantidade || 0}</div>
                          </td>
                          <td className="py-4">
                            <div className="font-medium">
                              {formatarValor(item.precoUnitario)}
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="font-bold text-[#D4AF37]">
                              {formatarValor(itemTotal)}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Resumo Financeiro */}
              <div className="mt-8 max-w-md ml-auto">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatarValor(pedidoSelecionado.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frete</span>
                    <span>
                      {pedidoSelecionado.frete === 0 ? (
                        <span className="text-green-600">Grátis</span>
                      ) : (
                        formatarValor(pedidoSelecionado.frete)
                      )}
                    </span>
                  </div>
                  {pedidoSelecionado.desconto > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span>- {formatarValor(pedidoSelecionado.desconto)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-[#D4AF37]">
                        {formatarValor(pedidoSelecionado.total)}
                      </span>
                    </div>
                    {pedidoSelecionado.total > 0 && (
                      <div className="text-sm text-gray-600 mt-1 text-right">
                        Em 12x de {formatarValor(pedidoSelecionado.total / 12)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Informações de Entrega e Pagamento */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Endereço de Entrega */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-bold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-[#D4AF37]" />
                  Endereço de Entrega
                </h3>
                {enderecoPedido ? (
                  <div className="space-y-2">
                    <div className="font-medium">{enderecoPedido.nome}</div>
                    <div>
                      {enderecoPedido.logradouro}, {enderecoPedido.numero}
                      {enderecoPedido.complemento &&
                        `, ${enderecoPedido.complemento}`}
                    </div>
                    <div>{enderecoPedido.bairro}</div>
                    <div>
                      {enderecoPedido.cidade} - {enderecoPedido.estado}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    {usuarioLogado ? (
                      <div className="space-y-2">
                        <div className="font-medium">{usuarioLogado.nome}</div>
                        <div>{usuarioLogado.email}</div>
                        <div>Telefone: {usuarioLogado.telefone}</div>
                        <p className="text-sm mt-2">
                          Endereço a ser definido na entrega
                        </p>
                      </div>
                    ) : (
                      "Informações de endereço não disponíveis"
                    )}
                  </div>
                )}
              </div>

              {/* Método de Pagamento */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-bold mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-[#D4AF37]" />
                  Método de Pagamento
                </h3>
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mr-4">
                    <CreditCard className="h-6 w-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="font-medium capitalize">
                      {pedidoSelecionado.metodoPagamento
                        .toLowerCase()
                        .replace(/_/g, " ")}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      Status:{" "}
                      {pedidoSelecionado.statusPagamento
                        .toLowerCase()
                        .replace(/_/g, " ")}
                    </div>
                    {pedidoSelecionado.referenciaPagamento && (
                      <div className="text-sm text-gray-600 mt-1">
                        Ref: {pedidoSelecionado.referenciaPagamento}
                      </div>
                    )}
                  </div>
                </div>
                {usuarioLogado && (
                  <div className="text-sm text-gray-600">
                    Comprovante enviado para: {usuarioLogado.email}
                  </div>
                )}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={handleDownloadComprovante}
                className="flex-1 min-w-[200px] bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-black transition flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Baixar Comprovante
              </button>

              <button
                onClick={handleCompartilhar}
                className="flex-1 min-w-[200px] border border-gray-300 py-3 rounded-xl font-medium hover:bg-gray-50 transition flex items-center justify-center"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Compartilhar Pedido
              </button>

              {pedidoSelecionado.status === "ENTREGUE" && (
                <button
                  onClick={handleAvaliar}
                  className="flex-1 min-w-[200px] border border-[#D4AF37] text-[#D4AF37] py-3 rounded-xl font-medium hover:bg-[#D4AF37]/5 transition flex items-center justify-center"
                >
                  <Star className="h-5 w-5 mr-2" />
                  Avaliar Compra
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Ações Rápidas */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <h3 className="font-bold mb-4">Próximos Passos</h3>

              <div className="space-y-4">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <div className="font-medium">Confirmação por e-mail</div>
                    <div className="text-sm text-gray-600">
                      {usuarioLogado
                        ? `Enviado para ${usuarioLogado.email}`
                        : "E-mail não disponível"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <Phone className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <div className="font-medium">Notificações por SMS</div>
                    <div className="text-sm text-gray-600">
                      {usuarioLogado
                        ? `Atualizações no ${usuarioLogado.telefone}`
                        : "Telefone não disponível"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-500 mr-3" />
                  <div>
                    <div className="font-medium">Tempo de entrega</div>
                    <div className="text-sm text-gray-600">2-4 dias úteis</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Suporte */}
            <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow p-6 mb-6">
              <h3 className="font-bold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Precisa de ajuda?
              </h3>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() =>
                    window.open(
                      `https://www.correios.com.br/enviar-e-receber/ferramentas/rastreamento`,
                      "_blank"
                    )
                  }
                  className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
                >
                  <div className="font-medium">Acompanhar pedido</div>
                  <div className="text-sm text-gray-300">
                    Status e localização
                  </div>
                </button>

                <button
                  onClick={() => navigate("/contato")}
                  className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
                >
                  <div className="font-medium">Alterar entrega</div>
                  <div className="text-sm text-gray-300">Data ou endereço</div>
                </button>

                <button
                  onClick={() => (window.location.href = "tel:08001234567")}
                  className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
                >
                  <div className="font-medium">Falar com suporte</div>
                  <div className="text-sm text-gray-300">
                    24h por dia, 7 dias
                  </div>
                </button>
              </div>

              <div className="border-t border-white/20 pt-4">
                <div className="text-sm mb-2">Central de atendimento</div>
                <div className="text-2xl font-bold">0800 123 4567</div>
                <div className="text-sm text-gray-300 mt-1">
                  suporte@sufficius.com
                </div>
              </div>
            </div>

            {/* Recomendações */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-bold mb-4 flex items-center">
                <Gift className="h-5 w-5 mr-2 text-[#D4AF37]" />
                Você também pode gostar
              </h3>

              <div className="space-y-4">
                {produtosRecomendados.length > 0 ? (
                  produtosRecomendados.slice(0, 2).map((produto) => {
                    const imageUrl = getImageUrl(produto.imagem || undefined || "", 50);

                    return (
                      <div
                        key={produto.id}
                        className="flex items-center p-3 border rounded-lg hover:border-[#D4AF37] transition cursor-pointer"
                        onClick={() => navigate(`/produtos/${produto.id}`)}
                      >
                        <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center mr-3">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={produto.nome}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.parentElement!.innerHTML = `
                                  <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <ShoppingBag class="h-6 w-6 text-gray-400" />
                                  </div>
                                `;
                              }}
                            />
                          ) : (
                            <ShoppingBag className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm line-clamp-1">
                            {produto.nome}
                          </div>
                          <div className="text-sm text-[#D4AF37] font-semibold">
                            {formatarValor(produto.preco)}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <p>Carregando recomendações...</p>
                  </div>
                )}

                <button
                  onClick={handleVerMaisProdutos}
                  className="w-full py-3 border border-[#D4AF37] text-[#D4AF37] rounded-lg font-medium hover:bg-[#D4AF37]/5 transition flex items-center justify-center"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Ver mais produtos
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Garantias */}
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            Por que comprar conosco?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-[#D4AF37]" />
              </div>
              <h3 className="font-bold mb-2">Garantia de 30 Dias</h3>
              <p className="text-gray-600">
                Se não gostar, devolvemos seu dinheiro. Sem complicações.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">
                Entregamos em toda Angola em até 4 dias úteis.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">Suporte 24/7</h3>
              <p className="text-gray-600">
                Nossa equipe está sempre disponível para ajudar você.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-10 w-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <span className="font-bold text-white text-lg">S</span>
              </div>
              <span className="ml-2 text-xl font-bold">Sufficius Commerce</span>
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400">Obrigado por comprar conosco! 🎉</p>
              <p className="text-sm text-gray-500 mt-1">
                Seu pedido #{pedidoSelecionado.numeroPedido} está sendo
                processado com cuidado.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              © {new Date().getFullYear()} Sufficius Commerce. Todos os direitos
              reservados.
            </p>
            <p className="text-sm mt-2">
              Em caso de dúvidas, entre em contato: suporte@sufficius.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
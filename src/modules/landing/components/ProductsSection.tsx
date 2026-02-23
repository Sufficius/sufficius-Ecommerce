// src/modules/landing/components/ProductsSection.tsx - ATUALIZADO
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { produtosRoute } from "@/modules/services/api/routes/produtos";
import { carrinhosRoute } from "@/modules/services/api/routes/carrinhos";
import {
  Star,
  Heart,
  Loader,
  ChevronRight,
  Eye,
  ShoppingCart,
} from "lucide-react"; // Ajuste os imports conforme necessário
import { ProductImage } from "./ProductImage";

export const ProductsSection = () => {
  const [quantidade, setQuantidade] = useState(1);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);
  const { user } = useAuthStore();
  const user_Id = user?.id_usuario || "";

  const { data: produtos, isLoading } = useQuery({
    queryKey: ["produtos"],
    queryFn: async () => {
      const response = await produtosRoute.getProdutos();
      return response;
    },
  });

  const [, setAddingProductId] = useState<string | null>(null);

  const addToCartMutation = useMutation({
    mutationFn: async (cartData: {
      userId: string;
      produtoId: string;
      quantidade: number;
    }) => {
      return await carrinhosRoute.adicionarItem(cartData);
    },
    onSuccess: () => {
      toast.success("Produto adicionado ao carrinho com sucesso!");
    },
    onError: (e: any) => {
      setAddingProductId(null);
      const errorMessage =
        e.response?.data?.message ||
        "Ocorreu um erro ao adicionar o produto ao carrinho.";
      toast.error(errorMessage);
    },
  });

  const handleAddCartValue = async (produtoId: string, quantidade: number) => {
    await addToCartMutation.mutate({ userId: user_Id, produtoId, quantidade });
  };

  const handleQuantidade = (action: "increment" | "decrement") => {
    setQuantidade((prev) => {
      const quantidadeDisponivel = produtoSelecionado?.quantidade || 0;

      if (action === "increment") {
        return prev < quantidadeDisponivel ? prev + 1 : prev;
      } else {
        return prev > 1 ? prev - 1 : 1;
      }
    });
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <Loader className="h-8 w-8 animate-spin text-[#D4AF37]" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Produtos em Destaque</h2>
            <p className="text-gray-600">Os mais vendidos da semana</p>
          </div>
          <button className="flex items-center text-[#D4AF37] font-semibold">
            Ver todos <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos?.map((produto: any) => (
            <div
              key={produto.id}
              className="group border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-52 overflow-hidden">
                <ProductImage 
                  produto={produto} 
                  className="w-full h-full"
                />
                <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white">
                  <Heart className="h-5 w-5" />
                </button>
                <div className="absolute top-4 left-4 bg-[#D4AF37] text-white text-xs px-2 py-1 rounded">
                  -20%
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{produto.nome}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {produto.descricao}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-[#D4AF37] fill-current" />
                    <span className="ml-1 text-sm">5</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-2xl font-bold text-[#D4AF37]">
                      KZ {produto.preco?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Disponível {produto.quantidade} unidades
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setProdutoSelecionado(produto);
                        setQuantidade(1);
                      }}
                      className="p-2 border rounded-lg hover:bg-gray-50"
                    >
                      <Eye size={18} />
                    </button>
                    {user && (
                      <button
                        onClick={() => handleAddCartValue(produto.id, quantidade)}
                        disabled={addToCartMutation.isPending}
                        className="p-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#c19b2c] disabled:opacity-50"
                      >
                        {addToCartMutation.isPending ? (
                          <Loader className="animate-spin h-4 w-4" />
                        ) : (
                          <ShoppingCart size={18} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Detalhes do Produto */}
      {produtoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl animate-fadeIn overflow-hidden">
            <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
              <div className="md:w-1/2">
                <div className="h-80 rounded-xl overflow-hidden">
                  <ProductImage 
                    produto={produtoSelecionado}
                    className="w-full h-full"
                  />
                </div>
              </div>

              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-2">
                  {produtoSelecionado.nome}
                </h2>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 text-[#D4AF37] fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    ({produtoSelecionado.vendas || 0} vendas)
                  </span>
                </div>

                <p className="text-gray-600 mb-6">
                  {produtoSelecionado.descricao}
                </p>

                <div className="mb-6">
                  <div className="text-4xl font-bold text-[#D4AF37] mb-2">
                    KZ {produtoSelecionado.preco?.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    ou 12x de KZ {(produtoSelecionado.preco / 12).toFixed(2)}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => handleQuantidade("decrement")}
                        disabled={quantidade <= 1}
                        className={`px-4 py-2 ${
                          quantidade <= 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        -
                      </button>
                      <span className="px-4 py-2 min-w-[3rem] text-center">
                        {quantidade}
                      </span>
                      <button
                        onClick={() => handleQuantidade("increment")}
                        disabled={
                          quantidade >= (produtoSelecionado.quantidade || 1)
                        }
                        className={`px-4 py-2 ${
                          quantidade >= (produtoSelecionado.quantidade || 1)
                            ? "text-gray-400 cursor-not-allowed"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        +
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      {produtoSelecionado.quantidade || 0} unidades disponíveis
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {user && (
                      <button
                        onClick={() => {
                          handleAddCartValue(produtoSelecionado.id, quantidade);
                          setProdutoSelecionado(null);
                          setQuantidade(1);
                        }}
                        className="flex-1 bg-[#D4AF37] text-white py-3 rounded-lg font-semibold hover:bg-[#c19b2c] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          quantidade <= 0 ||
                          quantidade > (produtoSelecionado.quantidade || 0)
                        }
                      >
                        {addToCartMutation.isPending
                          ? "Adicionando..."
                          : "Adicionar ao Carrinho"}
                      </button>
                    )}
                    <button
                      onClick={() => setProdutoSelecionado(null)}
                      className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition"
                    >
                      Fechar
                    </button>
                  </div>

                  {quantidade <= 0 && (
                    <p className="text-red-500 text-sm mt-2">
                      A quantidade deve ser pelo menos 1
                    </p>
                  )}
                  {quantidade > (produtoSelecionado.quantidade || 0) && (
                    <p className="text-red-500 text-sm mt-2">
                      Não há estoque suficiente. Disponível:{" "}
                      {produtoSelecionado.quantidade || 0}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
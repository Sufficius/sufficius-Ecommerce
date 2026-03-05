// src/modules/landing/index.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Package,
  Users,
  Star,
  Shield,
  Truck,
  CreditCard,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronRight,
  Heart,
  LogOut,
  Loader,
} from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { FiShoppingCart } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCartStore } from "@/modules/services/store/cart-store";
import { carrinhosRoute } from "@/modules/services/api/routes/carrinhos";
import { api } from "@/modules/services/api/axios";

// ============================================
// CONFIGURAÇÃO DO SUPABASE
// ============================================
const SUPABASE_STORAGE_URL = "https://rojyeqiqrvriknawugmt.supabase.co/storage/v1/object/public";

// Buckets
const BUCKETS = {
  PRODUCTS: "produtos-imagens",
  CATEGORIES: "categorias-imagens",
  AVATARS: "avatars",
  HERO: "hero"
};

// ============================================
// COMPONENTE DE IMAGEM SUPABASE
// ============================================
interface SupabaseImageProps {
  src?: string;
  alt: string;
  bucket?: keyof typeof BUCKETS;
  width?: number;
  height?: number;
  className?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
  fallback?: React.ReactNode;
}

const SupabaseImage = ({
  src,
  alt,
  bucket = "PRODUCTS",
  width = 800,
  height = 600,
  className = "",
  loading = "lazy",
  priority = false,
  fallback
}: SupabaseImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  // Gerar URL completa da imagem no Supabase
  const getImageUrl = () => {
    if (!src) return null;
    if (src.startsWith("http")) return src;
    
    // Limpar o caminho
    const cleanPath = src.replace(/^\/+/, "");
    return `${SUPABASE_STORAGE_URL}/${BUCKETS[bucket]}/${cleanPath}`;
  };

  const imageUrl = getImageUrl();

  if (!src || isError) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {fallback || (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Package className="h-12 w-12 text-gray-400" />
            <span className="ml-2 text-gray-500 text-sm">{alt}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className={`absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 transition-opacity duration-500 ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
      />

      <img
        src={imageUrl!}
        alt={alt}
        loading={priority ? "eager" : loading}
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

// ============================================
// COMPONENTES DE IMAGEM ESPECÍFICOS
// ============================================

const HeroImage = () => (
  <SupabaseImage
    src="hero/colecao-2026.jpg"
    alt="Nova Coleção de Produtos"
    bucket="HERO"
    width={600}
    height={400}
    priority={true}
    className="w-full h-full rounded-2xl"
  />
);

const CategoryImage = ({
  category,
  imageUrl,
  className = "",
}: {
  category: string;
  imageUrl?: string;
  className?: string;
}) => {
  // Se não tiver imagem personalizada, usa uma imagem padrão por categoria
  const defaultImage = `categories/${category.toLowerCase().replace(/\s+/g, '-')}.jpg`;
  
  return (
    <SupabaseImage
      src={imageUrl || defaultImage}
      alt={category}
      bucket="CATEGORIES"
      width={200}
      height={128}
      className={`w-full h-full ${className}`}
    />
  );
};

const TestimonialAvatar = ({ id, imageUrl }: { id: number; imageUrl?: string }) => {
  return (
    <div className="h-10 w-10 rounded-full overflow-hidden">
      <SupabaseImage
        src={imageUrl || `avatars/client-${id}.jpg`}
        alt={`Cliente ${id}`}
        bucket="AVATARS"
        width={40}
        height={40}
        className="w-full h-full"
      />
    </div>
  );
};

const ProductImage = ({ produto, className = "" }: { produto: any; className?: string }) => {
  // Fallback personalizado para produtos
  const productFallback = (
    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
      <Package className="h-12 w-12 text-gray-400 mb-2" />
      <span className="text-gray-500 text-sm">{produto?.nome}</span>
    </div>
  );

  return (
    <SupabaseImage
      src={produto?.foto}
      alt={produto?.nome}
      bucket="PRODUCTS"
      className={`w-full h-full object-cover ${className}`}
      fallback={productFallback}
    />
  );
};

// ============================================
// HERO SECTION
// ============================================
export const HeroSection = () => {
  const navigate = useNavigate();
  const logged = useAuthStore((state) => state.isAuthenticated);

  const handleCompra = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (logged) {
      navigate("/checkout");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="relative px-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32 z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 relative z-20">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-[#D4AF37]">🔥</span>
              <span className="text-sm">Oferta Especial Limitada</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Descubra a Nova Coleção{" "}
              <span className="text-[#D4AF37]">{new Date().getFullYear()}</span>
            </h1>

            <p className="text-gray-300 text-lg">
              Qualidade premium, preços imbatíveis. Encontre tudo o que precisa
              em um só lugar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 relative z-30">
              <button
                onClick={handleCompra}
                className="relative z-50 bg-[#D4AF37] text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-[#c19b2c] transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                style={{ pointerEvents: "auto" }}
              >
                Comprar Agora
              </button>

              <button
                className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition shadow-lg"
                style={{ pointerEvents: "auto" }}
              >
                Ver Coleção
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-gray-400">Clientes Satisfeitos</div>
              </div>
              <div>
                <div className="text-2xl font-bold">5K+</div>
                <div className="text-gray-400">Produtos Premium</div>
              </div>
              <div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-gray-400">Suporte Online</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <HeroImage />
            </div>
            <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-gradient-to-r from-[#D4AF37] to-yellow-500 rounded-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// FEATURES SECTION
// ============================================
export const Features = () => (
  <section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          {
            icon: <Truck className="h-8 w-8" />,
            title: "Entrega Rápida",
            desc: "Entrega em 24-48h",
          },
          {
            icon: <Shield className="h-8 w-8" />,
            title: "Garantia",
            desc: "30 dias para devolução",
          },
          {
            icon: <CreditCard className="h-8 w-8" />,
            title: "Pagamento Seguro",
            desc: "100% protegido",
          },
          {
            icon: <Users className="h-8 w-8" />,
            title: "Suporte 24/7",
            desc: "Atendimento especializado",
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center p-6 border rounded-xl hover:shadow-lg transition"
          >
            <div className="p-3 bg-[#D4AF37]/10 rounded-full mb-4">
              {feature.icon}
            </div>
            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// CATEGORIAS SECTION - CORRIGIDA
// ============================================
const FeaturedCategories = () => {
  const { data: categorias, isLoading } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
        const response = await api.get("/categorias");
        return response.data
    },
  });

  // AGORA CORRETO: acessando categorias.data
  const getCategoriasArray = () => {
    if (!categorias) {
      return [];
    }
    
    // A API retorna { data: [...], total: number }
    if (categorias?.data && Array.isArray(categorias.data)) {
      return categorias.data;
    }
    
    // Fallback caso seja array direto
    if (Array.isArray(categorias)) {
      return categorias;
    }
    
    return [];
  };

  const categoriasArray = getCategoriasArray();

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <Loader className="h-8 w-8 animate-spin text-[#D4AF37]" />
          </div>
        </div>
      </section>
    );
  }

  if (!categoriasArray || categoriasArray.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">
            Nenhuma categoria encontrada
          </h3>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Categorias em Destaque</h2>
          <p className="text-gray-600">
            Navegue por nossas principais categorias
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categoriasArray.map((cat: any) => (
            <div key={cat.id} className="group cursor-pointer">
              <div className="relative h-32 rounded-xl overflow-hidden mb-4 group-hover:scale-105 transition duration-300">
                <CategoryImage
                  category={cat.nome}
                  imageUrl={cat.imagem || cat?.Produto?.[0]?.foto}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">{cat.nome}</h3>
                <p className="text-sm text-gray-500">
                  {cat?.Produto?.length || 0} produtos
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// TESTIMONIALS SECTION
// ============================================
export const Testimonials = () => (
  <section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">O que nossos clientes dizem</h2>
        <p className="text-gray-600">
          Avaliações verificadas de compradores reais
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { id: 1, name: "Maria Silva", time: "Cliente há 2 anos", image: "testimonials/maria.jpg" },
          { id: 2, name: "João Santos", time: "Cliente há 1 ano", image: "testimonials/joao.jpg" },
          { id: 3, name: "Ana Oliveira", time: "Cliente há 3 anos", image: "testimonials/ana.jpg" },
        ].map((client) => (
          <div
            key={client.id}
            className="border rounded-xl p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-4 w-4 text-[#D4AF37] fill-current"
                />
              ))}
            </div>
            <p className="text-gray-600 mb-4 italic">
              "Produto de excelente qualidade! Entrega super rápida e
              atendimento impecável."
            </p>
            <div className="flex items-center">
              <TestimonialAvatar id={client.id} imageUrl={client.image} />
              <div className="ml-3">
                <div className="font-semibold">{client.name}</div>
                <div className="text-sm text-gray-500">{client.time}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// NEWSLETTER SECTION
// ============================================
export const Newsletter = () => (
  <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
    <div className="max-w-3xl mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">
        Fique por dentro das novidades
      </h2>
      <p className="text-gray-300 mb-8">
        Inscreva-se para receber ofertas exclusivas e lançamentos
      </p>

      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Seu melhor email"
          className="flex-1 px-4 py-3 rounded-lg text-gray-900"
        />
        <button className="bg-[#D4AF37] text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-[#c19b2c] transition">
          Inscrever-se
        </button>
      </div>

      <p className="text-sm text-gray-400 mt-4">
        Ao se inscrever, você concorda com nossa Política de Privacidade
      </p>
    </div>
  </section>
);

// ============================================
// FOOTER
// ============================================
export const Footer = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-10 w-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
              <span className="font-bold text-gray-900">S</span>
            </div>
            <span className="text-xl font-bold">Sufficius Commerce</span>
          </div>
          <p className="text-gray-400">
            Sua loja online de confiança para produtos de qualidade.
          </p>
          <div className="flex gap-4 mt-6">
            <Facebook className="h-5 w-5 cursor-pointer hover:text-[#D4AF37]" />
            <Twitter className="h-5 w-5 cursor-pointer hover:text-[#D4AF37]" />
            <Instagram className="h-5 w-5 cursor-pointer hover:text-[#D4AF37]" />
            <Linkedin className="h-5 w-5 cursor-pointer hover:text-[#D4AF37]" />
          </div>
        </div>

        {[
          {
            title: "Loja",
            links: ["Produtos", "Categorias", "Ofertas", "Novidades"],
          },
          {
            title: "Empresa",
            links: ["Sobre nós", "Contato", "Carreiras", "Blog"],
          },
          {
            title: "Suporte",
            links: ["FAQ", "Trocas", "Entregas", "Pagamentos"],
          },
        ].map((section, idx) => (
          <div key={idx}>
            <h3 className="font-bold text-lg mb-4">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#D4AF37] transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>
          © {new Date().getFullYear()} Sufficius Commerce. Todos os direitos
          reservados.
        </p>
      </div>
    </div>
  </footer>
);

// ============================================
// PRODUTOS SECTION
// ============================================
const ProductsSection = () => {
  const [quantidade, setQuantidade] = useState(1);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);
  const { user } = useAuthStore();
  const user_Id = user?.id_usuario || "";

  const { data: produtos, isLoading, error } = useQuery({
    queryKey: ["produtos"],
    queryFn: async () => {
      const response = await api.get("/produtos/get");
      return response.data;
    },
  });

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

   const getProdutosArray = () => {
    if (!produtos){
      return [];
    };

    if (produtos?.data && Array.isArray(produtos.data)){
      return produtos.data;
    } 
    if (Array.isArray(produtos)) {
      console.log("✅ Produtos é array direto");
      return produtos;
    }
    console.log("⚠️ Formato inesperado:", produtos);
    return [];
  };

   const produtosArray = getProdutosArray();

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

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-red-500">Erro ao carregar produtos</p>
        </div>
      </section>
    );
  }

  if (!produtosArray || produtosArray.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">
            Nenhum produto encontrado
          </h3>
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
          {produtosArray && produtosArray.map((produto: any) => (
            <div
              key={produto.id}
              className="group border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-52 overflow-hidden bg-gray-100">
                <ProductImage produto={produto} />
                <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white z-10">
                  <Heart className="h-5 w-5" />
                </button>
                <div className="absolute top-4 left-4 bg-[#D4AF37] text-white text-xs px-2 py-1 rounded z-10">
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
                      <BsEye size={18} />
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
                          <FiShoppingCart size={18} />
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
                <div className="h-80 rounded-xl overflow-hidden bg-gray-100">
                  <ProductImage produto={produtoSelecionado} className="w-full h-full" />
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
                    <p className="text-red-500 text-sm">
                      A quantidade deve ser pelo menos 1
                    </p>
                  )}
                  {quantidade > (produtoSelecionado.quantidade || 0) && (
                    <p className="text-red-500 text-sm">
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

// ============================================
// HEADER
// ============================================
const Header = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setCart] = useState<any[]>([]);

  const user = useAuthStore((state) => state.user);
  const user_Id = user?.id_usuario || "";
  const logged = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => await carrinhosRoute.getCarrinho(),
    enabled: !!user_Id,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (cartData?.data?.itens) {
      const mapped = cartData?.data?.itens.map((item) => ({
        id: item.id,
        name: item.produto.nome,
        description: item.produto.imagemAlt,
        image: item.produto.imagem,
        price: item.produto.preco,
        quantity: item.quantidade,
        product_id: item.produtoId,
      }));
      setCart(mapped);
    }
  }, [cartData]);

  const { setCurrentUser } = useCartStore();

  useEffect(() => {
    if (user) {
      setCurrentUser(user.id_usuario);
    } else {
      setCurrentUser(null);
    }
  }, [user, setCurrentUser]);

  const countItems = useQuery({
    queryKey: ["count"],
    queryFn: async () => {
      const response = await carrinhosRoute.countCartItems(
        user?.id_usuario || "",
      );
      return response;
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <>
      <header className="w-full border-b bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            {/* LOGO */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <span className="font-bold text-white text-lg">S</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-xl">
                  Sufficius
                </span>
                <p className="text-xs text-gray-500">Commerce</p>
              </div>
            </div>

            {/* SEARCH BAR */}
            <div className="hidden md:flex relative w-full max-w-md mx-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Pesquisar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            {/* NAVIGATION */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
              <a href="#inicio" className="hover:text-[#D4AF37] transition">
                Início
              </a>
              <a href="#produtos" className="hover:text-[#D4AF37] transition">
                Produtos
              </a>
              <a href="#categorias" className="hover:text-[#D4AF37] transition">
                Categorias
              </a>
              <a href="#contato" className="hover:text-[#D4AF37] transition">
                Contato
              </a>
            </nav>

            {/* ACTIONS */}
            <div className="flex items-center gap-4">
              {/* ÁREA DE AUTENTICAÇÃO */}
              <div className="relative" ref={profileRef}>
                {logged ? (
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <CgProfile size={24} />
                    </button>

                    {user?.role === "ADMIN" && (
                      <Link to={"/dashboard"}>
                        <Button>Dashboard</Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <Link to={"/login"}>
                    <Button className="gap-5 flex ml-4">Entrar</Button>
                  </Link>
                )}

                {/* MENU DO PERFIL */}
                {profileOpen && logged && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b">
                      <p className="font-medium">Bem-vindo!</p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {user?.email}
                      </p>
                    </div>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                      Minha Conta
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                      Meus Pedidos
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 border-t"
                    >
                      <LogOut size={20} />
                      Terminar Sessão
                    </button>
                  </div>
                )}
              </div>

              {/* BOTÃO DO CARRINHO */}
              <Link to={"/checkout"}>
                <button className="relative p-2 rounded-full">
                  <ShoppingCart className="w-5" />
                  {user && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {countItems.isLoading ? (
                        "0"
                      ) : (
                        cartData?.data?.totalItens?.toString() || "0"
                      )}
                    </span>
                  )}
                </button>
              </Link>

              {/* BOTÃO MENU MOBILE */}
              <button className="md:hidden" onClick={() => setOpen(!open)}>
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* MENU MOBILE */}
          {open && (
            <div className="md:hidden border-t bg-white">
              <div className="p-4">
                <input
                  type="search"
                  placeholder="Pesquisar..."
                  className="w-full border rounded-lg px-4 py-2 mb-4"
                />
                <div className="space-y-3">
                  <a href="#inicio" className="block py-2">
                    Início
                  </a>
                  <a href="#produtos" className="block py-2">
                    Produtos
                  </a>
                  <a href="#categorias" className="block py-2">
                    Categorias
                  </a>
                  <a href="#contato" className="block py-2">
                    Contato
                  </a>
                  {!logged && (
                    <Link
                      to="/login"
                      className="block py-2"
                      onClick={() => setOpen(false)}
                    >
                      <Button className="w-full">Entrar</Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

// ============================================
// COMPONENTE PRINCIPAL LANDING
// ============================================
export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <div id="inicio">
        <Header />
      </div>

      <HeroSection />
      <Features />
      
      <div id="produtos">
        <ProductsSection />
      </div>
      
      <div id="categorias">
        <FeaturedCategories />
      </div>

      <Testimonials />
      <Newsletter />
      
      <div id="contato">
        <Footer />
      </div>
    </div>
  );
}
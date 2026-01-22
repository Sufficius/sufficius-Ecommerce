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
import { CgClose, CgProfile } from "react-icons/cg";
import { FiShoppingCart } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { produtosRoute } from "@/modules/services/api/routes/produtos";
import { useCartStore } from "@/modules/services/store/cart-store";
import { carrinhosRoute } from "@/modules/services/api/routes/carrinhos";

// Componente de imagem otimizado com Cloudinary
interface CloudinaryImageProps {
  publicId?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
}

const CloudinaryImage = ({
  publicId,
  alt,
  width = 800,
  height = 600,
  className = "",
  loading = "lazy",
  priority = false,
}: CloudinaryImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  // Configuração do Cloudinary
  const cloudName =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "sufficius-commerce";

  const normalizedPublicId = (id: string | undefined): string => {
    if (!id) return "placeholder";

    if (id.includes("res.cloudinary.com")) {
      const parts = id.split("/upload/");
      return parts.length > 1 ? parts[1] : parts[0];
    }
    return id.startsWith("/") ? id.substring(1) : id;
  };

  const normalizeId = normalizedPublicId(publicId);
  const isFullPublicId =
    normalizeId.includes("/") || normalizeId.startsWith("v");
  const finalPublicId = isFullPublicId
    ? normalizeId
    : `placeholder/${normalizeId}`;

  // Transformações otimizadas
  const transformations = "c_scale,w_800,h_600,q_auto,f_auto";

  const src = `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${finalPublicId}`;

  // Placeholder em base64 para blur effect
  const placeholder =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMWYxIi8+PC9zdmc+";

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 transition-opacity duration-500 ${
          isLoaded ? "opacity-0" : "opacity-100"
        } ${isError ? "hidden" : "block"}`}
      />

      {/* Imagem otimizada */}
      <img
        src={isLoaded ? src : placeholder}
        alt={alt}
        loading={priority ? "eager" : loading}
        width={width}
        height={height}
        onLoad={() => {
          setIsLoaded(true);
        }}
        onError={() => {
          console.error(`Erro ao carregar imagem ${alt}:`, src);
          setIsError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Fallback para erro */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Package className="h-12 w-12 text-gray-400" />
          <span className="ml-2 text-gray-500 text-sm">{alt}</span>
        </div>
      )}
    </div>
  );
};

const HeroImage = () => (
  <CloudinaryImage
    publicId="v1768212665/image4_kyqknt.jpg"
    alt="Nova Coleção de Produtos"
    width={600}
    height={400}
    priority={true}
    className="w-full h-full rounded-2xl"
  />
);

// Imagens para categorias - usando suas imagens
const CategoryImage = ({
  category,
  className = "",
}: {
  category: string;
  className?: string;
}) => {
  const imageMap: Record<string, string> = {
    Eletrônicos: "v1768212665/img2_jxkmz3.jpg",
    Moda: "v1768212665/img3_frqidi.jpg",
    "Casa & Jardim": "v1768212665/image13_bgsomn.jpg",
    Beleza: "v1768212665/image6_s6uyn9.jpg",
    Esportes: "v1768212665/image7_qyn6if.jpg",
    Livros: "v1768212665/image12_fv8ifg.jpg",
    Áudio: "sufficius-commerce/categoria-audio",
    "TV & Vídeo": "sufficius-commerce/categoria-tv-video",
    Games: "sufficius-commerce/categoria-games",
    Wearables: "sufficius-commerce/categoria-wearables",
  };

  return (
    <CloudinaryImage
      publicId={imageMap[category] || "v1768212665/image3_g6gaai.jpg"}
      alt={category}
      width={200}
      height={128}
      className={`w-full h-full ${className}`}
    />
  );
};

// Imagem de testimonial
const TestimonialAvatar = ({ id }: { id: number }) => {
  const imageMap = {
    1: "v1768212665/image3_g6gaai.jpg",
    2: "v1768212665/img4_bsfuoz.jpg",
    3: "v1768212665/image5_p7b819.jpg",
  };

  return (
    <div className="h-10 w-10 rounded-full overflow-hidden">
      <CloudinaryImage
        publicId={
          imageMap[id as keyof typeof imageMap] ||
          "v1768212665/image3_g6gaai.jpg"
        }
        alt={`Cliente ${id}`}
        width={40}
        height={40}
        className="w-full h-full"
      />
    </div>
  );
};

// const CartProductImage = ({ produto }: { produto: any }) => {
//   if(produto.imagem) {
//     let imagePath = produto.imagem;

//     if(imagePath.startsWith('/')){
//       imagePath = imagePath.substring(1);
//     }
//     const cloudName = "sufficius-commerce";
//     const transformations = "c_scale,w_150,h_150,q_auto,f_auto";
//     const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${imagePath}`;

//     return (
//       <img
//       src={imageUrl}
//       alt={`Produto ${produto.nome}`}
//       width={64}
//       height={64}
//       className="w-full h-full object-cover"
//       onError={(e)=>  {
//         e.currentTarget.style.display = 'none';
//         e.currentTarget.parentElement!.innerHTML = `
//         <div class="w-full h-full bg-gray-100 flex items-center justify-center">
//               <Package className="h-6 w-6 text-gray-400" />
//             </div>
//         `
//       }}
//     />
//   );
// }
// };

const HeroSection = () => {
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
      {/* Ajuste o z-index da overlay para não sobrepor os botões */}
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
              {/* Botão "Comprar Agora" com prioridade máxima */}
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

const Features = () => (
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

const FeaturedCategories = () => {
  const categories = [
    { name: "Eletrônicos", count: "120 produtos" },
    { name: "Moda", count: "85 produtos" },
    { name: "Casa & Jardim", count: "64 produtos" },
    { name: "Beleza", count: "42 produtos" },
    { name: "Esportes", count: "56 produtos" },
    { name: "Livros", count: "210 produtos" },
  ];

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
          {categories.map((cat, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="h-32 rounded-xl overflow-hidden mb-4 group-hover:scale-105 transition duration-300">
                <CategoryImage
                  category={cat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">{cat.name}</h3>
                <p className="text-sm text-gray-500">{cat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => (
  <section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">O que nossos clientes dizem</h2>
        <p className="text-gray-600">
          Avaliações verificadas de compradores reais
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
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
              <TestimonialAvatar id={idx} />
              <div className="ml-3">
                <div className="font-semibold">Maria Silva</div>
                <div className="text-sm text-gray-500">Cliente há 2 anos</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Newsletter = () => (
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

const Footer = () => (
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

// Componente de Produtos
const ProductsSection = () => {
  const [quantidade, setQuantidade] = useState(1);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);

  const addItem = useCartStore((state) => state.addItem);

  const { data: produtos } = useQuery({
    queryKey: ["produtos"],
    queryFn: async () => {
      const response = await produtosRoute.getProdutos();
      return response.data;
    },
  });

  const renderImagem = (produto: any) => {
    if (produto.imagem) {
      if (produto.imagem.includes("http")) {
        return (
          <img
            src={produto.imagem}
            alt={produto.nome}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error(
                `Erro ao carregar imagem completa: ${produto.imagem}`
              );
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement!.innerHTML = `
              <div class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span class="text-gray-400">${produto.nome}</span>
              </div>
            `;
            }}
          />
        );
      }

      let cloudinaryPath = produto.imagem;

      if (cloudinaryPath.startsWith("/")) {
        cloudinaryPath = cloudinaryPath.substring(1);
      }

      return (
        <CloudinaryImage
          publicId={cloudinaryPath}
          alt={produto.nome}
          width={400}
          height={300}
          className="w-full h-full"
        />
      );
    } else {
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
          <Package className="h-12 w-12 text-gray-400 mb-2" />
          <span className="text-gray-500 text-sm">{produto.nome}</span>
          <div className="absolute bottom-2 right-2 bg-[#D4AF37] text-white px-2 py-1 text-xs rounded">
            Sem Imagem
          </div>
        </div>
      );
    }
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

  const queryClient = useQueryClient();

  const addCartMutation = useMutation({
    mutationFn: async ({
      produtoId,
      quantidade,
    }: {
      produtoId: string;
      quantidade: number;
    }) => {
      return await carrinhosRoute.adicionarItem(produtoId, quantidade);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carrinho"] });
    },
    onError: (error) => {
      console.error("Erro ao adicionar ao carrinho:", error);
    },
  });

  const handleAdicionarAoCarrinho = (
    produto: any,
    quantidadeSelecionada: number = 1
  ) => {
    const cartItem = {
      id: produto.id,
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      quantidade: produto.quantidade || 0,
      quantidadeSelecionada: quantidadeSelecionada,
      imagem: produto.imagem,
      categoria: produto.categoria,
    };
    addItem(cartItem);
    addCartMutation.mutate({
      produtoId: produto.id,
      quantidade: quantidadeSelecionada,
    });
    toast.success(`${produto.nome} adicionado ao carrinho!`);
  };

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
          {produtos?.produtos?.map((produto: any) => {
            return (
              <div
                key={produto.id}
                className="group border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-52 overflow-hidden">
                  {renderImagem(produto)}
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
                      <p className="text-gray-500 text-sm">
                        {produto.descricao}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-[#D4AF37] fill-current" />
                      <span className="ml-1 text-sm">{produto.rating}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="text-2xl font-bold text-[#D4AF37]">
                        KZ {produto.preco.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {produto.vendas} vendas
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
                      <button
                        onClick={() => handleAdicionarAoCarrinho(produto)}
                        disabled={addCartMutation.isPending}
                        className="p-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#c19b2c]"
                      >
                        {addCartMutation.isPending ? (
                          <Loader className="animate-spin" />
                        ) : (
                          <FiShoppingCart size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Modal de Detalhes do Produto */}
      {produtoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl animate-fadeIn overflow-hidden">
            <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
              <div className="md:w-1/2">
                <div className="h-80 rounded-xl overflow-hidden">
                  {renderImagem(produtoSelecionado)}
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
                    KZ {produtoSelecionado.preco.toLocaleString()}
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
                    <button
                      onClick={() => {
                        handleAdicionarAoCarrinho(
                          produtoSelecionado,
                          quantidade
                        );
                        setProdutoSelecionado(null);
                        setQuantidade(1);
                      }}
                      className="flex-1 bg-[#D4AF37] text-white py-3 rounded-lg font-semibold hover:bg-[#c19b2c] transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        quantidade <= 0 ||
                        quantidade > (produtoSelecionado.quantidade || 0)
                      }
                    >
                      {addCartMutation.isPending
                        ? "Adicionando..."
                        : "Adicionar ao Carrinho"}
                    </button>
                    <button
                      onClick={() => setProdutoSelecionado(null)}
                      className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition"
                    >
                      Fechar
                    </button>
                  </div>

                  {/* Mensagens de validação */}
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

// Componente Header atualizado
const Header = () => {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const user = useAuthStore((state) => state.user);
  const logged = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const {
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getTotalItemsDoUsuario,
    setCurrentUser,
    getItemsDoUsuarioAtual,
  } = useCartStore();

  useEffect(() => {
    if (user) {
      setCurrentUser(user.id_usuario);
    } else {
      setCurrentUser(null);
    }
  }, [user, setCurrentUser]);

  const totalItens = user ? getTotalItemsDoUsuario(user.id_usuario) : 0;
  const carrinho = getItemsDoUsuarioAtual();

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

  const handleQuantidade = (id: string, action: "increment" | "decrement") => {
    const item = carrinho.find((i) => i.id === id);
    if (!item) return;

    const novaQuantidade =
      action === "increment"
        ? item.quantidadeSelecionada + 1
        : item.quantidadeSelecionada - 1;

    updateQuantity(id, novaQuantidade);
  };

  const removerDoCarrinho = (id: string) => {
    removeItem(id);
    toast.info("Produto removido do carrinho");
  };

  const finalizarCompra = () => {
    if (carrinho.length === 0) {
      toast.error("Nenhum produto no carrinho!");
      return;
    }
    if (!logged) {
      toast.error("Faça login para finalizar a compra");
      navigate("/login");
      return;
    }
    setCartOpen(false);
    navigate("/checkout");
  };

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    setCurrentUser(null);
    navigate("/");
  };

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null;

    let cleanedPath = imagePath;
    if (cleanedPath.startsWith("/")) {
      cleanedPath = cleanedPath.substring(1);
    }

    const cloudName = "sufficius-commerce";
    const transformations = "c_fill,w_150,h_150,q_auto,f_auto";

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${cleanedPath}`;
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
                  // USUÁRIO LOGADO
                  <div className="flex gap-2 items-center">
                    {/* Botão de perfil - SEMPRE visível para usuários logados */}
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <CgProfile size={24} />
                    </button>

                    {/* Botão "Voltar" - SÓ para ADMIN */}
                    {user?.role === "ADMIN" && (
                      <Link to={"/dashboard"}>
                        <Button>Dashboard</Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  // USUÁRIO NÃO LOGADO
                  <Link to={"/login"}>
                    <Button>Entrar</Button>
                  </Link>
                )}

                {/* MENU DO PERFIL (dropdown) */}
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
              <button
                className="relative p-2 rounded-full"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart size={22} />
                {totalItens > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItens}
                  </span>
                )}
              </button>

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

      {/* MODAL DO CARRINHO */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Meu Carrinho ({totalItens})</h2>
              <button onClick={() => setCartOpen(false)} className="p-1">
                <X size={24} />
              </button>
            </div>

            {totalItens === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <ShoppingCart className="h-16 w-16 mb-4" />
                <p>Seu carrinho está vazio</p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="mt-4 text-[#D4AF37] font-medium"
                >
                  Continuar comprando
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto">
                  {carrinho.map((item) => {
                    const imageUrl = getImageUrl(item.imagem);
                    const itemTotal = item.preco * item.quantidadeSelecionada;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center border-b py-4"
                      >
                        <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.nome}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.parentElement!.innerHTML = `
                                <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                                  <span class="text-gray-400 text-xs">${item.nome}</span>
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
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium">{item.nome}</h3>
                          <p className="text-[#D4AF37] font-semibold">
                            KZ {item.preco.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() =>
                                handleQuantidade(item.id, "decrement")
                              }
                              className="w-6 h-6 border rounded"
                              disabled={item.quantidadeSelecionada <= 1}
                            >
                              -
                            </button>
                            <span className="min-w-[2rem] text-center">
                              {item.quantidadeSelecionada}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantidade(item.id, "increment")
                              }
                              className="w-6 h-6 border rounded"
                              disabled={
                                item.quantidadeSelecionada >= item.quantidade
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right ml-2">
                          <p className="font-semibold">
                            KZ {itemTotal.toLocaleString()}
                            {(
                              item.preco * item.quantidadeSelecionada
                            ).toLocaleString()}
                          </p>
                          <button
                            onClick={() => removerDoCarrinho(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <CgClose size={20} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>Total:</span>
                    <span>KZ {getTotal().toLocaleString()}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (carrinho.length > 0) {
                          clearCart();
                          toast.success("Carrinho limpo com sucesso!");
                        }
                      }}
                      className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
                      disabled={carrinho.length === 0}
                    >
                      Limpar
                    </button>
                    <button
                      onClick={finalizarCompra}
                      className="w-full bg-[#D4AF37] text-white py-3 rounded-lg font-semibold hover:bg-[#c19b2c] transition"
                     disabled={carrinho.length === 0}
                    >
                      Finalizar Compra
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

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

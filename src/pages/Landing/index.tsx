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
} from "lucide-react";
import { CgClose, CgProfile } from "react-icons/cg";
import { FiShoppingCart } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { Button } from "@/components/ui/button";
import { PrimeiraImagem, QuartaImagem, QuintaImagem, SegundaImagem, SextaImagem, TerceiraImagem } from "@/components/images";

const ProductImage = ({ index }: { index: number }) => (
  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
    <div className="absolute bottom-2 right-2 bg-[#D4AF37] text-white px-2 py-1 text-xs rounded">
      Produto {index}
    </div>
  </div>
);

const HeroSection = () => {
  const navigate = useNavigate();
  const logged = useAuthStore((state) => state.isAuthenticated);

  const handleCompra = () => {
    if (logged) {
      navigate("/checkout");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="relative px-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-0" />
      <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
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

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleCompra}
                className="bg-[#D4AF37] text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-[#c19b2c] transition-all transform hover:scale-105"
              >
                Comprar Agora
              </button>
              <button className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition">
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
              <ProductImage index={1} />
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
    { name: "Eletrônicos", count: "120 produtos", color: "bg-blue-500" },
    { name: "Moda", count: "85 produtos", color: "bg-pink-500" },
    { name: "Casa & Jardim", count: "64 produtos", color: "bg-green-500" },
    { name: "Beleza", count: "42 produtos", color: "bg-purple-500" },
    { name: "Esportes", count: "56 produtos", color: "bg-orange-500" },
    { name: "Livros", count: "210 produtos", color: "bg-red-500" },
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
              <div
                className={`${cat.color} h-32 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition`}
              >
                <Package className="h-12 w-12 text-white" />
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
        {[1, 2, 3].map((_, idx) => (
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
              <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
              <div>
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

  const produtos = [
    {
      id: 1,
      nome: "Smartphone Premium",
      descricao: '128GB, Tela 6.7", Câmera Tripla',
      preco: 8999,
      categoria: "Eletrônicos",
      rating: 4.5,
      vendas: 234,
      img: <PrimeiraImagem />,
    },
    {
      id: 2,
      nome: "Notebook Gamer",
      descricao: "RTX 4060, 16GB RAM, 1TB SSD",
      preco: 12599,
      categoria: "Eletrônicos",
      rating: 4.8,
      vendas: 189,
      img: <SegundaImagem />,

    },
    {
      id: 3,
      nome: "Fone Bluetooth",
      descricao: "Cancelamento de Ruído, 30h bateria",
      preco: 1999,
      categoria: "Áudio",
      rating: 4.3,
      vendas: 456,
      img: <TerceiraImagem />,

    },
    {
      id: 4,
      nome: "Smart TV 4K",
      descricao: "55 polegadas, Android TV",
      preco: 3299,
      categoria: "TV & Vídeo",
      rating: 4.6,
      vendas: 123,
      img: <QuartaImagem />,

    },
    {
      id: 5,
      nome: "Console de Jogos",
      descricao: "1TB SSD, 2 Controles",
      preco: 4599,
      categoria: "Games",
      rating: 4.7,
      vendas: 312,
      img: <QuintaImagem />,

    },
    {
      id: 6,
      nome: "Smartwatch",
      descricao: "Monitor Cardíaco, GPS, À prova d'água",
      preco: 1599,
      categoria: "Wearables",
      rating: 4.4,
      vendas: 278,
      img: <SextaImagem />,
    },
  ];

  const handleQuantidade = (action: "increment" | "decrement") => {
    setQuantidade((prev) =>
      action === "increment" ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
  };

  const handleAdicionarAoCarrinho = (produto: any) => {
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
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className="group border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
               {produto.img || ""}
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
                    <p className="text-gray-500 text-sm">{produto.descricao}</p>
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
                      className="p-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#c19b2c]"
                    >
                      <FiShoppingCart size={18} />
                    </button>
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
                <div className="h-80 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="-mt-10">
                  {produtoSelecionado.img}
                  </div>
                  <ProductImage index={produtoSelecionado.id} />
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
                    ({produtoSelecionado.vendas} vendas)
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
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-2">{quantidade}</span>
                      <button
                        onClick={() => handleQuantidade("increment")}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      {20 - quantidade} unidades disponíveis
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        handleAdicionarAoCarrinho(produtoSelecionado);
                        setProdutoSelecionado(null);
                      }}
                      className="flex-1 bg-[#D4AF37] text-white py-3 rounded-lg font-semibold hover:bg-[#c19b2c] transition"
                    >
                      Adicionar ao Carrinho
                    </button>
                    <button
                      onClick={() => setProdutoSelecionado(null)}
                      className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition"
                    >
                      Fechar
                    </button>
                  </div>
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
  // const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [profileOpen, setProfileOpen] = useState(false);
  const [quantidades, setQuantidades] = useState<Record<number, number>>({});
  const [carrinho, setCarrinho] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useAuthStore((state) => state.user);
  const logged = useAuthStore((state) => state.isAuthenticated);

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

  const handleQuantidade = (id: number, action: "increment" | "decrement") => {
    setQuantidades((prev) => {
      const atual = prev[id] || 1;
      const nova =
        action === "increment" ? atual + 1 : atual > 1 ? atual - 1 : 1;
      return { ...prev, [id]: nova };
    });
  };

  const removerDoCarrinho = (id: number) => {
    setCarrinho(carrinho.filter((item) => item !== id));
    toast.info("Produto removido do carrinho");
  };

  const finalizarCompra = () => {
    if (carrinho.length === 0) {
      toast.error("Nenhum produto no carrinho!");
      return;
    }
    toast.success("Compra finalizada com sucesso!");
    setCarrinho([]);
    setCartOpen(false);
  };

  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
  };

  const produtosExemplo = [
    { id: 1, nome: "Smartphone", preco: 8999, imagem: "📱" },
    { id: 2, nome: "Notebook", preco: 12599, imagem: "💻" },
    { id: 3, nome: "Fone", preco: 1999, imagem: "🎧" },
  ];

  const total = carrinho.reduce((acc, id) => {
    const produto = produtosExemplo.find((p) => p.id === id);
    const qtd = quantidades[id] || 1;
    return produto ? acc + produto.preco * qtd : acc;
  }, 0);

  return (
    <>
      <header className="w-full border-b bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
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

            {/* SEARCH */}
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

            {/* NAV */}
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
              <div className="relative" ref={profileRef}>
                {logged && (
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <CgProfile size={24} />
                    </button>
                    <Link to={"/dashboard"}>
                      <Button>Voltar</Button>
                    </Link>
                  </div>
                )}

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
                ) || (
                  <div className="">
                    {!logged && (
                      <Link to={"/login"}>
                        <Button>Entrar</Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>

              <button
                className="relative p-2 rounded-full hover:bg-gray-100"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart size={22} />
                {carrinho.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {carrinho.length}
                  </span>
                )}
              </button>

              <button className="md:hidden" onClick={() => setOpen(!open)}>
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
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
              </div>
            </div>
          </div>
        )}
      </header>

      {/* CART MODAL */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Meu Carrinho ({carrinho.length})
              </h2>
              <button onClick={() => setCartOpen(false)} className="p-1">
                <X size={24} />
              </button>
            </div>

            {carrinho.length === 0 ? (
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
                  {carrinho.map((id) => {
                    const produto = produtosExemplo.find((p) => p.id === id);
                    if (!produto) return null;
                    const qtd = quantidades[id] || 1;

                    return (
                      <div key={id} className="flex items-center border-b py-4">
                        <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                          {produto.imagem}
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium">{produto.nome}</h3>
                          <p className="text-[#D4AF37] font-semibold">
                            KZ {produto.preco.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => handleQuantidade(id, "decrement")}
                              className="w-6 h-6 border rounded"
                            >
                              -
                            </button>
                            <span>{qtd}</span>
                            <button
                              onClick={() => handleQuantidade(id, "increment")}
                              className="w-6 h-6 border rounded"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removerDoCarrinho(id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <CgClose size={20} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>Total:</span>
                    <span>KZ {total.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={finalizarCompra}
                    className="w-full bg-[#D4AF37] text-white py-3 rounded-lg font-semibold hover:bg-[#c19b2c] transition"
                  >
                    Finalizar Compra
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Componente principal Landing Page
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

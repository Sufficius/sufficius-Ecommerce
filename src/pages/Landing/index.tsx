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
  Loader,
  ChevronLeft,
  Play,
  Pause,
} from "lucide-react";
import { CgProfile } from "react-icons/cg";
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
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  foto?: string;
  categoria?: string;
  vendas?: string;
  rating?: string;
}


const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};


const OptimizedImage = ({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error || !src) {
    return (

      <div
        className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`}
      >
        <Package className="size-12 text-gray-400" />
      </div>

    );
  }


  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 
          ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
      />
    </div>
  );
};

// Componente Header atualizado
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);

  const { user } = useAuthStore();

  const logged = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();


  const { data: countData, refetch: refetchCount } = useQuery({
    queryKey: ["cart-count"],
    queryFn: async () => {
      try {
        const result = await carrinhosRoute.countCartItems();
        return result;
      }
      catch (error) {
        return { totalItens: 0 };
      }
    },
    enabled: true,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: false,
  });


  useEffect(() => {
    const handleCartUpdate = () => {
      refetchCount();
    };
    window.addEventListener("cart-updated", handleCartUpdate);

    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, [refetchCount]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    navigate("/");
    toast.success("Até logo!");
  };

  const navItems = [
    { name: "Início", href: "#inicio" },
    { name: "Produtos", href: "#produtos" },
    { name: "Categorias", href: "#categorias" },
    { name: "Ofertas", href: "#ofertas" },
    { name: "Contato", href: "#contato" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? "bg-white/95 backdrop-blur-md shadow-lg"
        : "bg-transparent text-white"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex  items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="h-12 w-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="font-bold text-white text-xl">S</span>
            </motion.div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Sufficius
              </span>
              <span className="text-xs text-gray-500">Commerce</span>
            </div>
          </Link>

          <div className="hidden md:flex relative flex-1 max-w-md mx-8">
            <input
              type="search"
              placeholder="Pesquisar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${isScrolled ? "placeholder:text-gray-500" : "placeholder:text-white"} h-12 pl-12 pr-4 rounded-2xl border-1 border-gray-100 bg-white/50 backdrop-blur-sm focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all outline-none`}
            />
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isScrolled ? "text-gray-500" : "text-white"} w-5 h-5 `} />
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative hover:text-amber-500 font-medium transition-colors group">
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative flex gap-4" ref={profileRef}>
              {logged ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex gap-2 items-center p-2 rounded-full hover:bg-gray-100"
                >
                  <CgProfile size={24} />
                </motion.button>
              ) : (
                <Link to="/login">
                  <Button className="ml-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border-0 shadow-lg shadow-amber-500/30">
                    Entrar
                  </Button>
                </Link>
              )}

              <div className="gap-3">
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-white to-white hover:from-white hover:to-white text-yellow-600 border-0 shadow-amber-500/30">
                    Cadastrar-se
                  </Button>
                </Link>
              </div>

              <AnimatePresence>
                {profileOpen && logged && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-b">
                      <p className="font-semibold text-gray-900">
                        Olá, {user?.nome || "Cliente"}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-2">
                      {[{ name: "Meu Perfil", href: "/perfil" }].map((item) => (

                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setProfileOpen(false)}
                          className="block px-4 py-2 text-gray-700  hover:bg-amber-50 rounded-xl transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}

                      {user?.role === "ADMIN" && (
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="block px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors">
                          Dashboard Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-2 border-t"
                      >
                        Sair
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/checkout">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-amber-100 transiton-color cursor-pointer">
                  <ShoppingCart className="size-5 text-gray-700" />
                </div>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`
                  absolute -top-1 -right-1 min-w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg px-1 ${!countData?.totalItens || countData.totalItens === 0
                      ? "opacity-0 scale-0"
                      : "opacity-100 scale-100"
                    } transition-all duration-300
                  `}
                >
                  {countData?.totalItens || 0}
                </motion.span>
              </motion.div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden size-10 rounded-full flex items-center justify-center transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md"
            >
              <div className="p-4 space-y-4">
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Buscar produtos..."
                    className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-gray-100 focus:border-amber-400 outline-none"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                </div>

                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 text-gray-700 hover:bg-amber-50 rounded-xl transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();
  const logged = useAuthStore((state) => state.isAuthenticated);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const slides = [
    {
      id: 1,
      title: "Descubra a Nova Coleção",
      subtitle: "Tecnologia de Ponta",
      description: "Os lançamentos mais aguardados do ano com preços exclusivos",
      image: "https://images.unsplash.com/photo",
      cta: "Explorar Agora",
      color: "from-blue-600 to-purple-600"
    },
    {
      id: 2,
      title: "Ofertas Imperdíveis",
      subtitle: "Até 50% OFF",
      description: "Descontos especiais em produtos selecionados",
      image: "https://images.unsplash.com/photo",
      cta: "Aproveitar Ofertas",
      color: "from-amber-500 to-yellow-500"
    },
    {
      id: 3,
      title: "Moda e Estilo",
      subtitle: "Nova Temporada",
      description: "As últimas tendências em moda masculina e feminina",
      image: "https://images.unsplash.com/photo",
      cta: "Ver Coleção",
      color: "from-pink-500 to-rose-500",
    }
  ];


  useEffect(() => {
    let interval: any;

    if (isAutoPlay) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);


  const nextSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }

  const prevSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].color} mix-blend-multiply opacity-90`}
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="max-w-2xl text-white"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium mb-6"
          >
            {slides[currentSlide].subtitle}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            {slides[currentSlide].title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-white/90 mb-8"
          >
            {slides[currentSlide].description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4"
          >
            <button
              onClick={() =>
                logged ? navigate("/checkout")
                  : navigate("/login")
              }
              className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              {slides[currentSlide].cta}
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("produtos")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-4 border-2 border-white text-white rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Ver Produtos
            </button>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={prevSlide}
          className="size-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition">
          <ChevronLeft className="size-6" />
        </button>
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlay(false);
                setCurrentSlide(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80"
                }`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="size-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition">
          <ChevronRight className="size-6" />
        </button>
            <button
          onClick={()=> setIsAutoPlay(!isAutoPlay)}
          className="ml-4 size-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition">
          {isAutoPlay ? (
            <Pause className="size-6" />
          ) : (
            <Play className="size-6" />
          )
        }
        </button>
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
                <img
                  src={cat.name}
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
        <img
          src={cloudinaryPath}
          alt={produto.nome}
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
      return await carrinhosRoute.adicionarItem(produtoId as any);
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
                        className={`px-4 py-2 ${quantidade <= 1
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
                        className={`px-4 py-2 ${quantidade >= (produtoSelecionado.quantidade || 1)
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

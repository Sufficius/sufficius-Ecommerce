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
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Percent,
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
import { carrinhosRoute } from "@/modules/services/api/routes/carrinhos";
import { api } from "@/modules/services/api/axios";
import { motion, AnimatePresence } from "framer-motion";

// ============================================
// TIPOS
// ============================================
interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  foto?: string;
  categoria?: string;
  vendas?: number;
  rating?: number;
}

// ============================================
// ANIMAÇÕES
// ============================================
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// ============================================
// COMPONENTE DE IMAGEM OTIMIZADA
// ============================================
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
        <Package className="w-12 h-12 text-gray-400" />
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
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

// ============================================
// HEADER MODERNO
// ============================================
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);

  const { user } = useAuthStore();

  console.log("user no header:", user);

  const logged = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  
  const { data: countData, refetch: refetchCount } = useQuery({
    queryKey: ["cart-count"],
    queryFn: async () => {
      try {
        const result = await carrinhosRoute.countCartItems();
        console.log("🔍 countCartItems RAW result:", result);
        console.log("🔍 result.totalItens:", result?.totalItens);
        return result;
      } catch (error) {
        console.log("❌ countCartItems error:", error);
        return { totalItens: 0 };
      }
    },
    enabled: true,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: false,
  });

  console.log("Contagem do carrinho:", countData);

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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="h-12 w-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30"
            >
              <span className="font-bold text-white text-xl">S</span>
            </motion.div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Sufficius
              </span>
              <span className="text-xs text-gray-500">Premium Commerce</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex relative flex-1 max-w-md mx-8">
            <input
              type="search"
              placeholder="Buscar produtos incríveis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${isScrolled ? "placeholder:text-gray-500" : "placeholder:text-white"} h-12 pl-12 pr-4 rounded-2xl border-2 border-gray-100 bg-white/50 backdrop-blur-sm focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all outline-none`}
            />
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${isScrolled ? "text-gray-500" : "text-white"}  w-5 h-5`}
            />
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative hover:text-amber-500 font-medium transition-colors group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Profile */}
            <div className="relative" ref={profileRef}>
              {logged ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="relative w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30"
                >
                  <CgProfile size={20} />
                </motion.button>
              ) : (
                <Link to="/login">
                  <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border-0 shadow-lg shadow-amber-500/30">
                    Entrar
                  </Button>
                </Link>
              )}

              {/* Profile Menu */}
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
                          className="block px-4 py-2 text-gray-700 hover:bg-amber-50 rounded-xl transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                      {user?.role === "ADMIN" && (
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="block px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                        >
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

            {/* Cart */}
            <Link to="/checkout">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-amber-100 transition-colors cursor-pointer">
                  <ShoppingCart className="w-5 h-5 text-gray-700" />
                </div>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`
                      absolute -top-1 -right-1 min-w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg px-1 ${
                        !countData?.totalItens || countData.totalItens === 0
                          ? "opacity-0 scale-0"
                          : "opacity-100 scale-100"
                      } transition-all duration-300
                      `}
                >
                  {countData?.totalItens || 0}
                </motion.span>
              </motion.div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-amber-100 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
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
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
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

// ============================================
// HERO SECTION CINEMATOGRÁFICA
// ============================================
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
      description:
        "Os lançamentos mais aguardados do ano com preços exclusivos",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format",
      cta: "Explorar Agora",
      color: "from-blue-600 to-purple-600",
    },
    {
      id: 2,
      title: "Ofertas Imperdíveis",
      subtitle: "Até 50% OFF",
      description: "Descontos especiais em produtos selecionados",
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format",
      cta: "Aproveitar Ofertas",
      color: "from-amber-500 to-yellow-500",
    },
    {
      id: 3,
      title: "Moda e Estilo",
      subtitle: "Nova Temporada",
      description: "As últimas tendências em moda masculina e feminina",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&auto=format",
      cta: "Ver Coleção",
      color: "from-pink-500 to-rose-500",
    },
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
  };

  const prevSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Slides */}
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

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-white"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium mb-6"
          >
            ✨ {slides[currentSlide].subtitle}
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
                logged ? navigate("/checkout") : navigate("/login")
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

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlay(false);
                setCurrentSlide(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className="ml-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition"
        >
          {isAutoPlay ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>
      </div>
    </section>
  );
};

// ============================================
// FEATURES SECTION COM ÍCONES ANIMADOS
// ============================================
const Features = () => {
  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Entrega Relâmpago",
      description: "Receba em até 24h",
      color: "from-blue-500 to-cyan-500",
      stats: "10k+ entregas",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Compra Segura",
      description: "Garantia de 30 dias",
      color: "from-green-500 to-emerald-500",
      stats: "100% protegido",
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Pagamento Flexível",
      description: "12x sem juros",
      color: "from-purple-500 to-pink-500",
      stats: "todas as bandeiras",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Suporte Premium",
      description: "24/7 especializado",
      color: "from-amber-500 to-orange-500",
      stats: "atendimento humanizado",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              <div
                className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-3">{feature.description}</p>
              <p className="text-sm font-semibold text-amber-500">
                {feature.stats}
              </p>

              <div
                className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} w-0 group-hover:w-full transition-all duration-500`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// PRODUTOS SECTION COM GRID MODERNO
// ============================================
const ProductsSection = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: produtos, isLoading } = useQuery({
    queryKey: ["produtos"],
    queryFn: async () => {
      const response = await api.get("/produtos/get");
      return response.data;
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: (data: any) => carrinhosRoute.adicionarItem(data),
    onSuccess: () => {
      toast.success("Produto adicionado ao carrinho!");
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });
      window.dispatchEvent(new Event("cart-updated"));
      setSelectedProduct(null);
      setQuantity(1);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao adicionar produto");
    },
  });

  const getProdutosArray = (): Product[] => {
    if (!produtos) return [];
    if (produtos?.data && Array.isArray(produtos.data)) return produtos.data;
    if (Array.isArray(produtos)) return produtos;
    return [];
  };

  const produtosArray = getProdutosArray();

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-96 bg-gray-100 rounded-3xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="produtos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-amber-100 text-amber-600 rounded-full text-sm font-medium mb-4">
            🛍️ Produtos em Destaque
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Os Mais Vendidos da{" "}
            <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
              Semana
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Confira os produtos que estão fazendo sucesso entre nossos clientes
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {produtosArray.map((produto: Product, index: number) => (
            <motion.div
              key={produto.id}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                {index === 0 && (
                  <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold rounded-full shadow-lg">
                    🔥 Mais Vendido
                  </span>
                )}
                {produto.quantidade > 0 && produto.quantidade < 5 && (
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                    Últimas {produto.quantidade} unidades
                  </span>
                )}
              </div>

              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <OptimizedImage
                  src={
                    produto.foto ||
                    `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format`
                  }
                  alt={produto.nome}
                  className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                />

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-amber-500 hover:text-white transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedProduct(produto)}
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-amber-500 hover:text-white transition-colors"
                  >
                    <BsEye className="w-4 h-4" />
                  </button>
                </div>

                {/* Discount Badge */}
                {index === 1 && (
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-full shadow-lg">
                    -20% OFF
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold mb-1 line-clamp-1">
                      {produto.nome}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {produto.descricao}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-2xl font-bold text-amber-500">
                      {produto.preco?.toLocaleString("pt-AO", {
                        style: "currency",
                        currency: "AOA",
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      ou 12x de{" "}
                      {(produto.preco / 12).toLocaleString("pt-AO", {
                        style: "currency",
                        currency: "AOA",
                      })}
                    </p>
                  </div>

                  {user ? (
                    <button
                      onClick={() =>
                        addToCartMutation.mutate({
                          produtoId: produto.id,
                          quantidade: 1,
                        })
                      }
                      disabled={addToCartMutation.isPending}
                      className="p-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
                    >
                      <FiShoppingCart className="w-5 h-5" />
                    </button>
                  ) : (
                    <Link to="/login">
                      <button className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-amber-500 hover:text-white transition-colors">
                        <FiShoppingCart className="w-5 h-5" />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/produtos">
            <button className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-2xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              Ver Todos os Produtos
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* Image */}
                <div className="space-y-4">
                  <div className="h-96 rounded-2xl overflow-hidden bg-gray-100">
                    <OptimizedImage
                      src={
                        selectedProduct.foto ||
                        `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format`
                      }
                      alt={selectedProduct.nome}
                      className="w-full h-full"
                      priority
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      {selectedProduct.nome}
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-5 h-5 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <span className="text-gray-600">(150 avaliações)</span>
                    </div>
                  </div>

                  <p className="text-gray-600">{selectedProduct.descricao}</p>

                  <div className="border-t border-b py-4">
                    <div className="flex items-baseline gap-4">
                      <span className="text-4xl font-bold text-amber-500">
                        {selectedProduct.preco?.toLocaleString("pt-AO", {
                          style: "currency",
                          currency: "AOA",
                        })}
                      </span>
                      <span className="text-gray-500 line-through">
                        {(selectedProduct.preco * 1.2).toLocaleString("pt-AO", {
                          style: "currency",
                          currency: "AOA",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border-2 rounded-xl">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          disabled={
                            quantity >= (selectedProduct.quantidade || 99)
                          }
                          className="px-4 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm text-gray-600">
                        {selectedProduct.quantidade || 99} unidades disponíveis
                      </span>
                    </div>

                    <div className="flex gap-3">
                      {user ? (
                        <button
                          onClick={() =>
                            addToCartMutation.mutate({
                              produtoId: selectedProduct.id,
                              quantidade: quantity,
                            })
                          }
                          disabled={addToCartMutation.isPending}
                          className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                        >
                          {addToCartMutation.isPending
                            ? "Adicionando..."
                            : "Adicionar ao Carrinho"}
                        </button>
                      ) : (
                        <Link to="/login" className="flex-1">
                          <button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                            Faça login para comprar
                          </button>
                        </Link>
                      )}
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="px-8 py-4 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// ============================================
// CATEGORIAS SECTION
// ============================================
const CategoriesSection = () => {
  const { data: categorias, isLoading } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const response = await api.get("/categorias");
      return response.data;
    },
  });

  const getCategoriasArray = () => {
    if (!categorias) return [];
    if (categorias?.data && Array.isArray(categorias.data))
      return categorias.data;
    if (Array.isArray(categorias)) return categorias;
    return [];
  };

  const categoriasArray = getCategoriasArray();

  const categoryColors = [
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-purple-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-red-500 to-rose-500",
    "from-indigo-500 to-blue-500",
  ];

  return (
    <section
      id="categorias"
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-amber-100 text-amber-600 rounded-full text-sm font-medium mb-4">
            📂 Categorias
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Navegue por{" "}
            <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
              Categorias
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Encontre exatamente o que procura em nossas categorias organizadas
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {categoriasArray.map((cat: any, index: number) => (
              <motion.div
                key={cat.id}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="group relative cursor-pointer"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${categoryColors[index % categoryColors.length]} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="relative bg-white border-2 border-gray-100 rounded-2xl p-6 text-center group-hover:border-transparent transition-all duration-300">
                  <div
                    className={`w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br ${categoryColors[index % categoryColors.length]} flex items-center justify-center text-white text-2xl font-bold`}
                  >
                    {cat.nome.charAt(0)}
                  </div>
                  <h3 className="font-semibold mb-1">{cat.nome}</h3>
                  <p className="text-sm text-gray-500">
                    {cat?.Produto?.length || 0} produtos
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

// ============================================
// PROMO BANNER
// ============================================
const PromoBanner = () => (
  <section className="py-20">
    <div className="max-w-7xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-gradient-to-r from-amber-500 to-yellow-500 rounded-3xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />

        <div className="relative px-8 py-16 text-center text-white">
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <Percent className="w-12 h-12" />
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Ofertas Exclusivas
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Cupons de desconto de até 40% para novos clientes
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <button className="px-8 py-4 bg-white text-amber-500 rounded-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              GARANTIR DESCONTO
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);

// ============================================
// TESTIMONIALS SECTION
// ============================================
const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Maria Silva",
      role: "Cliente há 2 anos",
      content:
        "Simplesmente incrível! A qualidade dos produtos e a rapidez na entrega superaram minhas expectativas.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      id: 2,
      name: "João Santos",
      role: "Cliente há 1 ano",
      content:
        "Melhor loja online que já comprei. Atendimento excepcional e produtos de primeira linha.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 3,
      name: "Ana Oliveira",
      role: "Cliente há 3 anos",
      content:
        "Preços justos e variedade incrível. Sempre encontro o que preciso e ainda ganho desconto!",
      rating: 5,
      image:
        "https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?w=100&auto=format",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-amber-100 text-amber-600 rounded-full text-sm font-medium mb-4">
            ⭐ Depoimentos
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            O que nossos{" "}
            <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
              clientes
            </span>{" "}
            dizem
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-3xl rounded-tr-3xl" />

              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <p className="text-gray-700 italic">"{testimonial.content}"</p>

              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 w-0 group-hover:w-full transition-all duration-500 rounded-b-3xl" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// NEWSLETTER SECTION
// ============================================
const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Inscrição realizada com sucesso!");
    setEmail("");
  };

  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Mail className="w-16 h-16 mx-auto mb-6 text-amber-500" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Fique por dentro
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Receba ofertas exclusivas e lançamentos diretamente no seu email
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor email"
              className="flex-1 h-14 px-6 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-amber-500/50"
              required
            />
            <button
              type="submit"
              className="h-14 px-8 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Inscrever-se
            </button>
          </form>

          <p className="text-sm text-gray-400 mt-4">
            Ao se inscrever, você concorda com nossa Política de Privacidade
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// FOOTER MODERNO
// ============================================
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contato" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center">
                <span className="font-bold text-white text-xl">S</span>
              </div>
              <span className="text-xl font-bold">Sufficius</span>
            </div>
            <p className="text-gray-400 mb-6">
              Sua loja online de confiança para produtos de qualidade premium.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-amber-500 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Loja",
              links: ["Produtos", "Categorias", "Ofertas", "Lançamentos"],
            },
            {
              title: "Suporte",
              links: ["FAQ", "Trocas", "Entregas", "Contato"],
            },
            {
              title: "Contato",
              links: [
                { icon: Phone, text: "+244 957 249 674" },
                { icon: Mail, text: "contato@sufficius.com" },
                { icon: MapPin, text: "Luanda, Angola" },
              ],
            },
          ].map((section, idx) => (
            <div key={idx}>
              <h3 className="font-bold text-lg mb-6">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((item, index) => {
                  if (typeof item === "string") {
                    return (
                      <li key={index}>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-amber-500 transition-colors"
                        >
                          {item}
                        </a>
                      </li>
                    );
                  }
                  const Icon = item.icon;
                  return (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-gray-400"
                    >
                      <Icon className="w-5 h-5 text-amber-500" />
                      <span>{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>
            © {currentYear} Sufficius Commerce. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <Features />
        <ProductsSection />
        <CategoriesSection />
        <PromoBanner />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

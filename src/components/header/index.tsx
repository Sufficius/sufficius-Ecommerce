"use client";

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, Grid, List } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CgClose } from "react-icons/cg";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { carrinho, removerDoCarrinho, produtos } = useCart();
  const [quantidades, setQuantidades] = useState<Record<number, number>>({}); // id -> quantidade

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const user = localStorage.getItem("token");

  const handleChange = (value: string) => {
    if (!value.trim()) {
      navigate("/", { replace: true });
    } else {
      navigate(`/?q=${encodeURIComponent(value)}`, { replace: true });
    }
  };

  // Incrementa ou decrementa a quantidade
  const handleQuantidade = (id: number, action: "increment" | "decrement") => {
    setQuantidades((prev) => {
      const atual = prev[id] || 1;
      const nova = action === "increment" ? atual + 1 : atual > 1 ? atual - 1 : 1;
      return { ...prev, [id]: nova };
    });
  };

  // Calcula total do carrinho
  const total = carrinho.reduce((acc, id) => {
    const produto = produtos.find((p) => p.id === id);
    const qtd = quantidades[id] || 1;
    return produto ? acc + produto.preco * qtd : acc;
  }, 0);

  // Finalizar compra
  const finalizarCompra = () => {
    const items = carrinho.map((id) => {
      const produto = produtos.find((p) => p.id === id);
      return produto
        ? { id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: quantidades[id] || 1 }
        : null;
    }).filter(Boolean);
    navigate("/pagamento", { state: { items } });
    setCartOpen(false);
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="h-9 w-9 rounded-full" />
            <div className="flex flex-col">
              <span className="font-semibold text-[#d4af37] text-lg">Sufficius</span>
              <p className="text-xs text-gray-400 truncate max-w-[120px]">{user}</p>
            </div>
          </div>

          {/* SEARCH DESKTOP */}
          <div className="hidden md:flex relative w-full max-w-md mx-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Pesquisar produtos"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full rounded-lg border pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          {/* MENU DESKTOP */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
            <a href="#" className="hover:text-black">E-commerce</a>
            <a href="#" className="hover:text-black">Vendas</a>
            <a href="#" className="hover:text-black">Homens</a>
            <a href="#" className="hover:text-black">Mulheres</a>
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            {/* CART */}
            <button className="relative hover:text-black" onClick={() => setCartOpen(true)}>
              <ShoppingCart size={20} />
              {carrinho.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {carrinho.length}
                </span>
              )}
            </button>

            {/* MOBILE MENU BUTTON */}
            <button className="md:hidden" onClick={() => setOpen(!open)}>
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL CARRINHO */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Meu Carrinho ({carrinho.length})</h2>
              <button onClick={() => setCartOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>

            {/* Toggle Grid/List */}
            <div className="flex gap-2 mb-4">
              <button onClick={() => setViewMode("grid")} className={`p-1 rounded ${viewMode === "grid" ? "bg-gray-200" : ""}`}>
                <Grid size={20} />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-1 rounded ${viewMode === "list" ? "bg-gray-200" : ""}`}>
                <List size={20} />
              </button>
            </div>

            {/* Lista de produtos */}
            {carrinho.length === 0 ? (
              <p className="text-center text-gray-500">Seu carrinho está vazio</p>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}>
                {carrinho.map((id) => {
                  const produto = produtos.find((p) => p.id === id);
                  if (!produto) return null;
                  const qtd = quantidades[id] || 1;
                  return (
                    <div key={id} className={`flex items-center border p-2 rounded ${viewMode === "grid" ? "flex-col" : "flex-row"}`}>
                      <div className="w-24 h-24 flex items-center justify-center bg-gray-50 rounded-md overflow-hidden">
                        {produto.imagem}
                      </div>
                      <div className="flex-1 ml-2">
                        <h3 className="font-bold">{produto.nome}</h3>
                        <p className="text-gray-500">{produto.descricao}</p>
                        <p className="text-[#D4AF37] font-semibold">{produto.preco.toLocaleString()} KZ</p>

                        {/* Quantidade */}
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => handleQuantidade(id, "decrement")} className="bg-gray-800 text-white w-8 h-8 rounded-md">-</button>
                          <span className="w-8 text-center">{qtd}</span>
                          <button onClick={() => handleQuantidade(id, "increment")} className="bg-gray-800 text-white w-8 h-8 rounded-md">+</button>
                        </div>
                      </div>
                      <button onClick={() => removerDoCarrinho(id)} className="text-red-500 hover:text-red-700 mt-2 md:mt-0">
                        <CgClose size={20} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Total e finalizar */}
            {carrinho.length > 0 && (
              <div className="mt-4 flex justify-between items-center">
                <span className="font-bold text-lg">Total: {total.toLocaleString()} KZ</span>
                <button
                  onClick={finalizarCompra}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition"
                >
                  Finalizar Compra
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

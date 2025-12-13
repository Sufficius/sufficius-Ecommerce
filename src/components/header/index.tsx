"use client";

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const [open, setOpen] = useState(false);
  const {carrinho} = useCart();

  const navigate = useNavigate();
  const [params] = useSearchParams();

  const query = params.get("q") || "";
  const user = localStorage.getItem("token");

  // 🔍 pesquisa em tempo real
  const handleChange = (value: string) => {
    if (!value.trim()) {
      navigate("/", { replace: true });
    } else {
      navigate(`/?q=${encodeURIComponent(value)}`, { replace: true });
    }
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="h-9 w-9 rounded-full"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-[#d4af37] text-lg">
                Sufficius
              </span>
              <p className="text-xs text-gray-400 truncate max-w-[120px]">
                {user}
              </p>
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
            <button className="relative hover:text-black">
              <ShoppingCart size={20} />
              {carrinho.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {carrinho.length}
                </span>
              )}
            </button>

            {/* MOBILE MENU BUTTON */}
            <button
              className="md:hidden"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* SEARCH MOBILE */}
        <div className="md:hidden py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Pesquisar produtos"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full rounded-lg border pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden border-t py-4 space-y-3 text-sm">
            <a href="#" className="block text-gray-700">E-commerce</a>
            <a href="#" className="block text-gray-700">Vendas</a>
            <a href="#" className="block text-gray-700">Homens</a>
            <a href="#" className="block text-gray-700">Mulheres</a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

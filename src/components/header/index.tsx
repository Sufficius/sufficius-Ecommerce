"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
} from "lucide-react";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const user = localStorage.getItem("token");

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!query.trim()) return;

    // 👉 por agora apenas log
    console.log("Pesquisar por:", query);

    // EXEMPLOS FUTUROS:
    // navigate(`/pesquisa?q=${query}`);
    // fetchProdutos(query);

    setQuery("");
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
          <form
            onSubmit={handleSearch}
            className="hidden md:flex relative w-full max-w-md mx-6"
          >
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={() => handleSearch()}
            />
            <input
              type="search"
              placeholder="Pesquisar produtos"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </form>

          {/* NAV DESKTOP */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
            <a href="#" className="hover:text-black">E-commerce</a>
            <a href="#" className="hover:text-black">Vendas</a>
            <a href="#" className="hover:text-black">Homens</a>
            <a href="#" className="hover:text-black">Mulheres</a>
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            <button title="Carrinho" className="relative hover:text-black">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </button>

            <button
              className="md:hidden"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* SEARCH MOBILE */}
        <form
          onSubmit={handleSearch}
          className="md:hidden py-3"
        >
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={() => handleSearch()}
            />
            <input
              type="search"
              placeholder="Pesquisar produtos"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </form>

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

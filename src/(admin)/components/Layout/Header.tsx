"use client";

import { Bell, Search, Menu, Settings } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Menu button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search bar */}
        <div className="flex-1 max-w-lg mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Buscar no painel..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-gray-100">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Settings className="h-5 w-5" />
          </button>

          <div className="h-8 w-8 bg-[#D4AF37] rounded-full flex items-center justify-center">
            <span className="font-bold text-white text-sm">A</span>
          </div>
        </div>
      </div>
    </header>
  );
}
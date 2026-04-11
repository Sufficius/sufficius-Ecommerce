"use client";

import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  LogOut,
  TrendingUp,
  CreditCard,
  Shield,
} from "lucide-react";
import { useAuthStore } from "@/modules/services/store/auth-store";
import { BiCategory } from "react-icons/bi";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const [activeSection, setActiveSection] = useState("dashboard");

  const menuItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      path: "/dashboard",
      section: "dashboard",
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: "Produtos",
      path: "/produtos",
      section: "produtos",
    },
    {
      icon: <BiCategory className="h-5 w-5" />,
      label: "Categorias",
      path: "/categorias",
      section: "categorias",
    },
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      label: "Pedidos",
      path: "/pedidos",
      section: "pedidos",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Usuários",
      path: "/usuarios",
      section: "usuarios",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      label: "Estoque",
      path: "/estoque",
      section: "estoque",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: "Pagamentos",
      path: "/pagamentos",
      section: "pagamentos",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Relatórios",
      path: "/relatorios",
      section: "relatorios",
    },
  ];

  const logout = useAuthStore((state) => state.logout);
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex flex-col h-full bg-white border-r" itemScope={isOpen}>
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-[#D4AF37] rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div className="ml-3">
            <div className="font-bold text-gray-900">Sufficius Admin</div>
            <div className="text-xs text-gray-500">Painel de Controle</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setActiveSection(item.section)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive || activeSection === item.section
                    ? "bg-[#D4AF37] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}

            <div className="space-y-1">
        </div>

        <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
        </div>

        {/* Separador */}
      </nav>      
    </div>
  );
}

"use client";

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  TrendingUp,
  CreditCard,
  Shield,
  Home,
} from "lucide-react";
import { toast } from "sonner";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");

  const menuItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      path: "/admin/dashboard",
      section: "dashboard",
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: "Produtos",
      path: "/admin/produtos",
      section: "produtos",
    },
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      label: "Pedidos",
      path: "/admin/pedidos",
      section: "pedidos",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Usuários",
      path: "/admin/usuarios",
      section: "usuarios",
    },
    {
      icon: <Tag className="h-5 w-5" />,
      label: "Cupons",
      path: "/admin/cupons",
      section: "cupons",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      label: "Estoque",
      path: "/admin/estoque",
      section: "estoque",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: "Pagamentos",
      path: "/admin/pagamentos",
      section: "pagamentos",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Relatórios",
      path: "/admin/relatorios",
      section: "relatorios",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Configurações",
      path: "/admin/configuracoes",
      section: "configuracoes",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminName");
    localStorage.removeItem("token");
    toast.success("Logout efetuado!");
    // window.location.reload();
    navigate("/admin/login");
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
        </div>

        {/* Separador */}
        <div className="my-6 border-t"></div>

        {/* Links rápidos */}
        <div className="space-y-1">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Ir para Loja</span>
          </button>
        </div>
      </nav>

      {/* Perfil e Logout */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
            <span className="font-bold text-[#D4AF37]">A</span>
          </div>
          <div className="flex-1">
            <div className="font-medium">Administrador</div>
            <div className="text-xs text-gray-500">Super Admin</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
}

import AdminLayout from "@/(admin)/components/Layout/Layout";
import ConfiguracoesPage from "@/(admin)/pages/Configuracoes";
import AdminCupons from "@/(admin)/pages/Cupons";
import AdminDashboard from "@/(admin)/pages/Dashboard";
import AdminEstoque from "@/(admin)/pages/Estoque";
import PagamentosPage from "@/(admin)/pages/Pagamentos";
import AdminPedidos from "@/(admin)/pages/Pedidos";
import AdminProdutos from "@/(admin)/pages/Produtos";
import RelatoriosPage from "@/(admin)/pages/Relatorios";
import AdminUsuarios from "@/(admin)/pages/Usuarios";
import { NotFound } from "@/pages/not-found";
export const HomesRoutes: IRouteProps = {
  path: "/admin",
  element: AdminLayout,
  visibility: "private", // Mude de "auth" para "private"
  children: [
    {
      path: "/admin/dashboard",
      element: AdminDashboard,
      visibility: "private", // Mude para "private"
    },
    {
      path: "/admin/produtos",
      element: AdminProdutos,
      visibility: "private", // Mude para "private"
    },
    {
      path: "/admin/pedidos",
      element: AdminPedidos,
      visibility: "private", // Mude para "private"
    },
    {
      path: "/admin/usuarios",
      element: AdminUsuarios,
      visibility: "private", // Mude para "private"
    },
    {
      path: "/admin/cupons",
      element: AdminCupons,
      visibility: "private", // Mude para "private"
    },
    {
      path: "/admin/estoque",
      element: AdminEstoque,
      visibility: "private", // Mude para "private"
    },
    {
      path: "/admin/pagamentos",
      element: PagamentosPage,
      visibility: "private", // Mude para "private"
    },
    {
      path: "/admin/relatorios",
      element: RelatoriosPage,
      visibility: "private", // Mude para "private"
    },
    {
      path: "/admin/configuracoes",
      element: ConfiguracoesPage,
      visibility: "private", // Mude para "private"
    },
    {
      path: "*",
      element: NotFound,
      visibility: "public",
    },
  ],
};
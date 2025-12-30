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
import { IRouteProps } from "@/interfaces/routes/route";
import { NotFound } from "@/pages/not-found";

export const HomesRoutes: IRouteProps = {
  path: "/",
  element: AdminLayout,
  visibility: "public", // Mude de "auth" para "private"
  children: [
       {
      path: "/",
      element: AdminDashboard,
      visibility: "guest", // Mude para "private"
    },
    {
      path: "/dashboard",
      element: AdminDashboard,
      visibility: "auth", // Mude para "private"
    },
    {
      path: "/produtos",
      element: AdminProdutos,
      visibility: "auth", // Mude para "auth"
    },
    {
      path: "/pedidos",
      element: AdminPedidos,
      visibility: "auth", // Mude para "auth"
    },
    {
      path: "/usuarios",
      element: AdminUsuarios,
      visibility: "auth", // Mude para "auth"
    },
    {
      path: "/cupons",
      element: AdminCupons,
      visibility: "auth", // Mude para "auth"
    },
    {
      path: "/estoque",
      element: AdminEstoque,
      visibility: "auth", // Mude para "auth"
    },
    {
      path: "/pagamentos",
      element: PagamentosPage,
      visibility: "auth", // Mude para "auth"
    },
    {
      path: "/relatorios",
      element: RelatoriosPage,
      visibility: "auth", // Mude para "auth"
    },
    {
      path: "/configuracoes",
      element: ConfiguracoesPage,
      visibility: "auth", // Mude para "auth"
    },
    {
      path: "*",
      element: NotFound,
      visibility: "public",
    },
  ],
};
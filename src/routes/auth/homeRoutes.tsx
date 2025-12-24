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
  visibility: "auth",
  children: [
    {
      path: "/admin/dashboard",
      element: AdminDashboard,
      visibility: "auth",
    },
    {
      path: "/admin/produtos",
      element: AdminProdutos,
      visibility: "auth",
    },
    {
      path: "/admin/pedidos",
      element: AdminPedidos,
      visibility: "auth",
    },
    {
      path: "/admin/usuarios",
      element: AdminUsuarios,
      visibility: "auth",
    },
    {
      path: "/admin/cupons",
      element: AdminCupons,
      visibility: "auth",
    },
    {
      path: "/admin/estoque",
      element: AdminEstoque,
      visibility: "auth",
    },
    {
      path: "/admin/pagamentos",
      element: PagamentosPage,
      visibility: "auth",
    },
    {
      path: "/admin/relatorios",
      element: RelatoriosPage,
      visibility: "auth",
    },
    // {
    //   path: "/permissoes",
    //   element: Permissoes,
    //   visibility: "auth",
    // },
    {
      path: "/admin/configuracoes",
      element: ConfiguracoesPage,
      visibility: "auth",
    },
    {
      path: "*",
      element: NotFound,
      visibility: "public",
    },
  ],
};

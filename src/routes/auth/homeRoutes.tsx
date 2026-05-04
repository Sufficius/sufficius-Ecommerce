import AdminLayout from "@/(admin)/components/Layout/Layout";
import CategoryPage from "@/(admin)/pages/Categorias";
// import ConfiguracoesPage from "@/(admin)/pages/Configuracoes";
// import AdminCupons from "@/(admin)/pages/Cupons";
import AdminDashboard from "@/(admin)/pages/Dashboard";
import DetalhesPedido from "@/(admin)/pages/DetalhesPedido";
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
      visibility: "private", // Mude para "private"
    },
    {
      path: "/produtos",
      element: AdminProdutos,
      // element: NotFound,
      visibility: "private", 
    },
    {
      path: "/pedidos",
      element: AdminPedidos,
      visibility: "private", 
    },
    {
      path: "/pedidos/:id",
      element: DetalhesPedido,
      visibility: "private",
    },
    {
      path: "/usuarios",
      element: AdminUsuarios,
      visibility: "private", 
    },
    {
      path: "/estoque",
      element: AdminEstoque,
      visibility: "private", 
    },
    {
      path: "/pagamentos",
      element: PagamentosPage,
      visibility: "private", 
    },
    {
      path: "/relatorios",
      element: RelatoriosPage,
      visibility: "private", 
    },
    {
      path: "/categorias",
      element: CategoryPage,
      visibility: "private", 
    },
    {
      path: "*",
      element: NotFound,
      visibility: "public",
    },
  ],
};

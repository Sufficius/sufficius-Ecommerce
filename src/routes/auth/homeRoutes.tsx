import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import { HomeLayout } from "@/pages/layout/homeLayout";
import { NotFound } from "@/pages/not-found";

export const HomesRoutes: IRouteProps = {
  path: "/",
  element: HomeLayout,
  visibility: "auth",
  children: [
    {
      path: "/",
      element: Landing,
      visibility: "auth",
    },
    {
      path: "/dashboard",
      element: Dashboard,
      visibility: "auth",
    },
    // {
    //     path: "/clientes",
    //   element: Clientes,
    //   visibility: "private",
    // },
    // {
    //   path: "/produtos",
    //   element: Produtos,
    //   visibility: "private",
    // },
    // {
    //   path: "/usuarios",
    //   element: Usuarios,
    //   visibility: "private",
    // },
    // {
    //   path: "/estoque",
    //   element: Estoque,
    //   visibility: "private",
    // },
    // {
    //   path: "/relatorios",
    //   element: Relatorios,
    //   visibility: "private",
    // },
    // {
    //   path: "/logs",
    //   element: Logs,
    //   visibility: "private",
    // },
    // {
    //   path: "/backups",
    //   element: Backups,
    //   visibility: "private",
    // },
    // {
    //   path: "/permissoes",
    //   element: Permissoes,
    //   visibility: "private",
    // },
    // {
    //   path: "/settings",
    //   element: Configuracoes,
    //   visibility: "private",
    // },
    {
      path: "*",
      element: NotFound,
      visibility: "public",
    },
  ],
};

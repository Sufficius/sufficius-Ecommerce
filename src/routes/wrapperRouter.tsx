// wrapperRouter.tsx
import { lazy } from "react";

// Lazy loading para melhor performance
const AdminLayout = lazy(() => import("@/(admin)/components/Layout/Layout"));
const AdminDashboard = lazy(() => import("@/(admin)/pages/Dashboard"));
const AdminProdutos = lazy(() => import("@/(admin)/pages/Produtos"));
const AdminPedidos = lazy(() => import("@/(admin)/pages/Pedidos"));
const AdminUsuarios = lazy(() => import("@/(admin)/pages/Usuarios"));
const AdminLogin = lazy(() => import("@/(admin)/pages/Login"));
const AuthLayout = lazy(() => import("@/pages/layout/authLayout"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/Landing"));
const Proposta = lazy(() => import("@/pages/Begin"));

export const WrapperRoutes = (): IRouteProps[] => {
  return [
    // Rota pública (home)
    {
      path: "/",
      element: Home,
      visibility: "public",
    },

    // Rota de login
    {
      path: "/login",
      element: AuthLayout,
      visibility: "auth",
      children: [
        {
          index: true,
          element: AdminLogin,
          visibility: "auth",
        },
        {
          path: "*",
          element: NotFound,
          visibility: "public",
        },
      ],
    },

    // Rota privada para clientes
    {
      path: "/proposta",
      element: Proposta,
      visibility: "private",
    },

    // Rotas do ADMIN (organizadas corretamente)
    {
      path: "/admin",
      element: AdminLayout,
      visibility: "private", // IMPORTANTE: private, não auth!
      children: [
        {
          index: true, // /admin
          element: AdminDashboard,
          visibility: "private",
        },
        {
          path: "dashboard", // /admin/dashboard
          element: AdminDashboard,
          visibility: "private",
        },
        {
          path: "produtos", // /admin/produtos
          element: AdminProdutos,
          visibility: "private",
        },
        {
          path: "pedidos", // /admin/pedidos
          element: AdminPedidos,
          visibility: "private",
        },
        {
          path: "usuarios", // /admin/usuarios
          element: AdminUsuarios,
          visibility: "private",
        },
        {
          path: "*",
          element: NotFound,
          visibility: "public",
        },
      ],
    },

    // Rota 404 (sempre último)
    {
      path: "*",
      element: NotFound,
      visibility: "public",
    },
  ];
};

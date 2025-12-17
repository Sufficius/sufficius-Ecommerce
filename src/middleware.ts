// middleware/authMiddleware.ts
import { NavigateFunction } from 'react-router-dom';

// Tipos
type Role = "ADMIN" | "GESTOR" | "OPERADOR";

// Configurações de rotas
export const publicRoutes = ["/", "/auth/forgot-password", "/auth/forgot-password/change-password", "/auth/signup"];

export const protectedRoutes = [
  { path: "/dashboard", roles: ["ADMIN", "OPERADOR"] },
  { path: "/schedule/new", roles: ["GESTOR"] },
  { path: "/schedule/request", roles: ["GESTOR"] },
  { path: "/schedule/completed", roles: ["GESTOR", "ADMIN"] },
  { path: "/patient", roles: ["GESTOR", "ADMIN", "OPERADOR"] },
  { path: "/patient/:id", roles: ["GESTOR", "ADMIN", "OPERADOR"] },
  { path: "/patient/:id/exam-history", roles: ["GESTOR", "ADMIN", "OPERADOR"] },
  { path: "/patient/:id/next-exam", roles: ["GESTOR", "ADMIN", "OPERADOR"] },
  { path: "/patient/:id/ready-exam", roles: ["ADMIN", "OPERADOR"] },
  { path: "/team-management", roles: ["ADMIN", "OPERADOR"] },
  { path: "/payment", roles: ["GESTOR"] },
  { path: "/message", roles: ["GESTOR", "ADMIN", "OPERADOR"] },
  { path: "/setting", roles: ["ADMIN"] },
  { path: "/profile", roles: ["GESTOR", "ADMIN", "OPERADOR"] },
  { path: "/logout", roles: ["GESTOR", "ADMIN", "OPERADOR"] },
];

export const ScreenToRendirectWhenLogin: Record<Role, string[]> = {
  ADMIN: [
    "/dashboard",
    "/schedule/new",
    "/schedule/completed",
    "/schedule/request",
    "/patient",
    "/patient/:id",
    "/patient/:id/exam-history",
    "/patient/:id/next-exam",
    "/patient/:id/ready-exam",
    "/team-management",
    "/payment",
    "/message",
    "/setting",
    "/profile",
    "/logout"
  ],
  GESTOR: [
    "/schedule/new",
    "/schedule/completed",
    "/schedule/request",
    "/patient",
    "/patient/:id",
    "/patient/:id/exam-history",
    "/patient/:id/next-exam",
    "/patient/:id/ready-exam",
    "/payment",
    "/message",
    "/setting",
    "/profile",
    "/logout"
  ],
  OPERADOR: [
    "/dashboard",
    "/schedule/completed",
    "/patient",
    "/patient/:id",
    "/patient/:id/exam-history",
    "/patient/:id/next-exam",
    "/patient/:id/ready-exam",
    "/payment",
    "/message",
    "/setting",
    "/profile",
    "/logout"
  ]
};

// Funções auxiliares
export function isPublicRoute(pathname: string): boolean {
  return publicRoutes.includes(pathname);
}

export function matchProtectedRoute(pathname: string) {
  return protectedRoutes.find((route) => pathToRegex(route.path).test(pathname));
}

export function pathToRegex(path: string): RegExp {
  const regex = path.replace(/:[^\s/]+/g, "([^/]+)");
  return new RegExp(`^${regex}$`);
}

export function getRedirectPathForRole(role: string): string {
  const rolePaths = ScreenToRendirectWhenLogin[role as Role];
  return rolePaths ? rolePaths[0] : "/";
}

// Função para obter cookies
export function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

// Middleware principal
export function authMiddleware(
  pathname: string,
  navigate: NavigateFunction
): boolean {
  const token = getCookie("akin-token");
  const userRole = getCookie("akin-role") as Role | undefined;
  console.log(`Middleware executando para: ${pathname}, Token: ${!!token}, Role: ${userRole}`);

    // Se está na rota raiz e não tem token, permita (é a página de login)
  if (pathname === '/' && !token) {
    return true;
  }

  // Caso 1: Não autenticado tentando acessar rota protegida
  if (!token) {
    const matchedRoute =  matchProtectedRoute(pathname) 
    if(matchedRoute){
        navigate("/", { replace: true });
      return false; // Bloqueia a navegação
    }
    return true; // Permite acesso a rotas públicas
  }

  // Caso 2: Autenticado tentando acessar rota pública
  if (token && isPublicRoute(pathname) && pathname !== "/") {
    const redirectPath = getRedirectPathForRole(userRole || "");
    navigate(redirectPath, { replace: true });
    return false;
  }

  // Caso 2b: Autenticado na raiz -> redireciona para dashboard
  if (token && pathname === '/') {
    const redirectPath = getRedirectPathForRole(userRole || "");
    navigate(redirectPath, { replace: true });
    return false;
  }

  // Caso 3: Rota protegida com verificação de role
  const matchedRoute = matchProtectedRoute(pathname);
  if (matchedRoute) {
    if (!userRole || !matchedRoute.roles.includes(userRole)) {
      const redirectPath = getRedirectPathForRole(userRole || "");
      navigate(redirectPath, { replace: true });
      return false;
    }
  }

  return true; // Permite o acesso
}
import { IRouteWrapperProps } from "@/interfaces/routes/route";
import Cookies from "js-cookie";
import { Navigate, useLocation } from "react-router-dom";

const RouteWrapper = ({ element: Element, visibility }: IRouteWrapperProps) => {
  const token = Cookies.get("authSufficius-token") || null;
  const userString =
    Cookies.get("authSufficius-user") ||
    localStorage.getItem("authSufficius-user");

  let user = null;
    try {
      user = userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error("Erro ao parsear usuário:", error);
      user = null;
    }
    const location = useLocation();

    // 1. ROTAS PÚBLICAS - sempre acessíveis
    if (visibility === "public") {
      return <Element />;
    }

    // 2. ROTAS DE AUTENTICAÇÃO (login/register) - apenas para NÃO autenticados
    if (visibility === "auth" || visibility === "private") {
      if (!token || !user) {
        return  <Navigate to="/" state={{ from: location.pathname }} replace />
      
      }
      return <Element />;
    }

    // 3. ROTAS PRIVADAS - apenas para autenticados
    if (visibility === "guest") {
      if (token && user) {
        return <Navigate to="/dashboard" replace />;
      }
      return <Element />;
    }

    return <Element />;
};

export default RouteWrapper;

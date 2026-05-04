import { IRouteWrapperProps } from "@/interfaces/routes/route";
import Cookies from "js-cookie";
import { Navigate, useLocation } from "react-router-dom";

const RouteWrapper = ({ element: Element, visibility }: IRouteWrapperProps) => {
  const token = Cookies.get("authSufficius-token") || null;
  const users =
    Cookies.get("authSufficius-user") ||
    localStorage.getItem("authSufficius-user");

  const location: any = useLocation();
  const from = location.state?.from?.pathname || "/";

  if ((!token || !users) && visibility === "private") {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  // 1. ROTAS PÚBLICAS - sempre acessíveis
  if (token && users && visibility === "auth") {
    return <Navigate to={from} replace />;
  }

  // 3. ROTAS PRIVADAS - apenas para autenticados
  if (visibility === "guest") {
    if (token && users) {
      return <Navigate to="/dashboard" replace />;
    }
    return <Element />;
  }

  return <Element />;
};

export default RouteWrapper;

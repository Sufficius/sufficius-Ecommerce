import Cookies from "js-cookie";
import { Navigate, useLocation } from "react-router-dom";
import { memo, useState, useEffect } from "react";

interface IRouteWrapperProps {
  element: React.ComponentType;
  visibility: "private" | "auth" | "public";
}

// Cache global para auth state (evita múltiplas leituras dos cookies)
let authCache: { token: string | null; user: any | null; timestamp: number } | null = null;
const CACHE_DURATION = 5000; // 5 segundos

const RouteWrapper = memo(({ element: Element, visibility }: IRouteWrapperProps) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(false);
  const [authState, setAuthState] = useState<{ token: string | null; user: any | null }>({ 
    token: null, 
    user: null 
  });

  // Verificar cache primeiro
  useEffect(() => {
    const checkAuth = async () => {
      // Se já temos cache válido, usar ele
      if (authCache && Date.now() - authCache.timestamp < CACHE_DURATION) {
        setAuthState({ token: authCache.token, user: authCache.user });
        return;
      }

      setIsChecking(true);
      
      try {
        const token = Cookies.get("authSufficius-token") || null;
        const userString = Cookies.get("authSufficius-user") || localStorage.getItem("authSufficius-user");
        
        let user = null;
        if (userString) {
          try {
            user = JSON.parse(userString);
          } catch (error) {
            console.error("Erro ao parsear usuário:", error);
            user = null;
          }
        }

        // Atualizar cache
        authCache = { token, user, timestamp: Date.now() };
        setAuthState({ token, user });
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []); // Executar apenas uma vez

  const { token, user } = authState;

  // Loading enquanto verifica autenticação
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. ROTAS PÚBLICAS - sempre acessíveis
  if (visibility === "public") {
    return <Element />;
  }

  // 2. ROTAS DE AUTENTICAÇÃO (login/register) - apenas para NÃO autenticados
  if (visibility === "auth") {
    if (token && user) {
      const userRole = user.role || user.tipo;
      return <Navigate to={userRole === "ADMIN" ? "/admin/dashboard" : "/proposta"} replace />;
    }
    return <Element />;
  }

  // 3. ROTAS PRIVADAS - apenas para autenticados
  if (visibility === "private") {
    if (!token || !user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <Element />;
  }

  // Fallback
  return <Navigate to="/login" replace />;
});

// Nome para debugging
RouteWrapper.displayName = "RouteWrapper";

export default RouteWrapper;
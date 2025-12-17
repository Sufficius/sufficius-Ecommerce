// hooks/useAuthRedirect.ts
import { authMiddleware } from '@/middleware';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useAuthRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Executa o middleware na mudança de rota
    authMiddleware(location.pathname, navigate);
  }, [location.pathname, navigate]);

  // Retorna se o usuário tem acesso à rota atual
  const hasAccessTo = (pathname: string): boolean => {
    let hasAccess = true;
    const mockNavigate = ((path: string) => {
      hasAccess = false;
    }) as any;
    
    return authMiddleware(pathname, mockNavigate);
  };

  return { hasAccessTo };
}
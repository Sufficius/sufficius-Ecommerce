// middleware/AuthMiddlewareProvider.tsx
import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authMiddleware } from './middleware';

interface AuthMiddlewareContextType {
  checkAccess: (pathname: string) => boolean;
}

const AuthMiddlewareContext = createContext<AuthMiddlewareContextType | undefined>(undefined);

export function AuthMiddlewareProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const checkAccess = useCallback((pathname: string): boolean => {
    let hasAccess = true;
    const mockNavigate = (() => {
      hasAccess = false;
    }) as any;
    
    return authMiddleware(pathname, mockNavigate);
  }, []);

  useEffect(() => {
    // Executa o middleware apenas se a rota atual não for a raiz
    // Evita loop infinito na raiz
    if (location.pathname !== '/') {
      const hasAccess = authMiddleware(location.pathname, navigate);
      
      if (!hasAccess) {
        console.log(`Acesso negado para: ${location.pathname}`);
      }
    }
  }, [location.pathname, navigate]); // Removi checkAccess das dependências

  return (
    <AuthMiddlewareContext.Provider value={{ checkAccess }}>
      {children}
    </AuthMiddlewareContext.Provider>
  );
}

export function useAuthMiddleware() {
  const context = useContext(AuthMiddlewareContext);
  if (!context) {
    throw new Error('useAuthMiddleware must be used within AuthMiddlewareProvider');
  }
  return context;
}
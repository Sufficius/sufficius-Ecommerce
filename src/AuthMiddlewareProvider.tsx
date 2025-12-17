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
    let accessAllowed = true;
    const mockNavigate = (() => {
      accessAllowed = false;
    }) as any;
    
    authMiddleware(pathname, mockNavigate);
    return accessAllowed;
  }, []);

  useEffect(() => {
    // Executa o middleware apenas se a rota atual não for a raiz
    // Evita loop infinito na raiz
    if (location.pathname !== '/') {
      const accessAllowed = authMiddleware(location.pathname, navigate);
      
      if (!accessAllowed) {
        console.log(`Acesso negado para: ${location.pathname}`);
      }
    }
  }, [location.pathname, navigate]);

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
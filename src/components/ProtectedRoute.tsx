// components/ProtectedRoute.tsx
import { getCookie } from '@/middleware';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRoles?: string[];
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const token = getCookie("akin-token");
  const userRole = getCookie("akin-role");

  // 1. Verificar autenticação
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 2. Verificar roles se necessário
  if (requiredRoles && userRole && !requiredRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
}
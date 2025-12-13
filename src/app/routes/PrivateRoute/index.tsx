import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  // exemplo simples (ajusta à tua lógica real)
  return !!localStorage.getItem("token");
};

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

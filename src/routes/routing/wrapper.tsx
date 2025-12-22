import Cookies from "js-cookie";
import { Navigate, useLocation } from "react-router-dom";

const RouteWrapper = ({ element: Element, visibility }: IRouteWrapperProps) => {
  const token = Cookies.get("authSufficius-token");
  const user =
    Cookies.get("authSufficius-user") ||
    localStorage.getItem("authSufficius-user");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const location: any = useLocation();

  const from = location.state?.from?.pathname || "/";

  if ((!token || !user) && visibility === "private") {
    return <Navigate to="/" state={{ from: location }} />;
  }

  if (token && user && visibility === "auth") {
    return <Navigate to={from} replace />;
  }

  return <Element />;
};

export default RouteWrapper;

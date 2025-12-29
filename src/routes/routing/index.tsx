import { Fragment, Suspense, useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WrapperRoutes } from "../wrapperRouter";
import RouteWrapper from "./wrapper";

// Componente de loading melhorado
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-gray-600">Carregando...</p>
    </div>
  </div>
);

const Routing = () => {
  // Memoizar as rotas para evitar recálculos desnecessários
  const routes = useMemo(() => WrapperRoutes(), []);

  // Memoizar a função build para evitar recriação em cada render
  const build = useMemo(() => {
    return (route: IRouteProps): React.ReactNode => {
      // Evitar recursão profunda usando caminhos relativos para children
      const children = route.children?.map((child) => {
        // Normalizar paths para evitar duplicações
        const childPath = child?.path?.startsWith("/") 
          ? child.path 
          : `${route?.path?.replace(/\/$/, "")}/${child.path}`;
        
        return {
          ...child,
          path: childPath
        };
      });

      const routeElement = (
        <RouteWrapper 
          key={route.path} 
          visibility={route.visibility} 
          element={route.element} 
        />
      );

      if (!children || children.length === 0) {
        return (
          <Route
            key={route.path}
            path={route.path}
            element={routeElement}
          />
        );
      }

      return (
        <Route
          key={route.path}
          path={route.path}
          element={routeElement}
        >
          {children.map((child) => build(child))}
        </Route>
      );
    };
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {routes.map((route) => (
            <Fragment key={route.path}>
              {build(route)}
            </Fragment>
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Routing;
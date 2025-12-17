import { Fragment, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WrapperRoutes } from "../wrapperRouter";
import RouteWrapper from "./wrapper";

const Routing = () => {
  const routes = WrapperRoutes();
  return (
    <BrowserRouter>
      <Suspense fallback={<p>carregando...</p>}>
        <Routes>
          {routes.map((path) => (
            <Fragment key={path.path}> {build(path)}</Fragment>
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

const build = (route: IRouteProps): React.ReactNode => {
  if (!route.children) {
    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <RouteWrapper visibility={route.visibility} element={route.element} />
        }
      />
    );
  }

  return (
    <Route
      key={route.path}
      path={route.path}
      element={
        <RouteWrapper visibility={route.visibility} element={route.element} />
      }
    >
      {route.children?.map((outlet) => build(outlet))}
    </Route>
  );
};

export default Routing;

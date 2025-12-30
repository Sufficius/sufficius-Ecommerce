import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Fragment, Suspense } from "react";

import RouteWrapper from "./wrapper";
import { WrapperRouter } from "../wrapperRouter";
import { IRouteProps } from "@/interfaces/routes/route";

const Routing = () => {
  const routes = WrapperRouter();
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

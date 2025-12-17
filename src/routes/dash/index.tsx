import Dashboard from "@/pages/Dashboard";
import { DashLayout } from "@/pages/layout/dashLayout";

export const DashRoutes: IRouteProps = {
  path: "/",
  element: DashLayout,
  visibility: "private",
  children: [
    {
      path: "/",
      element: Dashboard,
      visibility: "private",
    },
  ],
};

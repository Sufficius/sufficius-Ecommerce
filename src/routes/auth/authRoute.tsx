import AdminLogin from "@/(admin)/pages/Login";
import { AuthLayout } from "@/pages/layout/authLayout";
import { NotFound } from "@/pages/not-found";


export const AuthRoutes: IRouteProps = {
  path: "/admin",
  element: AuthLayout,
  visibility: "auth",
  children: [
    {
      path: "/admin/login",
      element: AdminLogin,
      visibility: "auth",
    },
    // {
    //   path: "/auth/register",
    //   element: Register,
    //   visibility: "auth",
    // },
    {
      path: "*",
      element: NotFound,
      visibility: "auth",
    },
  ],
};

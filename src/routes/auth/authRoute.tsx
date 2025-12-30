import AdminLogin from "@/(admin)/pages/Login";
import { IRouteProps } from "@/interfaces/routes/route";
import Landing from "@/pages/Landing";
import { AuthLayout } from "@/pages/layout/authLayout";
import { NotFound } from "@/pages/not-found";

export const AuthRoutes: IRouteProps = {
  path: "/",
  element: AuthLayout,
  visibility: "public",
  children: [
      {
      path: "/",
      element: Landing,
      visibility: "public", // Mude para "private"
    },
    {
      path: "/login",
      element: AdminLogin,
      visibility: "public",
    },
    // {
    //   path: "/auth/register",
    //   element: Register,
    //   visibility: "auth",
    // },
    {
      path: "*",
      element: NotFound,
      visibility: "public",
    },
  ],
};

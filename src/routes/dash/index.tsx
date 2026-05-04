import { IRouteProps } from "@/interfaces/routes/route";
import CheckoutPage from "@/pages/Checkout";
import ConfirmacaoCompra from "@/pages/Confirmacao";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import { DashLayout } from "@/pages/layout/dashLayout";

export const DashRoutes: IRouteProps = {
  path: "/",
  element: DashLayout,
  visibility: "public",
  children: [
    {
      path: "/",
      element: Landing,
      visibility: "public",
    },
    {
      path: "/dashboard",
      element: Dashboard,
      visibility: "auth",
    },
    {
      path: "/checkout",
      element: CheckoutPage,
      visibility: "public",
    },
    {
      path: "/confirmacao",
      element: ConfirmacaoCompra,
      visibility: "auth",
    },
  ],
};

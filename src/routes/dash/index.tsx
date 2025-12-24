import CheckoutPage from "@/pages/Checkout";
import ConfirmacaoCompra from "@/pages/Confirmacao";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import { DashLayout } from "@/pages/layout/dashLayout";

export const DashRoutes: IRouteProps = {
  path: "/",
  element: DashLayout,
  visibility: "auth",
  children: [
    {
      path: "/",
      element: Landing,
      visibility: "auth",
    },
     {
      path: "/dashboard",
      element: Dashboard,
      visibility: "private",
    },
    {
      path: "/checkout",
      element: CheckoutPage,
      visibility: "auth", 
    },
    {
      path:"/confirmacao",
      element: ConfirmacaoCompra,
      visibility: "auth",
    }
  ],
};

import { AuthRoutes } from "./auth/authRoute"
import { HomesRoutes } from "./auth/homeRoutes"
import { DashRoutes } from "./dash";

export const WrapperRouter = () => {
  return [AuthRoutes, HomesRoutes, DashRoutes];
}
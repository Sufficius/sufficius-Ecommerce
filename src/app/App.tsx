import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./layout";
import Landing from "../pages/Landing";
import { PrivateRoute } from "./routes/PrivateRoute";
import Login from "../pages/Login";
import Pagamento from "@/pages/Payment";
import { CartProvider } from "@/context/CartContext";

export const App = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<Login />} />

          {/* Rotas privadas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Landing />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/pagamento"
            element={
              <PrivateRoute>
                <Layout>
                  <Pagamento />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
};

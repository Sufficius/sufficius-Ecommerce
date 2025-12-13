import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./layout";
import Landing from "../pages/Landing";
import { PrivateRoute } from "./routes/PrivateRoute";
import Login from "../pages/Login";

export const App = () => {
  return (
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
      </Routes>
    </BrowserRouter>
  );
};

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./layout";
import Landing from "../pages/Landing";
export const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route element={<Landing />} path="/" />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Index";
import Login from "./pages/Login";
import Produtos from "./pages/Produtos";
import PrivateRoute from "./PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* principal */}
        <Route path="/" element={<Home />} />

        {/* públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastrar" element={<div>Cadastro (em breve)</div>} />

        {/* privadas */}
        <Route element={<PrivateRoute />}>
          <Route path="/produtos" element={<Produtos />} />
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Cadastrar from "./pages/Cadastrar"
import Login from "./pages/Login";
import Home from "./pages/Home";
import Verificar from './pages/Verificar';
import PrivateRoute from "./PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* principal */}
        <Route path="/" element={<Index />} />

        {/* públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastrar" element={<Cadastrar />} />
        <Route path="/verificar" element={<Verificar />} />

        {/* privadas */}
        <Route element={<PrivateRoute />}>
          <Route path="/Home" element={<Home />} />
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

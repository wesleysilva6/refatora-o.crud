import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Cadastrar from "./pages/Cadastrar"
import Login from "./pages/Login";
import Verificar from './pages/Verificar';
import Resetar from './pages/Resetar';
import Home from "./pages/Home";
import Perfil from "./pages/Perfil"
import PrivateRoute from "./PrivateRoute";
import Simular from './pages/Simular';

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
          <Route path="/resetar" element={<Resetar />} />

        {/* privadas */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/simular" element={<Simular />} />
        </Route>

        <Route path="*" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
}

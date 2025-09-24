import { Link, useLocation } from "react-router-dom";
import "../pages/sales-dashboard.css";
import ThemeToggle from "./ThemeToggle";

type Props = { collapsed?: boolean };

export default function SalesSidebar({ collapsed }: Props) {
  const { pathname } = useLocation();

  const isActive = (to: string) => pathname === to;

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`} id="sidebar">
      <h2>
        <i className="bi bi-bank" /> <span className="sidebar-text">Painel de Vendas</span>
      </h2>

      {/* Ajuste os paths para as rotas do seu React */}
      <Link to="/home" className={isActive("/home") ? "active" : ""}>
        <i className="bi bi-speedometer2" />
        <span className="sidebar-text">Painel de Estoque</span>
      </Link>

      <Link to="/vendas" className={isActive("/vendas") ? "active" : ""}>
        <i className="bi bi-coin" />
        <span className="sidebar-text">Realizar Venda</span>
      </Link>

      <Link to="/dashboard" className={isActive("/dashboard") ? "active" : ""}>
        <i className="bi bi-cash-coin" />
        <span className="sidebar-text">Dashboard</span>
      </Link>

      <Link to="/sistema" className={isActive("/sistema") ? "active" : ""}>
        <i className="bi bi-gear" />
        <span className="sidebar-text">Configurações</span>
      </Link>

      <Link to="/logout">
        <i className="bi bi-box-arrow-left" />
        <span className="sidebar-text">Sair</span>
      </Link>

        <div className="m-2 mb-5">
            <ThemeToggle />
        </div>
    </aside>
  );
}

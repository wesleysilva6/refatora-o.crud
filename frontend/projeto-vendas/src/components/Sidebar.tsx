
import { Link, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import ThemeToggle from "./ThemeToggle";

import logoTexto from "../assets/img/logo_stexto.png";
import logoFundo from "../assets/img/fundop2.png";
import logoBranca from "../assets/img/logo_branca.png";

import "./sidebar.css";
    export default function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = useCallback(() => { 
        localStorage.removeItem("token"); 
        localStorage.removeItem("user");
        navigate("/", { replace: true });
    }, [navigate]);

return (
    <>
        <nav className="navbar" data-bs-theme="dark">
            <div className="container-fluid">
                <button className="btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarOffcanvas" aria-controls="sidebarOffcanvas" aria-label="Abrir menu">
                    <i className="bi bi-list" />
                </button>
                <Link to="/home" className="navbar-brand mx-auto d-flex align-items-center gap-2">
                    <img src={logoTexto} width={65} height={65} alt="Estoque Aqui" />
                    <img src={logoFundo} width={85} height={65} alt="Logo" />
                </Link>
            </div>
        </nav>

    <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex={-1} id="sidebarOffcanvas" aria-labelledby="sidebarOffcanvasLabel">
        <div className="offcanvas-header">
            <img src={logoBranca} width={120} className="mx-auto d-block" alt="Logo" />
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Fechar" />
        </div>

        <div className="offcanvas-body d-flex flex-column align-items-start">
        <h5 className="text-white w-100 text-center mb-4">Painel Estoque Aqui</h5>

            <ul className="list-unstyled w-100">
            <li>
                <Link to="/vendas" className="text-white mb-3 fs-5 nav-link" >
                    <i className="bi bi-receipt" /> Painel de Vendas
                </Link>
            </li>

            <li>
                <Link to="/perfil" className="text-white mb-3 fs-5 nav-link">
                    <i className="bi bi-person-circle" /> Meu Perfil
                </Link>
            </li>

            <li>
                <Link to="/home" className="text-white mb-3 fs-5 nav-link">
                    <i className="bi bi-house-door-fill" /> Home
                </Link>
            </li>

            <li>
                <Link to="/simular" className="text-white mb-3 fs-5 nav-link">
                    <i className="bi bi-box-seam-fill" /> Simular Venda
                </Link>
            </li>

            <li>
                <Link to="/historico" className="text-white mb-3 fs-5 nav-link">
                    <i className="bi bi-clipboard-data-fill" /> Histórico
                </Link>
            </li>

            <li>
                <Link to="/analytics" className="text-white mb-3 fs-5 nav-link">
                    <i className="bi bi-bar-chart-line-fill" /> Estatísticas
                </Link>
            </li>

            <li>
                <div className="m-2 mb-5">
                    <ThemeToggle />
                </div>
            </li>

            <li>
                <button type="button" className="text-primary mb-3 fs-5 nav-link w-100" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-left" /> Sair
                </button>
            </li>
            </ul>
        </div>
        </div>
    </>
    );
}

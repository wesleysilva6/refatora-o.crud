import { Link } from "react-router-dom";
import logoHeader from "../../assets/img/logo_stexto.png"
import titleHeader from "../../assets/img/fundop2.png"
import "./header.css"

export default function Header() {
    return (
        <nav className="navbar">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
                    <img src={logoHeader} className="logoHeader" alt="Estoque Aqui" />
                    <img src={titleHeader} className="titleHeader" alt="Estoque Aqui" />
                </Link>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/" className="nav-link text-white">Voltar</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
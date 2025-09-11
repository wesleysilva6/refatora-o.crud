import { Link } from "react-router-dom"
import LogoEstoque from "../assets/img/logo_stexto.png"
import LogoTexto from "../assets/img/fundop2.png"

export default function Sidebar() {
    return (
        <nav className="navbar">
            <div className="container-fluid">
                <button type="button" className="btn">
                    <i className="bi bi-list"></i>
                </button>
                <Link to="/home" className="navbar-brand mx-auto">
                    <img src={LogoEstoque} alt="" />
                    <img src={LogoTexto} alt="" />
                </Link>
            </div>
        </nav>
        
    )
}
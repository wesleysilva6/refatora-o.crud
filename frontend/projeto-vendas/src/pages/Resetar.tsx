import { Link } from "react-router-dom";
import { useState } from "react";
import Footer from "../components/footer/Footer";
import logoNavbar from "../assets/img/logo_stexto.png"
import imgCadastro from "../assets/img/fundop.png";
import textNavbar from "../assets/img/fundop2.png";
import styles from "./Resetar.module.css"

// type Form = { password: string };

export default function Resetar() {
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const [showPwd2, setShowPwd2] = useState(false);

return (
    <div className={`min-vh-100 d-flex flex-column ${styles.root}`}>
        <nav className="navbar">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
                    <img src={logoNavbar} className="logoHeader" alt="Estoque Aqui" />
                    <img src={textNavbar} className="titleHeader" alt="Estoque Aqui" />
                </Link>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/" className="nav-link text-white">Voltar</Link>
                    </li>
                </ul>
            </div>
        </nav>

        <main className={styles.containerLogin}>
            <div className="row justify-content-center">
                <div className={styles.cardLogin}>
                    <div className={`card ${styles.card}`}>
                        <div className="card-header text-white">Redefinir Senha</div>
                    <div className="py-3">
                        <img src={imgCadastro} alt="Logo" width={200} height={200} className="d-block mx-auto img-fluid" />
                    </div>

            <div className="card-body">
                <form className="spinnerForm" noValidate>
                    <div className="input-group mt-1">
                        <span className={`input-group-text ${styles.inputGroupText}`}>
                            <i className="bi bi-lock" aria-hidden="true" />
                        </span>
                        <input type={showPwd ? "text" : "password"} className={`form-control ${styles.formControl}`} placeholder="Digite uma Senha" required autoComplete="current-password" />
                        <button type="button" className={`btn btn-dark ${styles.eyes}`} onClick={() => setShowPwd((s) => !s)} aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}>
                        <i className={`bi ${showPwd ? "bi-eye-slash" : "bi-eye"}`} aria-hidden="true" />
                    </button>
                    </div>

                    <div className="input-group mt-2">
                        <span className={`input-group-text ${styles.inputGroupText}`}>
                            <i className="bi bi-lock" aria-hidden="true" />
                        </span>
                        <input type={showPwd2 ? "text" : "password"} className={`form-control ${styles.formControl}`} placeholder="Confirme a Senha" required autoComplete="current-password" />
                    <button type="button" className={`btn btn-dark ${styles.eyes}`} onClick={() => setShowPwd2((s) => !s)} aria-label={showPwd2 ? "Ocultar senha2" : "Mostrar senha2"} >
                        <i className={`bi ${showPwd2 ? "bi-eye-slash" : "bi-eye"}`} aria-hidden="true" />
                    </button>
                    </div>

                    <button className="btn btn-sm btn-primary mt-2 w-100" type="submit" disabled={loading} aria-busy={loading}>
                        {loading ? "Alterando Senha..." : "Alterar Senha"}
                    </button>

                    {loading && (
                        <div className="d-flex justify-content-center mt-2">
                            <div className="spinner-border text-primary" role="status" aria-label="Carregando" />
                        </div>
                    )}

                </form>
            </div>
                    </div>
                </div>
            </div>
        </main>
    <Footer />
    </div>
    )
}
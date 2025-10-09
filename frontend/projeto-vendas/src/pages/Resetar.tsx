import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../components/footer/Footer";
import logoNavbar from "../assets/img/logo_stexto.png"
import imgCadastro from "../assets/img/fundop.png";
import textNavbar from "../assets/img/fundop2.png";
import styles from "./Resetar.module.css"
import { api } from "../api";
import { toast } from "../lib/swal";

export default function Resetar() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const [showPwd2, setShowPwd2] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const t = params.get("token");
        const e = params.get("email");
        if (!t || !e) {
            toast.fire({ icon: "error", title: "Token ou e-mail inválido." });
            navigate("/login");
        }
        setToken(t);
        setEmail(e);
    }, [params, navigate]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg(null);

        if (senha.length < 8) return setErrorMsg("A senha deve ter no mínimo 8 caracteres.");
        if (!/[A-Z]/.test(senha)) return setErrorMsg("A senha deve conter uma letra maiúscula.");
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) return setErrorMsg("A senha deve conter um caractere especial.");
        if (senha !== confirmarSenha) return setErrorMsg("As senhas não coincidem.");

        setLoading(true);
        try {
            await api.post("/password/reset", { token, email, password: senha, password_confirmation: confirmarSenha });
            toast.fire({ icon: "success", title: "Senha redefinida com sucesso!" });
            navigate("/login?sucesso=senha", { replace: true });
        } catch (err: any) {
            setErrorMsg(err?.response?.data?.message ?? "Falha ao redefinir a senha.");
        } finally {
            setLoading(false);
        }
    }

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
                <form className="spinnerForm" noValidate onSubmit={handleSubmit}>
                    <div className="input-group mt-1">
                        <span className={`input-group-text ${styles.inputGroupText}`}>
                            <i className={`bi bi-lock ${styles.icon}`} aria-hidden="true" />
                        </span>
                        <input type={showPwd ? "text" : "password"} className={`form-control ${styles.formControl}`} placeholder="Digite uma Senha" required autoComplete="new-password" value={senha} onChange={e => setSenha(e.target.value)} />
                        <button type="button" className={`btn btn-dark ${styles.eyes}`} onClick={() => setShowPwd((s) => !s)} aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}>
                        <i className={`bi ${showPwd ? "bi-eye-slash" : "bi-eye"}`} aria-hidden="true" />
                    </button>
                    </div>

                    <div className="input-group mt-2">
                        <span className={`input-group-text ${styles.inputGroupText}`}>
                            <i className={`bi bi-lock ${styles.icon}`} aria-hidden="true" />
                        </span>
                        <input type={showPwd2 ? "text" : "password"} className={`form-control ${styles.formControl}`} placeholder="Confirme a Senha" required autoComplete="new-password" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} />
                    <button type="button" className={`btn btn-dark ${styles.eyes}`} onClick={() => setShowPwd2((s) => !s)} aria-label={showPwd2 ? "Ocultar senha2" : "Mostrar senha2"} >
                        <i className={`bi ${showPwd2 ? "bi-eye-slash" : "bi-eye"}`} aria-hidden="true" />
                    </button>
                    </div>

                    {errorMsg && <div className="text-danger mt-2">{errorMsg}</div>}

                    <button className="btn btn-sm btn-primary mt-3 w-100" type="submit" disabled={loading || !token} aria-busy={loading}>
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
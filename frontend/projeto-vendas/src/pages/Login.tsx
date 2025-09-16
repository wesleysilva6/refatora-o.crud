import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import imgCadastro from "../assets/img/fundop.png";
import { api } from "../api";
import { useAuth } from "../auth";

import styles from "./Login.module.css"; // << CSS Module

type Form = { email: string; password: string };

export default function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<Form>({ defaultValues: {} });

  const initialMessages = useMemo(() => {
    const sucesso = params.get("sucesso");
    const errorParam = params.get("error");
    const erroParam  = params.get("erro");
    let s: string | null = null;
    let e: string | null = null;
    if (sucesso === "senha") s = "Senha alterada com sucesso.";
    if (errorParam === "email_senha") e = "Email e senha inválidos";
    if (erroParam === "senha") e = "Senha inválida";
    return { s, e };
  }, [params]);

  useEffect(() => {
    setSuccessMsg(initialMessages.s);
    setErrorMsg(initialMessages.e);
    if (initialMessages.s || initialMessages.e) {
      const t = setTimeout(() => {
        setSuccessMsg(null);
        setErrorMsg(null);
        setParams({}, { replace: true });
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [initialMessages, setParams]);

  async function onSubmit(v: Form) {
    try {
      setErrorMsg(null);
      setLoading(true);
      const { data } = await api.post("/login", { email: v.email, password: v.password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user ?? {}));
      setToken(data.token);
      navigate("/home", { replace: true });
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? "Falha ao autenticar";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`min-vh-100 d-flex flex-column ${styles.root}`}>
      <Header />

      <main className={styles.containerLogin}>
        <div className="row justify-content-center">
          <div className={styles.cardLogin}>

            <div className={`card ${styles.card}`}>
              <div className="card-header text-white">Entrar</div>

              <div className="py-3">
                <img src={imgCadastro} alt="Logo" width={200} height={200} className="d-block mx-auto img-fluid" />
              </div>

              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)} className="spinnerForm" noValidate>
                  <div className="input-group mt-1">
                    <span className={`input-group-text ${styles.inputGroupText}`}>
                      <i className="bi bi-envelope" aria-hidden="true" />
                    </span>
                    <input
                      type="email"
                      className={`form-control ${styles.formControl}`}
                      placeholder="E-mail"
                      required
                      autoComplete="email"
                      inputMode="email"
                      {...register("email")}
                    />
                  </div>

                  <div className="input-group mt-2">
                    <span className={`input-group-text ${styles.inputGroupText}`}>
                      <i className="bi bi-lock" aria-hidden="true" />
                    </span>
                    <input
                      type={showPwd ? "text" : "password"}
                      className={`form-control ${styles.formControl}`}
                      placeholder="Senha"
                      required
                      autoComplete="current-password"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      className={`btn btn-dark ${styles.eyes}`}
                      onClick={() => setShowPwd((s) => !s)}
                      aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
                    >
                      <i className={`bi ${showPwd ? "bi-eye-slash" : "bi-eye"}`} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="m-auto text-left">
                    {errorMsg && <div className="text-danger">{errorMsg}</div>}
                  </div>

                  <button className="btn btn-sm btn-primary mt-2 w-100" type="submit" disabled={loading} aria-busy={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                  </button>

                  <div className="d-flex justify-content-between text-primary mt-1">
                    <Link to="/verificar">Esqueceu a senha?</Link>
                    <Link to="/cadastrar">Cadastrar-se</Link>
                  </div>

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
  );
}

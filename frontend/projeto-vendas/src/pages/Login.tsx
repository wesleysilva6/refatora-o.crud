import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth";
import { api } from "../api";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

type Form = { email: string; password: string };

export default function Index() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<Form>({
    defaultValues: { email: "admin@example.com", password: "123456" },
  });

  // Mapeia mensagens vindas por query string (compatível com seu PHP)
  const initialMessages = useMemo(() => {
    const sucesso = params.get("sucesso");
    const errorParam = params.get("error"); // ?error=email_senha
    const erroParam = params.get("erro");   // ?erro=senha

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

    // Oculta alertas após 3s e limpa a query (como no PHP)
    if (initialMessages.s || initialMessages.e) {
      const t = setTimeout(() => {
        setSuccessMsg(null);
        setErrorMsg(null);
        // limpa params sem recarregar
        setParams({}, { replace: true });
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [initialMessages, setParams]);

  async function onSubmit(v: Form) {
    try {
      setErrorMsg(null);
      setLoading(true);

      const { data } = await api.post("/login", {
        email: v.email,
        password: v.password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user ?? {}));
      setToken(data.token);

      navigate("/produtos", { replace: true });
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? "Falha ao autenticar";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Header opcional */}
      {/* <Header /> */}

      <main className="container flex-grow-1 py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">
            <div className="card-login">
              <div className="m-auto text-center">
                {successMsg && (
                  <div className="alert alert-success">{successMsg}</div>
                )}
                {errorMsg && <div className="text-danger">{errorMsg}</div>}
              </div>

              <div className="card">
                <div className="card-header text-white">Entrar</div>

                <div className="text-center py-3">
                  {/* Coloque esse arquivo em public/assets/img/fundop.png */}
                  <img
                    src="/assets/img/fundop.png"
                    alt="Logo"
                    width="200"
                    height="200"
                  />
                </div>

                <div className="card-body">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="spinnerForm"
                  >
                    <div className="input-group mt-1">
                      <span className="input-group-text">
                        <i className="bi bi-envelope" style={{ color: "#fff" }} />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="E-mail"
                        required
                        {...register("email")}
                      />
                    </div>

                    <div className="input-group mt-2">
                      <span className="input-group-text">
                        <i className="bi bi-lock" style={{ color: "#fff" }} />
                      </span>
                      <input
                        type={showPwd ? "text" : "password"}
                        className="form-control"
                        placeholder="Senha"
                        required
                        {...register("password")}
                      />
                      <button
                        type="button"
                        className="eyes btn btn-dark"
                        onClick={() => setShowPwd((s) => !s)}
                        aria-label="Mostrar/ocultar senha"
                      >
                        <i className={`bi ${showPwd ? "bi-eye-slash" : "bi-eye"}`} />
                      </button>
                    </div>

                    <button
                      className="btnEnviar btn btn-sm btn-primary mt-2 w-100"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Entrando..." : "Entrar"}
                    </button>

                    <div className="d-flex justify-content-between mt-2">
                      {/* Substitua por <Link/> se tiver páginas React */}
                      <a href="/verificar">Esqueceu a Senha?</a>
                      <a href="/cadastrar">Cadastrar-se</a>
                    </div>

                    <div className="d-flex justify-content-center mt-2">
                      {loading && (
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Carregando...</span>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer opcional */}
      {/* <Footer /> */}
    </div>
  );
}

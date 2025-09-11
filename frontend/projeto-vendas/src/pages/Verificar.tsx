import { Modal } from 'bootstrap';
import { useRef, useState } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import imgRedefinir from "../assets/img/fundop.png";
import styles from "./Verificar.module.css";
import { useForm } from "react-hook-form";
import { api } from "../api";

type Form = { email: string };

export default function Verificar() {
  const { register, handleSubmit, reset } = useForm<Form>();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [emailEnviado, setEmailEnviado] = useState<string | null>(null);

  // ref do modal
    const modalRef = useRef<HTMLDivElement>(null);

    function abrirModal() {
      if (!modalRef.current) return;
      const instance = Modal.getOrCreateInstance(modalRef.current);
      instance.show();
    }

  async function onSubmit(v: Form) {
    try {
      setErrorMsg(null);
      setLoading(true);
      await api.post("/password/forgot", { email: v.email });
      setEmailEnviado(v.email);
      abrirModal();     // << abre
      reset();
    } catch (e: any) {
      const msg = e?.response?.data?.message
        || e?.response?.data?.errors?.email?.[0]
        || "E-mail inválido. Verifique e tente novamente.";
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
              <div className={`card-header ${styles.cardHeader} text-white`}>Verificar e-mail</div>

              <div className="py-3">
                <img
                  src={imgRedefinir}
                  alt="Logo"
                  width={200}
                  height={200}
                  className="d-block mx-auto img-fluid"
                />
              </div>

              <div className="card-body">
                <form className="spinnerForm" noValidate onSubmit={handleSubmit(onSubmit)}>
                  <div className="input-group mt-2">
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

                  {errorMsg && <div className="text-danger mt-2">{errorMsg}</div>}

                  <button
                    className="btn btn-sm btn-primary mt-2 w-100"
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {loading ? "Verificando..." : "Enviar e-mail"}
                  </button>

                  <div className="d-flex justify-content-center mt-2">
                    {loading && (
                      <div className="spinner-border text-primary" role="status" aria-label="Carregando" />
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL Bootstrap */}
        <div className="modal fade" id="emailModal" tabIndex={-1} aria-hidden="true" ref={modalRef}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header text-white" style={{ background: "var(--color--primary)" }}>
                <h5 className="modal-title">E-mail enviado com sucesso!</h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar" />
              </div>
              <div className="modal-body text-center">
                <p className="text-center">
                  <i className="bi bi-envelope-check" style={{ fontSize: "4.4rem" }} />
                </p>
                <p className='text-center'>
                  E-mail de<strong> redefinição de senha</strong> foi enviado para:{" "}
                  <strong style={{ fontSize: "1.3rem" }}>{emailEnviado}</strong>
                </p>
                <p className='text-center'>Verifique sua caixa de entrada ou spam.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

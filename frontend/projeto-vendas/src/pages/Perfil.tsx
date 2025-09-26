import Sidebar from "../components/Sidebar"
import { useEffect, useState } from "react";
import { api } from "../api";

import styles from "./Perfil.module.css";

type User = { nome: string; email: string; foto?: string };

export default function Perfil() {
    const [user, setUser] = useState<User | null>(null);
    const [nome, setNome] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(false);
    const [texts, setTexts] = useState<{ type: "success" | "danger"; text: string }[]>([]);
    const [showPwd, setShowPwd] = useState(false);
    const [showPwd2, setShowPwd2] = useState(false);
    const [showPwd3, setShowPwd3] = useState(false);

    function pushAlert(type: "success" | "danger", text: string) {
        setTexts((a) => [...a, { type, text }]);
        setTimeout(() => setTexts((a) => a.slice(1)), 3500);
    }

    // Carrega usuário
    useEffect(() => {
        (async () => {
        try {
            const { data } = await api.get("/me");
            setUser(data);
            setNome(data?.nome ?? "");
            if (data?.foto) setPreview(data.foto);
        } catch {
        }
        })();
    }, []);

    // Preview local da foto
    useEffect(() => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    async function enviarFoto() {
        if (!file) return;
        setSending(true);
        try {
        const fd = new FormData();
        fd.append("foto", file);
        const { data } = await api.post("/perfil/foto", fd, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setUser((u) => (u ? { ...u, foto: data.foto } : u));
        pushAlert("success", "Foto atualizada!");
        setFile(null);
        } catch (e: any) {
        pushAlert("danger", e?.response?.data?.message ?? "Falha ao enviar foto");
        } finally {
        setSending(false);
        }
    }

    async function removerFoto() {
        setSending(true);
        try {
        await api.delete("/perfil/foto");
        setPreview(null);
        setUser((u) => (u ? { ...u, foto: undefined } : u));
        pushAlert("success", "Foto removida.");
        } catch (e: any) {
        pushAlert("danger", e?.response?.data?.message ?? "Falha ao remover foto");
        } finally {
        setSending(false);
        }
    }

    async function salvarNome(e: React.FormEvent) {
        e.preventDefault();
        if (!nome.trim()) {
        pushAlert("danger", "O nome não pode estar em branco.");
        return;
        }
        setSending(true);
        try {
        const { data } = await api.post("/perfil/nome", { novo_nome: nome });
        setUser((u) => (u ? { ...u, nome: data?.nome ?? nome } : u));
        pushAlert("success", "Nome atualizado com sucesso!");
        } catch (e: any) {
        pushAlert("danger", e?.response?.data?.message ?? "Falha ao atualizar nome");
        } finally {
        setSending(false);
        }
    }

    async function salvarSenha(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const senha = String(form.get("senha") ?? "");
        const nova_senha = String(form.get("nova_senha") ?? "");
        const confirmar_senha = String(form.get("confirmar_senha") ?? "");

        if (!senha || !nova_senha || !confirmar_senha) {
        pushAlert("danger", "Preencha todos os campos.");
        return;
        }
        if (nova_senha !== confirmar_senha) {
        pushAlert("danger", "As novas senhas digitadas não coincidem.");
        return;
        }

        setSending(true);
        try {
        await api.post("/perfil/senha", { senha, nova_senha, confirmar_senha });
        (e.target as HTMLFormElement).reset();
        pushAlert("success", "Senha alterada com sucesso.");
        } catch (er: any) {
        const msg =
            er?.response?.data?.message ??
            er?.response?.data?.errors?.senha?.[0] ??
            "Falha ao alterar a senha";
        pushAlert("danger", msg);
        } finally {
        setSending(false);
        }
    }

    function toggle(id: string) {
        const el = document.getElementById(id) as HTMLInputElement | null;
        if (!el) return;
        el.type = el.type === "password" ? "text" : "password";
    }

return (
    <div className="min-vh-100 d-flex flex-column">
        <Sidebar />
        <div className={`justify-content-center align-items-center ${styles.container}`}>
            <div className={`card mx-auto ${styles.card}`} style={{ maxWidth: 700 }}>
                <div className={`card-header ${styles.cardHeader}`}>
                    <h5 className={`card-title mt-2 ${styles.cardTitle}`}>Atualizar Perfil</h5>
                </div>
            <div className={`text-center mt-2 ${styles.cardTop}`}>Meu Perfil</div>

        <div className="mb-2">
            <img src={preview ?? "/avatars/user.png"} id="preview" className={`mx-auto d-block ${styles.imgPerfil}`} alt="Foto de Perfil" style={{ maxWidth: 200 }} />
        <div className="d-flex align-items-center justify-content-center gap-2">
            <label htmlFor="inputFoto" className={`btn btn-primary ${styles.btnEscolher}`}> Escolher arquivo </label>
            <button className={`btn btn-danger ${styles.btnExcluir}`} type="button" onClick={removerFoto} disabled={sending}>
                <i className="bi bi-trash3"></i>
            </button>
        </div>

            <input type="file" id="inputFoto" accept="image/*" className="d-none" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />

        {file && (
            <button className="btn btn-primary mt-3" type="button" onClick={enviarFoto} disabled={sending}>
                {sending ? "Salvando..." : "Salvar Foto"}
            </button> )}
        </div>

            <div className={`text-center ${styles.infoUser}`}>
                <strong>
                    <div className="nome mt-3">{user?.nome}</div>
                    <div className="email">{user?.email}</div>
                </strong>
            </div>

        <div className={`card-body ${styles.cardBody}`}>
            <form onSubmit={salvarNome} className="spinnerForm">
            <div className="mb-3 text-start">
                <label htmlFor="editarNome" className="form-label text-white">Editar Nome</label>
                <input type="text" id="editarNome" name="novo_nome" className={`form-control ${styles.formControl}`} placeholder="Nome do Usuário" value={nome} onChange={(e) => setNome(e.target.value)}/>
            </div>
                <button type="submit" className={`btn btn-primary w-100 ${styles.btnAtualizar}`} disabled={sending}>
                    {sending ? "Salvando..." : "Atualizar Nome"}
                </button>
            </form>

            <hr className="text-primary my-4" />

        <form onSubmit={salvarSenha} className="spinnerForm">
            <label htmlFor="senha" className="form-label text-white">Senha Atual</label>
            <div className="input-group mb-2">
                <input id="senha" name="senha" type={showPwd ? "text" : "password"} className={`form-control ${styles.formControl}`} placeholder="Digite a Senha" required autoComplete="current-password" />
                <button type="button" className={`btn ${styles.eyes}`} onClick={() => setShowPwd(s => !s)} aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}>
                    <i className={`bi ${showPwd ? "bi-eye-slash" : "bi-eye"}`} />
                </button>
            </div>

            <label htmlFor="nova_senha" className="form-label mt-2 text-white">Digite uma nova Senha</label>
            <div className="input-group mb-3">
                <input id="nova_senha" name="nova_senha" type={showPwd2 ? "text" : "password"} className={`form-control ${styles.formControl}`} placeholder="Nova Senha" required autoComplete="new-password" />
                <button type="button" className={`btn ${styles.eyes}`} onClick={() => setShowPwd2(s => !s)} aria-label={showPwd2 ? "Ocultar nova senha" : "Mostrar nova senha"} > 
                    <i className={`bi ${showPwd2 ? "bi-eye-slash" : "bi-eye"}`} /> 
                </button>
            </div>

            <label htmlFor="confirmar_senha" className="form-label mb-1 text-white">Confirmar Nova Senha</label>
            <div className="input-group mt-2">
                <input id="confirmar_senha" name="confirmar_senha" type={showPwd3 ? "text" : "password"} className={`form-control ${styles.formControl}`} placeholder="Confirme a Senha" required autoComplete="new-password" />
                <button type="button" className={`btn ${styles.eyes}`} onClick={() => setShowPwd3(s => !s)} aria-label={showPwd3 ? "Ocultar confirmação" : "Mostrar confirmação"} > 
                    <i className={`bi ${showPwd3 ? "bi-eye-slash" : "bi-eye"}`} />
                </button>
            </div>

            {texts.map((a, i) => (
            <div key={i} className={`text-${a.type} mt-1`}> {a.text} </div> ))}

            <div className="mt-3">
                <button type="submit" className={`btn btn-primary w-100 mt-1 ${styles.btnAtualizar}`} disabled={sending}>
                    {sending ? "Salvando..." : "Atualizar Senha"}
                </button>
            </div>
        </form>
        </div>
        </div>
    </div>
    </div>
    )
}
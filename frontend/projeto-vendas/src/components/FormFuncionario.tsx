import { useState } from "react";
import { api } from "../api";
import styles from "./Form.module.css";
import { confirmacao, sucessoFuncionarioCard, toast } from "../lib/swal";

export default function FormFuncionario() {
    const [nome, setNome] = useState("");
    const [cargo, setCargo] = useState<"Estoquista" | "Vendedor" | "Gerente" | "Férias">("Estoquista");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [salario, setSalario] = useState<string>("");
    const [status, setStatus] = useState<"ativo" | "inativo">("ativo");
    const [foto, setFoto] = useState<File | null>(null);
    const [sending, setSending] = useState(false);

async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nome.trim()) {
        toast.fire({ icon: "error", title: "Informe o nome" });
        return;
    }

    if (!email.trim()) {
        toast.fire({ icon: "error", title: "Informe o e-mail" });
        return;
    }

    if (!telefone.trim()) {
        toast.fire({ icon: "error", title: "Informe o telefone" });
        return;
    }

    if (!salario.trim()) {
        toast.fire({ icon: "error", title: "Informe o salário" });
        return;
    }

    // confirmação sweetalert
    const r = await confirmacao({
        title: "Você deseja realmente cadastrar esse funcionário?",
        text: "Essa ação não poderá ser desfeita!",
        icon: "warning",
        confirmText: "Sim, cadastrar",
        cancelText: "Cancelar",
        confirmColor: "#157347",
        cancelColor: "#d33",
    });
    if (!r.isConfirmed) return;

    setSending(true);
    try {
        const fd = new FormData();
        fd.append("nome", nome);
        fd.append("cargo", cargo);
        fd.append("email", email);
        if (telefone) fd.append("telefone", telefone);
        if (salario) fd.append("salario", salario);
        fd.append("status", status);
        if (foto) fd.append("foto", foto);

    const { data } = await api.post("/funcionarios", fd, {
        headers: { "Content-Type": "multipart/form-data" },
    });

        // card bonito de sucesso
        await sucessoFuncionarioCard({
        nome: data?.nome ?? nome,
        email: data?.email ?? email,
        telefone: data?.telefone ?? telefone,
        cargo: data?.cargo ?? cargo,
        status: data?.status ?? status,
        foto: data?.foto, // precisa ser URL pública do backend
    });

        // limpa o formulário
        setNome("");
        setCargo("Estoquista");
        setEmail("");
        setTelefone("");
        setSalario("");
        setStatus("ativo");
        setFoto(null);

    toast.fire({ icon: "success", title: "Cadastro concluído!" });
    } catch (err: any) {
    const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[Object.keys(err?.response?.data?.errors || {})[0]]?.[0] ||
        "Falha ao cadastrar funcionário";
        toast.fire({ icon: "error", title: msg });
    } finally {
        setSending(false);
    }
}

return (
    <div className={`min-vh-100 d-flex`}>

        <div className={`container ${styles.container}`}>
            <h2>Cadastrar Funcionários</h2>

    <form onSubmit={onSubmit} id="formFuncionario" className="w-100" encType="multipart/form-data">
        <div className="mb-3">
            <label htmlFor="nomeFuncionario">Nome do Funcionário</label>
            <input id="nomeFuncionario" type="text" className={`form-control ${styles.formControl}`} placeholder="Nome do Funcionário" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>

        <div className="mb-3">
            <label htmlFor="cargoFuncionario">Cargo Funcionário</label>
            <select id="cargoFuncionario" className={`form-select ${styles.formControl}`} value={cargo} onChange={(e) => setCargo(e.target.value as any)} required >
                <option value="Estoquista">Estoquista</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Gerente">Gerente</option>
            </select>
        </div>

        <div className="mb-3">
            <label htmlFor="emailFuncionario">Email do Funcionário</label>
            <input id="emailFuncionario" type="email" className={`form-control ${styles.formControl}`} placeholder="Email do Funcionário" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </div>

        <div className="mb-3">
            <label htmlFor="telFuncionario">Telefone do Funcionário</label>
            <input id="telFuncionario" type="text" className={`form-control ${styles.formControl}`} placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
        </div>

        <div className="mb-3">
            <label htmlFor="salarioFuncionario">Salário do Funcionário</label>
            <input id="salarioFuncionario" type="number" step={0.01} min={0} className={`form-control ${styles.formControl}`} placeholder="Salário do Funcionário" value={salario} onChange={(e) => setSalario(e.target.value)} required />
        </div>

        <div className="mb-3">
            <label htmlFor="statusFuncionario">Status do Funcionário</label>
            <select id="statusFuncionario" className={`form-select ${styles.formControl}`} value={status} onChange={(e) => setStatus(e.target.value as any)} >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="ferias">Férias</option>
            </select>
        </div>

        <div className="mb-3">
            <label htmlFor="fotoFuncionario">Foto do Funcionário</label>
            <input id="fotoFuncionario" type="file" className="form-control" accept="image/*" onChange={(e) => setFoto(e.target.files?.[0] ?? null)} />
        </div>

        <button type="submit" className="btn btn-primary" disabled={sending}>
            {sending ? "Cadastrando..." : "Cadastrar Funcionário"}
        </button>
    </form>
    </div>
    </div>
);
}

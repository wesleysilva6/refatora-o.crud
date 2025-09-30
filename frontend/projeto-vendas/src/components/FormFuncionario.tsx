import { useState } from "react";
import { api } from "../api";
import styles from "./Form.module.css";

export default function FormFuncionario() {
    const [nome, setNome] = useState("");
    const [cargo, setCargo] = useState("Estoquista");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [salario, setSalario] = useState<string>("");
    const [status, setStatus] = useState("ativo");
    const [foto, setFoto] = useState<File | null>(null);
    const [sending, setSending] = useState(false);

async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
        const fd = new FormData();
        fd.append("nome", nome);
        fd.append("cargo", cargo); // Vendedor | Estoquista | Gerente
        fd.append("email", email);
        if (telefone) fd.append("telefone", telefone);
        if (salario) fd.append("salario", salario);
        fd.append("status", status); // ativo | inativo
        if (foto) fd.append("foto", foto);

    await api.post("/funcionarios", fd, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    setNome("");
    setCargo("Estoquista");
    setEmail("");
    setTelefone("");
    setSalario("");
    setStatus("ativo");
    setFoto(null);
    alert("Funcionário cadastrado!");
        } catch (err: any) {
        alert(err?.response?.data?.message ?? "Falha ao cadastrar funcionário");
        } finally {
        setSending(false);
        }
    }

return (
    <div className="min-vh-100 d-flex">
    <form onSubmit={onSubmit} className="w-100" style={{ maxWidth: 520 }}>
        <div className="mb-3">
            <label htmlFor="nomeFuncionario">Nome do Funcionário</label>
            <input id="nomeFuncionario" type="text" className={`form-control ${styles.formControl}`} placeholder="Nome do Funcionário" required value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>

        <div className="mb-3">
            <label htmlFor="cargoFuncionario">Cargo Funcionário</label>
            <select id="cargoFuncionario" className={`form-select ${styles.formControl}`} required value={cargo} onChange={(e) => setCargo(e.target.value)} >
                <option value="Estoquista">Estoquista</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Gerente">Gerente</option>
            </select>
        </div>

        <div className="mb-3">
            <label htmlFor="emailFuncionario">Email do Funcionário</label>
            <input id="emailFuncionario" type="email" className={`form-control ${styles.formControl}`} placeholder="Email do Funcionário" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="mb-3">
            <label htmlFor="telFuncionario">Telefone do Funcionário</label>
            <input id="telFuncionario" type="text" className={`form-control ${styles.formControl}`} placeholder="Telefone (Opcional)" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        </div>

        <div className="mb-3">
            <label htmlFor="salarioFuncionario">Salário do Funcionário</label>
            <input id="salarioFuncionario" type="number" step={0.01} min={0} className={`form-control ${styles.formControl}`} placeholder="Salário do Funcionário" value={salario} onChange={(e) => setSalario(e.target.value)} />
        </div>

        <div className="mb-3">
            <label htmlFor="statusFuncionario">Status do Funcionário</label>
            <select id="statusFuncionario" className={`form-select ${styles.formControl}`} value={status} onChange={(e) => setStatus(e.target.value)} >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
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
);
}

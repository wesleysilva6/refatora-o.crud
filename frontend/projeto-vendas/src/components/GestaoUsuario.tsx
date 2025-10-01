import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { confirmacao, toast } from "../lib/swal";
import styles from "./Gestao.module.css";

type Cargo = "Vendedor" | "Estoquista" | "Gerente";
type Status = "ativo" | "inativo" | "ferias";

type Funcionario = {
    id: number;
    nome: string;
    email: string;
    telefone?: string | null;
    cargo: Cargo;
    status: Status;
    foto?: string | null;
    data_admissao?: string | null; // ISO
};

const CARGOS: Cargo[] = ["Vendedor", "Estoquista", "Gerente"];

export default function UserManagement() {
    const [q, setQ] = useState("");
    const [cargo, setCargo] = useState<"" | Cargo>("");
    const [status, setStatus] = useState<"" | Status>("");
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState<Funcionario[]>([]);
    const [err, setErr] = useState<string | null>(null);

async function fetchData() {
    setLoading(true);
    setErr(null);
    try {
        const { data } = await api.get<Funcionario[]>("/funcionarios", {
            params: { q, cargo, status },
        });
        setList(Array.isArray(data) ? data : []);
    } catch (e: any) {
        setErr(e?.response?.data?.message ?? "Falha ao carregar funcionários");
        setList([]);
    } finally {
        setLoading(false);
    }
}

useEffect(() => {
    fetchData();
}, []);

const visible = useMemo(() => {
    return list.filter((f) => {
        const okQ =
            !q ||
            f.nome?.toLowerCase().includes(q.toLowerCase()) ||
            f.email?.toLowerCase().includes(q.toLowerCase());
            const okCargo = !cargo || f.cargo === cargo;
            const okStatus = !status || f.status === status;
            return okQ && okCargo && okStatus;
    });
}, [list, q, cargo, status]);

async function toggleStatus(f: Funcionario) {
    const vaiDesligar = f.status === "ativo";
    const res = await confirmacao({
        title: vaiDesligar ? "Demitir funcionário?" : "Reativar funcionário?",
        text: vaiDesligar
            ? `${f.nome} permanecerá no histórico, mas ficará inativo.`
            : `Reativar ${f.nome} como ${f.cargo}?`,
        icon: vaiDesligar ? "warning" : "question",
        confirmText: vaiDesligar ? "Confirmar demissão" : "Reativar",
        confirmColor: vaiDesligar ? "#dc3545" : "#198754",
    });
    if (!res.isConfirmed) return;

    try {
    const novo = vaiDesligar ? "inativo" : "ativo";
    await api.patch(`/funcionarios/${f.id}`, { status: novo }); // ajuste no seu backend
        setList((old) => old.map((x) => (x.id === f.id ? { ...x, status: novo as Status } : x)));
        toast.fire({ icon: "success", title: vaiDesligar ? "Demitido" : "Reativado" });
    } catch (e: any) {
        toast.fire({
            icon: "error",
            title: e?.response?.data?.message ?? "Falha ao atualizar status",
        });
    }
}

    function onEdit(f: Funcionario) {
    // aqui você pode abrir um modal de edição ou navegar para outra página
    // ex.: navigate(`/sistema/usuarios/${f.id}/editar`)
    toast.fire({ icon: "info", title: "Abrir modal de edição (implantar)" });
}

return (
    <div className="min-vh-100 d-flex flex-column">

    <div className={`container ${styles.container}`}>
        <h2>Gestão de Usuários</h2>

        <div className={styles.filters}>
        <input className={styles.search} placeholder="Pesquisar por nome ou e-mail..." value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchData()} />

        <select className={styles.select} value={cargo} onChange={(e) => setCargo(e.target.value as any)}>
            <option value="">Todos os cargos</option>
            {CARGOS.map((c) => (
                <option key={c} value={c}>
                    {c}
                </option>
            ))}
        </select>

        <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="">Todos os status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
        </select>

        <button className={`btn btn-primary ${styles.btn}`} onClick={fetchData} disabled={loading}>
            {loading ? "Carregando..." : "Aplicar"}
        </button>
        </div>

        {err && <div className={`alert alert-danger ${styles.alert}`}>{err}</div>}

        {loading ? (
        <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`${styles.card} ${styles.skeleton}`} />
            ))}
        </div>
        ) : visible.length === 0 ? (
        <div className={styles.empty}>
            <div className={styles.emptyArt} />
                <p>Nenhum usuário encontrado.</p>
            </div>
        ) : (
            <div className={styles.grid}>
                {visible.map((f) => (
                    <FuncionarioCard key={f.id} data={f} onToggleStatus={() => toggleStatus(f)} onEdit={() => onEdit(f)} />
                ))}
            </div>
        )}
        </div>
    </div>
);
}

    function FuncionarioCard({
        data,
        onToggleStatus,
        onEdit,
    }: {
        data: Funcionario;
        onToggleStatus: () => void;
        onEdit: () => void;
        }) {
        const { nome, email, telefone, cargo, status, foto } = data;

return (
    <div className={styles.card}>
        <div className={styles.left}>
            <div className={styles.avatar}>
                {foto ? <img src={foto} alt={nome} /> : <span>{iniciais(nome)}</span>}
            </div>

        <div className={styles.info}>
            <div className={styles.name}>{nome}</div>
            <div className={styles.sub}>
                <span>{email}</span>
                    {telefone ? <span className={styles.dot}>•</span> : null}
                    {telefone ? <span>{telefone}</span> : null}
            </div>

            <div className={styles.badges}>
                <span className={`${styles.badge} ${styles[`cargo_${cargo}`]}`}>{cargo}</span>
                <span className={`${styles.pill} ${status === "ativo" ? styles.ok : styles.muted}`}>{status}</span>
            </div>
        </div>
        </div>

    <div className={styles.actions}>
        <button className={`btn btn-sm ${styles.iconBtn}`} onClick={onEdit} title="Editar">
            <i className="bi bi-pencil-square" />
        </button>

        <button className={`btn btn-sm ${styles.iconBtn}`} onClick={onToggleStatus} title={status === "ativo" ? "Demitir" : "Reativar"} > {status === "ativo" ? <i className="bi bi-person-dash" /> : <i className="bi bi-person-check" />}
        </button>
    </div>
    </div>
);
}

    function iniciais(nome: string) {
        const parts = nome.trim().split(/\s+/);
        const first = parts[0]?.[0] ?? "";
        const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
        return (first + last).toUpperCase();
    }

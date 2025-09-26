import { useEffect, useState } from "react";
import { api } from "../api";

type Funcionario = {
    id: number;
    nome: string;
    cargo: string; 
    email: string;
    telefone: string;
    salario: number;
    status: "ativo" | "inativo";
    foto?: string | null;
    data_admissao?: string;
};

export default function FuncionariosPanel() {
    const [itens, setItens] = useState<Funcionario[]>([]);
    const [loading, setLoading] = useState(false);

useEffect(() => {
    (async () => {
        try {
        setLoading(true);
        const { data } = await api.get<Funcionario[]>("/funcionarios"); 
        setItens(data);
    } finally {
        setLoading(false);
    }
    })();
}, []);

return (
    <div className="card">
        <div className="card-body">
        {loading ? (
            <div className="text-muted">Carregando…</div>
        ) : itens.length === 0 ? (
            <div className="text-muted">Nenhum funcionário cadastrado.</div>
        ) : (
        <div className="table-responsive">
            <table className="table">
            <thead>
                <tr>
                    <th>Foto</th>
                    <th>Nome</th>
                    <th>Cargo</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Salário</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {itens.map(f => (
                <tr key={f.id}>
                    <td>
                        {f.foto ? (
                        <img src={f.foto} alt={f.nome} width={40} height={40} style={{ objectFit: "cover", borderRadius: 8 }} />
                        ) : ( <span className="text-muted">—</span> )}
                    </td>
                        <td>{f.nome}</td>
                        <td>{f.cargo}</td>
                        <td>{f.email}</td>
                        <td>{f.telefone}</td>
                        <td>R$ {Number(f.salario).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                        <td>{f.status === "ativo" ? "Ativo" : "Inativo"}</td>
                </tr>
                ))}
            </tbody>
        </table>
        </div>
        )}
    </div>
    </div>
);
}

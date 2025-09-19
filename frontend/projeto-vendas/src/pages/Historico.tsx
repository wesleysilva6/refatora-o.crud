import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import styles from "./Historico.module.css";
import { api } from "../api";

type ItemHistorico = {
    id_item: number;
    cliente: string;
    criada_em: string;
    nome_produto: string;
    quantidade: number;
    preco: number;
    subtotal: number;
};

export default function Historico() {
    const [historico, setHistorico] = useState<ItemHistorico[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarHistorico();
    }, []);

// Historico.tsx (substitua carregarHistorico por isto)
    async function carregarHistorico() {
    setLoading(true);
    try {
        const { data } = await api.get("/simulacoes"); // pode vir [{id,..., cliente, criado_em, itens:[...]}]
        const rows: ItemHistorico[] = Array.isArray(data)
        ? data.flatMap((s: any) =>
            (s.itens ?? []).map((i: any) => ({
                id_item: i.id,
                cliente: s.cliente,
                criada_em: s.criado_em ?? s.created_at ?? "", // compat
                nome_produto: i.nome_produto,
                quantidade: Number(i.quantidade ?? 0),
                preco: Number(i.preco ?? 0),
                subtotal: Number(i.subtotal ?? 0),
            }))
            )
        : [];
        setHistorico(rows);
    } catch {
        setHistorico([]);
    } finally {
        setLoading(false);
    }
}

    async function deletarItem(id_item: number) {
        await api.delete(`/simulacoes/item/${id_item}`);
        setHistorico(historico.filter(item => item.id_item !== id_item));
    }

    async function limparHistorico() {
        await api.delete("/simulacoes");
        setHistorico([]);
    }

    const total = historico.reduce((acc, item) => acc + item.subtotal, 0);

    return (
        <div className="min-vh-100 d-flex flex-column">
            <Sidebar />

            <div className={`card ${styles.card}`}>
                <div className={`card-header ${styles.cardHeader}`}>
                    <h5 className="card-title mt-2">Histórico de Simulações</h5>
                </div>

                <div className={`card-body ${styles.cardBody}`}>
                    <div className="mb-3">
                        <table className={`table table-striped ${styles.table}`}>
                            <thead>
                                <tr>
                                    <th>Nome Cliente</th>
                                    <th>Produto</th>
                                    <th>Quantidade</th>
                                    <th>Preço</th>
                                    <th>Criada em</th>
                                    <th>Subtotal</th>
                                    <th>Deletar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center">Carregando...</td>
                                    </tr>
                                ) : historico.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center">Nenhuma simulação encontrada.</td>
                                    </tr>
                                ) : (
                                    historico.map(linha => (
                                        <tr key={linha.id_item}>
                                            <td>{linha.cliente}</td>
                                            <td>{linha.nome_produto}</td>
                                            <td>{linha.quantidade}</td>
                                            <td>R$ {linha.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                                            <td>{linha.criada_em}</td>
                                            <td>R$ {linha.subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                                            <td>
                                                <button
                                                    className={`btn btn-sm ${styles.btnExcluir}`}
                                                    onClick={() => deletarItem(linha.id_item)}
                                                    title="Deletar item">
                                                    <span className="icon"><i className={`bi bi-trash3`}></i></span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            <tfoot>
                                <tr className="table-dark">
                                    <th colSpan={5} className="text-end text-white">Subtotal Geral:</th>
                                    <th>R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</th>
                                    <th></th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button
                            className={`btn ${styles.btnExcluirSimulacoes}`}
                            onClick={limparHistorico}
                            disabled={historico.length === 0} >
                            Excluir todas as Simulações
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
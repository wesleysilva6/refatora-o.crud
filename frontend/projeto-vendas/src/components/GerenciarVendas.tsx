import { useEffect, useMemo, useState } from "react";
import { api } from "../api"; // sua instância axios
import styles from "./GerenciarVendas.module.css";

type Venda = {
    id: number;
    cliente: string;
    telefone?: string | null;
    funcionario?: { id: number; nome: string } | null;
    total: number;
    realizada_em: string; // ISO vindo do backend
};

type Paginacao<T> = {
    data: T[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
};

export default function GerenciarVendas() {
    const [de, setDe] = useState<string>("");   
    const [ate, setAte] = useState<string>(""); 
    const [q, setQ] = useState<string>("");     
    const [page, setPage] = useState<number>(1);
    const [rows, setRows] = useState<number>(10);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [resp, setResp] = useState<Paginacao<Venda> | null>(null);

    const fmtBRL = (v: number) =>
        new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

    const fmtDateTime = (iso: string) =>
        new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
        }).format(new Date(iso));

async function carregar(resetPage = false) {
    setLoading(true);
    setErro(null);
    try {
        const params: any = { page: resetPage ? 1 : page, per_page: rows };
        if (de) params.from = de;
        if (ate) params.to = ate;
        if (q.trim()) params.q = q.trim();

        const { data } = await api.get<Paginacao<Venda>>("/vendas", { params });
        setResp(data);
        if (resetPage) setPage(1);
    } catch (e: any) {
        setErro(e?.response?.data?.message ?? "Falha ao carregar vendas");
        setResp(null);
    } finally {
        setLoading(false);
    }
}

    useEffect(() => { carregar(true); }, []);

    useEffect(() => { carregar(); }, [page, rows]);

    const totalPeriodo = useMemo(
        () => (resp?.data ?? []).reduce((acc, v) => acc + Number(v.total || 0), 0),
        [resp]
    );

return (
    <div className={`container-fluid ${styles.containerFluid}`}>
        <div className={`card mb-3 ${styles.cardContainer}`}>
            <div className={`card-body ${styles.cardFiltrar}`}>
                <div className="row g-3">
                    <div className="col-sm-12 col-md-3">
                        <label className={`form-label ${styles.label}`}>De</label>
                        <input type="date" value={de} onChange={(e) => setDe(e.target.value)} className={`form-control ${styles.formControl}`} />
                    </div>

            <div className="col-sm-12 col-md-3">
                <label className={`form-label ${styles.label}`}>Até</label>
                <input type="date" value={ate} onChange={(e) => setAte(e.target.value)} className={`form-control ${styles.formControl}`} />
            </div>

            <div className="col-sm-12 col-md-4">
                <label className={`form-label ${styles.label}`}>Buscar (cliente/telefone)</label>
                <input value={q} onChange={(e) => setQ(e.target.value)} className={`form-control ${styles.formControl}`} placeholder="ex: Maria, 11 9xxxx-xxxx" />
            </div>

            <div className="col-sm-12 col-md-2 d-flex align-items-end gap-2">
                <button className={`btn btn-primary w-100 ${styles.btnFiltrar}`} onClick={() => carregar(true)}>
                    Aplicar filtros
                </button>
            </div>

            </div>
        </div>
    </div>

        <div className="row g-3 mb-3">
            <div className="col-12 col-md-6 col-xl-2">
                <div className={`card ${styles.cardContainer}`}>
                    <div className={`card-body ${styles.cardVendas}`}>
                        <div className="text-white small">Vendas listadas</div>
                        <div className="fs-4">{resp?.total ?? 0}</div>
                    </div>
                </div>
            </div>

            <div className="col-12 col-md-6 col-xl-2">
                <div className={`card ${styles.cardContainer}`}>
                    <div className={`card-body ${styles.cardVendasPeriodo}`}>
                        <div className="text-white small">Total no período</div>
                        <div className="fs-4">{fmtBRL(totalPeriodo)}</div>
                    </div>
                </div>
            </div>
        </div>

    <div className={`card ${styles.cardContainer}`}>
        <div className={`card-body ${styles.cardBody}`}>
            {erro && <div className="alert alert-danger mb-3">{erro}</div>}
            {loading ? (
                <div className="text-center py-4">Carregando…</div>
            ) : (
            <>
            <div className={`table-responsive ${styles?.tableResponsive ?? ""}`}>
                <table className={`table table-dark table-striped align-middle mb-0 ${styles?.table ?? ""}`} >
                    <thead>
                        <tr>
                            <th>Data/Hora</th>
                            <th>Cliente</th>
                            <th>Vendedor(a)</th>
                            <th>Telefone</th>
                            <th className="text-end">Total</th>
                        </tr> 
                    </thead>
                    <tbody>
                    {(resp?.data ?? []).length === 0 ? (
                        <tr>
                        <td colSpan={6} className="text-center text-muted py-4">
                            Nenhuma venda encontrada.
                        </td>
                        </tr>
                    ) : (
                        resp!.data.map((v) => (
                        <tr key={v.id}>
                            <td className={styles.nowrap}>{fmtDateTime(v.realizada_em)}</td>
                            <td className={styles.clientCell}> <span title={v.cliente}>{v.cliente}</span> </td>
                            <td>{v.funcionario?.nome ?? "—"}</td>
                            <td className={styles.nowrap}>{v.telefone ?? "—"}</td>
                            <td className={`text-end fw-semibold ${styles.money}`}>
                            {fmtBRL(v.total)}
                            </td>
                        </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-2">
                <div className="d-flex align-items-center gap-2">
                    <span>Linhas:</span>
                    <select value={rows} onChange={(e) => setRows(Number(e.target.value))} className="form-select form-select-sm" style={{ width: 90 }} >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-sm btn-outline-secondary" disabled={!resp || page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} >
                        ‹ Anterior
                    </button>
                    <span className="small">
                        pág. {resp?.current_page ?? page} / {resp?.last_page ?? 1}
                    </span>
                    <button className="btn btn-sm btn-outline-secondary" disabled={!resp || page >= (resp?.last_page ?? 1)} onClick={() => setPage((p) => p + 1)} >
                    Próxima ›
                    </button>
                </div>
            </div>
            </>
        )}
        </div>
    </div>
    </div>
);
}

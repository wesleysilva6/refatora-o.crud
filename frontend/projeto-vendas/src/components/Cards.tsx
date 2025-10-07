import { useEffect, useState } from "react";
import SalesCard from "./SalesCard";
import { api } from "../api";
import { fmtBRL } from "../utils/number";

type Metrics = {
    hoje: { total: number; diff_pct_vs_ontem: number | null };
    mes: { total: number; diff_pct_vs_mes_anterior: number | null };
    estoque_baixo: { qtd: number; limite: number };
};

export default function Cards() {
    const [data, setData] = useState<Metrics | null>(null);
    const [loading, setLoading] = useState(true);

    async function load() {
        setLoading(true);
        try {
            const { data } = await api.get<Metrics>("/dashboard/metrics");
            setData(data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // opcional: auto-refresh a cada 60s
        const id = setInterval(load, 10000);
        return () => clearInterval(id);
    }, []);

    const vendasHojeValue = data ? fmtBRL(data.hoje.total) : "—";
    const vendasHojeSub =
        data?.hoje.diff_pct_vs_ontem == null
        ? "sem base"
        : `${data.hoje.diff_pct_vs_ontem >= 0 ? "↑" : "↓"} ${Math.abs(data.hoje.diff_pct_vs_ontem)}% vs ontem`;

    const vendasMesValue = data ? fmtBRL(data.mes.total) : "—";
    const vendasMesSub =
        data?.mes.diff_pct_vs_mes_anterior == null
        ? "sem base"
        : `${data.mes.diff_pct_vs_mes_anterior >= 0 ? "↑" : "↓"} ${Math.abs(data.mes.diff_pct_vs_mes_anterior)}% vs mês passado`;

    const estoqueBaixoValue = data ? String(data.estoque_baixo.qtd) : "—";
    const estoqueBaixoSub = data ? `itens < ${data.estoque_baixo.limite}` : "";

return (
    <div className="container-fluid">
    <div className="row g-4">
        <div className="col-12 col-md-6 col-xl-3">
            <SalesCard title="Vendas de Hoje" value={vendasHojeValue} subtitle={vendasHojeSub} tone={(data?.hoje.diff_pct_vs_ontem ?? 0) >= 0 ? "success" : "danger"} icon={<i className="bi bi-cash-stack" />} />
        </div>

        <div className="col-12 col-md-6 col-xl-4">
            <SalesCard title="Vendas do Mês" value={vendasMesValue} subtitle={vendasMesSub} tone={(data?.mes.diff_pct_vs_mes_anterior ?? 0) >= 0 ? "primary" : "danger"} icon={<i className="bi bi-graph-up" />} />
        </div>

        <div className="col-12 col-md-6 col-xl-3">
            <SalesCard title="Estoque Baixo" value={estoqueBaixoValue} subtitle={estoqueBaixoSub} tone="danger" icon={<i className="bi bi-exclamation-triangle" />} />
        </div>
    </div>
    </div>
);
}

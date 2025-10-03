import SalesCard from "./SalesCard";






export default function Cards() {
return (
    <div className="container-fluid">
        <div className="row g-4">
            <div className="col-12 col-md-6 col-xl-3">
                <SalesCard title="Vendas de Hoje" value="R$ 1.289,30" subtitle="↑ 12% vs ontem" tone="success" icon={<i className="bi bi-cash-stack" />} />
            </div>

        <div className="col-12 col-md-6 col-xl-4">
            <SalesCard title="Vendas do Mês" value="R$ 18.230,00" subtitle="↑ 8% vs mês passado" tone="primary" icon={<i className="bi bi-graph-up" />} />
        </div>

        <div className="col-12 col-md-6 col-xl-3">
            <SalesCard title="Estoque Baixo" value="10" subtitle="itens com alerta" tone="danger" icon={<i className="bi bi-exclamation-triangle" />} />
        </div>
    </div>
    </div>
);
}

import { useEffect, useState } from "react";
import SalesSidebar from "../components/SalesSidebar";
import { api } from "../api";
import styles from "./Dashboard.module.css"
import Cards from "../components/Cards"

type Produto = {
    id: number;
    nome_produto: string;
    preco: number;
    quantidade: number;
};

type DashboardData = {
    total_produtos: number;
    total_unidades: number;
    produtos_estoque_baixo: number;
    produtos: Produto[];
};

type Me = { nome: string; email: string; foto?: string | null };

export default function Dashboard() {
    const [collapsed, setCollapsed] = useState(false);
    const [me, setMe] = useState<Me | null>(null);
    const [search, setSearch] = useState("");
    const [data, setData] = useState<DashboardData>({
    total_produtos: 0,
    total_unidades: 0,
    produtos_estoque_baixo: 70,
    produtos: [],
});

useEffect(() => {
    (async () => {
        try {
        const [{ data: meData }, { data: dash }] = await Promise.all([
            api.get("/me"),
            api.get("/dashboard"),
        ]);
        setMe(meData);
        setData({
            total_produtos: dash.total_produtos ?? 0,
            total_unidades: dash.total_unidades ?? 0,
            produtos_estoque_baixo: dash.produtos_estoque_baixo ?? 0,
            produtos: Array.isArray(dash.produtos) ? dash.produtos : [],
        });
        } catch {

        }
    })();
}, []);

    const produtosFiltrados = data.produtos.filter((p) =>
        p.nome_produto.toLowerCase().includes(search.toLowerCase())
    );

return (
    <div className="min-vh-100" style={{ overflowX: "hidden" }}>
        <SalesSidebar collapsed={collapsed} />

    <div className={`content ${collapsed ? "expanded" : ""}`} id="content" style={{ marginLeft: collapsed ? 150 : 250, transition: "margin-left 0.3s"}}>
        <div className="dash d-flex justify-content-between align-items-center mb-4">
            <button id="toggleSidebar" onClick={() => setCollapsed((c) => !c)}>
                <i className={`bi ${collapsed ? "bi-arrow-bar-right" : "bi-arrow-bar-left"}`} />
            </button>

            <h2>Dashboard</h2>

        <div className="d-flex align-items-center"></div>
        </div>

    <div className={`row g-3 mb-4`}>
        <Cards/>
    </div>

        <div className="row g-3">

        <div className="col-md-6">
            <div className={`card p-3 ${styles.card}`}>
                <h6 className="mb-3">Estoque - Quantidade de Produtos</h6>

                <table className={`table ${styles.tableCustom}`}>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Preço</th>
                            <th>Estoque</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody className={`${styles.tbody}`}>
                        {produtosFiltrados.length > 0 ? ( produtosFiltrados.map((produto) => (
                        <tr key={produto.id}>
                            <td>{produto.nome_produto}</td>
                            <td>{`R$ ${Number(produto.preco).toFixed(2).replace('.',',')}`}</td>
                            <td>{produto.quantidade}</td>
                            <td> <button className="btn btn-sm btn-primary">Selecionar</button> </td>
                        </tr> )) ) : (
                    <tr>
                        <td colSpan={4} className="text-center"> Nenhum produto cadastrado </td>
                    </tr> )}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="col-md-4">
            <div className={`card p-3 ${styles.card}`}>
                <div className={`card-header ${styles.cardHeader}`}>
                    <h5 className="card-title">Últimos Alertas</h5>
                </div>
                <div className={`card-body ${styles.cardBody}`}>
                    <div className="mb-3">
                        <ul className={`list-group ${styles.ul}`}>
                            <li className={`list-group-item ${styles.li}`}> 
                                g6
                            </li>

                            <li className={`list-group-item ${styles.li}`}> 
                                
                            </li>




                        </ul>
                    </div>
                </div>
            </div>
        </div>

        </div>
    </div>
    </div>
);}

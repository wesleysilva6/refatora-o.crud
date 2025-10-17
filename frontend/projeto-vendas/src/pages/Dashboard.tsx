import { useState, useEffect, useMemo } from "react";
import SalesSidebar from "../components/SalesSidebar";
import styles from "./Dashboard.module.css"
import Cards from "../components/Cards"
import { api } from "../api";
import { toast } from "../lib/swal";

type Produto = {
    id: number;
    nome_produto: string;
    preco: number;
    quantidade: number;
};

export default function Dashboard() {
    const [collapsed, setCollapsed] = useState(false);
    const [search, setSearch] = useState("");
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarProdutos() {
            setLoading(true);
            try {
                const { data } = await api.get<any[]>("/topicos-with-produtos");
                const allProdutos: Produto[] = data.flatMap((t: any) =>
                    (t.produtos || []).map((p: any) => ({
                        id: p.id,
                        nome_produto: p.nome_produto,
                        quantidade: Number(p.quantidade) ?? 0,
                        preco: Number(p.preco) ?? 0,
                    }))
                );
                setProdutos(allProdutos);
            } catch (e) {
                toast.fire({ icon: "error", title: "Falha ao carregar produtos." });
            } finally {
                setLoading(false);
            }
        }
        carregarProdutos();
    }, []);

    const produtosFiltrados = produtos.filter((p) =>
        p.nome_produto.toLowerCase().includes(search.toLowerCase())
    );

    const produtosAlerta = useMemo(() => produtos.filter(p => p.quantidade < 10), [produtos]);

return (
    <div className="min-vh-100" style={{ overflowX: "hidden" }}>
        <SalesSidebar collapsed={collapsed} />

    <div className={`content ${collapsed ? "expanded" : ""}`} id="content" style={{ marginLeft: collapsed ? 150 : 250, transition: "margin-left 0.3s"}}>
        <div className="dash d-flex justify-content-between align-items-center mb-4">
            <button id="toggleSidebar" onClick={() => setCollapsed((c) => !c)}>
                <i className={`bi  ${styles.icon} ${collapsed ? "bi-arrow-bar-right" : "bi-arrow-bar-left"}`} />
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
                <div className="mb-3">
                    <input type="text" className={`form-control ${styles.formControl}`} placeholder="Buscar produto..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                <table className={`table table-dark table-striped table-hover align-middle mb-0 ${styles?.table ?? ""}`}>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Preço</th>
                            <th>Estoque</th>
                        </tr>
                    </thead>
                    <tbody className={`${styles.tbody}`}>
                        {loading ? (
                            <tr><td colSpan={3} className="text-center">Carregando...</td></tr>
                        ) : produtosFiltrados.length > 0 ? ( 
                            produtosFiltrados.map((produto) => (
                        <tr key={produto.id}>
                            <td>{produto.nome_produto}</td>
                            <td>{`R$ ${Number(produto.preco).toFixed(2).replace('.',',')}`}</td>
                            <td>{produto.quantidade}</td>
                        </tr> )) ) : (
                    <tr>
                        <td colSpan={3} className="text-center"> Nenhum produto encontrado </td>
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
                        {loading ? (
                            <div className="text-center">Carregando...</div>
                        ) : produtosAlerta.length === 0 ? (
                            <div className="text-center">Nenhum alerta de estoque baixo.</div>
                        ) : (
                            <ul className={`list-group ${styles.ul}`}>
                                {produtosAlerta.map(p => (
                                    <li key={p.id} className={`list-group-item d-flex justify-content-between align-items-center ${styles.li}`}>
                                        <i className="bi bi-exclamation-triangle"></i>
                                        {p.nome_produto}
                                        <span className={`badge bg-danger rounded-pill`}>
                                            {p.quantidade}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </div>
    </div>
    </div>
);}

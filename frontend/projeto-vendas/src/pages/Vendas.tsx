import { useMemo, useState, useEffect } from "react";
import styles from "./Vendas.module.css";
import SalesSidebar from "../components/SalesSidebar";
import { api } from "../api";
import { confirmacao, toast } from "../lib/swal";

type Produto = {
    id: number | string;
    nome_produto: string;
    preco: number;
    descricao?: string | null;
    imagem?: string | null;
    foto?: string | null;  
    quantidade: number;    
};

type Func = { 
    id: number | string; 
    nome: string 
};

type CarrinhoItem = {
    id: number | string;          // id do produto
    nome_produto: string;
    preco: number;
    quantidade: number;
    subtotal: number;
};

export default function Vendas() {
    const [collapsed, setCollapsed] = useState(false);
    const [cliente, setCliente] = useState("");
    const [telefone, setTelefone] = useState("");
    const [funcionarioId, setFuncionarioId] = useState<string>("");
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [funcionarios, setFuncionarios] = useState<Func[]>([]);
    const [produtoId, setProdutoId] = useState<string>("");
    const produtoSel = useMemo( () => produtos.find((p) => String(p.id) === produtoId), [produtos, produtoId]);
    const [quantidade, setQuantidade] = useState<number>(1);
    const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
    const total = useMemo(() => carrinho.reduce((acc, it) => acc + it.subtotal, 0),[carrinho]);

    useEffect(() => setQuantidade(1), [produtoId]);
        const fmtBRL = (v?: number) =>
            typeof v === "number"
            ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
            : "-";
    const estoqueDisponivel = produtoSel?.quantidade ?? 0;
    const foto = produtoSel?.imagem || produtoSel?.foto || undefined;

    useEffect(() => {
        (async () => {
        const { data } = await api.get("/topicos-with-produtos");
        const all: Produto[] = data.flatMap((t: any) =>
            (t.produtos || []).map((p: any) => ({
            id: p.id,
            nome_produto: p.nome_produto,
            quantidade: Number(p.quantidade) ?? 0,
            preco: Number(p.preco) ?? 0,
            descricao: p.descricao ?? null,
            imagem: p.imagem ?? null,
            }))
        );
        setProdutos(all);
        })().catch(() => {
        toast.fire({ icon: "error", title: "Falha ao carregar produtos" });
        });
    }, []);

    useEffect(() => {
        (async () => {
        const res = await api.get("/funcionario/vendedor");
        const arr = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setFuncionarios(arr.map((f: any) => ({ id: f.id, nome: f.nome })));
        })().catch(() => {
        toast.fire({ icon: "error", title: "Falha ao carregar vendedores" });
        });
    }, []);

    function handleAddCarrinho(e: React.FormEvent) {
        e.preventDefault();
        if (!produtoSel) return;

        const qtd = Math.max(1, Math.min(estoqueDisponivel || 1, quantidade || 1));
        if (qtd > (estoqueDisponivel || 0)) {
            toast.fire({ icon: "warning", title: "Quantidade acima do estoque" });
            return;
    }

    setCarrinho((prev) => {
        const idx = prev.findIndex((it) => String(it.id) === String(produtoSel.id));
        if (idx >= 0) {
            const novaQtd = Math.min(prev[idx].quantidade + qtd, estoqueDisponivel || prev[idx].quantidade);
            const novo = [...prev];
            novo[idx] = {
                ...novo[idx],
                quantidade: novaQtd,
                subtotal: novaQtd * novo[idx].preco,};
        return novo;
    }
    return [
        ...prev,
        {
            id: produtoSel.id,
            nome_produto: produtoSel.nome_produto,
            preco: produtoSel.preco,
            quantidade: qtd,
            subtotal: qtd * produtoSel.preco,
        },
    ];
    });

    toast.fire({ icon: "success", title: "Adicionado ao carrinho" });
    setProdutoId("");
    setQuantidade(1);
}

    function removerItem(id: string | number) {
        setCarrinho((prev) => prev.filter((it) => String(it.id) !== String(id)));
    }

    function alterarQtd(id: string | number, qtdStr: string) {
        const produto = produtos.find((p) => String(p.id) === String(id));
        const limite = produto?.quantidade ?? 1;

        const qtd = Math.max(1, Math.min(limite, Number(qtdStr) || 1));
        setCarrinho((prev) =>
            prev.map((it) =>
                String(it.id) === String(id)
                    ? { ...it, quantidade: qtd, subtotal: qtd * it.preco }
                : it
            )
        );
    }

async function finalizarVenda() {
    if (!cliente.trim() || !funcionarioId || carrinho.length === 0) {
        toast.fire({ icon: "warning", title: "Preencha cliente, vendedor e carrinho" });
        return;
    }

    const res = await confirmacao({
        title: "Finalizar Venda?",
        text: "Deseja realmente concluir esta venda?",
        icon: "warning",
        confirmText: "Confirmar Venda",
        confirmColor: "#198754",
    });
    if (!res.isConfirmed) return;

    try {
        await api.post("/vendas", {
            cliente,
            telefone: telefone || null,
            funcionario_id: Number(funcionarioId),
            itens: carrinho.map((it) => ({
            produto_id: Number(it.id),
            quantidade: it.quantidade,
            preco_unitario: it.preco,
        })),
    });

    toast.fire({ icon: "success", title: "Venda concluída" });
        setCliente("");
        setTelefone("");
        setFuncionarioId("");
        setProdutoId("");
        setQuantidade(1);
        setCarrinho([]);
    } catch (e: any) {
        const errors = e?.response?.data?.errors;
        const msg = errors
            ? Object.values(errors).flat().join(" | ")
            : (e?.response?.data?.message ?? "Falha ao confirmar venda");
        toast.fire({ icon: "error", title: msg });
    }
}

return (
    <div className="min-vh-100" style={{ overflowX: "hidden" }}>
        <div className={`content ${collapsed ? "expanded" : ""}`} id="content" style={{ marginLeft: collapsed ? 150 : 250, transition: "margin-left 0.3s" }} >
        <SalesSidebar collapsed={collapsed} />

        <div className="dash d-flex justify-content-between align-items-center mb-4">
            <button id="toggleSidebar" onClick={() => setCollapsed((c) => !c)}>
                <i className={`bi ${collapsed ? "bi-arrow-bar-right" : "bi-arrow-bar-left"}`} />
            </button>
        <h2>Realizar Venda</h2>
        <div />
        </div>

    <div className="row g-4">
        <div className="col-md-6">
            <div className={`card ${styles.card}`}>
                <div className={`card-header ${styles.cardHeader}`}>
                    <h5 className="text-center mt-2">Nova Venda</h5>
                </div>

            <div className="card-body">
                <form onSubmit={handleAddCarrinho}>
                    <div className="mb-3">
                        <label htmlFor="nomeCliente" className="form-label">Cliente</label>
                        <input id="nomeCliente" className={`form-control ${styles.formControl}`} placeholder="Nome do Cliente" required value={cliente} onChange={(e) => setCliente(e.target.value)} />
                    </div>

                <div className="mb-3">
                    <label htmlFor="telCliente" className="form-label">Telefone</label>
                    <input id="telCliente" className={`form-control ${styles.formControl}`} placeholder="Telefone (Opcional)" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label htmlFor="vendedor" className="form-label">Vendedor</label>
                    <select id="vendedor" className={`form-select ${styles.formControl}`} required value={funcionarioId} onChange={(e) => setFuncionarioId(e.target.value)} >
                        <option value="">Selecione um Vendedor</option>
                            {funcionarios.map((f) => (
                            <option key={f.id} value={String(f.id)}>
                                {f.nome}
                            </option>
                            ))}
                    </select>
                </div>

                    <hr />

                <div className="mb-3">
                    <label htmlFor="produto" className="form-label">Produto</label>
                    <select id="produto" className={`form-select ${styles.formControl}`} value={produtoId} onChange={(e) => setProdutoId(e.target.value)} >
                        <option value="">Selecione um Produto</option>
                            {produtos.map((p) => (
                            <option key={p.id} value={String(p.id)}>
                                {p.nome_produto}
                            </option>
                            ))}
                    </select>
                </div>

                {produtoSel && (
                    <div id="detalhesProduto d-flex">
                    {foto && (
                        <img src={foto} alt={`Foto de ${produtoSel.nome_produto}`} style={{ maxWidth: 240, borderRadius: 8, display: "block", marginBottom: 8 }} onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")} />
                    )}

                    <p className={`mb-1 ${styles.infoProduto}`}>
                        <strong>Preço: </strong> {fmtBRL(produtoSel.preco)}
                    </p>

                    <p className={`mb-1 ${styles.infoProduto}`}>
                        <strong>Estoque disponível: </strong> {estoqueDisponivel}
                    </p>

                    {produtoSel.descricao && (
                        <p className={`mb-2 ${styles.infoProduto}`}>
                            <strong>Descrição: </strong> {produtoSel.descricao}
                        </p>
                    )}

                    <label htmlFor="quantidade" className="form-label mt-2">Quantidade</label>
                    <input id="quantidade" type="number" min={1} max={estoqueDisponivel || 1} value={quantidade} onChange={(e) =>
                        setQuantidade(
                            Math.max(1, Math.min(estoqueDisponivel || 1, Number(e.target.value) || 1))
                        ) } className={`form-control ${styles.formControl}`} />

                    <button type="submit" className={`btn btn-primary mt-3 ${styles.btnVendas}`}>
                        Adicionar ao Carrinho
                    </button>
                </div>
                )}
            </form>
            </div>
        </div>
        </div>

            <div className="col-md-4">
                <div className={`card ${styles.card}`}>
                    <div className={`card-header ${styles.cardHeader}`}>
                        <h5 className="text-center mt-2">Detalhes da Venda</h5>
                    </div>

        <div className="card-body">
            <div className="table-responsive">
                <table className={`table ${styles.tableCustom}`}>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th style={{ width: 110 }}>Qtd</th>
                            <th>Unitário</th>
                            <th>Subtotal</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {carrinho.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center text-muted">
                                Carrinho vazio
                            </td>
                        </tr>
                    ) : (
                        carrinho.map((it) => {
                            const estoque = produtos.find((p) => String(p.id) === String(it.id))?.quantidade ?? 0;
                            return (
                            <tr key={String(it.id)}>
                                <td>{it.nome_produto}</td>
                                <td>
                                    <input type="number" className={`form-control ${styles.formControl}`} min={1} max={estoque || 1} value={it.quantidade} onChange={(e) => alterarQtd(it.id, e.target.value)} style={{ width: 100 }} />
                                </td>
                                <td>{fmtBRL(it.preco)}</td>
                                <td>{fmtBRL(it.subtotal)}</td>
                                <td>
                                    <button type="button" className={`btn btn-danger btn-sm ${styles.btnExcluir}`} onClick={() => removerItem(it.id)} title="Remover" >
                                        <i className="bi bi-trash3" />
                                    </button>
                                </td>
                            </tr>
                        );
                        })
                    )}
                    </tbody>

                    <tfoot>
                        <tr className="table-dark">
                            <th colSpan={3} className={`text-end`}>Total:</th>
                            <th>{fmtBRL(total)}</th>
                            <th />
                        </tr>
                    </tfoot>
                </table>
            </div>

                <button type="button" onClick={finalizarVenda} className={`btn btn-primary mt-3 w-100 ${styles.btnVendas}`} disabled={!cliente.trim() || !funcionarioId || carrinho.length === 0} >
                    Finalizar Venda
                </button>
                </div>
            </div>
            </div>

            <div className="col-md-2" />
        </div>
    </div>
</div>
);
}

import { useEffect, useState } from "react";
import { api } from "../api";
import Sidebar from "../components/Sidebar";

import styles from "./Simular.module.css";

type Produto = { id: number; nome_produto: string; quantidade: number; preco: number; topico: string };
type ItemSimulacao = { id: number; nome_produto: string; quantidade: number; preco: number; subtotal: number };

export default function Simular() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState<number | null>(null);
    const [quantidade, setQuantidade] = useState<number>(1);
    const [simulacao, setSimulacao] = useState<ItemSimulacao[]>([]);
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(false);
    const [nomeCliente, setNomeCliente] = useState<string>("");

    useEffect(() => {
        async function carregarProdutos() {
            const { data } = await api.get("/topicos-with-produtos");
            const allProdutos = data.flatMap((t: any) =>
                (t.produtos || []).map((p: any) => ({
                    id: p.id,
                    nome_produto: p.nome_produto,
                    quantidade: p.quantidade,
                    preco: p.preco, // Certifique-se que o backend retorna o preço!
                    topico: t.nome_topico,
                }))
            );
            setProdutos(allProdutos);
        }
        carregarProdutos();
    }, []);

    const estoqueSelecionado = produtos.find(p => p.id === produtoSelecionado)?.quantidade;

    function handleAdicionarSimulacao(e: React.FormEvent) {
        e.preventDefault();
        if (!produtoSelecionado) return;
        const produto = produtos.find(p => p.id === produtoSelecionado);
        if (!produto) return;
        if (quantidade < 1 || quantidade > produto.quantidade) return;

        const subtotal = produto.preco * quantidade;
        setSimulacao(prev => [
            ...prev,
            {
                id: produto.id,
                nome_produto: produto.nome_produto,
                quantidade,
                preco: produto.preco,
                subtotal,
            },
        ]);
        setQuantidade(1);
        setProdutoSelecionado(null);
        // NÃO limpe o nome do cliente aqui!
    }

    async function handleFinalizarSimulacao(e: React.FormEvent) {
        e.preventDefault();
        if (simulacao.length === 0 || !nomeCliente) return;
        setSending(true);
        try {
            await api.post("/simulacao/finalizar", {
                cliente: nomeCliente,
                itens: simulacao,
            });
            setSimulacao([]); // Limpa só os produtos
            // nomeCliente permanece
        } catch (err) {
            // Trate o erro se necessário
        } finally {
            setSending(false);
        }
    }

    function handleLimparSimulacao() {
        setSimulacao([]);
        setNomeCliente("");
    }

    const total = simulacao.reduce((acc, item) => acc + item.subtotal, 0);

    return (
        <div className="min-vh-100 d-flex flex-column">
            <Sidebar />

            <div className={`card ${styles.card}`}>
                <div className={`card-header ${styles.cardHeader}`}>
                    <h5 className="card-title mt-2">Simular Venda</h5>
                </div>

                <form onSubmit={handleAdicionarSimulacao} className="spinnerForm">
                    <div className={`card-body ${styles.cardBody}`}>
                        <label htmlFor="nomeCliente" className="form-label">Cliente</label>
                        <input type="text" id="nomeCliente" className={`form-control w-25 mb-3 ${styles.formControl}`} placeholder="Nome do Cliente" required value={nomeCliente} onChange={e => setNomeCliente(e.target.value)}/>
                        <div className="mb-3 d-flex align-items-center gap-3 flex-wrap">
                            <div className={styles.prod}>
                                <label htmlFor="produtoId" className="form-label">Produto</label>
                                <select name="produto_id" id="produtoId" className={`form-select ${styles.formSelect}`} required value={produtoSelecionado ?? ""} onChange={e => setProdutoSelecionado(Number(e.target.value) || null)} >
                                    <option value="">Selecione um produto</option>
                                    {produtos.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nome_produto}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="quantidade" className="form-label">Quantidade</label>
                                <input type="number" id="quantidade" className={`form-control ${styles.formControl} ${!produtoSelecionado ? styles.inputDisabled : ""}`}
                                placeholder="Informe a Quantidade" required min={1} max={estoqueSelecionado ?? 1} value={quantidade} onChange={e => setQuantidade(Number(e.target.value))} disabled={!produtoSelecionado} />
                                <small id="estoque-info" className="text-warning d-block">
                                    {produtoSelecionado && estoqueSelecionado !== undefined ? `Quantidade disponível no estoque: ${estoqueSelecionado}` : ""}
                                </small>
                            </div>

                            <div className="pt-4 mt-3">
                                <button type="submit" className={`btn btn-primary w-100 ${styles.btnSimular}`} disabled={sending || !produtoSelecionado}>
                                    {sending ? "Adicionando..." : "Adicionar a Simulação"}
                                </button>
                                <div className="d-flex justify-content-center">
                                    <div className="d-flex justify-content-center mt-2">
                                        {loading && (<div className="spinner-border text-primary" role="status" aria-label="Carregando" />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="mb-3 px-3">
                    <table className={`table table-striped ${styles.table}`}>
                        <thead>
                            <tr>
                                <th>Nome do Produto</th>
                                <th>Quantidade</th>
                                <th>Preço Unitário</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {simulacao.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.nome_produto}</td>
                                    <td>{item.quantidade}</td>
                                    <td>R$ {item.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                                    <td>R$ {item.subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="table-dark">
                                <th colSpan={3} className="text-end text-white">Subtotal Geral:</th>
                                <th>R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className={`card-footer ${styles.cardFooter}`}>
                    <div className="d-flex justify-content-center gap-3 w-100">
                        <button
                            type="button"
                            className={`btn btn-primary ${styles.btnSimular}`}
                            disabled={sending || simulacao.length === 0 || !nomeCliente}
                            onClick={handleFinalizarSimulacao} >
                            {sending ? "Confirmando..." : "Confirmar a Simulação"}
                        </button>
                        <button
                            type="button"
                            className={`btn btn-primary ${styles.btnSimular}`}
                            disabled={sending && simulacao.length === 0 && !nomeCliente}
                            onClick={handleLimparSimulacao} >
                            {sending ? "Limpando..." : "Limpar a Simulação"}
                        </button>
                    </div>
                    <div className="d-flex justify-content-center mt-2 w-100">
                        {sending && (
                            <div className="spinner-border text-primary" role="status" aria-label="Carregando" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
import { useEffect, useRef, useState } from "react";
import { api } from "../api";
import Sidebar from "../components/Sidebar";
import { fmtDate } from "../utils/date";
import ModalsHub, { type ModalsHandle, type Produto as ProdutoBase, type Topico as TopicoBase, } from "../components/ModalsHub";
import styles from "./Home.module.css";

type Produto = ProdutoBase;
type Topico = TopicoBase & { produtos: Produto[] };

    const fmtBRL = (v: number | string | null | undefined) => {
    const n = Number(v ?? 0);
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
    }).format(n);
    };

export default function Home() {
    const caminhoImg = import.meta.env.VITE_IMAGE_BASE_URL
    const [topicos, setTopicos] = useState<Topico[]>([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const modalsRef = useRef<ModalsHandle>(null);

    async function carregar() {
        setErro(null);
        try {
        const { data } = await api.get<any[]>("/topicos-with-produtos");
        const normalized: Topico[] = (data ?? []).map((t) => ({
            id: t.id ?? t.id_topico,
            nome_topico: t.nome_topico,
            produtos: Array.isArray(t.produtos) ? t.produtos : [],
        }));
        setTopicos(normalized);
        } catch (e: any) {
        setErro(e?.response?.data?.message ?? "Falha ao carregar");
        } finally {
        setLoading(false);
        }
    }
    useEffect(() => {
        carregar();
    }, []);

    const onCriarTopico = async (nome: string) => {
        await api.post("/topicos", { nome_topico: nome });
        await carregar();
    };

    const onSalvarProdutoNovo = async (fd: FormData) => {
        await api.post("/produtos", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        });
        await carregar();
    };

    const onSalvarEdicaoProduto = async (fd: FormData, produtoId: number) => {
        await api.post(`/produtos/${produtoId}?_method=PUT`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        });
        await carregar();
    };

    const onRemoverProduto = async (produto: number) => {
        await api.delete(`/produtos/${produto}`);
        await carregar();
    };

    const onRemoverTopico = async (topicoId: number) => {
        await api.delete(`/topicos/${topicoId}`);
        await carregar();
    };

    const abrirCriarTopico = () => modalsRef.current?.openTopico();
    const abrirNovoProduto = (t: Topico) => modalsRef.current?.openNovoProduto(t);
    const abrirEditarProduto = (p: Produto) =>
        modalsRef.current?.openEditarProduto(p);
    const confirmarRemoverProduto = (p: Produto) =>
        modalsRef.current?.openRemoverProduto(p.id);
    const confirmarRemoverTopico = (t: Topico) =>
        modalsRef.current?.openRemoverTopico(t.id);
    const abrirImagem = (url: string) => modalsRef.current?.openImagem(url);

async function exportarTudo() {
    const res = await api.get(`/exports/produtos`, { responseType: "blob" });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `estoque_${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, "-")}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
}

async function exportarTopico(t: Topico) {
    const res = await api.get(`/exports/topicos/${t.id}`, {
        responseType: "blob",
    });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `topico_${t.id}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
}

return (
    <div className="min-vh-100 d-flex flex-column">
        <Sidebar />

    <div className="d-flex justify-content-center mt-4">
        <div className="alert alert-primary text-center w-50">
            Seja Muito Bem-Vindo(a) ao seu Sistema de ESTOQUE!
        </div>
    </div>

    <div className={styles.topicos}>
        <button className="btn btn-primary m-2" onClick={abrirCriarTopico}>
            <i className="bi bi-plus-circle" /> Adicionar Tópico
        </button>
        <button className="btn btn-primary" onClick={exportarTudo}>
            <i className="bi bi-box-arrow-in-up-right" /> Exportar Tabelas
        </button>
    </div>

    <div className={`containerHome ${styles.containerHome}`}>
        {erro && <div className="alert alert-danger">{erro}</div>}
        {loading && <div className="text-muted">Carregando…</div>}

        {topicos.map((t) => (
        <div key={t.id} className={styles.topicoBlock}>
            <h4 className={styles.topicoTitle}>{t.nome_topico}</h4>

            <div className="card-body">
            <div className="table-responsive">
                <table className={`table table-striped align-middle mb-0 ${styles.table ?? ""}`} >
                    <thead>
                        <tr>
                        <th>Imagem</th>
                        <th>Produto</th>
                        <th>Preço</th>
                        <th>Quantidade</th>
                        <th>Descrição</th>
                        <th>Data de Criação</th>
                        <th>Última atualização</th>
                        <th>Editar</th>
                        <th>Excluir</th>
                        </tr>
                    </thead>

                    <tbody>
                        {(t.produtos ?? []).map((p) => (
                        <tr key={p.id}>
                            <td>
                            {p.imagem ? (
                                <img src={caminhoImg + p.imagem} width={60} height={60} style={{objectFit: "cover",borderRadius: 8,cursor: "pointer", }} onClick={() => abrirImagem(p.imagem!)} />
                            ) : (
                                <span className="text-muted">—</span>
                            )}
                        </td>

                        <td>{p.nome_produto}</td>
                        <td>{fmtBRL(p.preco)}</td>
                        <td>{p.quantidade}</td>
                        <td>{p.descricao ?? "—"}</td>
                        <td>{fmtDate(p.criado_em)}</td>
                        <td>{fmtDate(p.atualizado_em)}</td>

                        <td>
                            <button className="btn" onClick={() => abrirEditarProduto(p)} title="Editar" >
                                <i className={`bi bi-pencil-square ${styles.icon ?? ""}`} />
                            </button>
                        </td>

                        <td>
                            <button className="btn" onClick={() => confirmarRemoverProduto(p)} title="Excluir" >
                                <i className={`bi bi-trash3 ${styles.icon ?? ""}`} />
                            </button>
                        </td>
                    </tr>
                    ))}
                    {(t.produtos ?? []).length === 0 && (
                        <tr>
                            <td colSpan={9} className="text-center py-4">
                                Nenhum produto neste tópico.
                            </td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>

            <div className={styles.btnTopico}>
                <button className="btn btn-primary" onClick={() => confirmarRemoverTopico(t)} >
                    <i className="bi bi-trash3" /> Excluir Tópico
                </button>
                <button className="btn btn-primary" onClick={() => abrirNovoProduto(t)} >
                    <i className="bi bi-plus-circle" /> Adicionar Produto
                </button>
                <button className="btn btn-primary" onClick={() => exportarTopico(t)} >
                    <i className="bi bi-box-arrow-in-up-right" /> Exportar Tabela
                </button>
            </div>
        </div>
        </div>
        ))}
    </div>

    <ModalsHub
        ref={modalsRef}
        onCriarTopico={onCriarTopico}
        onSalvarProdutoNovo={onSalvarProdutoNovo}
        onSalvarEdicaoProduto={onSalvarEdicaoProduto}
        onRemoverProduto={onRemoverProduto}
        onRemoverTopico={onRemoverTopico} />
    </div>
);
}

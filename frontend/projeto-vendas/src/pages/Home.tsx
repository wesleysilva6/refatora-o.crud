import { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
import { api } from "../api";
import Sidebar from "../components/Sidebar";
import { fmtDate } from '../utils/date';

// import { AddTopicoModal, AddProdutoModal, ConfirmModal, ImagePreviewModal } from "../components/modals";

import styles from "./Home.module.css"; // opcional (CSS Module) 

type Produto = {
    id: number;
    nome_produto: string;
    preco: number;
    quantidade: number;
    descricao?: string | null;
    imagem?: string | null;
    criado_em?: string; 
    atualizado_em?: string;
    created_at?: string;
    updated_at?: string;
    topico_id: number;
};

    type Topico = { 
    id: number; 
    nome_topico: string; 
    produtos: Produto[] 
};

export default function Home() {
    const [topicos, setTopicos] = useState<Topico[]>([]); 
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    // estados de modais
    const [topicoNome, setTopicoNome] = useState("");
    const [topicoSelecionado, setTopicoSelecionado] = useState<Topico | null>(null);
    const [produtoForm, setProdutoForm] = useState<Partial<Produto>>({});
    const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
    const [imgPreview, setImgPreview] = useState<string | null>(null);

    // refs de modais
    const modalTopicoRef = useRef<HTMLDivElement>(null);
    const modalProdutoRef = useRef<HTMLDivElement>(null);
    const modalEditarRef = useRef<HTMLDivElement>(null);
    const modalImagemRef = useRef<HTMLDivElement>(null);
    const modalRemoverProdutoRef = useRef<HTMLDivElement>(null);
    const modalRemoverTopicoRef = useRef<HTMLDivElement>(null);

    function open(el: HTMLElement | null) {
        if (!el) return;
        Modal.getOrCreateInstance(el).show();
    }   

    function close(el: HTMLElement | null) {
        if (!el) return;
        Modal.getOrCreateInstance(el).hide();
    }

    async function carregar() {
        setLoading(true);
        setErro(null);
    try {
        const { data } = await api.get<any[]>("/topicos-with-produtos");
        console.log('topicos API', data);
        const normalized: Topico[] = data.map(t => ({
        id: t.id ?? t.id_topico,            // <<< pega o que existir
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

    useEffect(() => { carregar(); }, []);

    // criar tópico
    async function criarTopico() {
        if (!topicoNome.trim()) return;
        await api.post("/topicos", { nome_topico: topicoNome });
        setTopicoNome("");
        close(modalTopicoRef.current);
        carregar();
    }

    // abrir modal de produto (novo)
    function abrirNovoProduto(t: Topico) {
        setTopicoSelecionado(t);
        setProdutoForm({ topico_id: t.id, nome_produto: "", preco: 0, quantidade: 1, descricao: "" });
        open(modalProdutoRef.current);
    }

    // salvar produto novo
    async function salvarProdutoNovo(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!topicoSelecionado?.id) {
            alert("Selecione um tópico válido.");
            return;
        }   

    const fd = new FormData(e.currentTarget); // já tem topico_id pelo hidden
        await api.post("/produtos", fd, {
        headers: { "Content-Type": "multipart/form-data" }
    });
        close(modalProdutoRef.current);
        carregar();
    }

    // abrir editar produto
    function abrirEditarProduto(p: Produto) {
        setProdutoEditando(p);
        open(modalEditarRef.current);
    }

    // salvar edição
    async function salvarEdicaoProduto(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!produtoEditando) return;

        const fd = new FormData(e.currentTarget);
        await api.post(`/produtos/${produtoEditando.id}?_method=PUT`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        close(modalEditarRef.current);
        setProdutoEditando(null);
        carregar();
    }

    // remover produto
    const [produtoRemover, setProdutoRemover] = useState<Produto | null>(null);
    function confirmarRemoverProduto(p: Produto) {
        setProdutoRemover(p);
        open(modalRemoverProdutoRef.current);
    }

    async function removerProduto() {
        if (!produtoRemover) return;
            await api.delete(`/produtos/${produtoRemover.id}`);
            close(modalRemoverProdutoRef.current);
        setProdutoRemover(null);
        carregar();
    }

    // remover tópico (com produtos)
    function confirmarRemoverTopico(t: Topico) {
        setTopicoSelecionado(t);
        open(modalRemoverTopicoRef.current);
    }

    async function removerTopico() {
        if (!topicoSelecionado) return;
            await api.delete(`/topicos/${topicoSelecionado.id}`);
            close(modalRemoverTopicoRef.current);
        setTopicoSelecionado(null);
        carregar();
    }

    // preview imagem
    function abrirImagem(url: string) {
        setImgPreview(url);
        open(modalImagemRef.current);
    }

    // exportar: baixa via blob (mantém Authorization)
    async function exportarTudo() {
        const res = await api.get(`/exports/produtos`, { responseType: "blob" });
        const url = URL.createObjectURL(res.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = `estoque_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
    }

    async function exportarTopico(t: Topico) {
        const res = await api.get(`/exports/topicos/${t.id}`, { responseType: "blob" });
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

        <div className={`${styles.topicos}`}>
            <button className="btn btn-primary m-2" onClick={() => open(modalTopicoRef.current)}>
                <i className="bi bi-plus-circle" /> Adicionar Tópico
            </button>
            <button className="btn btn-primary" onClick={exportarTudo}>
                <i className="bi bi-box-arrow-in-up-right" /> Exportar Tabelas
            </button>
        </div>

        <div className={`containerHome ${styles.containerHome}`}>

        {topicos.map((t) => (
            <div key={t.id} className={`${styles.topicoBlock}`}>
                <h4 className={`${styles.topicoTitle}`}>{t.nome_topico}</h4>

            <div className={`card-body`}>
                <div className="table-responsive">
                    <table className={`table table-striped align-middle mb-0 ${styles.table}`}>
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
                        {t.produtos.map((p) => (
                        <tr key={p.id}>
                            <td>
                            {p.imagem ? (
                                <img
                                src={p.imagem}
                                width={60}
                                height={60}
                                style={{ objectFit: "cover", borderRadius: 8, cursor: "pointer" }}
                                onClick={() => abrirImagem(p.imagem!)}
                                />
                            ) : <span className="text-muted">—</span>}
                            </td>

                            <td>{p.nome_produto}</td>
                            <td>{`R$ ${Number(p.preco).toFixed(2).replace('.',',')}`}</td>
                            <td>{p.quantidade}</td>
                            <td>{p.descricao}</td>
                            <td>{fmtDate(p.criado_em || p.created_at || '')}</td>
                            <td>{fmtDate(p.atualizado_em || p.updated_at || '')}</td>

                            <td>
                            <button className="btn" onClick={() => abrirEditarProduto(p)}>
                                <i className={`bi bi-pencil-square ${styles.icon}`} />
                            </button>
                            </td>

                            <td>
                            <button className="btn" onClick={() => confirmarRemoverProduto(p)}>
                                <i className={`bi bi-trash3 ${styles.icon}`} />
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>

                <div className={`${styles.btnTopico}`}>
                    <button className="btn btn-primary" onClick={() => confirmarRemoverTopico(t)}>
                        <i className="bi bi-trash3" /> Excluir Tópico
                    </button>
                    <button className="btn btn-primary" onClick={() => abrirNovoProduto(t)}>
                        <i className="bi bi-plus-circle" /> Adicionar Produto
                    </button>
                    <button className="btn btn-primary" onClick={() => exportarTopico(t)}>
                        <i className="bi bi-box-arrow-in-up-right" /> Exportar Tabela
                    </button>
                </div>
            </div>
            </div>
        ))}
        </div>

      {/* -------- Modais -------- */}

    {/* Novo tópico */}
      <div className="modal fade" ref={modalTopicoRef} tabIndex={-1}>
        <div className="modal-dialog"><div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Adicionar Tópico</h5>
            <button type="button" className="btn-close" onClick={() => close(modalTopicoRef.current)} />
          </div>
          <div className="modal-body">
            <input className="form-control" placeholder="Nome do tópico" value={topicoNome} onChange={e => setTopicoNome(e.target.value)} />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => close(modalTopicoRef.current)}>Cancelar</button>
            <button className="btn btn-primary" onClick={criarTopico}>Salvar</button>
          </div>
        </div></div>
      </div>

      {/* Novo produto */}
      <div className="modal fade" ref={modalProdutoRef} tabIndex={-1}>
        <div className="modal-dialog modal-lg"><div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Adicionar Produto</h5>
            <button type="button" className="btn-close" onClick={() => close(modalProdutoRef.current)} />
          </div>
          <form onSubmit={salvarProdutoNovo}>
            <div className="modal-body">
              <div className="row g-2">
                <div className="col-md-6"><input name="nome_produto" required className="form-control" placeholder="Produto" /></div>
                <div className="col-md-3"><input name="preco" required type="number" step="0.01" className="form-control" placeholder="Preço" /></div>
                <div className="col-md-3"><input name="quantidade" required type="number" className="form-control" placeholder="Quantidade" /></div>
                <input type="hidden" name="topico_id" value={topicoSelecionado?.id ?? ''} />
                <div className="col-12"><textarea name="descricao" className="form-control" placeholder="Descrição" /></div>
                <div className="col-12"><input name="imagem" type="file" accept="image/*" className="form-control" /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" type="button" onClick={() => close(modalProdutoRef.current)}>Cancelar</button>
              <button className="btn btn-primary" type="submit">Salvar</button>
            </div>
          </form>
        </div></div>
      </div>

      {/* Editar produto */}
      <div className="modal fade" ref={modalEditarRef} tabIndex={-1}>
        <div className="modal-dialog modal-lg"><div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Produto</h5>
            <button type="button" className="btn-close" onClick={() => close(modalEditarRef.current)} />
          </div>
          <form onSubmit={salvarEdicaoProduto}>
            <div className="modal-body">
              <div className="row g-2">
                <div className="col-md-6"><input name="nome_produto" defaultValue={produtoEditando?.nome_produto} className="form-control" /></div>
                <div className="col-md-3"><input name="preco" type="number" step="0.01" defaultValue={produtoEditando?.preco} className="form-control" /></div>
                <div className="col-md-3"><input name="quantidade" type="number" defaultValue={produtoEditando?.quantidade} className="form-control" /></div>
                <div className="col-12"><textarea name="descricao" defaultValue={produtoEditando?.descricao ?? ''} className="form-control" /></div>
                <div className="col-12"><input name="imagem" type="file" accept="image/*" className="form-control" /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" type="button" onClick={() => close(modalEditarRef.current)}>Cancelar</button>
              <button className="btn btn-primary" type="submit">Salvar</button>
            </div>
          </form>
        </div></div>
      </div>

      {/* Remover produto */}
      <div className="modal fade" ref={modalRemoverProdutoRef} tabIndex={-1}>
        <div className="modal-dialog"><div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Remover Produto</h5>
            <button type="button" className="btn-close" onClick={() => close(modalRemoverProdutoRef.current)} />
          </div>
          <div className="modal-body">
            <strong>Tem certeza de que deseja excluir este produto? Esta ação é irreversível.</strong>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => close(modalRemoverProdutoRef.current)}>Cancelar</button>
            <button className="btn btn-danger" onClick={removerProduto}>Remover</button>
          </div>
        </div></div>
      </div>

      {/* Remover tópico */}
      <div className="modal fade" ref={modalRemoverTopicoRef} tabIndex={-1}>
        <div className="modal-dialog"><div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Excluir Tópico</h5>
            <button type="button" className="btn-close" onClick={() => close(modalRemoverTopicoRef.current)} />
          </div>
          <div className="modal-body">
            <strong>
              Tem certeza de que deseja excluir este tópico? Ao prosseguir, todos os produtos vinculados a ele também serão permanentemente removidos.</strong>
            </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => close(modalRemoverTopicoRef.current)}>Cancelar</button>
            <button className="btn btn-danger" onClick={removerTopico}>Excluir</button>
          </div>
        </div>
      </div>
      </div>

      {/* Preview imagem */}
      <div className="modal fade" ref={modalImagemRef} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered"><div className="modal-content">
          <img src={imgPreview ?? ''} alt="preview" style={{ maxHeight: '80vh', objectFit: 'contain' }} />
        </div></div>
      </div>
    </div>
  );
}

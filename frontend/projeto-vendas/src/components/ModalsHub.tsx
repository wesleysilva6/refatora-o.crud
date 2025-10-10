import React, { forwardRef, useImperativeHandle, useRef, useState,} from "react";
import { Modal } from "bootstrap";
import styles from "./ModalsHub.module.css"

export type Produto = {
    id: number;
    nome_produto: string;
    preco: number;
    quantidade: number;
    descricao?: string | null;
    imagem?: string | null;
    topico_id: number;
    criado_em?: string;
    atualizado_em?: string;
};

export type Topico = { 
    id: number; 
    nome_topico: string 
};

type Props = {
    // callbacks executados pela página após submit/confirm
    onCriarTopico: (nome: string) => Promise<void> | void;
    onSalvarProdutoNovo: (form: FormData) => Promise<void> | void;
    onSalvarEdicaoProduto: (form: FormData, produtoId: number) => Promise<void> | void;
    onRemoverProduto: (produtoId: number) => Promise<void> | void;
    onRemoverTopico: (topicoId: number) => Promise<void> | void;
};

export type ModalsHandle = {
    openTopico(): void;
    openNovoProduto(t: Topico): void;
    openEditarProduto(p: Produto): void;
    openRemoverProduto(produtoId: number): void;
    openRemoverTopico(topicoId: number): void;
    openImagem(url: string): void;
    closeAll(): void;
};

const ModalsHub = forwardRef<ModalsHandle, Props>(function ModalsHub(
    { onCriarTopico, onSalvarProdutoNovo, onSalvarEdicaoProduto, onRemoverProduto, onRemoverTopico },
    ref
) {
    // refs dos modais
    const rTopico = useRef<HTMLDivElement>(null);
    const rNovo   = useRef<HTMLDivElement>(null);
    const rEdit   = useRef<HTMLDivElement>(null);
    const rDelP   = useRef<HTMLDivElement>(null);
    const rDelT   = useRef<HTMLDivElement>(null);
    const rImg    = useRef<HTMLDivElement>(null);

    // estados “contexto” dos modais
    const [topicoNome, setTopicoNome] = useState("");
    const [ctxTopicoId, setCtxTopicoId] = useState<number | null>(null);
    const [editProduto, setEditProduto] = useState<Produto | null>(null);
    const [delProdutoId, setDelProdutoId] = useState<number | null>(null);
    const [delTopicoId, setDelTopicoId] = useState<number | null>(null);
    const [imgUrl, setImgUrl] = useState<string | null>(null);

    const show = (el: HTMLDivElement | null) => el && Modal.getOrCreateInstance(el).show();
    const hide = (el: HTMLDivElement | null) => el && Modal.getOrCreateInstance(el).hide();

    useImperativeHandle(ref, () => ({
        openTopico: () => { setTopicoNome(""); show(rTopico.current); },
        openNovoProduto: (t) => { setCtxTopicoId(t.id); show(rNovo.current); },
        openEditarProduto: (p) => { setEditProduto(p); show(rEdit.current); },
        openRemoverProduto: (produtoId) => { setDelProdutoId(produtoId); show(rDelP.current); },
        openRemoverTopico: (topicoId) => { setDelTopicoId(topicoId); show(rDelT.current); },
        openImagem: (url) => { setImgUrl(url); show(rImg.current); },
        closeAll: () => [rTopico,rNovo,rEdit,rDelP,rDelT,rImg].forEach(x => hide(x.current)),
    }), []);

    // submits/confirm
    const criarTopico = async () => {
        const nome = topicoNome.trim();
            if (!nome) return;
            await onCriarTopico(nome);
            hide(rTopico.current);
    };

    const salvarProdutoNovo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
            if (ctxTopicoId) fd.set("topico_id", String(ctxTopicoId)); // garante
            await onSalvarProdutoNovo(fd);
            hide(rNovo.current);
            e.currentTarget.reset();
    };

    const salvarEdicaoProduto = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
            if (!editProduto) return;
            const fd = new FormData(e.currentTarget);
            await onSalvarEdicaoProduto(fd, editProduto.id);
            hide(rEdit.current);
            setEditProduto(null);
    };

    const removerProduto = async () => {
        if (!delProdutoId) return;
        await onRemoverProduto(delProdutoId);
        hide(rDelP.current);
        setDelProdutoId(null);
    };

    const removerTopico = async () => {
        if (!delTopicoId) return;
        await onRemoverTopico(delTopicoId);
        hide(rDelT.current);
        setDelTopicoId(null);
    };

return (
    <>
    {/* Criar tópico */}
    <div className={`modal fade`} ref={rTopico} tabIndex={-1}>
        <div className="modal-dialog">
            <div className={`modal-content ${styles.modalContent}`}>
                <div className="modal-header">
                    <h5 className={`modal-title ${styles.modalTitle}`}>Adicionar Tópico</h5>
                    <button type="button" className="btn-close" onClick={() => hide(rTopico.current)} />
                </div>
                <div className="modal-body">
                    <label htmlFor="topicoNome" className="form-label">Nome Tópico</label>
                    <input className={`form-control ${styles.formControl}`} placeholder="Nome do tópico" value={topicoNome} onChange={e => setTopicoNome(e.target.value)} id="topicoNome" />
                </div>
                <div className="modal-footer">
                    <button className={`btn btn-secondary ${styles.btnCancelar}`} onClick={() => hide(rTopico.current)}>Cancelar</button>
                    <button className={`btn btn-primary ${styles.btnSalvar}` } onClick={criarTopico}>Salvar</button>
                </div>
            </div>
        </div>
    </div>

        {/* Novo produto */}
        <div className="modal fade" ref={rNovo} tabIndex={-1}>
            <div className="modal-dialog modal-lg">
                <div className={`modal-content ${styles.modalContent}`}>
                    <div className="modal-header">
                        <h5 className={`modal-title ${styles.modalTitle}`}>Adicionar Produto</h5>
                        <button type="button" className="btn-close" onClick={() => hide(rNovo.current)} />
                    </div>

                    <form key={formNovoKey} onSubmit={salvarProdutoNovo}>
                        <div className="modal-body">
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <label htmlFor="nomeProduto" className="form-label">Nome do Produto</label>
                                    <input name="nome_produto" id="nomeProduto"  className={`form-control ${styles.formControl}`} placeholder="Produto" required />
                                </div>

                                <div className="col-md-3">
                                    <label htmlFor="precoProduto" className="form-label">Preço</label>
                                    <input name="preco" id="precoProduto"  type="number" step="0.01" className={`form-control ${styles.formControl}`} placeholder="Preço" required />
                                </div>

                                <div className="col-md-3">
                                    <label htmlFor="quantidadeProduto" className="form-label">Quantidade</label>
                                    <input name="quantidade" id="quantodadeProduto"  type="number" className={`form-control ${styles.formControl}`} placeholder="Quantidade" required />
                                </div>

                                <input type="hidden" name="topico_id" value={ctxTopicoId ?? ""} />
                                <div className="col-12">
                                    <label htmlFor="descricaoProduto" className="form-label">Descrição</label>
                                    <textarea name="descricao" id="descricaoProduto" className={`form-control ${styles.formControl}`} placeholder="Descrição" />
                                </div>

                                <div className="col-12 mt-4">
                                    <input name="imagem" type="file" accept="image/*" className={`form-control ${styles.formControl}`}/>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className={`btn btn-secondary ${styles.btnCancelar}`} type="button" onClick={() => hide(rNovo.current)}>Cancelar</button>
                            <button className={`btn btn-primary ${styles.btnSalvar}` } type="submit">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        {/* Editar produto */}
        <div className="modal fade" ref={rEdit} tabIndex={-1}>
            <div className="modal-dialog modal-lg">
                <div className={`modal-content ${styles.modalContent}`}>
                    <div className="modal-header">
                        <h5 className={`modal-title ${styles.modalTitle}`}>Editar Produto</h5>
                        <button type="button" className="btn-close" onClick={() => hide(rEdit.current)} />
                    </div>

                    <form key={editProduto?.id} onSubmit={salvarEdicaoProduto}>
                        <div className="modal-body">
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <label htmlFor="nomeProduto" className="form-label">Nome do Produto</label>
                                    <input name="nome_produto" id="nomeProduto" defaultValue={editProduto?.nome_produto ?? ""} className={`form-control ${styles.formControl}`} />
                                </div>

                                <div className="col-md-3">
                                    <label htmlFor="precoProduto" className="form-label">Preço</label>
                                    <input name="preco" id="precoProduto" type="number" step="0.01" defaultValue={String(editProduto?.preco ?? 0)} className={`form-control ${styles.formControl}`} />
                                </div>

                                <div className="col-md-3">
                                    <label htmlFor="quantidadeProduto" className="form-label">Quantidade</label>
                                    <input name="quantidade" id="quantidadeProduto" type="number" defaultValue={String(editProduto?.quantidade ?? 1)} className={`form-control ${styles.formControl}`} />
                                </div>

                                <div className="col-12">
                                    <label htmlFor="descricaoProduto" className="form-label">Descrição</label>
                                    <textarea name="descricao" id="descricaoProduto" defaultValue={editProduto?.descricao ?? ""} className={`form-control ${styles.formControl}`} />
                                </div>

                                <div className="col-12 mt-4">
                                    <input name="imagem" type="file" accept="image/*" className={`form-control ${styles.formControl}`} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className={`btn btn-secondary ${styles.btnCancelar}`} type="button" onClick={() => hide(rEdit.current)}>Cancelar</button>
                            <button className={`btn btn-primary ${styles.btnSalvar}`} type="submit">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        {/* Remover produto */}
        <div className="modal fade" ref={rDelP} tabIndex={-1}>
            <div className="modal-dialog">
                <div className={`modal-content ${styles.modalContent}`}>
                    <div className="modal-header">
                        <h5 className={`modal-title ${styles.modalTitle}`}>Remover Produto</h5>
                        <button type="button" className="btn-close" onClick={() => hide(rDelP.current)} />
                    </div>

                    <div className="modal-body">
                        <strong className={`${styles.modalText}`}>Tem certeza de que deseja excluir este produto? Esta ação é irreversível.</strong>
                    </div>

                    <div className="modal-footer">
                        <button className={`btn btn-secondary ${styles.btnCancelar}`} onClick={() => hide(rDelP.current)}>Cancelar</button>
                        <button className={`btn btn-danger ${styles.btnExcluir}`} onClick={removerProduto}>Remover</button>
                    </div>
                </div>
            </div>
        </div>

        {/* Remover tópico */}
        <div className="modal fade" ref={rDelT} tabIndex={-1}>
            <div className="modal-dialog">
                <div className={`modal-content ${styles.modalContent}`}>
                    <div className="modal-header">
                        <h5 className={`modal-title ${styles.modalTitle}`}>Excluir Tópico</h5>
                        <button type="button" className="btn-close" onClick={() => hide(rDelT.current)} />
                    </div>

                    <div className="modal-body">
                        <strong className={`${styles.modalText}`}>Tem certeza de que deseja excluir este tópico? Produtos vinculados serão removidos.</strong>
                    </div>

                    <div className="modal-footer">
                        <button className={`btn btn-secondary ${styles.btnCancelar}`} onClick={() => hide(rDelT.current)}>Cancelar</button>
                        <button className={`btn btn-danger ${styles.btnExcluir}`} onClick={removerTopico}>Excluir</button>
                    </div>
                </div>
            </div>
        </div>

        {/* Preview imagem */}
        <div className="modal fade" ref={rImg} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    {imgUrl && ( <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}${imgUrl}`} alt="preview" style={{ maxHeight: "80vh", objectFit: "contain" }} /> )}
                </div>
            </div>
        </div>
    </>
);
});

export default ModalsHub;

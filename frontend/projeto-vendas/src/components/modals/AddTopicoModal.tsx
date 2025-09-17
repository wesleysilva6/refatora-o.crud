import { forwardRef } from "react";

    type Props = {
        nome: string;
        setNome: (v: string) => void;
        onSalvar: () => void;
        saving?: boolean;
    };

    const AddTopicoModal = forwardRef<HTMLDivElement, Props>(
    ({ nome, setNome, onSalvar, saving }, ref) => {

    return (
        <div className="modal fade" ref={ref} tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">

                <div className="modal-header">
                    <h5 className="modal-title">Adicionar Tópico</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" />
                </div>

            <div className="modal-body">
                <input className="form-control" placeholder="Nome do tópico" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>

            <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button className="btn btn-primary" onClick={onSalvar} disabled={saving}>
                    {saving ? "Salvando..." : "Salvar"}
                </button>
            </div>

                </div>
            </div>
        </div>
    );
});

export default AddTopicoModal;

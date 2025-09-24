import { Modal } from 'bootstrap';
import { useRef, useState } from 'react';


export default function EmailVerificar() {    
    const modalRef = useRef<HTMLDivElement>(null);
    const [emailEnviado, setEmailEnviado] = useState<string | null>(null);

    function abrirModal() {
        if (!modalRef.current) return;
        const instance = Modal.getOrCreateInstance(modalRef.current);
        instance.show();
    }

    return (
        <div className="modal fade" id="emailModal" tabIndex={-1} aria-hidden="true" ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                <div className="modal-header text-white" style={{ background: "var(--color--primary)" }}>
                    <h5 className="modal-title">E-mail enviado com sucesso!</h5>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar" />
                </div>

                <div className="modal-body text-center">
                <p className="text-center"> <i className="bi bi-envelope-check" style={{ fontSize: "4.4rem" }} /> </p>
                    <p className='text-center'>
                        E-mail de<strong> redefinição de senha</strong> foi enviado para:{" "}
                        <strong style={{ fontSize: "1.3rem" }}>{emailEnviado}</strong>
                    </p>
                        <p className='text-center'>Verifique sua caixa de entrada ou spam.</p>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal"> OK </button>
                </div>

                </div>
            </div>
        </div>
    )
}






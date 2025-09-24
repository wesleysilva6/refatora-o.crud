import { useEffect, useState } from "react";
import styles from './Vendas.module.css'
import SalesSidebar from "../components/SalesSidebar";

export default function Vendas() {
        const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-vh-100" style={{ overflowX: "hidden" }}>
            <div className={`content ${collapsed ? "expanded" : ""}`} id="content" style={{ marginLeft: collapsed ? 150 : 250, transition: "margin-left 0.3s"}}>
                <SalesSidebar collapsed={collapsed} />

        <div className="dash d-flex justify-content-between align-items-center mb-4">
            <button id="toggleSidebar" onClick={() => setCollapsed((c) => !c)}>
                <i className={`bi ${collapsed ? "bi-arrow-bar-right" : "bi-arrow-bar-left"}`} />
            </button>

            <h2>Realizar Venda</h2>

        <div className="d-flex align-items-center"></div>
        </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className={`card ${styles.card}`}>
                            <div className={`card-header ${styles.cardHeader}`}>
                                <h5 className="text-center mt-2">Nova Venda</h5>
                            </div>

                            <div className="card-body">
                                <form action="">
                                    <div className="mb-3">
                                        <label htmlFor="nomeCliente" className="form-label">Cliente</label>
                                        <input type="text" id="nomeCliente" className={`form-control ${styles.formControl}`} placeholder="Nome do Cliente" required/>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="telCliente" className="form-label">Telefone</label>
                                        <input type="text" id="telCliente" className={`form-control ${styles.formControl}`} placeholder="Telefone ( Opcional )" />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="vendedor" className="form-label">Vendedor</label>
                                        <select id="vendedor" className={`form-select ${styles.formControl}`} required>
                                            <option value="">Selecione um Vendedor

                                            </option>
                                        </select>
                                    </div>

                                <hr />

                                <div className="mb-3">
                                    <label htmlFor="produto" className="form-label">Produto</label>
                                    <select id="produto" className={`form-select ${styles.formControl}`}>
                                        <option value="">Selecione um Produto</option>
                                    </select>
                                </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
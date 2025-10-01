import { useEffect, useState } from "react";
import SalesSidebar from "../components/SalesSidebar"
import FormFuncionario from "../components/FormFuncionario";
import GestaoUsuario from "../components/GestaoUsuario";

// se você já tem um hook de usuário (foto/nome), use-o aqui:

type TabKey =
    | "sistema"
    | "gestão"
    | "vendedores"
    | "vendas"

const TABS: { key: TabKey; label: string }[] = [
    { key: "sistema", label: "Sistema" },
    { key: "gestão", label: "Gestão de Usuários" },
    { key: "vendedores", label: "Funcionários" },
    { key: "vendas", label: "Vendas" },
];

export default function Configuracoes() {
    const [collapsed, setCollapsed] = useState(false);
    const [active, setActive] = useState<TabKey>("sistema");

useEffect(() => {
    const saved = localStorage.getItem("activeTab") as TabKey | null;
    if (saved && TABS.some(t => t.key === saved)) setActive(saved);
}, []);


useEffect(() => {
    localStorage.setItem("activeTab", active);
}, [active]);

return (
    <div className="min-vh-100 d-flex">
        <div className={`content ${collapsed ? "expanded" : ""}`} id="content" style={{ marginLeft: collapsed ? 150 : 250, transition: "margin-left 0.3s"}}>
        <SalesSidebar />

        <div className="dash d-flex justify-content-between align-items-center mb-4">
            <button id="toggleSidebar" onClick={() => setCollapsed((c) => !c)}>
                <i className={`bi ${collapsed ? "bi-arrow-bar-right" : "bi-arrow-bar-left"}`} />
            </button>

            <h2>Sistema</h2>

        <div className="d-flex align-items-center"></div>
        </div>

        <nav className="nav nav-underline custom-nav mb-3">
            {TABS.map(tab => (
            <button key={tab.key} type="button" className={`nav-link ${active === tab.key ? "active" : ""}`} onClick={() => setActive(tab.key)} data-tab={tab.key} > {tab.label}
            </button>
            ))}
        </nav>

        <div className="container mt-2">

        {active === "sistema" && (
            <section id="sistema" className="tab-section">
                <h4>Sistema</h4>
                <p className="text-muted">Configurações gerais do sistema.</p>
            </section>
        )}

        {active === "gestão" && (
            <section id="usuarios" className="tab-section">
                <GestaoUsuario/>
            </section>
        )}

        {active === "vendedores" && (
            <section id="vendedores" className="tab-section">
                <FormFuncionario/>
            </section>
        )}

        {active === "vendas" && (
            <section id="vendas" className="tab-section">
                <h4>Vendas</h4>
                <p className="text-muted">Conteúdo livre de Vendas.</p>
            </section>
        )}

        </div>
    </div>
    </div>
);
}

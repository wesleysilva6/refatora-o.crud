import { useTheme } from "../theme/ThemeProvider";

export default function ThemeToggle() {
    const { resolved, toggle, theme, setTheme } = useTheme();

return (
    <div className="d-flex align-items-center gap-2">
        <button className="btn btn-outline-primary" onClick={toggle} title="Alternar tema">
            <i className={`bi ${resolved === "dark" ? "bi-sun" : "bi-moon"}`} />
        </button>

        <select className="form-select form-select-sm" style={{ width: 120 }} value={theme} onChange={(e) => setTheme(e.target.value as any)}>
            <option value="system">Sistema</option>
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
        </select>
    </div>
    );
}

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

    type Theme = "light" | "dark" | "system";
    type Ctx = { theme: Theme; resolved: "light" | "dark"; setTheme: (t: Theme) => void; toggle: () => void };

    const ThemeCtx = createContext<Ctx>({ theme: "system", resolved: "light", setTheme: () => {}, toggle: () => {} });

    function getSystemPref(): "light" | "dark" {
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    function getInitial(): Theme {
        const saved = localStorage.getItem("theme") as Theme | null;
        return saved ?? "system";
    }

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(getInitial);
    const resolved = useMemo(() => (theme === "system" ? getSystemPref() : theme), [theme]);

    useEffect(() => {
        const el = document.documentElement;
        if (resolved === "dark") el.setAttribute("data-theme", "dark");
        else el.removeAttribute("data-theme");
        localStorage.setItem("theme", theme);
    }, [theme, resolved]);

    useEffect(() => {
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = () => { if (theme === "system") { 
            const el = document.documentElement;
            mql.matches ? el.setAttribute("data-theme", "dark") : el.removeAttribute("data-theme");
        }};
        mql.addEventListener?.("change", onChange);
        return () => mql.removeEventListener?.("change", onChange);
    }, [theme]);

    const toggle = () => setTheme(resolved === "dark" ? "light" : "dark");

return (
    <ThemeCtx.Provider value={{ theme, resolved, setTheme, toggle }}>
        {children}
    </ThemeCtx.Provider>
);
}

export const useTheme = () => useContext(ThemeCtx);

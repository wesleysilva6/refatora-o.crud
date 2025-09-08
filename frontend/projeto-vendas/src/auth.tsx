import { createContext, useContext, useState } from "react";

type Ctx = { token: string | null; setToken: (t: string | null) => void };
const AuthCtx = createContext<Ctx>({ token: null, setToken: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  return <AuthCtx.Provider value={{ token, setToken }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);

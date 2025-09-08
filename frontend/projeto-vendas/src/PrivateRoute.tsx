// src/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth";

export default function PrivateRoute() {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

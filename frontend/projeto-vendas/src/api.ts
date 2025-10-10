import axios from "axios";
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });
export const PATH_IMAGEM = import.meta.env.PATH_IMAGEM;

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
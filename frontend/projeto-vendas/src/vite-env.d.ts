declare module "*.css";

/// <reference types="vite/client" />

// (opcional, mas ajuda o TS a saber da sua env)
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

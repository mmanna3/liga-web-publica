/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly API_BASE_URL: string;
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_LIGA_NOMBRE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

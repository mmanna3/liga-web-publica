// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

/** `/` en dev; `/liga-web-publica/` en build de GitHub Pages (ver scripts npm) */
const base = process.env.BASE_PATH ?? '/';
const site = process.env.PUBLIC_SITE_URL ?? 'https://edefi.github.io';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
        '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
        '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
        '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
      },
    },
  },
});

# Liga Web Pública

Landing estática para una liga de fútbol. Construida con **Astro**, **Tailwind CSS v4** y **TypeScript** (modo strict). Los datos de torneos se obtienen en build time desde la API oficial.

## Stack

- [Astro](https://astro.build) — sitio estático con fetch server-side
- [Tailwind CSS v4](https://tailwindcss.com)
- TypeScript strict
- Fetch API nativa (sin SDK extra)
- ESLint + Prettier

## Requisitos

- Node.js ≥ 22.12

## Comandos

```bash
# Instalar dependencias
npm install

# Desarrollo → http://localhost:4321/  (base path /)
npm run dev

# Build local (mismo que dev)
npm run build:local

# Build para GitHub Pages → /liga-web-publica/
npm run build:gh-pages

# Vista previa del build local
npm run preview

# Vista previa como en GitHub Pages (después de build:gh-pages)
npm run preview:gh-pages

# Lint y formato
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

## Variables de entorno

Copiá `.env.example` a `.env`:

| Variable             | Descripción                                                        |
| -------------------- | ------------------------------------------------------------------ |
| `API_BASE_URL`       | URL base de la API (solo server-side)                              |
| `PUBLIC_SITE_URL`    | URL pública del sitio (SEO, OG)                                    |
| `PUBLIC_LIGA_NOMBRE` | Nombre visible de la liga                                          |
| `BASE_PATH`          | Base path del deploy (`/` local, `/liga-web-publica/` en GH Pages) |

## Tipografías

- [Coalition](https://www.dafont.com/es/coalition.font) — títulos (`font-display`)
- [D3 Euronism](https://www.dafont.com/d3euronism.font) — marca EDEFI (`font-brand`)
- Inter — cuerpo de texto

Archivos en `src/assets/fonts/`. Ver `src/assets/fonts/LICENSE.txt` para uso comercial.

Logo de la liga: `public/logo.png` (header, footer, favicon).

## Estructura

```
src/
  components/     # UI reutilizable (Header, Hero, cards…)
  layouts/        # BaseLayout con SEO
  pages/          # Rutas (index)
  lib/            # API, colores, utilidades
  types/          # Tipos TypeScript
  styles/         # global.css + tema Tailwind
public/           # Assets estáticos
```

## API

En build/dev, Astro ejecuta en el servidor:

```
GET {API_BASE_URL}/info-inicial-de-torneos
```

Respuesta tipada como `AgrupadorDeTorneo[]` (ver `src/types/torneo.ts`).

## Deploy en GitHub Pages

1. En el repo: **Settings → Pages → Source: GitHub Actions**
2. Push a `main` — el workflow `.github/workflows/deploy.yml` construye y publica `dist/`
3. El sitio queda en `https://<usuario>.github.io/liga-web-publica/`

Para otro nombre de repo, actualizá `BASE_PATH` en `package.json` (`build:gh-pages`) y en `.env.example`.

## Alias de imports

| Alias           | Ruta               |
| --------------- | ------------------ |
| `@/*`           | `src/*`            |
| `@components/*` | `src/components/*` |
| `@layouts/*`    | `src/layouts/*`    |
| `@lib/*`        | `src/lib/*`        |
| `@types/*`      | `src/types/*`      |
| `@styles/*`     | `src/styles/*`     |

## Licencia

Privado — uso interno de la liga.

/** URL de asset en public/ respetando `base` (dev: /, GitHub Pages: /liga-web-publica/) */
export function assetUrl(path: string): string {
  const normalized = path.replace(/^\//, '');
  return `${import.meta.env.BASE_URL}${normalized}`;
}

export function siteBaseUrl(): string {
  const base = import.meta.env.BASE_URL ?? '/';
  return base.endsWith('/') ? base : `${base}/`;
}

/** Home con hash opcional (funciona desde cualquier ruta, p. ej. /zona/) */
export function homeUrl(hash = ''): string {
  const normalizedHash = hash.startsWith('#') ? hash : hash ? `#${hash}` : '';
  return `${siteBaseUrl()}${normalizedHash}`;
}

export function nosotrosUrl(): string {
  return `${siteBaseUrl()}nosotros/`;
}

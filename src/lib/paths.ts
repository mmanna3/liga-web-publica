/** URL de asset en public/ respetando `base` (dev: /, GitHub Pages: /liga-web-publica/) */
export function assetUrl(path: string): string {
  const normalized = path.replace(/^\//, '');
  return `${import.meta.env.BASE_URL}${normalized}`;
}

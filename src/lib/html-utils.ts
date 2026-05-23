export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function textoOGuion(s: string | undefined): string {
  const t = (s ?? '').trim();
  return t.length > 0 ? t : '—';
}

export function numeroOGuion(n: number | undefined): string {
  return n != null && Number.isFinite(n) ? String(n) : '—';
}

const CARNET_DIGITAL_SUFFIX = /\/api\/carnet-digital\/?$/;

function getApiOrigin(): string {
  const explicit = import.meta.env.PUBLIC_API_ORIGIN;
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }
  const base =
    import.meta.env.PUBLIC_API_BASE_URL ?? 'https://admin.edefi.com.ar/api/carnet-digital';
  return base.replace(CARNET_DIGITAL_SUFFIX, '').replace(/\/$/, '');
}

export function escudoUrl(escudoRelativo: string | undefined): string | null {
  const r = (escudoRelativo ?? '').trim();
  if (!r) return null;
  if (/^(https?:|data:)/i.test(r)) return r;
  const path = r.startsWith('/') ? r : `/${r}`;
  return `${getApiOrigin()}${path}`;
}

export const CLASE_FILA_TABLA_ESCUDO =
  'tabla-fila-escudo border-b border-black/10 last:border-b-0';

export const CLASE_BODY_TABLA_ESCUDO = 'tabla-body-escudos';

export function escudoImgHtml(
  escudoRelativo: string | undefined,
  sizeClass = 'h-8 w-8',
  placeholderClass = 'bg-white/10',
): string {
  const url = escudoUrl(escudoRelativo);
  if (!url) {
    return `<span class="inline-block ${sizeClass} shrink-0 rounded-md ${placeholderClass}" aria-hidden="true"></span>`;
  }
  return `<img src="${escapeHtml(url)}" alt="" class="inline-block ${sizeClass} shrink-0 rounded-md object-contain" loading="lazy" decoding="async" />`;
}

import type { ZonaLinkContext } from '@types/zona-detalle';

export function siteBaseUrl(): string {
  const base = import.meta.env.BASE_URL ?? '/';
  return base.endsWith('/') ? base : `${base}/`;
}

export function homeUrl(hash = ''): string {
  const normalizedHash = hash.startsWith('#') ? hash : hash ? `#${hash}` : '';
  return `${siteBaseUrl()}${normalizedHash}`;
}

export function zonaUrl(ctx: ZonaLinkContext): string {
  const params = new URLSearchParams({
    id: String(ctx.zonaId),
    tipoDeFase: ctx.tipoDeFase,
    zonaNombre: ctx.zonaNombre,
    faseNombre: ctx.faseNombre,
    torneoNombre: ctx.torneoNombre,
    agrupadorNombre: ctx.agrupadorNombre,
    color: ctx.color,
    agrupadorId: String(ctx.agrupadorId),
  });
  return `${siteBaseUrl()}zona/?${params.toString()}`;
}

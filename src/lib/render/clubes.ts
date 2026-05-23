import { escapeHtml, escudoImgHtml, googleMapsSearchUrl, textoOGuion } from '@lib/html-utils';
import { emptyStateHtml, iconSvg } from '@lib/ui-html';
import type { ClubesDTO } from '@types/zona-detalle';

function lineaDireccionLocalidad(direccion: string | undefined, localidad: string | undefined): string {
  const d = (direccion ?? '').trim();
  const l = (localidad ?? '').trim();
  if (!d && !l) return '—';
  if (!d) return l;
  if (!l) return d;
  return `${d}, ${l}`;
}

function direccionHtml(direccion: string | undefined, localidad: string | undefined): string {
  const texto = lineaDireccionLocalidad(direccion, localidad);
  if (texto === '—') {
    return `<p class="text-sm leading-5 text-zinc-400">${escapeHtml(texto)}</p>`;
  }

  const mapsUrl = googleMapsSearchUrl(texto);
  return `<p class="text-sm leading-5">
    <a
      href="${escapeHtml(mapsUrl)}"
      target="_blank"
      rel="noopener noreferrer"
      class="text-zona-accent inline-flex items-start gap-1.5 underline-offset-2 transition-colors hover:text-white hover:underline"
      aria-label="Ver ${escapeHtml(texto)} en Google Maps"
    >
      ${iconSvg('map-pin', 'h-4 w-4 shrink-0 translate-y-0.5')}
      <span>${escapeHtml(texto)}</span>
    </a>
  </p>`;
}

function clubCardHtml(item: ClubesDTO): string {
  return `<article class="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
    <div class="flex items-start gap-4">
      ${escudoImgHtml(item.escudo, 'h-12 w-12')}
      <div class="min-w-0 flex-1 space-y-1">
        <h4 class="text-base font-bold leading-5 text-white">${escapeHtml(textoOGuion(item.equipo))}</h4>
        ${direccionHtml(item.direccion, item.localidad)}
        <p class="text-sm leading-5 text-zinc-500">Cancha: ${escapeHtml(textoOGuion(item.tipoCancha))}</p>
        <p class="text-sm leading-5 text-zinc-500">Superficie: ${escapeHtml(textoOGuion(item.superficieCancha))}</p>
      </div>
    </div>
  </article>`;
}

export function renderClubesHtml(data: ClubesDTO[] | undefined): string {
  const filas = data ?? [];
  if (filas.length === 0) {
    return emptyStateHtml('No hay clubes en esta zona.');
  }
  return `<div class="grid gap-3 sm:grid-cols-2">${filas.map((c) => clubCardHtml(c)).join('')}</div>`;
}

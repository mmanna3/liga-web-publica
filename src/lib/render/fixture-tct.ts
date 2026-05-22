import { escapeHtml, escudoImgHtml, textoOGuion } from '@lib/html-utils';
import { emptyStateHtml } from '@lib/ui-html';
import type { FixtureDTO, FixtureFechaDTO, FixturePartidoDTO } from '@types/zona-detalle';

function filaPartidoHtml(partido: FixturePartidoDTO): string {
  return `<div class="flex items-center gap-2 border-b border-white/5 px-2 py-2.5 last:border-b-0">
    ${escudoImgHtml(partido.localEscudo, 'h-9 w-9')}
    <span class="min-w-0 flex-1 text-right text-sm font-medium text-zinc-200">${escapeHtml(textoOGuion(partido.local))}</span>
    <span class="shrink-0 px-1 text-xs font-semibold text-zinc-500">vs</span>
    <span class="min-w-0 flex-1 text-left text-sm font-medium text-zinc-200">${escapeHtml(textoOGuion(partido.visitante))}</span>
    ${escudoImgHtml(partido.visitanteEscudo, 'h-9 w-9')}
  </div>`;
}

function cardFechaHtml(fecha: FixtureFechaDTO): string {
  const partidos = fecha.partidos ?? [];
  return `<div class="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2">
    <div class="mb-1 flex items-baseline justify-between gap-2 border-b border-white/10 px-2 py-2">
      <span class="shrink text-base font-semibold text-white">${escapeHtml(textoOGuion(fecha.titulo))}</span>
      <span class="shrink-0 text-sm font-medium text-white">${escapeHtml(textoOGuion(fecha.dia))}</span>
    </div>
    ${partidos.map((p) => filaPartidoHtml(p)).join('')}
  </div>`;
}

export function renderFixtureTctHtml(data: FixtureDTO | undefined): string {
  const fechas = data?.fechas ?? [];
  if (fechas.length === 0) {
    return emptyStateHtml('No hay fechas para esta zona.');
  }
  const cards = fechas.map((f) => cardFechaHtml(f)).join('');
  return `<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">${cards}</div>`;
}

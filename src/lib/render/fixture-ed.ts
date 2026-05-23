import { CLASE_BODY_TABLA_ESCUDO, CLASE_FILA_TABLA_ESCUDO, escapeHtml, escudoImgHtml, textoOGuion } from '@lib/html-utils';
import { emptyStateHtml, iconSvg } from '@lib/ui-html';
import type {
  EliminacionDirectaDTO,
  InstanciasDTO,
  PartidoEliminacionDirectaDTO,
} from '@types/zona-detalle';

function textoPenal(p: string | undefined): string | null {
  const t = (p ?? '').trim();
  return t.length > 0 ? t : null;
}

function parseNumeroResultado(s: string | undefined): number | null {
  const t = (s ?? '').trim();
  if (!t || t === '—') return null;
  const n = Number(String(t).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

type LadoGanador = 'local' | 'visitante';

function ganadorDelPartido(partido: PartidoEliminacionDirectaDTO): LadoGanador | null {
  const rL = parseNumeroResultado(partido.resultadoLocal);
  const rV = parseNumeroResultado(partido.resultadoVisitante);
  if (rL === null || rV === null) return null;
  if (rL > rV) return 'local';
  if (rV > rL) return 'visitante';
  const pL = parseNumeroResultado(partido.penalesLocal);
  const pV = parseNumeroResultado(partido.penalesVisitante);
  if (pL === null || pV === null) return null;
  if (pL > pV) return 'local';
  if (pV > pL) return 'visitante';
  return null;
}

function esInstanciaFinal(instancia: InstanciasDTO): boolean {
  return (instancia.titulo ?? '').trim().toLowerCase() === 'final';
}

function partidoFinalConResultados(instancia: InstanciasDTO): PartidoEliminacionDirectaDTO | null {
  const partidos = instancia.partidos ?? [];
  if (partidos.length === 0) return null;
  const p = partidos[0];
  const rL = parseNumeroResultado(p.resultadoLocal);
  const rV = parseNumeroResultado(p.resultadoVisitante);
  if (rL === null || rV === null) return null;
  return p;
}

function filaPartidoHtml(partido: PartidoEliminacionDirectaDTO): string {
  const pLoc = textoPenal(partido.penalesLocal);
  const pVis = textoPenal(partido.penalesVisitante);
  const resL = textoOGuion(partido.resultadoLocal);
  const resV = textoOGuion(partido.resultadoVisitante);

  return `<div class="flex items-center gap-1.5 px-2 py-2.5 ${CLASE_FILA_TABLA_ESCUDO}">
    ${escudoImgHtml(partido.escudoLocal, 'h-9 w-9', 'bg-zinc-200')}
    <span class="min-w-0 flex-1 text-right text-xs font-medium text-zinc-200">${escapeHtml(textoOGuion(partido.local))}</span>
    <div class="flex shrink-0 flex-wrap items-center justify-center gap-x-0.5 rounded-md border border-white/10 bg-white/5 px-2 py-1.5">
      <span class="text-xs font-semibold tabular-nums text-zinc-200">${escapeHtml(resL)}${pLoc != null ? `(${escapeHtml(pLoc)})` : ''}</span>
      <span class="shrink-0 px-0.5 text-xs font-semibold text-zinc-500">vs</span>
      <span class="text-xs font-semibold tabular-nums text-zinc-200">${escapeHtml(resV)}${pVis != null ? `(${escapeHtml(pVis)})` : ''}</span>
    </div>
    <span class="min-w-0 flex-1 text-left text-xs font-medium text-zinc-200">${escapeHtml(textoOGuion(partido.visitante))}</span>
    ${escudoImgHtml(partido.escudoVisitante, 'h-9 w-9', 'bg-zinc-200')}
  </div>`;
}

function cardInstanciaHtml(instancia: InstanciasDTO): string {
  const partidos = instancia.partidos ?? [];
  return `<div class="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
    <div class="border-b border-white/10 px-3 py-2 text-center">
      <p class="text-base font-semibold text-white">${escapeHtml(textoOGuion(instancia.titulo))}</p>
      <p class="mt-1 text-sm font-medium text-white">${escapeHtml(textoOGuion(instancia.dia))}</p>
    </div>
    <div class="${CLASE_BODY_TABLA_ESCUDO}">
      ${partidos.map((p) => filaPartidoHtml(p)).join('')}
    </div>
  </div>`;
}

function bloqueCampeonHtml(partido: PartidoEliminacionDirectaDTO): string {
  const lado = ganadorDelPartido(partido);
  if (lado === null) return '';
  const nombre = lado === 'local' ? partido.local : partido.visitante;
  const escudo = lado === 'local' ? partido.escudoLocal : partido.escudoVisitante;
  const nombreLimpio = (nombre ?? '').trim();
  if (!nombreLimpio) return '';

  return `<div class="my-8 flex flex-col items-center px-2">
    <div class="text-amber-400">${iconSvg('trophy', 'h-12 w-12')}</div>
    <div class="mt-3">${escudoImgHtml(escudo, 'h-12 w-12')}</div>
    <p class="mt-2 max-w-xs text-center text-base font-semibold text-white">${escapeHtml(nombreLimpio)}</p>
    <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-amber-400">Campeón</p>
  </div>`;
}

export function renderFixtureEdHtml(data: EliminacionDirectaDTO | undefined): string {
  const instancias = data?.instancias ?? [];
  if (instancias.length === 0) {
    return emptyStateHtml('No hay partidos para esta zona.');
  }

  const instanciaFinal = instancias.find((i) => esInstanciaFinal(i));
  const partidoDeLaFinal = instanciaFinal ? partidoFinalConResultados(instanciaFinal) : null;
  const campeon = partidoDeLaFinal ? bloqueCampeonHtml(partidoDeLaFinal) : '';
  const instanciasHtml = instancias.map((i) => cardInstanciaHtml(i)).join('');

  return `${campeon}<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">${instanciasHtml}</div>`;
}

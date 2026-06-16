import {
  anchoTablaJornadas,
  celdaResultadoCategoria,
  nombresCategoriasDeFecha,
} from '@lib/jornadas-utils';
import {
  CLASE_BODY_TABLA_ESCUDO,
  escapeHtml,
  escudoImgHtml,
  numeroOGuion,
  textoOGuion,
} from '@lib/html-utils';
import { emptyStateHtml } from '@lib/ui-html';
import type { FechasParaJornadasDTO, JornadaPorEquipoDTO, JornadasDTO } from '@types/zona-detalle';

const ANCHO = { esc: 44, equipo: 148, cat: 102, pt: 40, pj: 40 } as const;

function celdaHtml(
  content: string,
  ancho: number,
  align: 'left' | 'center' = 'left',
  bold = false,
  tabular = false,
): string {
  return `<div class="shrink-0 px-1.5 py-2 text-sm leading-5 text-zinc-200 ${bold ? 'font-semibold' : ''} ${tabular ? 'tabular-nums' : ''}" style="width:${ancho}px;min-width:${ancho}px;text-align:${align}">${escapeHtml(content)}</div>`;
}

function filaEncabezadoHtml(nombresCategorias: string[]): string {
  const cats = nombresCategorias
    .map(
      (cat) =>
        celdaHtml(cat, ANCHO.cat, 'center', true),
    )
    .join('');
  return `<div class="flex w-full border-b border-white/10 bg-zinc-900">
    ${celdaHtml('Esc', ANCHO.esc, 'center', true)}
    ${celdaHtml('Equipo', ANCHO.equipo, 'left', true)}
    ${cats}
    ${celdaHtml('P.T.', ANCHO.pt, 'center', true, true)}
    ${celdaHtml('P.J.', ANCHO.pj, 'center', true, true)}
  </div>`;
}

function filaEquipoHtml(
  equipo: JornadaPorEquipoDTO | undefined,
  nombresCategorias: string[],
  lado: 'local' | 'visitante',
  separarPartidoDebajo = false,
): string {
  const bordeClase = separarPartidoDebajo
    ? 'tabla-fila-escudo border-b border-black/20'
    : 'tabla-fila-escudo';

  const cats = nombresCategorias
    .map((cat) =>
      celdaHtml(
        celdaResultadoCategoria(equipo?.categorias, cat, lado),
        ANCHO.cat,
        'center',
        false,
        true,
      ),
    )
    .join('');

  return `<div class="flex ${bordeClase}">
    <div class="flex shrink-0 items-center justify-center px-1 py-1.5" style="width:${ANCHO.esc}px;min-width:${ANCHO.esc}px">${escudoImgHtml(equipo?.escudo, 'h-8 w-8', 'bg-zinc-200')}</div>
    ${celdaHtml(textoOGuion(equipo?.equipo), ANCHO.equipo, 'left')}
    ${cats}
    ${celdaHtml(numeroOGuion(equipo?.puntosTotales), ANCHO.pt, 'center', false, true)}
    ${celdaHtml(numeroOGuion(equipo?.partidosJugados), ANCHO.pj, 'center', false, true)}
  </div>`;
}

export function cardFechaJornadasHtml(fecha: FechasParaJornadasDTO): string {
  const jornadas = fecha.jornadas ?? [];
  const nombresCategorias = nombresCategoriasDeFecha(fecha);
  const anchoTabla = anchoTablaJornadas(nombresCategorias.length);
  const ultimoIndice = jornadas.length - 1;

  if (jornadas.length === 0) {
    return `<div class="overflow-hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2">
    <div class="mb-1 flex items-baseline justify-between gap-2 border-b border-white/10 px-2 py-2">
      <span class="shrink text-base font-semibold text-white">${escapeHtml(textoOGuion(fecha.titulo))}</span>
      <span class="shrink-0 text-sm font-medium text-white">${escapeHtml(textoOGuion(fecha.dia))}</span>
    </div>
    <p class="px-2 py-4 text-sm text-zinc-500">No hay partidos en esta fecha.</p>
  </div>`;
  }

  const filas = jornadas
    .map((j, i) => {
      const hayMas = i < ultimoIndice;
      return `<div class="w-full">
          ${filaEquipoHtml(j.local, nombresCategorias, 'local')}
          ${filaEquipoHtml(j.visitante, nombresCategorias, 'visitante', hayMas)}
        </div>`;
    })
    .join('');
  const body = `<div class="overflow-x-auto py-1">
    <div class="jornadas-tabla mx-auto w-full" style="min-width:${anchoTabla}px">
      ${filaEncabezadoHtml(nombresCategorias)}
      <div class="${CLASE_BODY_TABLA_ESCUDO}">
        ${filas}
      </div>
    </div>
  </div>`;

  return `<div class="mx-auto w-fit max-w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
    <div class="flex items-baseline justify-between gap-2 border-b border-white/10 px-3 py-2">
      <span class="shrink text-base font-semibold text-white">${escapeHtml(textoOGuion(fecha.titulo))}</span>
      <span class="shrink-0 text-sm font-medium text-white">${escapeHtml(textoOGuion(fecha.dia))}</span>
    </div>
    ${body}
  </div>`;
}

export function renderJornadasHtml(data: JornadasDTO | undefined): string {
  const fechas = data?.fechas ?? [];
  if (fechas.length === 0) {
    return emptyStateHtml('No hay jornadas para esta zona.');
  }
  return `<div id="jornadas-interactive" data-fechas-count="${fechas.length}">${cardFechaJornadasHtml(fechas[0])}</div>`;
}

export function renderJornadasSelectorHtml(
  fechas: FechasParaJornadasDTO[],
  indiceActivo: number,
  chipColorClass: string,
): string {
  const chips = fechas
    .map((fecha, index) => {
      const seleccionada = index === indiceActivo;
      const cls = seleccionada
        ? `${chipColorClass} text-white`
        : 'bg-white/10 text-zinc-300 hover:bg-white/15';
      return `<button type="button" class="jornada-chip shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${cls}" data-index="${index}" aria-pressed="${seleccionada}">${escapeHtml(textoOGuion(fecha.titulo))}</button>`;
    })
    .join('');

  return `<div class="mb-4 overflow-x-auto border-b border-white/10 pb-3">
    <div class="flex gap-2">${chips}</div>
  </div>`;
}

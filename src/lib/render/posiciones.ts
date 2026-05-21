import { escapeHtml, escudoImgHtml, textoOGuion } from '@lib/html-utils';
import { emptyStateHtml } from '@lib/ui-html';
import type {
  CategoriasConPosicionesDTO,
  PosicionDelEquipoDTO,
  PosicionesDTO,
} from '@types/zona-detalle';

const ANCHO = { pos: 38, esc: 44, equipo: 148, num: 34, goles: 38, pts: 40 } as const;

function titulosTabla(mostrarGoles: boolean): string[] {
  const t = ['Pos', 'Esc', 'Equipo', 'Pts', 'J', 'G', 'E', 'P', 'Np'];
  if (mostrarGoles) t.push('Gf', 'Gc', 'Df');
  return t;
}

function anchoColumna(i: number, mostrarGoles: boolean, numColumnas: number): number {
  if (i === 0) return ANCHO.pos;
  if (i === 1) return ANCHO.esc;
  if (i === 2) return ANCHO.equipo;
  if (i === 3) return ANCHO.pts;
  if (mostrarGoles && i >= numColumnas - 3 && i <= numColumnas - 1) return ANCHO.goles;
  return ANCHO.num;
}

function anchoTablaTotal(mostrarGoles: boolean): number {
  return (
    ANCHO.pos +
    ANCHO.esc +
    ANCHO.equipo +
    ANCHO.num * 5 +
    (mostrarGoles ? ANCHO.goles * 3 : 0) +
    ANCHO.pts
  );
}

function valorCelda(label: string, r: PosicionDelEquipoDTO): string {
  switch (label) {
    case 'Pos':
      return textoOGuion(r.posicion);
    case 'Equipo':
      return textoOGuion(r.equipo);
    case 'J':
      return textoOGuion(r.partidosJugados);
    case 'G':
      return textoOGuion(r.partidosGanados);
    case 'E':
      return textoOGuion(r.partidosEmpatados);
    case 'P':
      return textoOGuion(r.partidosPerdidos);
    case 'Np':
      return textoOGuion(r.partidosNoPresento);
    case 'Gf':
      return textoOGuion(r.golesAFavor);
    case 'Gc':
      return textoOGuion(r.golesEnContra);
    case 'Df':
      return textoOGuion(r.golesDiferencia);
    case 'Pts':
      return textoOGuion(r.puntos);
    default:
      return '—';
  }
}

function celdaHtml(
  content: string,
  ancho: number,
  align: 'left' | 'center' = 'left',
  bold = false,
  tabular = false,
): string {
  return `<div class="shrink-0 px-1.5 py-2 text-sm leading-5 text-zinc-200 ${bold ? 'font-semibold' : ''} ${tabular ? 'tabular-nums' : ''}" style="width:${ancho}px;min-width:${ancho}px;text-align:${align}">${escapeHtml(content)}</div>`;
}

function filaEncabezadoHtml(mostrarGoles: boolean): string {
  const titulos = titulosTabla(mostrarGoles);
  const n = titulos.length;
  const cells = titulos
    .map((h, i) =>
      celdaHtml(h, anchoColumna(i, mostrarGoles, n), i <= 2 ? 'left' : 'center', true, i >= 3),
    )
    .join('');
  return `<div class="flex border-b border-white/20 bg-white/10">${cells}</div>`;
}

function filaEquipoHtml(r: PosicionDelEquipoDTO, mostrarGoles: boolean): string {
  const titulos = titulosTabla(mostrarGoles);
  const n = titulos.length;
  const cells = titulos
    .map((label, i) => {
      const ancho = anchoColumna(i, mostrarGoles, n);
      if (label === 'Esc') {
        return `<div class="flex shrink-0 items-center justify-center px-1 py-1.5" style="width:${ancho}px;min-width:${ancho}px">${escudoImgHtml(r.escudo)}</div>`;
      }
      const align: 'left' | 'center' = label === 'Equipo' ? 'left' : 'center';
      return celdaHtml(valorCelda(label, r), ancho, align, false, label !== 'Equipo');
    })
    .join('');
  return `<div class="flex border-b border-white/5">${cells}</div>`;
}

function tablaCategoriaHtml(bloque: CategoriasConPosicionesDTO, mostrarGoles: boolean): string {
  const renglones = bloque.renglones ?? [];
  const anchoTotal = anchoTablaTotal(mostrarGoles);
  const titulo = escapeHtml(textoOGuion(bloque.categoria));
  const leyenda = (bloque.leyenda ?? '').trim();

  if (renglones.length === 0) {
    const leyendaHtml = leyenda
      ? `<p class="mt-2 text-sm leading-5 text-zinc-500">${escapeHtml(leyenda)}</p>`
      : '';
    return `<div class="my-6">
    <h4 class="font-display mb-3 text-center text-xl tracking-wide text-white uppercase">${titulo}</h4>
    <p class="text-sm text-zinc-500">Aún no hay partidos en esta categoría</p>
    ${leyendaHtml}
  </div>`;
  }

  const tabla = `<div class="overflow-x-auto">
      <div style="width:${anchoTotal}px;min-width:100%">
        ${filaEncabezadoHtml(mostrarGoles)}
        ${renglones.map((r) => filaEquipoHtml(r, mostrarGoles)).join('')}
      </div>
    </div>`;

  const leyendaHtml = leyenda
    ? `<p class="mt-2 text-sm leading-5 text-zinc-500">${escapeHtml(leyenda)}</p>`
    : '';

  return `<div class="my-6">
    <h4 class="font-display mb-3 text-center text-xl tracking-wide text-white uppercase">${titulo}</h4>
    ${tabla}
    ${leyendaHtml}
  </div>`;
}

export function renderPosicionesHtml(data: PosicionesDTO | undefined): string {
  const categorias = data?.posiciones ?? [];
  if (categorias.length === 0) {
    return emptyStateHtml('No hay posiciones para esta zona.');
  }
  const mostrarGoles = data?.verGoles !== false;
  return categorias.map((b) => tablaCategoriaHtml(b, mostrarGoles)).join('');
}

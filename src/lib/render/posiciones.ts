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
  ancho: number | 'flex',
  align: 'left' | 'center' = 'left',
  bold = false,
  tabular = false,
): string {
  const base = `py-2 text-sm leading-5 text-zinc-200 ${bold ? 'font-semibold' : ''} ${tabular ? 'tabular-nums' : ''}`;
  const alignClass = align === 'center' ? 'text-center' : 'text-left';

  if (ancho === 'flex') {
    return `<div class="min-w-[120px] flex-1 shrink px-1.5 ${base} ${alignClass}">${escapeHtml(content)}</div>`;
  }

  return `<div class="shrink-0 px-1.5 ${base} ${alignClass}" style="width:${ancho}px;min-width:${ancho}px">${escapeHtml(content)}</div>`;
}

function anchoCelda(label: string, i: number, mostrarGoles: boolean, n: number): number | 'flex' {
  if (label === 'Equipo') return 'flex';
  return anchoColumna(i, mostrarGoles, n);
}

function filaEncabezadoHtml(mostrarGoles: boolean): string {
  const titulos = titulosTabla(mostrarGoles);
  const n = titulos.length;
  const cells = titulos
    .map((h, i) => {
      const ancho = anchoCelda(h, i, mostrarGoles, n);
      return celdaHtml(h, ancho, i <= 2 ? 'left' : 'center', true, i >= 3);
    })
    .join('');
  return `<div class="flex w-full min-w-0">${cells}</div>`;
}

function filaEquipoHtml(r: PosicionDelEquipoDTO, mostrarGoles: boolean): string {
  const titulos = titulosTabla(mostrarGoles);
  const n = titulos.length;
  const cells = titulos
    .map((label, i) => {
      const ancho = anchoCelda(label, i, mostrarGoles, n);
      if (label === 'Esc') {
        const w = anchoColumna(i, mostrarGoles, n);
        return `<div class="flex shrink-0 items-center justify-center px-1 py-1.5" style="width:${w}px;min-width:${w}px">${escudoImgHtml(r.escudo)}</div>`;
      }
      const align: 'left' | 'center' = label === 'Equipo' ? 'left' : 'center';
      return celdaHtml(valorCelda(label, r), ancho, align, false, label !== 'Equipo');
    })
    .join('');
  return `<div class="flex w-full min-w-0 border-b border-white/5 last:border-b-0">${cells}</div>`;
}

function tablaCategoriaHtml(bloque: CategoriasConPosicionesDTO, mostrarGoles: boolean): string {
  const renglones = bloque.renglones ?? [];
  const anchoTotal = anchoTablaTotal(mostrarGoles);
  const titulo = escapeHtml(textoOGuion(bloque.categoria));
  const leyenda = (bloque.leyenda ?? '').trim();
  const leyendaHtml = leyenda
    ? `<p class="mt-2 text-sm leading-5 text-zinc-500">${escapeHtml(leyenda)}</p>`
    : '';

  if (renglones.length === 0) {
    return `<div class="min-w-0">
    <h4 class="font-display mb-3 text-center text-xl tracking-wide text-white uppercase">${titulo}</h4>
    <p class="text-sm text-zinc-500">Aún no hay partidos en esta categoría</p>
    ${leyendaHtml}
  </div>`;
  }

  const tabla = `<div class="max-md:overflow-x-auto">
      <div class="mx-auto w-full max-w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <div class="border-b border-white/20 bg-white/10">
          <div class="max-md:overflow-x-auto px-4">
            <div class="posiciones-tabla-inner mx-auto w-full" style="--tabla-min:${anchoTotal}px">
              ${filaEncabezadoHtml(mostrarGoles)}
            </div>
          </div>
        </div>
        <div class="max-md:overflow-x-auto px-4 py-1">
          <div class="posiciones-tabla-inner mx-auto w-full" style="--tabla-min:${anchoTotal}px">
            ${renglones.map((r) => filaEquipoHtml(r, mostrarGoles)).join('')}
          </div>
        </div>
      </div>
    </div>`;

  return `<div class="min-w-0">
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
  const tablas = categorias.map((b) => tablaCategoriaHtml(b, mostrarGoles)).join('');
  return `<div class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">${tablas}</div>`;
}

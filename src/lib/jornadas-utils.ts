import type { FechasParaJornadasDTO } from '@types/zona-detalle';

export type MarcadorParseado =
  | { ok: true; local: string; visitante: string }
  | { ok: false; texto: string };

export function fechaTieneResultados(fecha: FechasParaJornadasDTO): boolean {
  for (const j of fecha.jornadas ?? []) {
    const cats = categoriasResultadoUnico(j.local?.categorias, j.visitante?.categorias);
    for (const c of cats) {
      if ((c.resultado ?? '').trim().length > 0) return true;
    }
  }
  return false;
}

export function indiceUltimaFechaConResultados(fechas: FechasParaJornadasDTO[]): number {
  if (fechas.length === 0) return 0;
  for (let i = fechas.length - 1; i >= 0; i--) {
    if (fechaTieneResultados(fechas[i])) return i;
  }
  return 0;
}

export function categoriasResultadoUnico(
  loc: { categoria?: string; resultado?: string }[] | undefined,
  vis: { categoria?: string; resultado?: string }[] | undefined,
) {
  const a = loc?.length ? loc : vis;
  return a ?? [];
}

export function parseMarcadorPartido(s: string | undefined): MarcadorParseado {
  const t = (s ?? '').trim();
  if (!t) return { ok: false, texto: '—' };
  const main = t.match(/^(\S+)\s*-\s*(\S+)/);
  if (!main) return { ok: false, texto: t };
  let local = main[1];
  let visitante = main[2];
  const rest = t.slice(main[0].length).trim();
  const pen = rest.match(/^\((\S+)\s*-\s*(\S+)\)\s*$/);
  if (pen) {
    local = `${local} (${pen[1]})`;
    visitante = `${visitante} (${pen[2]})`;
  }
  return { ok: true, local, visitante };
}

export function nombresCategoriasDeFecha(fecha: FechasParaJornadasDTO): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const j of fecha.jornadas ?? []) {
    for (const row of categoriasResultadoUnico(j.local?.categorias, j.visitante?.categorias)) {
      const n = (row.categoria ?? '').trim();
      if (!n || seen.has(n)) continue;
      seen.add(n);
      ordered.push(n);
    }
  }
  return ordered;
}

export function celdaResultadoCategoria(
  categorias: { categoria?: string; resultado?: string }[] | undefined,
  nombreCategoria: string,
  lado: 'local' | 'visitante',
): string {
  const row = (categorias ?? []).find((r) => (r.categoria ?? '').trim() === nombreCategoria);
  if (!row) return '—';
  const mar = parseMarcadorPartido(row.resultado);
  if (mar.ok) return lado === 'local' ? mar.local : mar.visitante;
  if (mar.texto !== '—') return lado === 'local' ? mar.texto : '—';
  return '—';
}

export function anchoTablaJornadas(nCategorias: number): number {
  const ANCHO = { esc: 44, equipo: 148, cat: 102, pt: 40, pj: 40 };
  return ANCHO.esc + ANCHO.equipo + nCategorias * ANCHO.cat + ANCHO.pt + ANCHO.pj;
}

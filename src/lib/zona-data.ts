import { formatZonaNombre } from '@lib/html-utils';
import {
  getClubes,
  getEliminacionDirecta,
  getFixtureTodosContraTodos,
  getJornadasTodosContraTodos,
  getPosicionesAnual,
  getPosicionesTodosContraTodos,
} from '@lib/api-client';
import type {
  ZonaDetalleData,
  ZonaPageParams,
  ZonaSectionDef,
  ZonaSectionId,
} from '@types/zona-detalle';

export function parseZonaPageParams(search: URLSearchParams): ZonaPageParams | null {
  const idRaw = search.get('id');
  if (!idRaw) return null;
  const zonaId = Number(idRaw);
  if (!Number.isFinite(zonaId)) return null;

  const agrupadorId = Number(search.get('agrupadorId') ?? '');
  if (!Number.isFinite(agrupadorId)) return null;

  return {
    zonaId,
    agrupadorId,
    agrupadorNombre: search.get('agrupadorNombre') ?? '',
    tipoDeFase: search.get('tipoDeFase') ?? '',
    zonaNombre: formatZonaNombre(search.get('zonaNombre') ?? ''),
    faseNombre: search.get('faseNombre') ?? '',
    torneoNombre: search.get('torneoNombre') ?? '',
    color: search.get('color') ?? '',
  };
}

export function getSeccionesVisibles(tipoDeFase: string): ZonaSectionDef[] {
  if (tipoDeFase === 'EliminacionDirecta') {
    return [
      { id: 'fixture', titulo: 'Fixture' },
      { id: 'clubes', titulo: 'Clubes' },
    ];
  }
  if (tipoDeFase === 'Anual') {
    return [{ id: 'posiciones', titulo: 'Posiciones' }];
  }
  return [
    { id: 'posiciones', titulo: 'Posiciones' },
    { id: 'fixture', titulo: 'Fixture' },
    { id: 'jornadas', titulo: 'Jornadas' },
    { id: 'clubes', titulo: 'Clubes' },
  ];
}

async function settleSection<T>(
  id: ZonaSectionId,
  fn: () => Promise<T>,
  errors: Partial<Record<ZonaSectionId, string>>,
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    errors[id] = error instanceof Error ? error.message : 'Error inesperado';
    return undefined;
  }
}

export async function fetchZonaDetalle(
  zonaId: number,
  tipoDeFase: string,
): Promise<ZonaDetalleData> {
  const errors: Partial<Record<ZonaSectionId, string>> = {};
  const result: ZonaDetalleData = { errors };

  if (tipoDeFase === 'EliminacionDirecta') {
    const [eliminacionDirecta, clubes] = await Promise.all([
      settleSection('fixture', () => getEliminacionDirecta(zonaId), errors),
      settleSection('clubes', () => getClubes(zonaId), errors),
    ]);
    result.eliminacionDirecta = eliminacionDirecta;
    result.clubes = clubes;
    return result;
  }

  if (tipoDeFase === 'Anual') {
    result.posiciones = await settleSection(
      'posiciones',
      () => getPosicionesAnual(zonaId),
      errors,
    );
    return result;
  }

  const [posiciones, fixture, jornadas, clubes] = await Promise.all([
    settleSection('posiciones', () => getPosicionesTodosContraTodos(zonaId), errors),
    settleSection('fixture', () => getFixtureTodosContraTodos(zonaId), errors),
    settleSection('jornadas', () => getJornadasTodosContraTodos(zonaId), errors),
    settleSection('clubes', () => getClubes(zonaId), errors),
  ]);

  result.posiciones = posiciones;
  result.fixture = fixture;
  result.jornadas = jornadas;
  result.clubes = clubes;
  return result;
}

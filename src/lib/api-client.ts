import type { AgrupadorDeTorneo } from '@types/torneo';
import type {
  ClubesDTO,
  EliminacionDirectaDTO,
  FixtureDTO,
  JornadasDTO,
  PosicionesDTO,
} from '@types/zona-detalle';

const API_BASE_URL =
  import.meta.env.PUBLIC_API_BASE_URL ?? 'https://admin.edefi.com.ar/api/carnet-digital';

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

async function fetchJson<T>(path: string, label: string): Promise<T> {
  const url = `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new ApiClientError(`No se pudo cargar ${label} (${response.status})`, response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiClientError) throw error;
    throw new ApiClientError(
      error instanceof Error ? error.message : `Error de red al cargar ${label}`,
    );
  }
}

export async function getAgrupadoresDeTorneo(): Promise<AgrupadorDeTorneo[]> {
  const data = await fetchJson<unknown>('info-inicial-de-torneos', 'torneos');
  if (!Array.isArray(data)) {
    throw new ApiClientError('La respuesta de torneos no tiene el formato esperado');
  }
  return data as AgrupadorDeTorneo[];
}

export function getPosicionesTodosContraTodos(zonaId: number): Promise<PosicionesDTO> {
  return fetchJson(`posiciones-todos-contra-todos?zonaId=${zonaId}`, 'posiciones');
}

export function getPosicionesAnual(zonaId: number): Promise<PosicionesDTO> {
  return fetchJson(`posiciones-anual?zonaId=${zonaId}`, 'posiciones anuales');
}

export function getFixtureTodosContraTodos(zonaId: number): Promise<FixtureDTO> {
  return fetchJson(`fixture-todos-contra-todos?zonaId=${zonaId}`, 'fixture');
}

export function getJornadasTodosContraTodos(zonaId: number): Promise<JornadasDTO> {
  return fetchJson(`jornadas-todos-contra-todos?zonaId=${zonaId}`, 'jornadas');
}

export function getEliminacionDirecta(zonaId: number): Promise<EliminacionDirectaDTO> {
  return fetchJson(`eliminacion-directa?zonaId=${zonaId}`, 'eliminación directa');
}

export function getClubes(zonaId: number): Promise<ClubesDTO[]> {
  return fetchJson(`clubes?zonaId=${zonaId}`, 'clubes');
}

import type { AgrupadorDeTorneo } from '@types/torneo';
import type { SponsorWebPublica } from '@types/sponsor';
import type {
  ClubesDTO,
  EliminacionDirectaDTO,
  FixtureDTO,
  JornadasDTO,
  PosicionesDTO,
} from '@types/zona-detalle';

const API_BASE_URL =
  import.meta.env.PUBLIC_API_BASE_URL ?? 'https://admin.edefi.com.ar/api/carnet-digital';

const CARNET_DIGITAL_SUFFIX = /\/api\/carnet-digital\/?$/;

function getPublicApiOrigin(): string {
  const explicit = import.meta.env.PUBLIC_API_ORIGIN;
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }
  return API_BASE_URL.replace(CARNET_DIGITAL_SUFFIX, '').replace(/\/$/, '');
}

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

export async function getSponsorsWebPublica(): Promise<SponsorWebPublica[]> {
  const url = `${getPublicApiOrigin()}/api/publico/sponsors-web-publica`;

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new ApiClientError(
        `No se pudieron cargar los sponsors (${response.status})`,
        response.status,
      );
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      throw new ApiClientError('La respuesta de sponsors no tiene el formato esperado');
    }

    return data as SponsorWebPublica[];
  } catch (error) {
    if (error instanceof ApiClientError) throw error;
    throw new ApiClientError(
      error instanceof Error ? error.message : 'Error de red al cargar sponsors',
    );
  }
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

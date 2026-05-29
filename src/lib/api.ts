import type { EscudoClub } from '@types/club';
import type { AgrupadorDeTorneo } from '@types/torneo';
import type { SponsorWebPublica } from '@types/sponsor';

const API_BASE_URL =
  import.meta.env.API_BASE_URL ?? 'https://admin.edefi.com.ar/api/carnet-digital';

const CARNET_DIGITAL_SUFFIX = /\/api\/carnet-digital\/?$/;

function getApiOrigin(): string {
  const explicit = import.meta.env.API_ORIGIN;
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }
  return API_BASE_URL.replace(CARNET_DIGITAL_SUFFIX, '').replace(/\/$/, '');
}

export function escudoUrl(escudoRelativo: string): string {
  const path = escudoRelativo.startsWith('/') ? escudoRelativo : `/${escudoRelativo}`;
  return `${getApiOrigin()}${path}`;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function getAgrupadoresDeTorneo(): Promise<AgrupadorDeTorneo[]> {
  const url = `${API_BASE_URL}/info-inicial-de-torneos`;

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new ApiError(`No se pudieron cargar los torneos (${response.status})`, response.status);
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      throw new ApiError('La respuesta de la API no tiene el formato esperado');
    }

    return data as AgrupadorDeTorneo[];
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error instanceof Error ? error.message : 'Error de red al consultar la API');
  }
}

export function sponsorLogoUrl(sponsorId: number): string {
  const origin = getApiOrigin();
  return `${origin}/api/publico/sponsor-logo/${sponsorId}`;
}

export async function getSponsorsWebPublica(): Promise<SponsorWebPublica[]> {
  const url = `${getApiOrigin()}/api/publico/sponsors-web-publica`;

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new ApiError(`No se pudieron cargar los sponsors (${response.status})`, response.status);
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      throw new ApiError('La respuesta de la API no tiene el formato esperado');
    }

    return data as SponsorWebPublica[];
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error instanceof Error ? error.message : 'Error de red al consultar la API');
  }
}

export async function getEscudosDeClubes(): Promise<EscudoClub[]> {
  const url = `${getApiOrigin()}/api/publico/escudos-clubes`;

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new ApiError(`No se pudieron cargar los escudos (${response.status})`, response.status);
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      throw new ApiError('La respuesta de la API no tiene el formato esperado');
    }

    return data as EscudoClub[];
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error instanceof Error ? error.message : 'Error de red al consultar la API');
  }
}

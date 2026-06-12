export type Zona = {
  id: number;
  nombre: string;
};

export type Fase = {
  id: number;
  nombre: string;
  tipoDeFase: string;
  zonas: Zona[];
};

export type ElementoTorneo =
  | { tipo: 'fase'; id: number; nombre: string; tipoDeFase: string; zonas: Zona[] }
  | {
      tipo: 'grupo';
      grupoId: number;
      nombreGrupo: string;
      elementos: ElementoTorneo[];
    };

export type Torneo = {
  id: number;
  nombre: string;
  /** @deprecated usar elementos */
  fases?: Fase[];
  elementos: ElementoTorneo[];
};

export type AgrupadorDeTorneo = {
  id: number;
  nombre: string;
  color: string;
  torneos: Torneo[];
};

/** Normaliza torneos de la API (elementos o fases legacy). */
export function normalizarTorneo(torneo: {
  id: number;
  nombre: string;
  fases?: Fase[];
  elementos?: ElementoTorneo[];
}): Torneo {
  if (torneo.elementos?.length) {
    return { id: torneo.id, nombre: torneo.nombre, elementos: torneo.elementos };
  }
  const fases = torneo.fases ?? [];
  return {
    id: torneo.id,
    nombre: torneo.nombre,
    elementos: fases.map((f) => ({
      tipo: 'fase' as const,
      id: f.id,
      nombre: f.nombre,
      tipoDeFase: f.tipoDeFase,
      zonas: f.zonas ?? [],
    })),
  };
}

export function normalizarAgrupadores(
  agrupadores: Array<{
    id: number;
    nombre: string;
    color: string;
    torneos: Array<{
      id: number;
      nombre: string;
      fases?: Fase[];
      elementos?: ElementoTorneo[];
    }>;
  }>,
): AgrupadorDeTorneo[] {
  return agrupadores.map((a) => ({
    ...a,
    torneos: a.torneos.map(normalizarTorneo),
  }));
}

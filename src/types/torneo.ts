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

export type Torneo = {
  id: number;
  nombre: string;
  fases: Fase[];
};

export type AgrupadorDeTorneo = {
  id: number;
  nombre: string;
  color: string;
  torneos: Torneo[];
};

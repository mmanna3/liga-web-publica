export type PosicionDelEquipoDTO = {
  posicion?: string;
  escudo?: string;
  equipo?: string;
  partidosJugados?: string;
  partidosGanados?: string;
  partidosEmpatados?: string;
  partidosPerdidos?: string;
  partidosNoPresento?: string;
  golesAFavor?: string;
  golesEnContra?: string;
  golesDiferencia?: string;
  puntos?: string;
};

export type CategoriasConPosicionesDTO = {
  categoria?: string;
  leyenda?: string;
  renglones?: PosicionDelEquipoDTO[];
};

export type PosicionesDTO = {
  posiciones?: CategoriasConPosicionesDTO[];
  verGoles?: boolean;
};

export type FixturePartidoDTO = {
  localEscudo?: string;
  visitanteEscudo?: string;
  local?: string;
  visitante?: string;
};

export type FixtureFechaDTO = {
  titulo?: string;
  dia?: string;
  partidos?: FixturePartidoDTO[];
};

export type FixtureDTO = {
  fechas?: FixtureFechaDTO[];
};

export type PartidoEliminacionDirectaDTO = {
  escudoLocal?: string;
  local?: string;
  resultadoLocal?: string;
  penalesLocal?: string;
  escudoVisitante?: string;
  visitante?: string;
  resultadoVisitante?: string;
  penalesVisitante?: string;
};

export type InstanciasDTO = {
  titulo?: string;
  dia?: string;
  partidos?: PartidoEliminacionDirectaDTO[];
};

export type EliminacionDirectaDTO = {
  instancias?: InstanciasDTO[];
};

export type ResultadoCategoriaDTO = {
  categoria?: string;
  resultado?: string;
};

export type JornadaPorEquipoDTO = {
  escudo?: string;
  equipo?: string;
  categorias?: ResultadoCategoriaDTO[];
  puntosTotales?: number;
  partidosJugados?: number;
};

export type JornadasPorFechaDTO = {
  local?: JornadaPorEquipoDTO;
  visitante?: JornadaPorEquipoDTO;
};

export type FechasParaJornadasDTO = {
  titulo?: string;
  dia?: string;
  jornadas?: JornadasPorFechaDTO[];
};

export type JornadasDTO = {
  fechas?: FechasParaJornadasDTO[];
};

export type ClubesDTO = {
  equipo?: string;
  escudo?: string;
  localidad?: string;
  direccion?: string;
  tipoCancha?: string;
  superficieCancha?: string;
};

export type ZonaLinkContext = {
  zonaId: number;
  tipoDeFase: string;
  zonaNombre: string;
  faseNombre: string;
  torneoNombre: string;
  agrupadorNombre: string;
  color: string;
  agrupadorId: number;
};

export type ZonaPageParams = ZonaLinkContext & {
  zonaId: number;
};

export type ZonaSectionId = 'posiciones' | 'fixture' | 'jornadas' | 'clubes';

export type ZonaSectionDef = {
  id: ZonaSectionId;
  titulo: string;
};

export type ZonaDetalleData = {
  posiciones?: PosicionesDTO;
  fixture?: FixtureDTO;
  jornadas?: JornadasDTO;
  eliminacionDirecta?: EliminacionDirectaDTO;
  clubes?: ClubesDTO[];
  errors: Partial<Record<ZonaSectionId, string>>;
};

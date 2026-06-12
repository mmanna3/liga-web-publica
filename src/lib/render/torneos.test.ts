import { describe, expect, it } from 'vitest';
import { normalizarTorneo } from '@types/torneo';
import { grupoDeFasesCardHtml, faseCardHtml } from '@lib/render/torneos';
import type { AgrupadorDeTorneo, ElementoTorneo, Torneo } from '@types/torneo';

const torneoBase: Torneo = {
  id: 1,
  nombre: 'Torneo Test',
  elementos: [],
};

const agrupador: AgrupadorDeTorneo = {
  id: 1,
  nombre: 'Agrupador',
  color: 'Azul',
  torneos: [torneoBase],
};

describe('normalizarTorneo', () => {
  it('convierte fases legacy a elementos', () => {
    const t = normalizarTorneo({
      id: 1,
      nombre: 'T',
      fases: [{ id: 5, nombre: 'Fase X', tipoDeFase: 'Regular', zonas: [] }],
    });
    expect(t.elementos).toHaveLength(1);
    expect(t.elementos[0].tipo).toBe('fase');
  });

  it('preserva elementos cuando vienen de la API', () => {
    const elementos: ElementoTorneo[] = [
      { tipo: 'grupo', grupoId: 2, nombreGrupo: 'Grupo A', elementos: [] },
    ];
    const t = normalizarTorneo({ id: 1, nombre: 'T', elementos });
    expect(t.elementos[0].tipo).toBe('grupo');
  });
});

describe('render jerárquico', () => {
  it('renderiza fase con nombre', () => {
    const html = faseCardHtml(
      { id: 1, nombre: 'Fase A', tipoDeFase: 'Regular', zonas: [] },
      torneoBase,
      agrupador,
      'text-blue-400',
      'hover:border-blue-400',
    );
    expect(html).toContain('Fase A');
  });

  it('renderiza grupo con sub-elementos', () => {
    const html = grupoDeFasesCardHtml(
      'Grupo A',
      [
        {
          tipo: 'fase',
          id: 1,
          nombre: 'Fase B',
          tipoDeFase: 'Regular',
          zonas: [{ id: 10, nombre: 'Zona 1' }],
        },
      ],
      torneoBase,
      agrupador,
      'text-blue-400',
      'hover:border-blue-400',
    );
    expect(html).toContain('Grupo A');
    expect(html).toContain('Fase B');
    expect(html).toContain('ZONA 1');
  });
});

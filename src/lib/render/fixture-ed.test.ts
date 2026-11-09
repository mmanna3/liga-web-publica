import { describe, expect, it } from 'vitest';
import { renderFixtureEdHtml } from './fixture-ed';

describe('renderFixtureEdHtml', () => {
  it('zona de un único equipo: muestra solo el campeón, sin partidos', () => {
    const html = renderFixtureEdHtml({
      instancias: [],
      campeonSinJugar: { equipo: 'Equipo Campeón', escudo: '/escudos/1.jpg' },
    });
    expect(html).toContain('Equipo Campeón');
    expect(html).toContain('Campeón');
    expect(html).not.toContain('No hay partidos');
  });

  it('sin campeón ni instancias: muestra el estado vacío', () => {
    expect(renderFixtureEdHtml({ instancias: [] })).toContain('No hay partidos');
  });
});

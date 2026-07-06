import { describe, expect, it } from 'vitest';
import { normalizarTorneo } from '@types/torneo';
import {
  grupoDeFasesCardHtml,
  faseCardHtml,
  isMultiWordTitle,
  zonaBadgeHtml,
} from '@lib/render/torneos';
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

const faseBase = {
  id: 1,
  nombre: 'Fase A',
  tipoDeFase: 'Regular',
  zonas: [{ id: 10, nombre: 'Zona 1' }],
};

describe('isMultiWordTitle', () => {
  it('detecta títulos con varias palabras', () => {
    expect(isMultiWordTitle('Fase Norte')).toBe(true);
    expect(isMultiWordTitle('Fase A')).toBe(true);
  });

  it('detecta títulos de una sola palabra', () => {
    expect(isMultiWordTitle('SUDAMERICANA')).toBe(false);
    expect(isMultiWordTitle('LIBERTADORES')).toBe(false);
  });
});

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

  it('faseCardHtml genera details colapsable sin open', () => {
    const html = faseCardHtml(
      faseBase,
      torneoBase,
      agrupador,
      'text-blue-400',
      'hover:border-blue-400',
    );
    expect(html).toContain('class="torneo-disclosure min-w-0"');
    expect(html).toContain('<summary');
    expect(html).not.toMatch(/\bopen=/);
  });

  it('fase y grupo al mismo nivel comparten padding y tipografía del summary', () => {
    const faseHtml = faseCardHtml(
      { id: 1, nombre: 'Fase A', tipoDeFase: 'Regular', zonas: [] },
      torneoBase,
      agrupador,
      'text-blue-400',
      'hover:border-blue-400',
    );
    const grupoHtml = grupoDeFasesCardHtml(
      'Grupo A',
      [],
      torneoBase,
      agrupador,
      'text-blue-400',
      'hover:border-blue-400',
    );

    expect(faseHtml).toContain(' p-5 ');
    expect(grupoHtml).toContain(' p-5 ');
    expect(faseHtml).toContain('text-xl');
    expect(grupoHtml).toContain('text-xl');
    expect(faseHtml).toContain('text-white');
    expect(grupoHtml).toContain('text-white');
    expect(faseHtml).not.toContain('p-6');
    expect(grupoHtml).not.toContain('text-lg');
    expect(grupoHtml).not.toContain('text-zinc-200');
  });

  it('fase multi-palabra usa wrap normal y card contenido', () => {
    const html = faseCardHtml(
      {
        id: 1,
        nombre: 'Copa Eliminatoria Final',
        tipoDeFase: 'Regular',
        zonas: [],
      },
      torneoBase,
      agrupador,
      'text-blue-400',
      'hover:border-blue-400',
    );
    const summaryEnd = html.indexOf('</summary>');
    const summary = html.slice(0, summaryEnd);
    expect(summary).toContain('whitespace-normal');
    expect(summary).not.toContain('disclosure-title-scroll');
    expect(html).toContain('glass min-w-0 rounded-2xl');
  });

  it('fase palabra única expande card y mantiene una sola línea', () => {
    const html = faseCardHtml(
      {
        id: 1,
        nombre: 'SUDAMERICANA',
        tipoDeFase: 'Regular',
        zonas: [],
      },
      torneoBase,
      agrupador,
      'text-blue-400',
      'hover:border-blue-400',
    );
    const summaryEnd = html.indexOf('</summary>');
    const summary = html.slice(0, summaryEnd);
    expect(summary).toContain('whitespace-nowrap');
    expect(summary).not.toContain('disclosure-title-scroll');
    expect(summary).toContain('SUDAMERICANA');
    expect(html).toContain('glass w-max min-w-full md:w-full md:min-w-0 rounded-2xl');
  });

  it('faseCardHtml usa color del agrupador en el ícono del summary', () => {
    const html = faseCardHtml(
      faseBase,
      torneoBase,
      agrupador,
      'text-blue-400',
      'hover:border-blue-400',
    );
    const summaryEnd = html.indexOf('</summary>');
    const summary = html.slice(0, summaryEnd);
    expect(summary).toContain('text-blue-400');
    expect(summary).not.toContain('1 zona');
  });

  it('faseCardHtml oculta badges de zona en el body del details', () => {
    const html = faseCardHtml(
      faseBase,
      torneoBase,
      agrupador,
      'text-blue-400',
      'hover:border-blue-400',
    );
    const summaryEnd = html.indexOf('</summary>');
    const body = html.slice(summaryEnd);
    expect(body).toContain('ZONA 1');
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

  it('grupoDeFasesCardHtml genera details colapsable', () => {
    const html = grupoDeFasesCardHtml(
      'Grupo A',
      [{ tipo: 'fase', id: 1, nombre: 'Fase B', tipoDeFase: 'Regular', zonas: [] }],
      torneoBase,
      agrupador,
      'text-blue-400',
      'hover:border-blue-400',
    );
    expect(html).toContain('class="torneo-disclosure min-w-0"');
    expect(html).not.toMatch(/\bopen=/);
    expect(html).toContain('text-blue-400');
  });

  it('grupoDeFasesCardHtml incluye contenedor acordeón para hijos', () => {
    const html = grupoDeFasesCardHtml(
      'Grupo A',
      [{ tipo: 'fase', id: 1, nombre: 'Fase B', tipoDeFase: 'Regular', zonas: [] }],
      torneoBase,
      agrupador,
      'text-blue-400',
      'hover:border-blue-400',
    );
    expect(html).toContain('torneo-accordion-group');
  });

  it('grupo anidado usa indentación sin margin-left', () => {
    const html = grupoDeFasesCardHtml(
      'Subgrupo',
      [],
      torneoBase,
      agrupador,
      'text-blue-400',
      'hover:border-blue-400',
      2,
    );
    expect(html).toContain('border-l border-white/10 pl-3');
    expect(html).not.toContain('ml-4');
  });

  it('faseCardHtml usa grid de 2 columnas para zonas en mobile', () => {
    const html = faseCardHtml(faseBase, torneoBase, agrupador, 'text-blue-400', 'hover:border-blue-400');
    expect(html).toContain('zonas-grid');
    expect(html).not.toContain('flex min-w-0 flex-wrap gap-3');
  });

  it('zonaBadgeHtml multi-palabra permite wrap', () => {
    const html = zonaBadgeHtml(
      { id: 10, nombre: 'Zona Larga Norte' },
      faseBase,
      torneoBase,
      agrupador,
      'text-blue-400',
      'hover:border-blue-400',
    );
    expect(html).toContain('w-full min-w-0');
    expect(html).toContain('whitespace-normal');
    expect(html).toContain('zona-badge-label');
    expect(html).toContain('sm:hover:scale-[1.05]');
  });

  it('zonaBadgeHtml palabra única usa nowrap en desktop y ancho completo en mobile', () => {
    const html = zonaBadgeHtml(
      { id: 10, nombre: 'SUDAMERICANA' },
      faseBase,
      torneoBase,
      agrupador,
      'text-blue-400',
      'hover:border-blue-400',
    );
    expect(html).toContain('whitespace-nowrap');
    expect(html).toContain('w-full min-w-0 md:w-max');
    expect(html).toContain('SUDAMERICANA');
  });
});

import { describe, expect, it } from 'vitest';
import { normalizarTorneo } from '@types/torneo';
import { grupoDeFasesCardHtml, faseCardHtml, zonaBadgeHtml } from '@lib/render/torneos';
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

  it('summary de fase permite wrap en nombres largos', () => {
    const html = faseCardHtml(
      {
        id: 1,
        nombre: 'Fase Eliminatoria Semifinal Norte Sur',
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
    expect(summary).toContain('wrap-break-word');
    expect(summary).toContain('whitespace-normal');
    expect(summary).toContain('min-w-0');
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

  it('zonaBadgeHtml incluye clases responsive para mobile', () => {
    const html = zonaBadgeHtml(
      { id: 10, nombre: 'Zona Larga Norte' },
      faseBase,
      torneoBase,
      agrupador,
      'text-blue-400',
      'hover:border-blue-400',
    );
    expect(html).toContain('max-w-full');
    expect(html).toContain('min-w-0');
    expect(html).toContain('wrap-break-word');
    expect(html).toContain('whitespace-normal');
    expect(html).toContain('sm:hover:scale-[1.05]');
  });
});

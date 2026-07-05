import { getAgrupadorTheme } from '@lib/colors';
import { escapeHtml, formatZonaNombre } from '@lib/html-utils';
import { zonaUrl } from '@lib/paths-client';
import { iconSvg } from '@lib/ui-html';
import type { AgrupadorDeTorneo, ElementoTorneo, Fase, Torneo, Zona } from '@types/torneo';

const DISCLOSURE_SUMMARY_BASE =
  'flex cursor-pointer list-none items-center gap-2.5 rounded-xl -mx-1 px-1 py-0.5 transition-colors hover:bg-white/5 active:bg-white/5 [&::-webkit-details-marker]:hidden';

const ELEMENTO_CARD_PADDING = 'p-5';

const FASE_CARD_BORDER = 'border border-white/10 border-l-2 border-l-white/10';
const GRUPO_CARD_BORDER = 'border border-dashed border-white/15';

function disclosureChevronHtml(): string {
  return `<span class="disclosure-chevron ml-auto shrink-0 text-zinc-500" aria-hidden="true">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </span>`;
}

function disclosureSummaryHtml(
  icon: 'layers' | 'trophy',
  title: string,
  accentClass: string,
  titleSizeClass = 'text-xl',
  titleColorClass = 'text-white',
): string {
  return `<summary class="${DISCLOSURE_SUMMARY_BASE}">
    ${iconSvg(icon, `h-5 w-5 shrink-0 ${accentClass}`)}
    <span class="min-w-0 flex-1">
      <span class="font-display ${titleSizeClass} leading-tight tracking-wide ${titleColorClass} wrap-break-word whitespace-normal uppercase">${escapeHtml(title)}</span>
    </span>
    ${disclosureChevronHtml()}
  </summary>`;
}

function elementoCardShellHtml(
  borderClass: string,
  indentClass: string,
  summaryHtml: string,
  bodyHtml: string,
  bodyExtraClass = '',
): string {
  return `<div class="glass min-w-0 rounded-2xl ${borderClass} ${ELEMENTO_CARD_PADDING} ${indentClass}">
    <details class="torneo-disclosure min-w-0">
      ${summaryHtml}
      <div class="mt-4 min-w-0 border-t border-white/5 pt-4 ${bodyExtraClass}">${bodyHtml}</div>
    </details>
  </div>`;
}

function zonaBadgeHtml(
  zona: Zona,
  fase: Fase,
  torneo: Torneo,
  agrupador: AgrupadorDeTorneo,
  accentClass: string,
  pillHoverClass: string,
): string {
  const href = zonaUrl({
    zonaId: zona.id,
    tipoDeFase: fase.tipoDeFase,
    zonaNombre: formatZonaNombre(zona.nombre),
    faseNombre: fase.nombre,
    torneoNombre: torneo.nombre,
    agrupadorNombre: agrupador.nombre,
    color: agrupador.color,
    agrupadorId: agrupador.id,
  });

  return `<a
    href="${escapeHtml(href)}"
    class="group flex max-w-full min-w-0 cursor-pointer items-center gap-2 rounded-full border border-border-glass bg-white/5 px-3 py-2 font-display text-sm font-medium tracking-wide text-zinc-300 uppercase backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:text-white sm:gap-3 sm:px-5 sm:py-2.5 sm:text-base sm:hover:scale-[1.05] ${pillHoverClass}"
  >
    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20 sm:h-9 sm:w-9 ${accentClass}" aria-hidden="true">
      ${iconSvg('ball', 'h-4 w-4')}
    </span>
    <span class="min-w-0 leading-tight wrap-break-word whitespace-normal">${escapeHtml(formatZonaNombre(zona.nombre))}</span>
  </a>`;
}

function faseCardHtml(
  fase: Fase,
  torneo: Torneo,
  agrupador: AgrupadorDeTorneo,
  accentClass: string,
  pillHoverClass: string,
): string {
  const zonasHtml =
    fase.zonas.length > 0
      ? `<div class="min-w-0">
          <p class="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.3em] uppercase ${accentClass}">
            ${iconSvg('grid', 'h-3.5 w-3.5')} Zonas
          </p>
          <div class="flex min-w-0 flex-wrap gap-3">
            ${fase.zonas.map((z) => zonaBadgeHtml(z, fase, torneo, agrupador, accentClass, pillHoverClass)).join('')}
          </div>
        </div>`
      : `<p class="flex items-center gap-2 text-sm text-zinc-600 italic">${iconSvg('grid', 'h-4 w-4')} Sin zonas asignadas</p>`;

  return elementoCardShellHtml(
    FASE_CARD_BORDER,
    '',
    disclosureSummaryHtml('layers', fase.nombre, accentClass),
    zonasHtml,
  );
}

function grupoDeFasesCardHtml(
  nombreGrupo: string,
  elementos: ElementoTorneo[],
  torneo: Torneo,
  agrupador: AgrupadorDeTorneo,
  accentClass: string,
  pillHoverClass: string,
  profundidad = 1,
): string {
  const indentClass = profundidad > 1 ? 'border-l border-white/10 pl-3 sm:pl-4' : '';
  const hijosHtml = elementos
    .map((el) =>
      elementoTorneoHtml(el, torneo, agrupador, accentClass, pillHoverClass, profundidad),
    )
    .join('');

  return elementoCardShellHtml(
    GRUPO_CARD_BORDER,
    indentClass,
    disclosureSummaryHtml('layers', nombreGrupo, accentClass),
    hijosHtml,
    'space-y-4',
  );
}

function elementoTorneoHtml(
  elemento: ElementoTorneo,
  torneo: Torneo,
  agrupador: AgrupadorDeTorneo,
  accentClass: string,
  pillHoverClass: string,
  profundidadGrupo = 1,
): string {
  if (elemento.tipo === 'fase') {
    return faseCardHtml(
      {
        id: elemento.id,
        nombre: elemento.nombre,
        tipoDeFase: elemento.tipoDeFase,
        zonas: elemento.zonas,
      },
      torneo,
      agrupador,
      accentClass,
      pillHoverClass,
    );
  }

  return grupoDeFasesCardHtml(
    elemento.nombreGrupo,
    elemento.elementos,
    torneo,
    agrupador,
    accentClass,
    pillHoverClass,
    profundidadGrupo + 1,
  );
}

function torneoCardHtml(
  torneo: Torneo,
  agrupador: AgrupadorDeTorneo,
  accentClass: string,
  pillHoverClass: string,
): string {
  const contenidoHtml = torneo.elementos
    .map((el) => elementoTorneoHtml(el, torneo, agrupador, accentClass, pillHoverClass))
    .join('');

  return `<div class="glass glass-hover rounded-2xl border border-white/10 p-6">
    <details class="torneo-disclosure">
      <summary class="${DISCLOSURE_SUMMARY_BASE}">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 ${accentClass}" aria-hidden="true">${iconSvg('trophy', 'h-5 w-5')}</span>
        <h3 class="min-w-0 flex-1 font-display pt-0.5 text-2xl leading-tight tracking-wide text-white wrap-break-word whitespace-normal uppercase sm:text-3xl">${escapeHtml(torneo.nombre)}</h3>
        ${disclosureChevronHtml()}
      </summary>
      <div class="mt-6 min-w-0 space-y-4 border-t border-white/5 pt-6">${contenidoHtml}</div>
    </details>
  </div>`;
}

function agrupadorCardHtml(agrupador: AgrupadorDeTorneo, index: number): string {
  const theme = getAgrupadorTheme(agrupador.color);
  const staggerClass = `stagger-${Math.min(index + 1, 4)}`;

  const torneosHtml = agrupador.torneos
    .map((t) => torneoCardHtml(t, agrupador, theme.accent, theme.pillHover))
    .join('');

  return `<article id="agrupador-${agrupador.id}" class="animate-fade-up relative scroll-mt-28 rounded-3xl border p-6 sm:p-8 md:p-10 ${theme.border} ${theme.glow} shadow-2xl transition-shadow duration-500 hover:shadow-[0_24px_80px_-12px_rgba(0,0,0,0.6)] ${staggerClass}">
    <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl bg-linear-to-br opacity-60 ${theme.gradient}" aria-hidden="true"></div>
    <div class="noise-overlay pointer-events-none absolute inset-0 overflow-hidden rounded-3xl opacity-30" aria-hidden="true"></div>
    <header class="relative z-10 mb-10 flex flex-wrap items-end gap-4 border-b border-white/10 pb-8">
      <div class="flex items-center gap-4">
        <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border bg-white/5 ${theme.border} ${theme.accent}" aria-hidden="true">
          ${iconSvg('trophy', 'h-7 w-7')}
        </span>
        <h3 class="font-display pt-1.5 text-4xl leading-none tracking-wide text-white uppercase sm:pt-2 sm:text-5xl md:pt-2.5 md:text-6xl">${escapeHtml(agrupador.nombre)}</h3>
      </div>
    </header>
    <div class="relative z-10 grid grid-cols-1 gap-6">${torneosHtml}</div>
  </article>`;
}

export function renderHeroAgrupadoresHtml(agrupadores: AgrupadorDeTorneo[]): string {
  if (agrupadores.length === 0) return '';

  const items = agrupadores
    .map((a) => {
      const theme = getAgrupadorTheme(a.color);
      return `<li>
        <a href="#agrupador-${a.id}" class="glass glass-hover flex items-center gap-3 rounded-full px-6 py-3 transition-all duration-300 ${theme.border}">
          <span class="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 ${theme.accent}" aria-hidden="true">${iconSvg('ball', 'h-4 w-4')}</span>
          <span class="font-display text-lg tracking-wide text-white uppercase">${escapeHtml(a.nombre)}</span>
        </a>
      </li>`;
    })
    .join('');

  return `<ul class="animate-fade-up stagger-3 mt-10 flex flex-wrap items-center gap-4 sm:gap-6">${items}</ul>`;
}

export function renderHeroStatsHtml(agrupadores: AgrupadorDeTorneo[]): string {
  const totalTorneos = agrupadores.reduce((acc, a) => acc + a.torneos.length, 0);
  if (totalTorneos === 0) return '';

  return `<dl class="animate-fade-up stagger-4 mt-16 grid grid-cols-2 gap-6 border-t border-white/15 pt-10 sm:grid-cols-3 sm:gap-10">
    <div class="text-center">
      <dt class="font-display flex items-center justify-center gap-2 text-[10px] tracking-[0.2em] text-zinc-400 uppercase">${iconSvg('shield', 'h-4 w-4 text-accent-hot')} Equipos</dt>
      <dd class="font-display mt-1 text-4xl text-white sm:text-5xl">+500</dd>
    </div>
    <div class="text-center">
      <dt class="font-display flex items-center justify-center gap-2 text-[10px] tracking-[0.2em] text-zinc-400 uppercase">${iconSvg('trophy', 'h-4 w-4 text-accent-hot')} Torneos</dt>
      <dd class="font-display mt-1 text-4xl text-white sm:text-5xl">${totalTorneos}</dd>
    </div>
    <div class="col-span-2 text-center sm:col-span-1">
      <dt class="font-display flex items-center justify-center gap-2 text-[10px] tracking-[0.2em] text-zinc-400 uppercase">${iconSvg('calendar', 'h-4 w-4 text-accent-hot')} Partidos</dt>
      <dd class="font-display mt-1 text-4xl text-white sm:text-5xl">+12000</dd>
    </div>
  </dl>`;
}

export function renderTorneosSectionHtml(agrupadores: AgrupadorDeTorneo[]): string {
  if (agrupadores.length === 0) {
    return `<div class="glass animate-fade-in rounded-2xl p-12 text-center">
      <p class="text-zinc-500">No hay torneos publicados en este momento.</p>
    </div>`;
  }

  return `<div class="space-y-12 md:space-y-16">${agrupadores.map((a, i) => agrupadorCardHtml(a, i)).join('')}</div>`;
}

export { elementoTorneoHtml, grupoDeFasesCardHtml, faseCardHtml, zonaBadgeHtml };

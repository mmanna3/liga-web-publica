import { getAgrupadorTheme } from '@lib/colors';
import { escapeHtml } from '@lib/html-utils';
import { zonaUrl } from '@lib/paths-client';
import { iconSvg } from '@lib/ui-html';
import type { AgrupadorDeTorneo, Fase, Torneo, Zona } from '@types/torneo';

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
    zonaNombre: zona.nombre,
    faseNombre: fase.nombre,
    torneoNombre: torneo.nombre,
    agrupadorNombre: agrupador.nombre,
    color: agrupador.color,
    agrupadorId: agrupador.id,
  });

  return `<a
    href="${escapeHtml(href)}"
    class="group inline-flex cursor-pointer items-center gap-3 rounded-full border border-border-glass bg-white/5 px-5 py-2.5 backdrop-blur-xl text-base font-medium tracking-wide text-zinc-300 transition-all duration-300 ease-out hover:scale-[1.05] hover:-translate-y-1 hover:text-white ${pillHoverClass}"
  >
    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20 ${accentClass}" aria-hidden="true">
      ${iconSvg('ball', 'h-4 w-4')}
    </span>
    ${escapeHtml(zona.nombre)}
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
      ? `<div class="mt-4">
          <p class="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.3em] uppercase ${accentClass}">
            ${iconSvg('grid', 'h-3.5 w-3.5')} Zonas
          </p>
          <div class="flex flex-wrap gap-3">
            ${fase.zonas.map((z) => zonaBadgeHtml(z, fase, torneo, agrupador, accentClass, pillHoverClass)).join('')}
          </div>
        </div>`
      : `<p class="mt-3 flex items-center gap-2 text-sm text-zinc-600 italic">${iconSvg('grid', 'h-4 w-4')} Sin zonas asignadas</p>`;

  return `<div class="glass rounded-2xl border border-white/10 border-l-2 border-l-white/10 p-6">
    <div class="flex items-center gap-2.5">
      ${iconSvg('layers', 'h-5 w-5 text-zinc-500')}
      <h4 class="font-display text-xl tracking-wide text-white uppercase">${escapeHtml(fase.nombre)}</h4>
    </div>
    ${zonasHtml}
  </div>`;
}

function torneoCardHtml(
  torneo: Torneo,
  agrupador: AgrupadorDeTorneo,
  accentClass: string,
  pillHoverClass: string,
): string {
  const fasesHtml = torneo.fases
    .map((f) => faseCardHtml(f, torneo, agrupador, accentClass, pillHoverClass))
    .join('');

  return `<div class="glass glass-hover rounded-2xl border border-white/10 p-6">
    <details>
      <summary class="flex cursor-pointer list-none items-center gap-3 rounded-xl -mx-1 px-1 py-0.5 transition-colors hover:bg-white/5 active:bg-white/5 [&::-webkit-details-marker]:hidden">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 ${accentClass}" aria-hidden="true">${iconSvg('trophy', 'h-5 w-5')}</span>
        <h3 class="font-display pt-0.5 text-2xl leading-tight tracking-wide text-white uppercase sm:text-3xl">${escapeHtml(torneo.nombre)}</h3>
      </summary>
      <div class="mt-6 space-y-4 border-t border-white/5 pt-6">${fasesHtml}</div>
    </details>
  </div>`;
}

function agrupadorCardHtml(agrupador: AgrupadorDeTorneo, index: number): string {
  const theme = getAgrupadorTheme(agrupador.color);
  const staggerClass = `stagger-${Math.min(index + 1, 4)}`;

  const torneosHtml = agrupador.torneos
    .map((t) => torneoCardHtml(t, agrupador, theme.accent, theme.pillHover))
    .join('');

  return `<article id="agrupador-${agrupador.id}" class="animate-fade-up relative scroll-mt-28 overflow-hidden rounded-3xl border p-6 sm:p-8 md:p-10 ${theme.border} ${theme.glow} shadow-2xl transition-shadow duration-500 hover:shadow-[0_24px_80px_-12px_rgba(0,0,0,0.6)] ${staggerClass}">
    <div class="pointer-events-none absolute inset-0 bg-linear-to-br opacity-60 ${theme.gradient}" aria-hidden="true"></div>
    <div class="noise-overlay pointer-events-none absolute inset-0 opacity-30" aria-hidden="true"></div>
    <header class="relative z-10 mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-8">
      <div class="flex items-center gap-4">
        <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border bg-white/5 ${theme.border} ${theme.accent}" aria-hidden="true">
          ${iconSvg('trophy', 'h-7 w-7')}
        </span>
        <h3 class="font-display pt-1.5 text-4xl leading-none tracking-wide text-white uppercase sm:pt-2 sm:text-5xl md:pt-2.5 md:text-6xl">${escapeHtml(agrupador.nombre)}</h3>
      </div>
      <span class="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-zinc-400">
        ${iconSvg('trophy', 'h-4 w-4')} ${agrupador.torneos.length} torneos
      </span>
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

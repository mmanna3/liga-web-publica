import { escapeHtml } from '@lib/html-utils';
import { getIconShapes } from '@lib/icon-shapes';
import type { IconName as ShapeIconName } from '@types/icon';

type IconName = Extract<
  ShapeIconName,
  'trophy' | 'ball' | 'layers' | 'grid' | 'alert' | 'calendar' | 'shield' | 'map-pin'
>;

/** Íconos alineados con la app móvil (Ionicons en zona-detalle). */
const ZONA_SECTION_ICONS = {
  posiciones: 'trophy',
  fixture: 'calendar',
  jornadas: 'ball',
  clubes: 'shield',
} as const satisfies Record<string, IconName>;

export function iconSvg(name: IconName, className = 'h-5 w-5'): string {
  const shapes = getIconShapes(name);
  const inner = shapes
    .map((shape) => {
      if (shape.type === 'circle') {
        return `<circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.r}" />`;
      }
      const attrs = [
        `d="${shape.d}"`,
        shape.linecap ? `stroke-linecap="${shape.linecap}"` : '',
        shape.linejoin ? `stroke-linejoin="${shape.linejoin}"` : '',
      ]
        .filter(Boolean)
        .join(' ');
      return `<path ${attrs} />`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" class="${className}" aria-hidden="true">${inner}</svg>`;
}

export function zonaSectionIcon(sectionId: keyof typeof ZONA_SECTION_ICONS): IconName {
  return ZONA_SECTION_ICONS[sectionId];
}

export function renderZonaSectionNavLink(
  sectionId: keyof typeof ZONA_SECTION_ICONS,
  titulo: string,
  theme: { pillHover: string; pillActive: string; iconHover: string; iconActive: string },
): string {
  const icon = ZONA_SECTION_ICONS[sectionId];
  return `<a href="#zona-${sectionId}" data-zona-nav-link data-section="${sectionId}" class="group inline-flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-full border border-border-glass bg-white/5 px-1 py-2 text-[10px] font-semibold leading-none tracking-normal text-zinc-400 backdrop-blur-xl transition-all duration-300 ease-out active:text-white sm:inline-flex sm:w-auto sm:shrink-0 sm:flex-none sm:flex-row sm:items-center sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:font-medium tracking-wide sm:text-zinc-300 sm:transition-all sm:duration-300 sm:ease-out sm:hover:-translate-y-1 sm:hover:text-white sm:px-5 sm:text-base sm:hover:scale-[1.05] ${theme.pillHover} ${theme.pillActive}">
    <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-zinc-500 transition-all duration-300 group-active:scale-105 group-active:bg-white/15 sm:h-9 sm:w-9 sm:group-hover:scale-110 sm:group-hover:bg-white/20 ${theme.iconHover} ${theme.iconActive}" aria-hidden="true">
      ${iconSvg(icon, 'h-4 w-4 sm:h-5 sm:w-5')}
    </span>
    <span class="text-center sm:text-left">${escapeHtml(titulo)}</span>
  </a>`;
}

export function loadingSkeletonHtml(lines = 3): string {
  const widths = ['w-2/3', 'w-full', 'w-5/6'];
  const rows = Array.from({ length: lines })
    .map(
      (_, i) =>
        `<div class="h-4 rounded-lg bg-white/10 ${widths[i % widths.length]}"></div>`,
    )
    .join('');
  return `<div class="animate-pulse-soft space-y-4" aria-hidden="true">${rows}</div>`;
}

export function errorBoxHtml(message: string): string {
  return `<div class="glass rounded-2xl border border-red-500/30 bg-red-950/20 p-8 text-center" role="alert">
    <div class="mx-auto mb-4 flex justify-center text-red-400">${iconSvg('alert', 'h-8 w-8')}</div>
    <p class="font-display text-2xl tracking-wide text-red-400 uppercase">No se pudo cargar</p>
    <p class="mt-2 text-zinc-400">${message}</p>
  </div>`;
}

export function sectionErrorHtml(message: string): string {
  return `<p class="rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-6 text-center text-red-400">${message}</p>`;
}

export function emptyStateHtml(message: string): string {
  return `<p class="rounded-xl border border-white/10 bg-white/5 px-4 py-8 text-center text-zinc-500">${message}</p>`;
}

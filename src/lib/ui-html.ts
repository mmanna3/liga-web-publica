type IconName = 'trophy' | 'ball' | 'layers' | 'grid' | 'alert' | 'calendar' | 'shield';

const paths: Record<IconName, string> = {
  trophy:
    'M8 21h8M12 17v4M7 4h10v4a5 5 0 01-10 0V4zM17 4h2a1 1 0 011 1v1a3 3 0 01-3 3h-1M7 4H5a1 1 0 00-1 1v1a3 3 0 003 3h1',
  ball: 'M12 2a10 10 0 100 20 10 10 0 000-20z M12 7l4.76 3.45-1.76 5.55h-6l-1.76-5.55z',
  layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  alert: 'M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z',
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
};

export function iconSvg(name: IconName, className = 'h-5 w-5'): string {
  const d = paths[name];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="${className}" aria-hidden="true"><path d="${d}"/></svg>`;
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

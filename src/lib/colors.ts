/** Mapea el nombre de color de la API a tokens visuales Tailwind */
const COLOR_MAP: Record<
  string,
  {
    accent: string;
    accentColor: string;
    glow: string;
    border: string;
    gradient: string;
    pillHover: string;
    pillActive: string;
    iconHover: string;
    iconActive: string;
    chipActive: string;
  }
> = {
  verde: {
    accent: 'text-emerald-400',
    accentColor: 'var(--color-emerald-400)',
    glow: 'shadow-emerald-500/20',
    border: 'border-emerald-500/30',
    gradient: 'from-emerald-600/40 via-emerald-900/20 to-transparent',
    pillHover:
      'hover:border-emerald-400/90 hover:bg-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/50',
    pillActive:
      '[&.is-active]:border-emerald-400/50 [&.is-active]:bg-emerald-500/12 [&.is-active]:text-zinc-200',
    iconHover: 'group-hover:text-emerald-400',
    iconActive: 'group-[.is-active]:bg-white/10 group-[.is-active]:text-emerald-400',
    chipActive: 'bg-emerald-600',
  },
  rojo: {
    accent: 'text-red-400',
    accentColor: 'var(--color-red-400)',
    glow: 'shadow-red-500/20',
    border: 'border-red-500/30',
    gradient: 'from-red-600/40 via-red-900/20 to-transparent',
    pillHover:
      'hover:border-red-400/90 hover:bg-red-500/30 hover:shadow-lg hover:shadow-red-500/50',
    pillActive:
      '[&.is-active]:border-red-400/50 [&.is-active]:bg-red-500/12 [&.is-active]:text-zinc-200',
    iconHover: 'group-hover:text-red-400',
    iconActive: 'group-[.is-active]:bg-white/10 group-[.is-active]:text-red-400',
    chipActive: 'bg-red-600',
  },
  azul: {
    accent: 'text-sky-400',
    accentColor: 'var(--color-sky-400)',
    glow: 'shadow-sky-500/20',
    border: 'border-sky-500/30',
    gradient: 'from-sky-600/40 via-sky-900/20 to-transparent',
    pillHover:
      'hover:border-sky-400/90 hover:bg-sky-500/30 hover:shadow-lg hover:shadow-sky-500/50',
    pillActive:
      '[&.is-active]:border-sky-400/50 [&.is-active]:bg-sky-500/12 [&.is-active]:text-zinc-200',
    iconHover: 'group-hover:text-sky-400',
    iconActive: 'group-[.is-active]:bg-white/10 group-[.is-active]:text-sky-400',
    chipActive: 'bg-sky-600',
  },
  amarillo: {
    accent: 'text-amber-400',
    accentColor: 'var(--color-amber-400)',
    glow: 'shadow-amber-500/20',
    border: 'border-amber-500/30',
    gradient: 'from-amber-600/40 via-amber-900/20 to-transparent',
    pillHover:
      'hover:border-amber-400/90 hover:bg-amber-500/30 hover:shadow-lg hover:shadow-amber-500/50',
    pillActive:
      '[&.is-active]:border-amber-400/50 [&.is-active]:bg-amber-500/12 [&.is-active]:text-zinc-200',
    iconHover: 'group-hover:text-amber-400',
    iconActive: 'group-[.is-active]:bg-white/10 group-[.is-active]:text-amber-400',
    chipActive: 'bg-amber-600',
  },
  naranja: {
    accent: 'text-orange-400',
    accentColor: 'var(--color-orange-400)',
    glow: 'shadow-orange-500/20',
    border: 'border-orange-500/30',
    gradient: 'from-orange-600/40 via-orange-900/20 to-transparent',
    pillHover:
      'hover:border-orange-400/90 hover:bg-orange-500/30 hover:shadow-lg hover:shadow-orange-500/50',
    pillActive:
      '[&.is-active]:border-orange-400/50 [&.is-active]:bg-orange-500/12 [&.is-active]:text-zinc-200',
    iconHover: 'group-hover:text-orange-400',
    iconActive: 'group-[.is-active]:bg-white/10 group-[.is-active]:text-orange-400',
    chipActive: 'bg-orange-600',
  },
};

const DEFAULT_THEME = {
  accent: 'text-white',
  accentColor: 'var(--color-white)',
  glow: 'shadow-white/10',
  border: 'border-white/20',
  gradient: 'from-zinc-600/40 via-zinc-900/20 to-transparent',
  pillHover:
    'hover:border-white/50 hover:bg-white/20 hover:shadow-lg hover:shadow-white/25',
  pillActive:
    '[&.is-active]:border-white/35 [&.is-active]:bg-white/10 [&.is-active]:text-zinc-200',
  iconHover: 'group-hover:text-white',
  iconActive: 'group-[.is-active]:bg-white/10 group-[.is-active]:text-white',
  chipActive: 'bg-zinc-600',
};

export type AgrupadorTheme = typeof DEFAULT_THEME & { raw: string };

export function getAgrupadorTheme(colorName: string): AgrupadorTheme {
  const key = colorName.trim().toLowerCase();
  const theme = COLOR_MAP[key] ?? DEFAULT_THEME;
  return { ...theme, raw: colorName };
}

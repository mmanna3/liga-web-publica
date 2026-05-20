/** Mapea el nombre de color de la API a tokens visuales Tailwind */
const COLOR_MAP: Record<
  string,
  { accent: string; glow: string; border: string; gradient: string }
> = {
  verde: {
    accent: 'text-emerald-400',
    glow: 'shadow-emerald-500/20',
    border: 'border-emerald-500/30',
    gradient: 'from-emerald-600/40 via-emerald-900/20 to-transparent',
  },
  rojo: {
    accent: 'text-red-400',
    glow: 'shadow-red-500/20',
    border: 'border-red-500/30',
    gradient: 'from-red-600/40 via-red-900/20 to-transparent',
  },
  azul: {
    accent: 'text-sky-400',
    glow: 'shadow-sky-500/20',
    border: 'border-sky-500/30',
    gradient: 'from-sky-600/40 via-sky-900/20 to-transparent',
  },
  amarillo: {
    accent: 'text-amber-400',
    glow: 'shadow-amber-500/20',
    border: 'border-amber-500/30',
    gradient: 'from-amber-600/40 via-amber-900/20 to-transparent',
  },
  naranja: {
    accent: 'text-orange-400',
    glow: 'shadow-orange-500/20',
    border: 'border-orange-500/30',
    gradient: 'from-orange-600/40 via-orange-900/20 to-transparent',
  },
};

const DEFAULT_THEME = {
  accent: 'text-white',
  glow: 'shadow-white/10',
  border: 'border-white/20',
  gradient: 'from-zinc-600/40 via-zinc-900/20 to-transparent',
};

export type AgrupadorTheme = typeof DEFAULT_THEME & { raw: string };

export function getAgrupadorTheme(colorName: string): AgrupadorTheme {
  const key = colorName.trim().toLowerCase();
  const theme = COLOR_MAP[key] ?? DEFAULT_THEME;
  return { ...theme, raw: colorName };
}

export const siteConfig = {
  nombre: import.meta.env.PUBLIC_LIGA_NOMBRE ?? 'EDEFI',
  descripcion:
    'Liga de fútbol — torneos, categorías y competencias en un solo lugar. Información oficial y actualizada.',
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://edefi.com.ar',
} as const;

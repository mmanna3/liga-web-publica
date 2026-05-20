export const siteConfig = {
  nombre: import.meta.env.PUBLIC_LIGA_NOMBRE ?? 'EDEFI',
  descripcion:
    'Torneos, partidos y resultados en un solo lugar. Información oficial y actualizada.',
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://edefi.com.ar',
  appStoreUrl: import.meta.env.PUBLIC_APP_STORE_URL ?? '',
  playStoreUrl:
    import.meta.env.PUBLIC_PLAY_STORE_URL ??
    'https://play.google.com/store/apps/details?id=com.ykn.edefidelegados',
} as const;

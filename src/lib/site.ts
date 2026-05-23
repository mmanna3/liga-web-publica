export const siteConfig = {
  nombre: import.meta.env.PUBLIC_LIGA_NOMBRE ?? 'EDEFI',
  descripcion:
    'Torneos, partidos y resultados en un solo lugar. Información oficial y actualizada.',
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://edefi.com.ar',
  appStoreUrl:
    import.meta.env.PUBLIC_APP_STORE_URL ??
    'https://apps.apple.com/ar/app/edefi-delegados/id6480324679',
  playStoreUrl:
    import.meta.env.PUBLIC_PLAY_STORE_URL ??
    'https://play.google.com/store/apps/details?id=com.ykn.edefidelegados',
  contacto: {
    horarios: [
      'Lunes a viernes de 17:00 hs a 20:00 hs'
    ],
    direccion: 'Juan B. Justo 550, Haedo. Bs. As',
    cp: '1706',
    telefono: '+5491158900516',
    telefonoDisplay: '11 5890-0516',
    email: 'edefiargentina@hotmail.com',
  },
  redes: {
    instagram: 'https://www.instagram.com/liga_edefi/',
    facebook: 'https://www.facebook.com/ligaedefi/',
  },
} as const;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/image'],
  image: {
    format: ['webp'],
    // Breakpoints para el srcset. El máximo (1280) con densidad 2x da 2560px,
    // que es el ancho real del archivo, así evitamos variantes reescaladas.
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    }
  },
  app: {
    head: {
      title: 'Eduardo Martinez — Marketing Professional & Developer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Eduardo Martinez — Marketing Professional. Galería, desarrollo Full-Stack y proyectos.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Italiana&family=Pinyon+Script&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap'
        }
      ]
    }
  },
  css: ['~/assets/css/main.css']
})

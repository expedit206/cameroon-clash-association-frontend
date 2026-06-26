export default defineNuxtConfig({
  ssr: false, // Désactive le SSR pour assurer une persistance totale de l'auth côté client
  compatibilityDate: '2025-07-15',
  srcDir: 'app',
  devtools: { enabled: true },
  css: ['~/assets/index.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:8000/api'
    }
  }
})

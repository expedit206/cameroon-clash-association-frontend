export default defineNuxtConfig({
  ssr: false, // Désactive le SSR pour assurer une persistance totale de l'auth côté client
  compatibilityDate: "2025-07-15",
  srcDir: "app",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["~/assets/index.css"],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || "http://localhost:8000/api",
    },
  },
  app: {
    head: {
      title: "CCA National League — L'élite de Clash of Clans au Cameroun 🇨🇲",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Rejoignez la compétition officielle de Clash of Clans au Cameroun. Suivez les tournois, classements de clans et d'élites avec la Cameroon Clash Association.",
        },
        {
          name: "keywords",
          content:
            "cca, coc cameroun, tournoi camerounois, clash of clans cameroun, gamer camerounais, tournoi coc, classement clan cameroun",
        },
        // Open Graph / Facebook / WhatsApp
        { property: "og:type", content: "website" },
        {
          property: "og:title",
          content: "CCA National League — Le Sommet du CoC Camerounais ⚔️",
        },
        {
          property: "og:description",
          content:
            "Affrontez les meilleurs clans du pays. Suivez les scores, brackets et diffusions en direct.",
        },
        { property: "og:image", content: "/images/cca-affiche1.png" },
        { property: "og:url", content: "https://clashkamer.com" },
        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "CCA National League 🇨🇲" },
        {
          name: "twitter:description",
          content: "Le tournoi d'élite Clash of Clans au Cameroun.",
        },
        { name: "twitter:image", content: "/images/cca-affiche1.png" },
      ],
      link: [{ rel: "icon", type: "image/png", href: "/images/logo cca.png" }],
    },
  },
});

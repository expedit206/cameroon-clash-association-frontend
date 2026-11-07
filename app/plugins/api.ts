export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  let baseUrl = config.public.apiBase || "http://localhost:8000/api";
  if (import.meta.client) {
    const hostname = window.location.hostname;
    if (hostname.includes("clashkamer.com")) {
      baseUrl = "https://api.clashkamer.com/api";
    }
  }

  const $api = $fetch.create({
    baseURL: baseUrl,
    onRequest({ options }) {
      // Construire un objet headers plain pour éviter les problèmes
      // avec les objets Headers natifs du navigateur (non-muables via propriétés)
      const headers: Record<string, string> = {
        Accept: "application/json",
      };

      // Copier les headers existants s'il y en a
      if (options.headers) {
        const existing = options.headers as Record<string, string>;
        Object.keys(existing).forEach((key) => {
          headers[key] = existing[key];
        });
      }

      // Compatibilité totale avec les anciens et nouveaux noms de stockage du token.
      if (import.meta.client) {
        const tokenValue = localStorage.getItem("cca_auth_token") || localStorage.getItem("auth_token");
        if (tokenValue) {
          headers["Authorization"] = `Bearer ${tokenValue}`;
        }
      }

      options.headers = headers;
    },
    // Note: les redirections sur 401 sont gérées par les middlewares de page,
    // pas ici, pour éviter les boucles durant la restauration de session.
  });

  return {
    provide: {
      api: $api,
    },
  };
});

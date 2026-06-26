export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const $api = $fetch.create({
    baseURL: config.public.apiBase || 'http://localhost:8000/api',
    onRequest({ options }) {
      // Construire un objet headers plain pour éviter les problèmes
      // avec les objets Headers natifs du navigateur (non-muables via propriétés)
      const headers: Record<string, string> = {
        Accept: 'application/json',
      };

      // Copier les headers existants s'il y en a
      if (options.headers) {
        const existing = options.headers as Record<string, string>;
        Object.keys(existing).forEach((key) => {
          headers[key] = existing[key];
        });
      }

      // Ajouter le token Bearer depuis le localStorage (SPA uniquement)
      if (import.meta.client) {
        const tokenValue = localStorage.getItem('cca_auth_token');
        if (tokenValue) {
          headers['Authorization'] = `Bearer ${tokenValue}`;
          console.log('[API] Token ajouté aux headers:', tokenValue.substring(0, 20) + '...');
        } else {
          console.warn('[API] Aucun token trouvé dans localStorage');
        }
      }

      options.headers = headers;
    },
    // Note: les redirections sur 401 sont gérées par les middlewares de page,
    // pas ici, pour éviter les boucles durant la restauration de session.
  });

  return {
    provide: {
      api: $api
    }
  };
});

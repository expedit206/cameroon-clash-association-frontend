export default defineNuxtPlugin(async (nuxtApp) => {
  const { fetchUser, token, user } = useAuth();

  // On vérifie le localStorage directement car le useState n'est pas encore hydraté
  // au moment où le plugin s'exécute (isLoggedIn serait toujours false).
  if (import.meta.client) {
    const savedToken = localStorage.getItem('cca_auth_token');
    if (savedToken && !token.value) {
      token.value = savedToken; // Hydrater le state AVANT le fetchUser
    }
  }

  // On n'appelle fetchUser que si on a un token et qu'on n'a pas encore les données user
  if (token.value && !user.value) {
    await fetchUser();
  }
});

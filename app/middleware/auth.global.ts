/**
 * Middleware global de gestion de l'authentification.
 * Ce fichier s'exécute sur CHAQUE changement de route et au démarrage de l'app.
 * Puisque nous sommes en ssr: false, il s'exécute uniquement côté client.
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, token, fetchUser, isLoggedIn } = useAuth();

  // ─────────────────────────────────────────────────────────────────
  // 🚫 CLASH BET SUSPENDU
  // Supercell interdit les paris dans les compétitions Clash of Clans.
  // Toutes les routes /clash-bet/* sont bloquées et redirigées.
  // La donnée et la logique backend sont préservées pour une réactivation future.
  // ─────────────────────────────────────────────────────────────────
  if (to.path.startsWith("/clash-bet")) {
    return navigateTo("/clash-bet-suspendu", { redirectCode: 302 });
  }

  // 1. Définition des routes publiques
  const publicRoutes = [
    "/login",
    "/register",
    "/rules",
    "/",
    "/leaderboard",
    "/clans/cameroun",
    "/players/cameroun",
    "/tournaments",
    "/tournaments/bracket",
    "/clash-bet-suspendu",
  ];
  const isPublicRoute = publicRoutes.includes(to.path);

  // 2. Restauration de session si nécessaire
  // Si on a un token (cookie ou local) mais pas encore l'objet user en mémoire
  if (!user.value) {
    // Si pas de cookie mais présent en local, fetchUser s'occupe de la synchro
    await fetchUser();
  }

  // 3. Logique de redirection

  // Cas A: Route protégée et utilisateur non connecté
  if (!isPublicRoute && !isLoggedIn.value) {
    console.warn(
      "[Auth Middleware] Unauthorized access to",
      to.path,
      "- Redirecting to /login",
    );
    return navigateTo("/login");
  }

  // Cas B: Utilisateur déjà connecté essayant d'aller sur login/register
  if (isLoggedIn.value && (to.path === "/login" || to.path === "/register")) {
    return navigateTo("/tournaments/register");
  }

  // Cas C: Protection spécifique des routes Admin
  if (to.path.startsWith("/admin") && user.value?.role !== "admin") {
    console.error(
      "[Auth Middleware] Admin access denied for",
      user.value?.tag_coc,
    );
    return navigateTo("/tournaments/register");
  }
});

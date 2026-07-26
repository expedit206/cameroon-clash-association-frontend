/**
 * useTournamentCta
 *
 * Détermine l'étape actuelle de l'utilisateur dans le parcours d'inscription
 * au tournoi, et retourne un label et une URL dynamiques pour tous les CTAs
 * de l'application pointant vers "/tournaments/register".
 *
 * Étapes possibles :
 * 1. Profil non-validé        → "Valider mon Profil"    → /my-clan
 * 2. Pas de clan              → "Rejoindre un Clan"     → /clans/cameroun
 * 3. Capitaine désigné        → "Composer le Roster"    → /tournaments/register
 * 4. Clan enregistré          → "Suivre mon Inscription" → /tournaments/register
 * 5. Membre du clan           → "Voir mon Statut"       → /tournaments/register
 */
export const useTournamentCta = () => {
  const { $api } = useNuxtApp();
  const { user, isLoggedIn } = useAuth();

  const ctaLabel = ref("Inscrire mon Clan");
  const ctaTo = ref("/tournaments/register");
  const ctaIcon = ref("🏆");
  const loading = ref(false);

  const refresh = async () => {
    if (!isLoggedIn.value || !user.value) {
      ctaLabel.value = "Inscrire mon Clan";
      ctaTo.value = "/tournaments/register";
      ctaIcon.value = "🏆";
      return;
    }

    const u = user.value;

    // Étape 1 : profil non validé
    if (u.status !== "validated") {
      ctaLabel.value = "Valider mon Profil";
      ctaTo.value = "/my-clan";
      ctaIcon.value = "✅";
      return;
    }

    // Étape 2 : pas de clan lié
    if (!u.current_clan_tag) {
      ctaLabel.value = "Rejoindre un Clan";
      ctaTo.value = "/clans/cameroun";
      ctaIcon.value = "🛡️";
      return;
    }

    // Étape 3 : capitaine désigné par l'admin → composer le roster
    if (u.capitained_clan) {
      ctaLabel.value = "Composer le Roster";
      ctaTo.value = "/tournaments/register";
      ctaIcon.value = "👑";
      return;
    }

    loading.value = true;
    try {
      // Vérifier l'état d'inscription du clan
      const response: any = await $api(`/competitions/1/registration/status`);

      // Si registration est null, le joueur ou son clan n'est pas encore inscrit
      const reg =
        response?.registration !== undefined ? response.registration : response;

      if (reg && reg.players && reg.players.length > 0) {
        ctaLabel.value = "Voir mon Statut";
        ctaTo.value = "/tournaments/register";
        ctaIcon.value = "📋";
      } else {
        ctaLabel.value = "En attente du Capitaine";
        ctaTo.value = "/tournaments/register";
        ctaIcon.value = "⏳";
      }
    } catch (e) {
      // En cas d'erreur réseau, CTA par défaut
      ctaLabel.value = "Inscrire mon Clan";
      ctaTo.value = "/tournaments/register";
      ctaIcon.value = "🏆";
    } finally {
      loading.value = false;
    }
  };

  // On lance la résolution dès que le composable est utilisé
  onMounted(refresh);

  return { ctaLabel, ctaTo, ctaIcon, loading, refresh };
};

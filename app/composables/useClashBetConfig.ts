/**
 * useClashBetConfig
 *
 * ⚠️ CLASH BET DÉSACTIVÉ — Supercell interdit les paris dans les compétitions Clash of Clans.
 * La logique métier (pages, services, contrôleurs) est conservée mais l'accès est bloqué globalement.
 * Pour réactiver, mettre CLASH_BET_SUSPENDED = false et décommenter la logique d'origine.
 */
const CLASH_BET_SUSPENDED = true;

export const useClashBetConfig = () => {
  const { user } = useAuth();
  const { $api } = useNuxtApp();
  const publicEnabled = useState<boolean>(
    "clash_bet_public_enabled",
    () => false,
  );
  const loading = useState<boolean>("clash_bet_public_loading", () => false);

  const fetchPublicConfig = async () => {
    // Suspendu — on ne fait pas l'appel API tant que CLASH_BET_SUSPENDED est true
    if (CLASH_BET_SUSPENDED) {
      loading.value = false;
      return;
    }
    try {
      const config: any = await $api("/clash-bet/public-settings");
      if (config && typeof config.clash_bet_public_enabled !== "undefined") {
        publicEnabled.value = Boolean(config.clash_bet_public_enabled);
      }
    } catch (e) {
      console.error("Error fetching Clash Bet public config:", e);
    } finally {
      loading.value = false;
    }
  };

  // Accès bloqué pour tout le monde tant que CLASH_BET_SUSPENDED est true
  const canAccessClashBet = computed(() => {
    if (CLASH_BET_SUSPENDED) return false;
    const isAdmin = user.value?.role === "admin" || user.value?.is_admin;
    return publicEnabled.value || Boolean(isAdmin);
  });

  return {
    publicEnabled,
    loading,
    canAccessClashBet,
    fetchPublicConfig,
  };
};

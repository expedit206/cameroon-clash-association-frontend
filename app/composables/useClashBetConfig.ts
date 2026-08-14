export const useClashBetConfig = () => {
  const { user } = useAuth();
  const { $api } = useNuxtApp();
  const publicEnabled = useState<boolean>('clash_bet_public_enabled', () => false);
  const loading = useState<boolean>('clash_bet_public_loading', () => true);

  const fetchPublicConfig = async () => {
    try {
      const config: any = await $api('/clash-bet/public-settings');
      if (config && typeof config.clash_bet_public_enabled !== 'undefined') {
        publicEnabled.value = Boolean(config.clash_bet_public_enabled);
      }
    } catch (e) {
      console.error('Error fetching Clash Bet public config:', e);
    } finally {
      loading.value = false;
    }
  };

  const canAccessClashBet = computed(() => {
    const isAdmin = user.value?.role === 'admin' || user.value?.is_admin;
    return publicEnabled.value || Boolean(isAdmin);
  });

  return {
    publicEnabled,
    loading,
    canAccessClashBet,
    fetchPublicConfig,
  };
};

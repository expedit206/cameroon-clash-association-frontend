export const useAuth = () => {
  const user = useState<any>('auth_user', () => null);
  const token = useState<string | null>('auth_token_state', () => null);
  
  const { $api } = useNuxtApp();

  const fetchUser = async () => {
    console.log('fetcu user en cours');
    
    // 1. Récupération robuste (LocalStorage est la vérité absolue)
    if (process.client && !token.value) {
      const saved = localStorage.getItem('cca_auth_token');
      if (saved) {
        console.log('[Auth] Recovery successful from LocalStorage');
        token.value = saved;
      }
    }

    if (!token.value) return null;

    try {
      console.log('[Auth] Validating session with API...');
      const data = await $api('/auth/me');
      user.value = data;
      return data;
    } catch (e: any) {
      // On ne vide la session QUE si le serveur confirme explicitement 
      // que le token est mort (401/403). Les erreurs 500 ou réseau sont ignorées.
      if (e.response?.status === 401 || e.response?.status === 403) {
        console.warn('[Auth] Token expired or invalid, cleaning up.');
        token.value = null;
        user.value = null;
        if (process.client) localStorage.removeItem('cca_auth_token');
      }
      return null;
    }
  };

  const login = async (credentials: any) => {
    try {
      const data: any = await $api('/auth/login', {
        method: 'POST',
        body: credentials
      });
      
      const access_token = data.access_token;
      token.value = access_token;
      user.value = data.user;
      
      if (process.client) {
        localStorage.setItem('cca_auth_token', access_token);
      }
      
      return data;
    } catch (e) {
      throw e;
    }
  };

  const logout = async () => {
    try {
      if (token.value) await $api('/auth/logout', { method: 'POST' });
    } finally {
      token.value = null;
      user.value = null;
      if (process.client) localStorage.removeItem('cca_auth_token');
      navigateTo('/login');
    }
  };

  const isLoggedIn = computed(() => !!token.value);

  return { user, token, fetchUser, login, logout, isLoggedIn };
};

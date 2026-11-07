export const useApi = () => {
  const config = useRuntimeConfig();
  const token = useCookie("auth_token", {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    path: "/",
  });

  const getAuthToken = () => {
    if (process.client) {
      const localToken = localStorage.getItem("cca_auth_token") || localStorage.getItem("auth_token");
      if (localToken) return localToken;
    }

    return token.value || null;
  };

  const fetchApi = async (url: string, options: any = {}) => {
    let baseUrl = config.public.apiBase || "http://localhost:8000/api";

    if (process.client) {
      const hostname = window.location.hostname;
      if (hostname.includes("clashkamer.com")) {
        baseUrl = "https://api.clashkamer.com/api";
      }
    }

    const tokenValue = getAuthToken();

    return $fetch(url, {
      baseURL: baseUrl,
      headers: {
        ...options.headers,
        Authorization: tokenValue ? `Bearer ${tokenValue}` : "",
        Accept: "application/json",
      },
      ...options,
    });
  };

  return {
    fetchApi,
    token,
    getAuthToken,
  };
};

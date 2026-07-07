export const useApi = () => {
  const config = useRuntimeConfig();
  const token = useCookie("auth_token", {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    path: "/",
  });

  const fetchApi = async (url: string, options: any = {}) => {
    let baseUrl = config.public.apiBase || "http://localhost:8000/api";

    if (process.client) {
      const hostname = window.location.hostname;
      if (hostname.includes("clashkamer.com")) {
        baseUrl = "https://api.clashkamer.com/api";
      }
    }
    let tokenValue = token.value;
    if (process.client && !tokenValue) {
      tokenValue = localStorage.getItem("auth_token");
    }

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
  };
};

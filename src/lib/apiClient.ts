import axios from "axios";

/**
 * Shared Axios instance for ALL network calls.
 * - Centralizes baseURL + headers
 * - Attaches auth token if present
 * - Handles common error cases
 *
 * In DEV we hit the same origin ("") so MSW can intercept /api/* paths.
 * In PROD we read from VITE_API_URL.
 */
const baseURL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_API_URL;
  
export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

// Attach token automatically (if you use token-based auth)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handling – extend with toasts/Sentry as needed
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Example: auto-logout on unauthorized
      localStorage.removeItem("token");
      // Optional: redirect to login
      // window.location.href = "/login";
    }

    if (import.meta.env.DEV) {
      // Helpful logs for the reviewer
      // eslint-disable-next-line no-console
      console.error("[API Error]", {
        url: error?.config?.url,
        status,
        data: error?.response?.data,
        message: error?.message,
      });
    }

    return Promise.reject(error);
  }
);
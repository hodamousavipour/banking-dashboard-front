import axios from "axios";

const baseURL = "";

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

// Attach token automatically 
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handling 
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
    }

    if (import.meta.env.DEV) {
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
import axios, {  type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

// Environment-driven base URL with local fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE || "https://exams.tryasp.net/api";

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10-second request timeout safeguard
});

// Request Interceptor: Attach JWT token automatically
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling & Session Expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Automatically purge session and redirect on expired / invalid token
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export * as authApi from './api/authApi';
export * as usersApi from './api/usersApi';
export * as rolesApi from './api/rolesApi';
export * as permissionsApi from './api/permissionsApi';
export * as auditApi from './api/auditApi';
export * as examsApi from './api/examsApi';
export * from './api/types/api';

export default api;
/// <reference types="node" />

import axios, { AxiosError, AxiosRequestConfig } from "axios";

// -----------------------------------------------------------------------------
// 🌍 Base URL for your deployed API
// -----------------------------------------------------------------------------
// Default to the Render-hosted API root + /api so frontend requests like
// `api.post('/verify-email')` map to `https://<host>/api/verify-email`.
const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://soceyo.onrender.com/api";

// ✅ Single Axios instance
export const api = axios.create({
  baseURL,
  withCredentials: true, // allow JWT refresh-token cookies
});

// -----------------------------------------------------------------------------
// 🧠 REQUEST INTERCEPTOR – attach access token + sane headers
// -----------------------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    // only run in browser
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        config.headers = config.headers || new axios.AxiosHeaders();
        config.headers.set("Authorization", `Bearer ${accessToken}`);
      }
    }

    // 🧾 Skip JSON header for FormData
    const isFormData = config.data instanceof FormData;
    if (!isFormData) {
      config.headers = config.headers || new axios.AxiosHeaders();
      if (!config.headers.has("Content-Type")) {
        config.headers.set("Content-Type", "application/json");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------------------------------------------------------
// 🔁 RESPONSE INTERCEPTOR – auto-refresh access tokens on 401
// -----------------------------------------------------------------------------
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token as string);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (!originalRequest.headers) originalRequest.headers = {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await api.post("/api/refresh"); // ✅ backend route has /api prefix
        const newAccess = (refreshResponse.data as any).access_token;

        // Persist new token
        localStorage.setItem("access_token", newAccess);
        api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;

        processQueue(null, newAccess);
        isRefreshing = false;

        // 🔄 retry original request
        if (!originalRequest.headers) originalRequest.headers = {};
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;

        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_id");
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
/// <reference types="node" />

import axios, { AxiosError, AxiosRequestConfig } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ✅ Create unified Axios instance
export const api = axios.create({
  baseURL,
  withCredentials: true, // allow sending cookies (useful for refresh JWT cookies)
});

// -----------------------------------------------------------------------------
// 🧠 REQUEST INTERCEPTOR – attach access token + sane headers
// -----------------------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        config.headers = config.headers || new axios.AxiosHeaders();
        config.headers.set("Authorization", `Bearer ${accessToken}`);
      }
    }

    // ✅ Skip JSON header for FormData
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
// 🔁 RESPONSE INTERCEPTOR – auto refresh tokens on 401
// -----------------------------------------------------------------------------
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

/**
 * Queues requests that arrive during a refresh cycle
 * so we don't fire multiple `/refresh` requests at once.
 */
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token as string);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent multiple concurrent refresh calls
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
        const refreshResponse = await api.post("/refresh");
        const newAccess = (refreshResponse.data as any).access_token;

        // Persist new token
        localStorage.setItem("access_token", newAccess);
        api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;

        processQueue(null, newAccess);
        isRefreshing = false;

        // 🔄 Retry failed original request
        if (!originalRequest.headers) originalRequest.headers = {};
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;

        // ❌ Token expired, redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
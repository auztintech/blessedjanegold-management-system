import Cookies from "js-cookie";
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/store/z-store/user";
import { endpoints } from "@/config/endpoints";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Plain axios, no interceptors — used only for the refresh call itself
const rawAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let isRefreshing = false;
let pendingQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

function processQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  pendingQueue = [];
}

const cookieOptions = {
  sameSite: "Lax" as const,
  secure: process.env.NODE_ENV !== "development",
};

const createInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  instance.interceptors.request.use((config) => {
    const token = Cookies.get(ACCESS_TOKEN_COOKIE);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryConfig;
      const status = error?.response?.status;
      const method = originalRequest?.method?.toUpperCase();
      const isAction = ["POST", "PUT", "DELETE", "PATCH"].includes(
        method || ""
      );

      // Handle 403 — permission issue, not an auth issue, don't try refreshing
      if (status === 403) {
        if (isAction) {
          toast.error("You don't have permission to perform this action.");
        } else {
          window.dispatchEvent(new CustomEvent("forbidden"));
        }
        return Promise.reject(error);
      }

      // Handle 401 — attempt silent refresh, but only once per request
      if (status === 401 && !originalRequest._retry) {
        const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE);

        if (!refreshToken) {
          window.dispatchEvent(new CustomEvent("unauthorized"));
          return Promise.reject(error);
        }

        if (isRefreshing) {
          // A refresh is already in flight — queue this request until it resolves
          return new Promise((resolve, reject) => {
            pendingQueue.push({
              resolve: (newToken: string) => {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                resolve(instance(originalRequest));
              },
              reject,
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { data } = await rawAxios.post<{
            access: string;
            refresh: string;
          }>(endpoints().user.refresh, { refresh: refreshToken });

          const newAccessToken = data.access;
          const newRefreshToken = data.refresh;

          Cookies.set(ACCESS_TOKEN_COOKIE, newAccessToken, {
            ...cookieOptions,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 2), // match real access TTL
          });

          Cookies.set(REFRESH_TOKEN_COOKIE, newRefreshToken, {
            ...cookieOptions,
            expires: 7, // match real refresh TTL
          });

          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          window.dispatchEvent(new CustomEvent("unauthorized"));
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export default createInstance;
export const instance = createInstance();

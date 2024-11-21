import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { store } from "../redux/store";
import { logout, setTokens } from "../redux/authSlice";

const BASE_URL = "https://veltra2.duckdns.org/api/v1";

class Http {
  private _instance: AxiosInstance; // Renamed to avoid conflict
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this._instance = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this._instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const state = store.getState();
        const token = state.auth.accessToken;

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this._instance.interceptors.response.use(
      (response) => response.data,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (!originalRequest) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this._instance(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const state = store.getState();
            const refreshToken = state.auth.refreshToken;

            const response = await axios.post(`${BASE_URL}/auth/refresh`, {
              refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } =
              response.data.data;

            store.dispatch(
              setTokens({
                access_token: accessToken,
              })
            );

            this.refreshSubscribers.forEach((callback) =>
              callback(accessToken)
            );
            this.refreshSubscribers = [];

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this._instance(originalRequest);
          } catch (refreshError) {
            store.dispatch(logout());
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error.response?.data || error);
      }
    );
  }

  // Public getter for instance
  public get instance() {
    return this._instance;
  }
}

export const http = new Http().instance;

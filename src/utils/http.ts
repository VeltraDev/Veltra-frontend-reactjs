import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";
import { Modal } from "antd";

class Http {
  instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: "https://veltra2.duckdns.org/api/v1",
      timeout: 10000000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken"); 
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`; 
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => response,
      this.handleError
    );
  }
  private handleError = async (error: AxiosError) => {
    if (error.response?.code === 1552) {
      Modal.warning({
        title: "Phiên đăng nhập hết hạn", 
        content: "Vui lòng đăng nhập lại để tiếp tục.",
        onOk: () => {
          localStorage.removeItem("user");
          window.location.href = "/auth";
        },
      });

      return Promise.reject(error);
    }

    return Promise.reject(error);
  };

  setToken(token: string) {
    localStorage.setItem("accessToken", token); 
    this.instance.defaults.headers.common["Authorization"] = `Bearer ${token}`; 
    console.log("New access token received");
  }

  clearToken() {
    localStorage.removeItem("accessToken");
    delete this.instance.defaults.headers.common["Authorization"]; 
  }

  get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }

  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }
}

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };

  constructor({
    status,
    payload,
  }: {
    status: number;
    payload: { message: string; [key: string]: any };
  }) {
    super(`HTTP Error: ${status}`);
    this.status = status;
    this.payload = payload;

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class EntityError extends HttpError {
  status: number;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

const http = new Http();

export default http;

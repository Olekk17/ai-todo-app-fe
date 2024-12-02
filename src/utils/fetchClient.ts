import axios, { AxiosRequestConfig } from "axios";
import { getToken, removeToken } from "./authToken";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5001";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

async function request<T>(
  url: string,
  method: RequestMethod = "GET",
  data: any = null
): Promise<T> {
  const token = getToken();
  const config: AxiosRequestConfig = {
    method,
    url: BASE_URL + url,
    headers: {},
  };

  if (data) {
    config.data = data;
    if (config?.headers) {
      config.headers["Content-Type"] = "application/json; charset=UTF-8";
    }
  }

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 401) {
        removeToken();
        window.location.href = "/";
      }
      throw new Error(error.response.data);
    } else {
      throw new Error(error.message);
    }
  }
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: any) => request<T>(url, "POST", data),
  patch: <T>(url: string, data: any) => request<T>(url, "PATCH", data),
  delete: (url: string) => request(url, "DELETE"),
};

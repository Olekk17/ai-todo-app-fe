import { getToken, removeToken } from "./authToken";

const BASE_URL = process.env.BASE_URL || "http://localhost:5001";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

function request<T>(
  url: string,
  method: RequestMethod = "GET",
  data: any = null
): Promise<T> {
  const options: RequestInit = { method };
  const token = getToken();

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = {
      "Content-Type": "application/json; charset=UTF-8",
    };
  }

  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return fetch(BASE_URL + url, options).then(async (response) => {
    if (!response.ok) {
      const message = await response.text();
      if (response.status === 401) {
        removeToken();
        window.location.href = "/";
      }
      throw new Error(message);
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  });
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: any) => request<T>(url, "POST", data),
  patch: <T>(url: string, data: any) => request<T>(url, "PATCH", data),
  delete: (url: string) => request(url, "DELETE"),
};

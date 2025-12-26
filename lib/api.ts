import axios from 'axios';

export function getApiBase() {
  return process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3333";
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("rh_token");
}

// Axios instance com autenticação automática
const api = axios.create({
  baseURL: getApiBase(),
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("rh_token");
        window.location.href = "/rh/login?expired=true";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const authToken = token || getAuthToken();
  const res = await fetch(`${getApiBase()}${path}`, {
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    cache: "no-store",
  });
  if (res.status === 401) {
    // Token expirado ou inválido - redirecionar para login
    if (typeof window !== "undefined") {
      localStorage.removeItem("rh_token");
      window.location.href = "/rh/login?expired=true";
    }
    throw new Error("Sessão expirada. Faça login novamente.");
  }
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown, token?: string): Promise<T> {
  const authToken = token || getAuthToken();
  const res = await fetch(`${getApiBase()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (res.status === 401) {
    // Token expirado ou inválido - redirecionar para login
    if (typeof window !== "undefined") {
      localStorage.removeItem("rh_token");
      window.location.href = "/rh/login?expired=true";
    }
    throw new Error("Sessão expirada. Faça login novamente.");
  }
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPut<T>(path: string, body: unknown, token?: string): Promise<T> {
  const authToken = token || getAuthToken();
  const res = await fetch(`${getApiBase()}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (res.status === 401) {
    // Token expirado ou inválido - redirecionar para login
    if (typeof window !== "undefined") {
      localStorage.removeItem("rh_token");
      window.location.href = "/rh/login?expired=true";
    }
    throw new Error("Sessão expirada. Faça login novamente.");
  }
  if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPatch<T>(path: string, body: unknown, token?: string): Promise<T> {
  const authToken = token || getAuthToken();
  const res = await fetch(`${getApiBase()}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (res.status === 401) {
    // Token expirado ou inválido - redirecionar para login
    if (typeof window !== "undefined") {
      localStorage.removeItem("rh_token");
      window.location.href = "/rh/login?expired=true";
    }
    throw new Error("Sessão expirada. Faça login novamente.");
  }
  if (!res.ok) throw new Error(`PATCH ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiDelete(path: string, token?: string): Promise<void> {
  const authToken = token || getAuthToken();
  const res = await fetch(`${getApiBase()}${path}`, {
    method: "DELETE",
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
  });
  if (res.status === 401) {
    // Token expirado ou inválido - redirecionar para login
    if (typeof window !== "undefined") {
      localStorage.removeItem("rh_token");
      window.location.href = "/rh/login?expired=true";
    }
    throw new Error("Sessão expirada. Faça login novamente.");
  }
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
}

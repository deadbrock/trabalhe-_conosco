export function getApiBase() {
  return process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3333";
}

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
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
  const res = await fetch(`${getApiBase()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
  const res = await fetch(`${getApiBase()}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

export async function apiDelete(path: string, token?: string): Promise<void> {
  const res = await fetch(`${getApiBase()}${path}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
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

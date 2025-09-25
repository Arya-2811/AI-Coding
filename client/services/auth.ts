export type Role = "Developer" | "Team Lead" | "Admin";
export interface User { id: string; email: string; name: string; role: Role }

const TOKEN_KEY = "cpai_token";

export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token); else localStorage.removeItem(TOKEN_KEY);
}

async function api<T>(url: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function signup(input: { email: string; password: string; name: string; role?: Role }) {
  return api<{ token: string; user: User }>("/api/auth/signup", { method: "POST", body: JSON.stringify(input) });
}
export async function login(input: { email: string; password: string }) {
  return api<{ token: string; user: User }>("/api/auth/login", { method: "POST", body: JSON.stringify(input) });
}
export async function logout() { return api<{ ok: true }>("/api/auth/logout", { method: "POST" }); }
export async function me() { return api<{ user: User }>("/api/auth/me"); }

export async function track(type: "queries" | "suggestions" | "accepted" | "rejected") {
  try { await api("/api/analytics/track", { method: "POST", body: JSON.stringify({ type }) }); } catch {}
}

import { RequestHandler } from "express";
import crypto from "crypto";

export type Role = "Developer" | "Team Lead" | "Admin";

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
}

const users = new Map<string, User>(); // id -> user
const tokens = new Map<string, string>(); // token -> userId

function hash(pw: string) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

function newId() {
  return crypto.randomBytes(12).toString("hex");
}

export function getUserByToken(token?: string | null): User | null {
  if (!token) return null;
  const userId = tokens.get(token);
  if (!userId) return null;
  return users.get(userId) ?? null;
}

export const signup: RequestHandler = (req, res) => {
  const { email, password, name, role } = req.body as {
    email?: string;
    password?: string;
    name?: string;
    role?: Role;
  };
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const exists = Array.from(users.values()).find((u) => u.email === email);
  if (exists) return res.status(409).json({ error: "Email already in use" });
  const user: User = {
    id: newId(),
    email,
    name,
    role: role ?? "Developer",
    passwordHash: hash(password),
  };
  users.set(user.id, user);
  const token = newId();
  tokens.set(token, user.id);
  res.status(201).json({ token, user: { id: user.id, email, name, role: user.role } });
};

export const login: RequestHandler = (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });
  const user = Array.from(users.values()).find((u) => u.email === email);
  if (!user || user.passwordHash !== hash(password))
    return res.status(401).json({ error: "Invalid credentials" });
  const token = newId();
  tokens.set(token, user.id);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
};

export const me: RequestHandler = (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.replace("Bearer ", "");
  const user = getUserByToken(token);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
};

export const logout: RequestHandler = (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.replace("Bearer ", "");
  if (token) tokens.delete(token);
  res.json({ ok: true });
};

export const listUsers: RequestHandler = (_req, res) => {
  const list = Array.from(users.values()).map((u) => ({ id: u.id, email: u.email, name: u.name, role: u.role }));
  res.json({ users: list });
};

export const updateRole: RequestHandler = (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.replace("Bearer ", "");
  const current = getUserByToken(token);
  if (!current || current.role !== "Admin") return res.status(403).json({ error: "Forbidden" });
  const { userId, role } = req.body as { userId?: string; role?: Role };
  const user = userId ? users.get(userId) : undefined;
  if (!user || !role) return res.status(400).json({ error: "Invalid request" });
  user.role = role;
  users.set(user.id, user);
  res.json({ ok: true });
};

// seed an initial admin for convenience
(() => {
  const adminEmail = "admin@codepilot.local";
  const existing = Array.from(users.values()).find((u) => u.email === adminEmail);
  if (!existing) {
    const id = newId();
    users.set(id, {
      id,
      email: adminEmail,
      name: "Admin",
      role: "Admin",
      passwordHash: hash("admin")
    });
  }
})();

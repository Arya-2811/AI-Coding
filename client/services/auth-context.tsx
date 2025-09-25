import { createContext, useContext, useEffect, useState } from "react";
import * as api from "./auth";
import { setToken, getToken } from "./auth";

interface AuthState {
  user: api.User | null;
  token: string | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role?: api.Role) => Promise<void>;
  signout: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<api.User | null>(null);
  const [token, setTok] = useState<string | null>(getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (token) {
          const res = await api.me();
          setUser(res.user);
        }
      } catch {
        setToken(null);
        setTok(null);
      } finally { setLoading(false); }
    })();
  }, []);

  const signin = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    setToken(res.token); setTok(res.token); setUser(res.user);
  };
  const signup = async (name: string, email: string, password: string, role?: api.Role) => {
    const res = await api.signup({ name, email, password, role });
    setToken(res.token); setTok(res.token); setUser(res.user);
  };
  const signout = async () => { await api.logout(); setToken(null); setTok(null); setUser(null); };

  return <Ctx.Provider value={{ user, token, loading, signin, signup, signout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

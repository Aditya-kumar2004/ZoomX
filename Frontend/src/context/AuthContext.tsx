"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import type { User, AuthTokens } from "@/types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  ready: boolean;
  /** Call after a successful login/register API call to persist user + JWT tokens. */
  login: (user: User, tokens?: AuthTokens) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const USER_KEY = "user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  // Rehydrate user from localStorage on first mount (client-side only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* noop */
    }
    setReady(true);
  }, []);

  const login = (userData: User, tokens?: { access: string; refresh: string }) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (tokens) {
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, ready, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

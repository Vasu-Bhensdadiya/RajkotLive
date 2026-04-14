"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { User } from "./types";
import { RegisterRequest } from "./api/types";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getMe,
  getStoredCurrentUser,
} from "./api/authService";
import { getAccessToken } from "./api/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: RegisterRequest) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      // Try to restore from localStorage first for instant UI
      const stored = getStoredCurrentUser();
      if (stored) setUser(stored);
      // Then validate with backend
      getMe()
        .then((u) => setUser(u))
        .catch(() => {
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: u } = await apiLogin(email, password);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    const { user: u } = await apiRegister(payload);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const u = await getMe();
      setUser(u);
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

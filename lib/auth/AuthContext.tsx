"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api/client";

export type AuthUser = {
  id: string;
  nickname: string | null;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  phone: string | null;
  status: "active" | "pending" | "suspended";
  verified: boolean;
  isActive: boolean;
  role: string | null;
  createdAt: string;
};

type LoginResponse = { user: AuthUser; accessToken: string; refreshToken: string; sessionId?: string };

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  /** Signs in without a real backend — see this function's own comment
   *  below for why it exists and how to retire it. */
  loginMock: (nickname: string, role: string) => void;
  logout: () => Promise<void>;
};

const STORAGE_KEY = "aurex:auth";

const AuthContext = createContext<AuthContextValue | null>(null);

type StoredAuth = { user: AuthUser; sessionId?: string };

type AuthState = { user: AuthUser | null; isLoading: boolean };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, isLoading: true });
  const sessionIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    let next: AuthState = { user: null, isLoading: false };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as StoredAuth;
        sessionIdRef.current = stored.sessionId;
        next = { user: stored.user, isLoading: false };
      }
    } catch {
      // empty
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(next);
  }, []);

  const persist = (next: LoginResponse) => {
    sessionIdRef.current = next.sessionId;
    const stored: StoredAuth = { user: next.user, sessionId: next.sessionId };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // empty
    }
    setState({ user: next.user, isLoading: false });
  };

  const login = async (email: string, password: string) => {
    const { data } = await apiFetch<LoginResponse>("/auth/login", { method: "POST", body: { email, password } });
    persist(data);
    return data.user;
  };

  /**
   * `login` above calls a real backend (NEXT_PUBLIC_API_BASE_URL, see
   * lib/api/client.ts) that doesn't exist in this environment yet — every
   * attempt fails with a network error, which LoginForm.tsx's own catch
   * block then shows as "Something went wrong." per the brief's own
   * request, this signs a user in WITHOUT that call: it persists the
   * exact same `aurex:auth` shape `login` would have (so useRequireAuth,
   * both dashboard shells, and logout all keep working completely
   * unchanged), just built from a fake AuthUser instead of a real API
   * response. `nickname`/`role` are the only two fields this app's UI
   * actually reads (see InvestorDashboardShell/BusinessDashboardShell's
   * own `user.nickname ?? ...` fallback) — everything else is filled
   * with plausible placeholder values.
   *
   * To retire this once a real backend exists: swap LoginForm.tsx's
   * `loginMock(...)` call back to `await login(email, password)` — this
   * function and `login` were built to be interchangeable at that one
   * call site, nothing else needs to change.
   */
  const loginMock = (nickname: string, role: string) => {
    const user: AuthUser = {
      id: `mock-${nickname.toLowerCase()}`,
      nickname,
      firstname: null,
      lastname: null,
      email: null,
      phone: null,
      status: "active",
      verified: true,
      isActive: true,
      role,
      createdAt: new Date(0).toISOString(),
    };
    persist({ user, accessToken: "mock-token", refreshToken: "mock-refresh-token", sessionId: "mock-session" });
  };

  const logout = async () => {
    if (sessionIdRef.current) {
      try {
        await apiFetch("/auth/logout", {
          method: "POST",
          body: { sessionId: sessionIdRef.current },
        });
      } catch {
        // empty
      }
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // empty
    }
    sessionIdRef.current = undefined;
    setState({ user: null, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, loginMock, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

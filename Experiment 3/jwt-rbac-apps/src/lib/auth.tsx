import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { signToken, verifyToken, type JwtPayload } from "./jwt";
import { can, type Permission, type Role } from "./rbac";
import { findAccount } from "./accounts";

const TOKEN_KEY = "rbac.token.v1";
const STORAGE_MODE_KEY = "rbac.token.storage.v1";

export type StorageMode = "localStorage" | "sessionStorage";

function store(mode: StorageMode): Storage {
  return mode === "localStorage" ? window.localStorage : window.sessionStorage;
}

type AuthValue = {
  ready: boolean;
  token: string | null;
  user: JwtPayload | null;
  role: Role | undefined;
  storageMode: StorageMode;
  login: (username: string, password: string, mode: StorageMode) => { ok: boolean; error?: string };
  logout: () => void;
  can: (permission: Permission) => boolean;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [storageMode, setStorageMode] = useState<StorageMode>("localStorage");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_MODE_KEY) as StorageMode | null;
    const mode: StorageMode = saved === "sessionStorage" ? "sessionStorage" : "localStorage";
    setStorageMode(mode);
    setToken(store(mode).getItem(TOKEN_KEY) ?? window.localStorage.getItem(TOKEN_KEY));
    setReady(true);
  }, []);

  const login = useCallback((username: string, password: string, mode: StorageMode) => {
    const account = findAccount(username, password);
    if (!account) return { ok: false, error: "Invalid username or password." };
    const next = signToken({ sub: `${account.role}-001`, name: account.name, role: account.role });
    // Clear both stores so only one active token exists.
    window.localStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(TOKEN_KEY);
    store(mode).setItem(TOKEN_KEY, next);
    window.localStorage.setItem(STORAGE_MODE_KEY, mode);
    setStorageMode(mode);
    setToken(next);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    // Only the session token is removed. Post data lives under a separate
    // shared key and must survive sign-out.
    window.localStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  const user = useMemo(() => verifyToken(token), [token]);

  const value = useMemo<AuthValue>(
    () => ({
      ready,
      token,
      user,
      role: user?.role,
      storageMode,
      login,
      logout,
      can: (permission: Permission) => can(user?.role, permission),
    }),
    [ready, token, user, storageMode, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

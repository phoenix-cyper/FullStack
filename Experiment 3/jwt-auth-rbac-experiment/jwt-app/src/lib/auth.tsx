import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { decodeToken, signToken, verifyToken, type JwtPayload } from "./jwt";
import { permissionsFor, roleHasPermission, type Permission, type Role } from "./rbac";

/** Mock user "database" — stands in for a Node/Express + bcrypt backend. */
const USERS = [
  { id: "u-1001", username: "admin", password: "admin123", name: "Ada Admin", role: "admin" },
  { id: "u-1002", username: "editor", password: "editor123", name: "Eli Editor", role: "editor" },
  { id: "u-1003", username: "viewer", password: "viewer123", name: "Vera Viewer", role: "viewer" },
];

export const DEMO_CREDENTIALS = USERS.map((u) => ({
  username: u.username,
  password: u.password,
  role: u.role,
}));

export const TOKEN_KEY = "jwt_demo_token";
export type StorageMode = "localStorage" | "sessionStorage";
const MODE_KEY = "jwt_demo_storage_mode";

function store(mode: StorageMode): Storage {
  return mode === "localStorage" ? window.localStorage : window.sessionStorage;
}

type AuthState = {
  token: string | null;
  user: JwtPayload | null;
  isAuthenticated: boolean;
  ready: boolean;
  storageMode: StorageMode;
  setStorageMode: (mode: StorageMode) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  /** Authorization helpers (RBAC). */
  role: Role | null;
  permissions: Permission[];
  hasRole: (roles: Role[]) => boolean;
  hasPermission: (permission: Permission) => boolean;
  /** Simulated protected API call: server verifies the bearer token. */
  callProtectedApi: () => Promise<{ status: number; body: unknown }>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [ready, setReady] = useState(false);
  const [storageMode, setStorageModeState] = useState<StorageMode>("localStorage");

  // Rehydrate the session from client storage on mount (stateless server).
  useEffect(() => {
    const mode =
      (window.localStorage.getItem(MODE_KEY) as StorageMode | null) ?? "localStorage";
    setStorageModeState(mode);
    const existing = store(mode).getItem(TOKEN_KEY);
    if (!existing) {
      setReady(true);
      return;
    }
    verifyToken(existing).then((payload) => {
      if (payload) {
        setToken(existing);
        setUser(payload);
      } else {
        store(mode).removeItem(TOKEN_KEY);
      }
      setReady(true);
    });
  }, []);

  // Auto sign-out the moment the token expires.
  useEffect(() => {
    if (!user) return;
    const ms = user.exp * 1000 - Date.now();
    const t = setTimeout(() => {
      store(storageMode).removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }, Math.max(ms, 0));
    return () => clearTimeout(t);
  }, [user, storageMode]);

  const setStorageMode = useCallback(
    (mode: StorageMode) => {
      const current = store(storageMode).getItem(TOKEN_KEY);
      store(storageMode).removeItem(TOKEN_KEY);
      if (current) store(mode).setItem(TOKEN_KEY, current);
      window.localStorage.setItem(MODE_KEY, mode);
      setStorageModeState(mode);
    },
    [storageMode],
  );

  const login = useCallback(
    async (username: string, password: string) => {
      // Step 1-2: the "server" validates credentials.
      const found = USERS.find(
        (u) => u.username === username.trim() && u.password === password,
      );
      await new Promise((r) => setTimeout(r, 350)); // simulated latency
      if (!found) throw new Error("Invalid username or password");
      // Step 3: sign a JWT (15 min TTL).
      const issued = await signToken({
        sub: found.id,
        name: found.name,
        role: found.role,
      });
      // Step 4: store it on the client.
      store(storageMode).setItem(TOKEN_KEY, issued);
      setToken(issued);
      setUser(decodeToken(issued));
    },
    [storageMode],
  );

  const logout = useCallback(() => {
    store(storageMode).removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, [storageMode]);

  const callProtectedApi = useCallback(async () => {
    // Step 5-6: attach `Authorization: Bearer <token>` and let the server verify.
    const bearer = token ? `Bearer ${token}` : null;
    await new Promise((r) => setTimeout(r, 250));
    if (!bearer) return { status: 401, body: { error: "No token provided" } };
    const payload = await verifyToken(bearer.slice(7));
    if (!payload)
      return { status: 401, body: { error: "Invalid or expired token" } };
    return {
      status: 200,
      body: {
        message: `Protected resource unlocked for ${payload.name}`,
        sub: payload.sub,
        role: payload.role,
        servedAt: new Date().toISOString(),
      },
    };
  }, [token]);

  const role = (user?.role as Role | undefined) ?? null;
  const permissions = useMemo(() => (role ? permissionsFor(role) : []), [role]);
  const hasRole = useCallback(
    (roles: Role[]) => Boolean(role && roles.includes(role)),
    [role],
  );
  const hasPermission = useCallback(
    (permission: Permission) => Boolean(role && roleHasPermission(role, permission)),
    [role],
  );

  const value = useMemo<AuthState>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(user),
      ready,
      storageMode,
      setStorageMode,
      login,
      logout,
      role,
      permissions,
      hasRole,
      hasPermission,
      callProtectedApi,
    }),
    [token, user, ready, storageMode, setStorageMode, login, logout, role, permissions, hasRole, hasPermission, callProtectedApi],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
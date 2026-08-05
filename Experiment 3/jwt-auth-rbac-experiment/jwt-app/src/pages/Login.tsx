import { useState, type FormEvent } from "react";
import { DEMO_CREDENTIALS, useAuth } from "../lib/auth";

export default function Login() {
  const { login, storageMode, setStorageMode } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell center">
      <form className="panel" onSubmit={onSubmit}>
        <h1>Sign in</h1>
        <p className="muted small">Mock credential validation</p>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={username}
          maxLength={40}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="admin"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          maxLength={64}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <label>Token storage</label>
        <div className="row">
          {(["localStorage", "sessionStorage"] as const).map((mode) => (
            <button
              type="button"
              key={mode}
              className={storageMode === mode ? "btn" : "btn ghost"}
              onClick={() => setStorageMode(mode)}
            >
              {mode}
            </button>
          ))}
        </div>

        {error && <p className="error" role="alert">{error}</p>}

        <button className="btn wide" type="submit" disabled={busy}>
          {busy ? "Issuing token…" : "Login"}
        </button>

        <div className="creds">
          <p className="small muted">Demo accounts</p>
          {DEMO_CREDENTIALS.map((c) => (
            <div key={c.username} className="cred">
              <code>{c.username} / {c.password}</code>
              <span className="muted">{c.role}</span>
            </div>
          ))}
        </div>
      </form>
    </main>
  );
}

import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import RoleNav from "../components/RoleNav";

export default function Dashboard() {
  const { user, token, permissions } = useAuth();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!user || !token) return null;

  const remaining = Math.max(0, Math.floor((user.exp * 1000 - now) / 1000));
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <main className="shell">
      <RoleNav />
      <header className="row between">
        <div>
          <span className="pill">Protected route</span>
          <h1>Welcome, {user.name}</h1>
        </div>
      </header>

      <section className="stats">
        <div className="stat"><p className="muted small">Subject (sub)</p><b>{user.sub}</b></div>
        <div className="stat"><p className="muted small">Role claim</p><b>{user.role}</b></div>
        <div className="stat"><p className="muted small">Expires in</p><b>{mm}:{ss}</b></div>
      </section>

      <section className="panel">
        <p className="muted small">Granted permissions</p>
        <div className="perms">
          {permissions.map((p) => (<span key={p}>{p}</span>))}
        </div>
      </section>
    </main>
  );
}

import RoleNav from "../components/RoleNav";
import { DEMO_CREDENTIALS } from "../lib/auth";
import { permissionsFor } from "../lib/rbac";

export default function Admin() {
  return (
    <main className="shell">
      <RoleNav />
      <h1>Admin panel</h1>
      <p className="muted small">
        Requires role <code>admin</code> and permission <code>users:manage</code>.
      </p>
      <div className="panel">
        <table className="table">
          <thead>
            <tr><th>User</th><th>Role</th><th>Permissions</th></tr>
          </thead>
          <tbody>
            {DEMO_CREDENTIALS.map((c) => (
              <tr key={c.username}>
                <td><code>{c.username}</code></td>
                <td>{c.role}</td>
                <td className="muted small">{permissionsFor(c.role).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

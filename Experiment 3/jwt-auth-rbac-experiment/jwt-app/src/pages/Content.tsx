import RoleNav from "../components/RoleNav";
import { useAuth } from "../lib/auth";

const ARTICLES = [
  { id: 1, title: "Stateless sessions with JWT", status: "Published" },
  { id: 2, title: "Designing role hierarchies", status: "Draft" },
  { id: 3, title: "Protecting routes in React", status: "Review" },
];

export default function Content() {
  const { hasPermission, role } = useAuth();
  const canEdit = hasPermission("content:edit");

  return (
    <main className="shell">
      <RoleNav />
      <h1>Content</h1>
      <p className="muted small">
        Visible with <code>content:view</code>. Edit buttons need <code>content:edit</code> —
        your role is <code>{role}</code>.
      </p>
      <div className="panel">
        {ARTICLES.map((a) => (
          <div key={a.id} className="row between item">
            <div>
              <b>{a.title}</b>
              <p className="muted small">{a.status}</p>
            </div>
            {canEdit ? (
              <button className="btn">Edit</button>
            ) : (
              <span className="muted small">Read only</span>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

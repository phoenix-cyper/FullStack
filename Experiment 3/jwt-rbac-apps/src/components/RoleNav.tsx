import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function RoleNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav className="flex items-center justify-between gap-4 rounded-xl border bg-card px-5 py-3 shadow-sm">
      <div className="flex items-center gap-1">
        <Link
          to="/"
          activeOptions={{ exact: true }}
          activeProps={{ className: "bg-secondary text-secondary-foreground" }}
          className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <Link
          to="/content"
          activeProps={{ className: "bg-secondary text-secondary-foreground" }}
          className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Content
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="uppercase tracking-wide">
          {user.role}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            logout();
            navigate({ to: "/" });
          }}
        >
          <LogOut className="mr-2 size-4" />
          Logout
        </Button>
      </div>
    </nav>
  );
}

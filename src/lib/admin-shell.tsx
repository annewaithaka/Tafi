import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  Route as RouteIcon,
  Bus,
  IdCard,
  Receipt,
  Settings,
  LogOut,
  Menu,
  Shield,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getMyRoles } from "@/lib/admin-data";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/guardians", label: "Guardians", icon: UserSquare2 },
  { to: "/admin/routes", label: "Routes", icon: RouteIcon },
  { to: "/admin/vehicles", label: "Vehicles", icon: Bus },
  { to: "/admin/drivers", label: "Drivers", icon: IdCard },
  { to: "/admin/billing", label: "Billing", icon: Receipt },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [schoolName, setSchoolName] = useState<string>("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
    supabase
      .from("profiles")
      .select("school_id, schools(name)")
      .maybeSingle()
      .then(({ data }) => {
        const s = (data as any)?.schools;
        setSchoolName(s?.name ?? "");
      });
    getMyRoles().then((roles) => setIsSuperAdmin(roles.some((r) => r.role === "super_admin")));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  const sidebar = (
    <aside className="w-64 shrink-0 border-r border-border bg-card h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-brand flex items-center justify-center text-primary-foreground font-extrabold text-sm">T</div>
          <div>
            <div className="font-extrabold tracking-tight leading-tight">Tafi</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">School admin</div>
          </div>
        </Link>
        {schoolName && (
          <div className="mt-3 text-xs text-muted-foreground truncate">{schoolName}</div>
        )}
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = item.exact ? path === item.to : path.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to as any}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-brand/10 text-brand"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
        {isSuperAdmin && (
          <Link
            to="/tafi"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              path.startsWith("/tafi")
                ? "bg-brand/10 text-brand"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            <Shield className="size-4" />
            Tafi admin
          </Link>
        )}
      </nav>
      <div className="p-4 border-t border-border space-y-2">
        <div className="text-xs text-muted-foreground truncate">{email}</div>
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Home className="size-4" /> View landing page
        </a>
        <Button size="sm" variant="outline" className="w-full" onClick={signOut}>
          <LogOut className="size-4 mr-2" /> Sign out
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden md:block">{sidebar}</div>
      {open && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute left-0 top-0 bottom-0" onClick={(e) => e.stopPropagation()}>
            {sidebar}
          </div>
        </div>
      )}
      <main className="flex-1 min-w-0">
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-md bg-brand flex items-center justify-center text-primary-foreground font-extrabold text-xs">T</div>
            <span className="font-bold">Tafi</span>
          </div>
          <Button size="icon" variant="ghost" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </Button>
        </div>
        <div className="p-6 md:p-8 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}
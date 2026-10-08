import { NavLink, Outlet } from "react-router-dom";

import { cn } from "@/lib/utils";

const navigation = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/organizations", label: "Organizations", end: false },
];

export function AppShell() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <NavLink to="/" className="font-display text-lg font-bold tracking-tight">
            Tafi
            <span className="ml-2 text-xs font-medium text-muted-foreground">school transport</span>
          </NavLink>
          <nav aria-label="Main">
            <ul className="flex items-center gap-1 overflow-x-auto">
              {navigation.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        "inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        Tafi — MVP 1 foundation. Nairobi, Kenya.
      </footer>
    </div>
  );
}

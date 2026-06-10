import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useStore } from "@/lib/store";
import { LayoutDashboard, Sprout, Beef, CloudSun, BookOpen, LogOut, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/crops", label: "Crops", icon: Sprout },
  { to: "/livestock", label: "Livestock", icon: Beef },
  { to: "/weather", label: "Weather", icon: CloudSun },
  { to: "/knowledge", label: "Knowledge", icon: BookOpen },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { state, signOut } = useStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    // Wait one tick for hydration; if no user, bounce to /auth
    const t = setTimeout(() => {
      if (!state.user) navigate({ to: "/auth" });
    }, 0);
    return () => clearTimeout(t);
  }, [state.user, navigate]);

  if (!state.user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground bg-grain">
      <div className="flex">
        <aside className="hidden md:flex w-64 min-h-screen flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-2 px-6 py-6 border-b border-sidebar-border">
            <Leaf className="h-6 w-6 text-sidebar-primary" />
            <span className="font-display text-xl font-semibold tracking-tight">AgriSmart</span>
          </Link>
          <nav className="flex-1 px-3 py-6 space-y-1">
            {nav.map((n) => {
              const active = pathname === n.to || pathname.startsWith(n.to + "/");
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-sidebar-border p-4">
            <div className="text-xs text-sidebar-foreground/70">Signed in as</div>
            <div className="text-sm font-medium truncate">{state.user.name}</div>
            <div className="text-xs text-sidebar-foreground/60 truncate">{state.user.farmName ?? state.user.email}</div>
            <button
              onClick={() => { signOut(); navigate({ to: "/" }); }}
              className="mt-3 flex items-center gap-2 text-xs text-sidebar-foreground/80 hover:text-sidebar-primary transition"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="font-display font-semibold">AgriSmart</span>
            </Link>
            <button onClick={() => { signOut(); navigate({ to: "/" }); }} className="text-xs text-muted-foreground">Sign out</button>
          </div>
          <div className="md:hidden overflow-x-auto border-b border-border bg-card">
            <div className="flex gap-1 px-2 py-2 min-w-max">
              {nav.map((n) => {
                const active = pathname === n.to || pathname.startsWith(n.to + "/");
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap",
                      active ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                    )}
                  >
                    <n.icon className="h-3.5 w-3.5" />
                    {n.label}
                  </Link>
                );
              })}
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

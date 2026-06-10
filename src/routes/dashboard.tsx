import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useStore } from "@/lib/store";
import { CROPS, getCrop } from "@/lib/knowledge-base";
import { useWeather, describe, emojiFor, recommendationsFor } from "@/hooks/use-weather";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sprout, CloudSun, AlertTriangle, TrendingUp, Calendar, Plus, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · AgriSmart" }] }),
  component: () => <AppShell><Dashboard /></AppShell>,
});

function Dashboard() {
  const { state, toggleTask } = useStore();
  const weather = useWeather();

  const now = Date.now();
  const upcoming = state.tasks
    .filter((t) => !t.completed)
    .sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate))
    .slice(0, 8);
  const overdue = upcoming.filter((t) => +new Date(t.dueDate) < now);
  const dueToday = upcoming.filter((t) => {
    const d = new Date(t.dueDate);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });

  const totalYield = state.harvests.reduce((s, h) => s + h.quantityKg, 0);
  const activePlantings = state.plantings.filter((p) => p.status === "active");

  // collect pest/disease alerts from active crops
  const alerts = activePlantings.flatMap((p) => {
    const crop = getCrop(p.cropId);
    if (!crop) return [];
    return crop.diseases.slice(0, 1).map((d) => ({ planting: p, crop, type: "disease" as const, name: d.name, body: d.symptoms }));
  }).slice(0, 3);

  const recs = weather.data ? recommendationsFor(weather.data) : [];

  return (
    <div className="px-6 md:px-10 py-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="text-sm text-muted-foreground">{state.user?.farmName ?? "Your farm"}</div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">Hello, {state.user?.name.split(" ")[0]}</h1>
          <p className="text-muted-foreground mt-1">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
        <Link to="/crops"><Button className="gap-2"><Plus className="h-4 w-4" /> Plant a crop</Button></Link>
      </div>

      {/* Stat tiles */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Sprout} label="Active crops" value={activePlantings.length} accent="primary" />
        <StatCard icon={Calendar} label="Due today" value={dueToday.length} accent="harvest" />
        <StatCard icon={AlertTriangle} label="Overdue" value={overdue.length} accent="terracotta" />
        <StatCard icon={TrendingUp} label="Total harvest (kg)" value={totalYield.toFixed(0)} accent="accent" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tasks */}
        <div className="lg:col-span-2 rounded-xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold">Upcoming tasks</h2>
            <Link to="/crops" className="text-xs text-primary hover:underline flex items-center gap-1">View crops <ArrowRight className="h-3 w-3" /></Link>
          </div>
          {upcoming.length === 0 ? (
            <EmptyTasks />
          ) : (
            <div className="space-y-2">
              {upcoming.map((t) => {
                const p = state.plantings.find((p) => p.id === t.plantingId);
                const crop = p && getCrop(p.cropId);
                const due = new Date(t.dueDate);
                const isOverdue = +due < now;
                return (
                  <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/40 transition">
                    <Checkbox checked={t.completed} onCheckedChange={() => toggleTask(t.id)} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{t.activity}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {crop?.emoji} {crop?.name} · {p?.fieldName}
                      </div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-md ${isOverdue ? "bg-destructive/10 text-destructive" : "bg-secondary text-secondary-foreground"}`}>
                      {due.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Weather */}
        <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 border border-primary/50">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display text-lg font-semibold">Weather</h2>
            <CloudSun className="h-4 w-4 opacity-70" />
          </div>
          {weather.isLoading ? (
            <div className="text-sm opacity-70">Loading…</div>
          ) : weather.data ? (
            <>
              <div className="text-xs opacity-70">{weather.data.location.name}</div>
              <div className="flex items-end gap-3 mt-2">
                <div className="text-5xl">{emojiFor(weather.data.current.weathercode)}</div>
                <div>
                  <div className="font-display text-4xl font-semibold leading-none">{Math.round(weather.data.current.temperature)}°</div>
                  <div className="text-xs opacity-80 mt-1">{describe(weather.data.current.weathercode)}</div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-7 gap-1 text-center">
                {weather.data.daily.map((d) => (
                  <div key={d.date} className="text-[10px]">
                    <div className="opacity-70">{new Date(d.date).toLocaleDateString(undefined, { weekday: "narrow" })}</div>
                    <div className="text-base my-0.5">{emojiFor(d.code)}</div>
                    <div className="font-semibold">{Math.round(d.tMax)}°</div>
                    <div className="opacity-60">{Math.round(d.tMin)}°</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-primary-foreground/20 space-y-2">
                {recs.slice(0, 2).map((r, i) => (
                  <div key={i} className="text-xs opacity-90 leading-relaxed">• {r.text}</div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-sm opacity-70">Weather unavailable</div>
          )}
        </div>

        {/* Alerts */}
        <div className="lg:col-span-2 rounded-xl bg-card border border-border p-6">
          <h2 className="font-display text-xl font-semibold mb-4">Disease & pest watch</h2>
          {alerts.length === 0 ? (
            <div className="text-sm text-muted-foreground">Plant a crop to see relevant pest and disease alerts.</div>
          ) : (
            <div className="space-y-3">
              {alerts.map((a, i) => (
                <Link key={i} to="/crops/$cropId" params={{ cropId: a.crop.id }} className="block p-4 rounded-lg border border-border hover:border-terracotta/50 hover:bg-secondary/40 transition">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-md bg-terracotta/15 text-terracotta flex items-center justify-center shrink-0">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{a.name} <span className="font-normal text-muted-foreground">in {a.crop.name}</span></div>
                      <div className="text-xs text-muted-foreground mt-1">{a.body}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Productivity */}
        <div className="rounded-xl bg-card border border-border p-6">
          <h2 className="font-display text-xl font-semibold mb-4">Productivity</h2>
          {state.harvests.length === 0 ? (
            <div className="text-sm text-muted-foreground">Record your first harvest to track productivity.</div>
          ) : (
            <div className="space-y-3">
              {state.plantings.map((p) => {
                const crop = getCrop(p.cropId);
                const yieldKg = state.harvests.filter((h) => h.plantingId === p.id).reduce((s, h) => s + h.quantityKg, 0);
                if (yieldKg === 0) return null;
                return (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="text-sm">{crop?.emoji} {crop?.name} · <span className="text-muted-foreground">{p.fieldName}</span></div>
                    <div className="font-display text-lg font-semibold">{yieldKg} <span className="text-xs text-muted-foreground font-sans">kg</span></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: number | string; accent: "primary" | "harvest" | "terracotta" | "accent" }) {
  const map = {
    primary: "bg-primary/10 text-primary",
    harvest: "bg-harvest/15 text-soil",
    terracotta: "bg-terracotta/15 text-terracotta",
    accent: "bg-accent/20 text-primary",
  };
  return (
    <div className="rounded-xl bg-card border border-border p-5 flex items-center gap-4">
      <div className={`h-11 w-11 rounded-lg ${map[accent]} flex items-center justify-center`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-display text-2xl font-semibold leading-tight">{value}</div>
      </div>
    </div>
  );
}

function EmptyTasks() {
  return (
    <div className="text-center py-10 px-4">
      <div className="text-4xl mb-3">🌱</div>
      <div className="font-display text-lg font-semibold">No tasks yet</div>
      <p className="text-sm text-muted-foreground mt-1 mb-4">Plant your first crop to auto-generate a schedule.</p>
      <Link to="/crops"><Button>Browse crops</Button></Link>
    </div>
  );
}

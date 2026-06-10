import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useWeather, describe, emojiFor, recommendationsFor } from "@/hooks/use-weather";

export const Route = createFileRoute("/weather")({
  head: () => ({ meta: [{ title: "Weather · AgriSmart" }] }),
  component: () => <AppShell><WeatherPage /></AppShell>,
});

function WeatherPage() {
  const { data, isLoading } = useWeather();
  return (
    <div className="px-6 md:px-10 py-8 max-w-5xl mx-auto">
      <h1 className="font-display text-4xl font-semibold tracking-tight mb-2">Weather & advisory</h1>
      <p className="text-muted-foreground mb-8">Forecasts from Open-Meteo. Recommendations tailored to active crops.</p>

      {isLoading && <div className="text-muted-foreground">Loading…</div>}
      {data && (
        <>
          <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 mb-6">
            <div className="text-sm opacity-70">{data.location.name} · {new Date(data.current.time).toLocaleString()}</div>
            <div className="flex items-end gap-4 mt-3">
              <div className="text-7xl">{emojiFor(data.current.weathercode)}</div>
              <div>
                <div className="font-display text-6xl font-semibold leading-none">{Math.round(data.current.temperature)}°</div>
                <div className="text-sm opacity-90 mt-1">{describe(data.current.weathercode)} · wind {Math.round(data.current.windspeed)} km/h</div>
              </div>
            </div>
          </div>

          <h2 className="font-display text-xl font-semibold mb-3">7-day forecast</h2>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2 mb-8">
            {data.daily.map((d) => (
              <div key={d.date} className="rounded-xl bg-card border border-border p-4 text-center">
                <div className="text-xs text-muted-foreground">{new Date(d.date).toLocaleDateString(undefined, { weekday: "short" })}</div>
                <div className="text-3xl my-1">{emojiFor(d.code)}</div>
                <div className="text-sm"><span className="font-semibold">{Math.round(d.tMax)}°</span> <span className="text-muted-foreground">/{Math.round(d.tMin)}°</span></div>
                <div className="text-[11px] text-muted-foreground mt-1">{d.rainMm.toFixed(1)} mm</div>
              </div>
            ))}
          </div>

          <h2 className="font-display text-xl font-semibold mb-3">Recommendations</h2>
          <div className="space-y-2">
            {recommendationsFor(data).map((r, i) => (
              <div key={i} className={`p-4 rounded-lg border ${
                r.tone === "alert" ? "bg-destructive/10 border-destructive/30 text-destructive" :
                r.tone === "warn" ? "bg-harvest/15 border-harvest/40" :
                "bg-secondary border-border"
              }`}>
                <div className="text-sm">{r.text}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

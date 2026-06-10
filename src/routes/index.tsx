import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Sprout, CloudSun, LineChart, ShieldCheck, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriSmart — Smart Farm Management" },
      { name: "description", content: "Plan, monitor and manage crops and livestock with timely recommendations, automated schedules and weather intelligence." },
      { property: "og:title", content: "AgriSmart — Smart Farm Management" },
      { property: "og:description", content: "Your digital farming assistant: crop schedules, livestock records, weather and expert recommendations." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Sprout, title: "Crop intelligence", body: "Pick a crop and get varieties, growing conditions, pests, diseases and treatments — all from an expert-curated knowledge base." },
  { icon: LineChart, title: "Automated schedules", body: "Plant a crop and the system lays out your land prep, fertilizer, weeding, scouting and harvest tasks day-by-day." },
  { icon: CloudSun, title: "Weather advisory", body: "7-day forecasts plus contextual recommendations: irrigate, delay spraying, watch for disease pressure." },
  { icon: ShieldCheck, title: "Pest & disease alerts", body: "Symptom guides, prevention and treatment for every crop you grow — caught before losses compound." },
  { icon: BookOpen, title: "Livestock records", body: "Inventory, feeding, vaccinations, treatments and production — for cattle, goats, sheep, poultry and pigs." },
  { icon: Leaf, title: "Yield tracking", body: "Log every harvest. See productivity per field, per season, per variety." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground bg-grain">
      <header className="border-b border-border/60">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-semibold tracking-tight">AgriSmart</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/auth"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link to="/auth"><Button size="sm">Get started</Button></Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
              Built for smallholder & commercial farmers
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-tight text-balance">
              Farm with the
              <span className="text-primary"> rhythm </span>
              of the season.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl text-balance">
              AgriSmart turns expert agronomy into a daily plan. Pick your crop, and we'll schedule your work, watch the weather, and flag pests before they spread.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth">
                <Button size="lg" className="gap-2">
                  Start managing your farm <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline">See the dashboard</Button>
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div><span className="font-display text-2xl text-foreground">5+</span> crops seeded</div>
              <div className="h-8 w-px bg-border" />
              <div><span className="font-display text-2xl text-foreground">7-day</span> forecasts</div>
              <div className="h-8 w-px bg-border" />
              <div><span className="font-display text-2xl text-foreground">Auto</span> task plans</div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-accent/40 via-harvest/30 to-terracotta/30 blur-2xl rounded-3xl" />
              <div className="relative rounded-2xl bg-card border border-border shadow-2xl shadow-primary/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Today · Plot A</div>
                    <div className="font-display text-lg font-semibold">Cabbage · day 42</div>
                  </div>
                  <div className="text-3xl">🥬</div>
                </div>
                <div className="space-y-2">
                  {[
                    { d: "✓", t: "Top-dress with CAN", muted: true },
                    { d: "→", t: "Scout for diamondback moth", muted: false },
                    { d: " ", t: "NPK at head formation", muted: false },
                    { d: " ", t: "Disease scout — black rot", muted: false },
                  ].map((r, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${r.muted ? "bg-secondary/50 border-border text-muted-foreground line-through" : "bg-background border-border"}`}>
                      <span className="h-6 w-6 rounded-md bg-primary/10 text-primary text-xs flex items-center justify-center font-semibold">{r.d}</span>
                      <span className="text-sm">{r.t}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-harvest/15 border border-harvest/30 text-sm">
                  <span className="font-semibold">⛅ 24°C</span> · light rain tomorrow — delay foliar spray.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-secondary/40">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-semibold tracking-tight text-balance">Everything a season demands, in one place.</h2>
            <p className="mt-4 text-muted-foreground">Stop juggling notebooks, WhatsApp reminders and weather apps. AgriSmart brings agronomic intelligence to your fingertips.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="group p-6 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight">Start your first crop in two minutes.</h2>
          <p className="mt-4 text-muted-foreground">No setup. No credit card. Sign up and plant a crop — your schedule appears instantly.</p>
          <div className="mt-8">
            <Link to="/auth">
              <Button size="lg" className="gap-2">Create your free account <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-primary" />
            <span className="font-display font-semibold text-foreground">AgriSmart</span>
            <span>· grown with care</span>
          </div>
          <div>© {new Date().getFullYear()}</div>
        </div>
      </footer>
    </div>
  );
}

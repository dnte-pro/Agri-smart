import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { CROPS } from "@/lib/knowledge-base";

export const Route = createFileRoute("/knowledge")({
  head: () => ({ meta: [{ title: "Knowledge base · AgriSmart" }] }),
  component: () => <AppShell><KB /></AppShell>,
});

function KB() {
  return (
    <div className="px-6 md:px-10 py-8 max-w-6xl mx-auto">
      <h1 className="font-display text-4xl font-semibold tracking-tight mb-2">Knowledge base</h1>
      <p className="text-muted-foreground mb-8">Expert-curated agronomy powering your recommendations. Browse crops below.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CROPS.map((c) => (
          <Link key={c.id} to="/crops/$cropId" params={{ cropId: c.id }} className="p-5 rounded-xl bg-card border border-border hover:border-primary/40 transition">
            <div className="text-3xl">{c.emoji}</div>
            <div className="font-display text-xl font-semibold mt-2">{c.name}</div>
            <div className="text-xs text-muted-foreground">{c.varieties.length} varieties · {c.pests.length} pests · {c.diseases.length} diseases</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 p-6 rounded-xl border border-dashed border-border text-center text-sm text-muted-foreground">
        Admin tools for editing the knowledge base are coming in the next iteration.
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Beef } from "lucide-react";

export const Route = createFileRoute("/livestock")({
  head: () => ({ meta: [{ title: "Livestock · AgriSmart" }] }),
  component: () => <AppShell><LS /></AppShell>,
});

function LS() {
  const types = [
    { emoji: "🐄", name: "Cattle" },
    { emoji: "🐐", name: "Goats" },
    { emoji: "🐑", name: "Sheep" },
    { emoji: "🐓", name: "Poultry" },
    { emoji: "🐖", name: "Pigs" },
  ];
  return (
    <div className="px-6 md:px-10 py-8 max-w-5xl mx-auto">
      <h1 className="font-display text-4xl font-semibold tracking-tight mb-2">Livestock</h1>
      <p className="text-muted-foreground mb-8">Inventory, feeding, vaccinations, health and production records.</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {types.map((t) => (
          <div key={t.name} className="p-5 rounded-xl bg-card border border-border text-center">
            <div className="text-4xl">{t.emoji}</div>
            <div className="font-display text-lg font-semibold mt-2">{t.name}</div>
            <div className="text-xs text-muted-foreground">0 animals</div>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-xl border border-dashed border-border text-center">
        <Beef className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
        <div className="font-display text-lg font-semibold">Livestock module coming next</div>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">In this MVP iteration we focused on crops end-to-end. Livestock inventory, vaccinations and production logs are next.</p>
      </div>
    </div>
  );
}

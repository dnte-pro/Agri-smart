import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { CROPS, getCrop, type Crop } from "@/lib/knowledge-base";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/crops")({
  head: () => ({ meta: [{ title: "Crops · AgriSmart" }] }),
  component: () => <AppShell><CropsPage /></AppShell>,
});

function CropsPage() {
  const { state } = useStore();

  return (
    <div className="px-6 md:px-10 py-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">Crops</h1>
          <p className="text-muted-foreground mt-1">Plant from the knowledge base. We generate the full schedule.</p>
        </div>
      </div>

      {state.plantings.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display text-xl font-semibold mb-4">Your active plantings</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.plantings.map((p) => {
              const crop = getCrop(p.cropId);
              if (!crop) return null;
              const planted = new Date(p.plantingDate);
              const daysIn = Math.floor((Date.now() - +planted) / 86400000);
              const pct = Math.min(100, Math.max(0, (daysIn / crop.maturityDays) * 100));
              const stage = crop.growthStages.find((s) => daysIn >= s.startDay && daysIn <= s.endDay) ?? crop.growthStages[crop.growthStages.length - 1];
              const taskCount = state.tasks.filter((t) => t.plantingId === p.id && !t.completed).length;
              return (
                <Link key={p.id} to="/crops/$cropId" params={{ cropId: crop.id }} className="block p-5 rounded-xl bg-card border border-border hover:border-primary/40 transition group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-3xl">{crop.emoji}</div>
                      <div className="font-display text-lg font-semibold mt-2">{crop.name}</div>
                      <div className="text-xs text-muted-foreground">{p.varietyName} · {p.fieldName}</div>
                    </div>
                    <div className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">Day {daysIn}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">{stage.name}</div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs">
                    <span className="text-muted-foreground">{taskCount} open tasks</span>
                    <span className="text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Open <ArrowRight className="h-3 w-3" /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-xl font-semibold mb-4">Knowledge base</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CROPS.map((c) => (
            <CropCard key={c.id} crop={c} />
          ))}
        </div>
      </section>
    </div>
  );
}

function CropCard({ crop }: { crop: Crop }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl bg-card border border-border p-5 flex flex-col">
      <div className="flex items-start justify-between">
        <div className="text-4xl">{crop.emoji}</div>
        <div className="text-xs text-muted-foreground">{crop.maturityDays}d</div>
      </div>
      <div className="font-display text-xl font-semibold mt-3">{crop.name}</div>
      <div className="text-xs text-muted-foreground">{crop.family}</div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {crop.varieties.slice(0, 3).map((v) => (
          <span key={v.name} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{v.name}</span>
        ))}
      </div>
      <div className="mt-auto pt-4 flex gap-2">
        <Link to="/crops/$cropId" params={{ cropId: crop.id }} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">Details</Button>
        </Link>
        <PlantDialog crop={crop} open={open} setOpen={setOpen} />
      </div>
    </div>
  );
}

function PlantDialog({ crop, open, setOpen }: { crop: Crop; open: boolean; setOpen: (b: boolean) => void }) {
  const { addPlanting } = useStore();
  const navigate = useNavigate();
  const [variety, setVariety] = useState(crop.varieties[0].name);
  const [field, setField] = useState("");
  const [area, setArea] = useState("1");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const plant = () => {
    if (!field.trim()) { toast.error("Field name is required"); return; }
    const id = addPlanting({
      crop,
      varietyName: variety,
      fieldName: field.trim(),
      areaHa: parseFloat(area) || 0,
      plantingDate: new Date(date).toISOString(),
    });
    toast.success(`${crop.name} planted — schedule generated`);
    setOpen(false);
    navigate({ to: "/crops/$cropId", params: { cropId: crop.id } });
    return id;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Plant</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Plant {crop.emoji} {crop.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Variety</Label>
            <Select value={variety} onValueChange={setVariety}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {crop.varieties.map((v) => (
                  <SelectItem key={v.name} value={v.name}>{v.name} — {v.maturityDays}d</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="field">Field name</Label>
            <Input id="field" value={field} onChange={(e) => setField(e.target.value)} placeholder="Plot A" className="mt-1.5" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="area">Area (ha)</Label>
              <Input id="area" type="number" step="0.1" min="0" value={area} onChange={(e) => setArea(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="date">Planting date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={plant}>Plant & generate schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

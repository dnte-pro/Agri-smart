import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { getCrop } from "@/lib/knowledge-base";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Bug, Droplets, Leaf, Sprout, Wheat, TestTube, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/crops/$cropId")({
  head: ({ params }) => ({
    meta: [{ title: `${getCrop(params.cropId)?.name ?? "Crop"} · AgriSmart` }],
  }),
  loader: ({ params }) => {
    const crop = getCrop(params.cropId);
    if (!crop) throw notFound();
    return null;
  },
  component: () => <AppShell><CropDetail /></AppShell>,
  notFoundComponent: () => <AppShell><div className="p-10">Crop not found.</div></AppShell>,
  errorComponent: ({ error }) => <AppShell><div className="p-10 text-destructive">{error.message}</div></AppShell>,
});

function CropDetail() {
  const { cropId } = Route.useParams();
  const crop = getCrop(cropId)!;
  const { state, toggleTask, addHarvest, addTask, removePlanting } = useStore();
  const plantings = state.plantings.filter((p) => p.cropId === crop.id);


  return (
    <div className="px-6 md:px-10 py-8 max-w-7xl mx-auto">
      <Link to="/crops" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> All crops
      </Link>

      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div className="flex items-start gap-5">
          <div className="text-6xl">{crop.emoji}</div>
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight">{crop.name}</h1>
            <div className="text-sm text-muted-foreground">{crop.family} · {crop.maturityDays} days to maturity</div>
            <div className="mt-2 text-sm text-muted-foreground max-w-xl">{crop.expectedYield} expected yield</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue={plantings.length ? "plantings" : "overview"} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plantings">My plantings ({plantings.length})</TabsTrigger>
          <TabsTrigger value="pests">Pests</TabsTrigger>
          <TabsTrigger value="diseases">Diseases</TabsTrigger>
          <TabsTrigger value="fertilizer">Fertilizer</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="grid md:grid-cols-2 gap-5">
          <InfoCard icon={Sprout} title="Growing conditions">
            <Row label="Temperature" value={crop.conditions.temperature} />
            <Row label="Rainfall" value={crop.conditions.rainfall} />
            <Row label="Soil" value={crop.conditions.soil} />
            <Row label="Altitude" value={crop.conditions.altitude} />
          </InfoCard>
          <InfoCard icon={Leaf} title="Varieties">
            <div className="space-y-2">
              {crop.varieties.map((v) => (
                <div key={v.name} className="p-3 rounded-md bg-secondary/50">
                  <div className="flex justify-between items-baseline">
                    <div className="font-medium">{v.name}</div>
                    <div className="text-xs text-muted-foreground">{v.maturityDays} days</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{v.notes}</div>
                </div>
              ))}
            </div>
          </InfoCard>
          <InfoCard icon={Droplets} title="Irrigation">
            <p className="text-sm text-muted-foreground">{crop.irrigation}</p>
          </InfoCard>
          <InfoCard icon={Wheat} title="Harvesting">
            <p className="text-sm text-muted-foreground">{crop.harvesting}</p>
          </InfoCard>
          <InfoCard icon={Sprout} title="Growth stages" className="md:col-span-2">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {crop.growthStages.map((s) => (
                <div key={s.name} className="p-3 rounded-md border border-border">
                  <div className="text-xs text-muted-foreground">Day {s.startDay}–{s.endDay}</div>
                  <div className="font-medium mt-1">{s.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.notes}</div>
                </div>
              ))}
            </div>
          </InfoCard>
        </TabsContent>

        <TabsContent value="plantings" className="space-y-4">
          {plantings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center">
              <div className="text-4xl mb-2">{crop.emoji}</div>
              <div className="font-display text-lg font-semibold">No plantings yet</div>
              <p className="text-sm text-muted-foreground mt-1 mb-4">Plant {crop.name} to generate your schedule.</p>
              <Link to="/crops"><Button>Go plant</Button></Link>
            </div>
          ) : (
            plantings.map((p) => {
              const tasks = state.tasks.filter((t) => t.plantingId === p.id).sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate));
              const harvests = state.harvests.filter((h) => h.plantingId === p.id);
              const yieldKg = harvests.reduce((s, h) => s + h.quantityKg, 0);
              const daysIn = Math.floor((Date.now() - +new Date(p.plantingDate)) / 86400000);
              const pct = Math.min(100, Math.max(0, (daysIn / crop.maturityDays) * 100));
              const stage = crop.growthStages.find((s) => daysIn >= s.startDay && daysIn <= s.endDay) ?? crop.growthStages[0];
              return (
                <div key={p.id} className="rounded-xl bg-card border border-border p-6">
                  <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                    <div>
                      <div className="font-display text-xl font-semibold">{p.fieldName} <span className="text-sm font-normal text-muted-foreground">· {p.varietyName} · {p.areaHa} ha</span></div>
                      <div className="text-xs text-muted-foreground mt-1">Planted {new Date(p.plantingDate).toLocaleDateString()} · day {daysIn} · {stage.name}</div>
                    </div>
                    <div className="flex gap-2">
                      <HarvestDialog onSave={(date, qty, notes) => { addHarvest(p.id, date, qty, notes); toast.success("Harvest logged"); }} />
                      <AddTaskDialog onSave={(activity, date) => { addTask(p.id, activity, new Date(date).toISOString()); toast.success("Task added"); }} />
                      <Button variant="ghost" size="icon" onClick={() => { if (confirm("Remove this planting and all its tasks?")) { removePlanting(p.id); toast.success("Removed"); } }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="text-sm font-semibold mb-2">Schedule</div>
                      <div className="space-y-1.5 max-h-96 overflow-y-auto pr-2">
                        {tasks.map((t) => {
                          const due = new Date(t.dueDate);
                          const overdue = !t.completed && +due < Date.now();
                          return (
                            <div key={t.id} className={`flex items-center gap-3 p-2.5 rounded-md border ${t.completed ? "bg-secondary/40 border-border opacity-60" : overdue ? "border-destructive/30 bg-destructive/5" : "border-border"}`}>
                              <Checkbox checked={t.completed} onCheckedChange={() => toggleTask(t.id)} />
                              <CategoryBadge category={t.category} />
                              <div className="flex-1 min-w-0">
                                <div className={`text-sm ${t.completed ? "line-through" : ""}`}>{t.activity}</div>
                                {t.notes && <div className="text-xs text-muted-foreground">{t.notes}</div>}
                              </div>
                              <div className="text-xs text-muted-foreground whitespace-nowrap">{due.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-2">Harvest log</div>
                      <div className="rounded-md bg-secondary/40 p-4 mb-3">
                        <div className="text-xs text-muted-foreground">Total harvested</div>
                        <div className="font-display text-3xl font-semibold">{yieldKg.toFixed(0)} <span className="text-sm font-sans font-normal text-muted-foreground">kg</span></div>
                      </div>
                      <div className="space-y-2">
                        {harvests.length === 0 ? (
                          <div className="text-xs text-muted-foreground">No harvests recorded yet.</div>
                        ) : (
                          harvests.map((h) => (
                            <div key={h.id} className="text-sm p-2 rounded-md border border-border">
                              <div className="flex justify-between"><span>{new Date(h.date).toLocaleDateString()}</span><span className="font-semibold">{h.quantityKg} kg</span></div>
                              {h.notes && <div className="text-xs text-muted-foreground">{h.notes}</div>}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="pests" className="grid md:grid-cols-2 gap-4">
          {crop.pests.map((p) => (
            <div key={p.name} className="p-5 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Bug className="h-4 w-4 text-terracotta" />
                <div className="font-display text-lg font-semibold">{p.name}</div>
              </div>
              <Row label="Symptoms" value={p.symptoms} />
              <Row label="Prevention" value={p.prevention} />
              <Row label="Treatment" value={p.treatment} />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="diseases" className="grid md:grid-cols-2 gap-4">
          {crop.diseases.map((d) => (
            <div key={d.name} className="p-5 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-2">
                <TestTube className="h-4 w-4 text-terracotta" />
                <div className="font-display text-lg font-semibold">{d.name}</div>
              </div>
              <Row label="Symptoms" value={d.symptoms} />
              <Row label="Cause" value={d.cause} />
              <Row label="Prevention" value={d.prevention} />
              <Row label="Treatment" value={d.treatment} />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="fertilizer">
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left">
                <tr><th className="px-4 py-3">Stage</th><th className="px-4 py-3">Product</th><th className="px-4 py-3">Rate</th></tr>
              </thead>
              <tbody>
                {crop.fertilizer.map((f, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-3">{f.stage}</td>
                    <td className="px-4 py-3 font-medium">{f.product}</td>
                    <td className="px-4 py-3 text-muted-foreground">{f.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoCard({ icon: Icon, title, children, className = "" }: { icon: any; title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-5 rounded-xl bg-card border border-border ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-primary" />
        <div className="font-display text-lg font-semibold">{title}</div>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm">
      <span className="text-muted-foreground">{label}: </span>
      <span>{value}</span>
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const map: Record<string, string> = {
    land: "bg-soil/15 text-soil",
    planting: "bg-primary/15 text-primary",
    irrigation: "bg-blue-500/15 text-blue-700",
    fertilizer: "bg-harvest/25 text-soil",
    weeding: "bg-accent/25 text-primary",
    pest: "bg-terracotta/15 text-terracotta",
    disease: "bg-destructive/15 text-destructive",
    harvest: "bg-harvest/30 text-soil",
    soil: "bg-muted text-muted-foreground",
  };
  return <span className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded ${map[category] ?? "bg-secondary text-secondary-foreground"}`}>{category}</span>;
}

function HarvestDialog({ onSave }: { onSave: (date: string, qty: number, notes?: string) => void }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [qty, setQty] = useState("");
  const [notes, setNotes] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline" size="sm" className="gap-1.5"><Wheat className="h-3.5 w-3.5" /> Log harvest</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Log harvest</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5" /></div>
          <div><Label>Quantity (kg)</Label><Input type="number" min="0" value={qty} onChange={(e) => setQty(e.target.value)} className="mt-1.5" /></div>
          <div><Label>Notes</Label><Input value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1.5" placeholder="Optional" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { const n = parseFloat(qty); if (!n || n <= 0) { toast.error("Enter a quantity"); return; } onSave(new Date(date).toISOString(), n, notes || undefined); setOpen(false); setQty(""); setNotes(""); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddTaskDialog({ onSave }: { onSave: (activity: string, date: string) => void }) {
  const [open, setOpen] = useState(false);
  const [activity, setActivity] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline" size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Add task</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add custom task</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Activity</Label><Input value={activity} onChange={(e) => setActivity(e.target.value)} className="mt-1.5" placeholder="e.g. Soil test sampling" /></div>
          <div><Label>Due date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { if (!activity.trim()) { toast.error("Activity required"); return; } onSave(activity.trim(), date); setOpen(false); setActivity(""); }}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

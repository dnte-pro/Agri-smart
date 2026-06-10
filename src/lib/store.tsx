// Lightweight client-only mock store backed by localStorage.
// Replace with Lovable Cloud + Supabase later — same shape.

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CROPS, type Crop } from "./knowledge-base";

export type User = { name: string; email: string; role: "farmer" | "admin"; farmName?: string; location?: string };

export type Task = {
  id: string;
  plantingId: string;
  activity: string;
  category: string;
  dueDate: string; // ISO
  completed: boolean;
  completedAt?: string;
  notes?: string;
};

export type Harvest = {
  id: string;
  plantingId: string;
  date: string;
  quantityKg: number;
  notes?: string;
};

export type Planting = {
  id: string;
  cropId: string;
  varietyName: string;
  plantingDate: string; // ISO
  areaHa: number;
  fieldName: string;
  status: "active" | "harvested";
};

export type State = {
  user: User | null;
  plantings: Planting[];
  tasks: Task[];
  harvests: Harvest[];
};

const STORAGE_KEY = "agrismart:v1";

const empty: State = { user: null, plantings: [], tasks: [], harvests: [] };

function load(): State {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

function save(s: State) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

type Ctx = {
  state: State;
  signIn: (u: User) => void;
  signOut: () => void;
  addPlanting: (input: { crop: Crop; varietyName: string; plantingDate: string; areaHa: number; fieldName: string }) => string;
  toggleTask: (taskId: string) => void;
  addTask: (plantingId: string, activity: string, dueDate: string, category?: string) => void;
  addHarvest: (plantingId: string, date: string, quantityKg: number, notes?: string) => void;
  removePlanting: (id: string) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(empty);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) save(state);
  }, [state, hydrated]);

  const value = useMemo<Ctx>(() => ({
    state,
    signIn: (u) => setState((s) => ({ ...s, user: u })),
    signOut: () => setState(() => ({ ...empty })),
    addPlanting: ({ crop, varietyName, plantingDate, areaHa, fieldName }) => {
      const id = uid();
      const planting: Planting = { id, cropId: crop.id, varietyName, plantingDate, areaHa, fieldName, status: "active" };
      const base = new Date(plantingDate).getTime();
      const tasks: Task[] = crop.schedule.map((t) => ({
        id: uid(),
        plantingId: id,
        activity: t.activity,
        category: t.category,
        dueDate: new Date(base + t.dayOffset * 86400000).toISOString(),
        completed: false,
        notes: t.notes,
      }));
      setState((s) => ({ ...s, plantings: [...s.plantings, planting], tasks: [...s.tasks, ...tasks] }));
      return id;
    },
    toggleTask: (taskId) =>
      setState((s) => ({
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined } : t,
        ),
      })),
    addTask: (plantingId, activity, dueDate, category = "land") =>
      setState((s) => ({
        ...s,
        tasks: [...s.tasks, { id: uid(), plantingId, activity, category, dueDate, completed: false }],
      })),
    addHarvest: (plantingId, date, quantityKg, notes) =>
      setState((s) => ({
        ...s,
        harvests: [...s.harvests, { id: uid(), plantingId, date, quantityKg, notes }],
      })),
    removePlanting: (id) =>
      setState((s) => ({
        ...s,
        plantings: s.plantings.filter((p) => p.id !== id),
        tasks: s.tasks.filter((t) => t.plantingId !== id),
        harvests: s.harvests.filter((h) => h.plantingId !== id),
      })),
  }), [state]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function useCropById(id: string) {
  return CROPS.find((c) => c.id === id);
}

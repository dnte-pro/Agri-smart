import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · AgriSmart" },
      { name: "description", content: "Sign in or create your AgriSmart account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { signIn } = useStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [farmName, setFarmName] = useState("");
  const [location, setLocation] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error("Email is required"); return; }
    signIn({
      name: name || email.split("@")[0],
      email,
      role: "farmer",
      farmName: farmName || undefined,
      location: location || undefined,
    });
    toast.success(mode === "signup" ? "Welcome to AgriSmart" : "Welcome back");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-sidebar text-sidebar-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-30" />
        <Link to="/" className="relative flex items-center gap-2">
          <Leaf className="h-6 w-6 text-sidebar-primary" />
          <span className="font-display text-xl font-semibold">AgriSmart</span>
        </Link>
        <div className="relative max-w-md">
          <div className="text-5xl mb-6">🌱</div>
          <h2 className="font-display text-4xl font-semibold leading-tight">
            "I used to forget when to top-dress. Now my phone tells me."
          </h2>
          <p className="mt-4 text-sidebar-foreground/70">
            — Farmer · Kiambu County
          </p>
        </div>
        <div className="relative text-sm text-sidebar-foreground/60">
          Demo mode · data saved locally to your browser
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-background bg-grain">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-semibold">AgriSmart</span>
          </Link>

          <h1 className="font-display text-3xl font-semibold">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signup"
              ? "Set up your farm profile to get personalised schedules."
              : "Sign in to your AgriSmart dashboard."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name">Your name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Wanjiku" className="mt-1.5" />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" className="mt-1.5" required />
            </div>
            {mode === "signup" && (
              <>
                <div>
                  <Label htmlFor="farm">Farm name</Label>
                  <Input id="farm" value={farmName} onChange={(e) => setFarmName(e.target.value)} placeholder="Green Valley Farm" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="loc">Location</Label>
                  <Input id="loc" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Kiambu, Kenya" className="mt-1.5" />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="pw">Password</Label>
              <Input id="pw" type="password" placeholder="••••••••" className="mt-1.5" />
              <p className="text-xs text-muted-foreground mt-1.5">Demo: any password works.</p>
            </div>

            <Button type="submit" size="lg" className="w-full mt-2">
              {mode === "signup" ? "Create account" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Already have an account?" : "New to AgriSmart?"}{" "}
            <button onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="text-primary font-medium hover:underline">
              {mode === "signup" ? "Sign in" : "Create one"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

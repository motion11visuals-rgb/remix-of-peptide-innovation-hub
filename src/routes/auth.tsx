import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/auth")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Owner sign in — Synthesia Labs" }, { name: "description", content: "Store owner sign in." }, { name: "robots", content: "noindex" }, { property: "og:title", content: "Owner sign in — Synthesia Labs" }, { property: "og:description", content: "Store owner sign in." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    if (mode === "up") {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin/orders` } });
      setMsg(error ? error.message : "Check your email to confirm your account, then sign in.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message);
    else navigate({ to: "/admin/orders" });
  }
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-heading text-2xl mb-6">{mode === "in" ? "Owner sign in" : "Create owner account"}</h1>
      <form onSubmit={submit} className="space-y-3">
        <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" required minLength={8} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" className="w-full">{mode === "in" ? "Sign in" : "Create account"}</Button>
      </form>
      {msg && <p className="mt-3 text-sm text-muted-foreground">{msg}</p>}
      <button className="mt-4 text-sm underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "First time? Create your account" : "Have an account? Sign in"}
      </button>
    </div>
  );
}

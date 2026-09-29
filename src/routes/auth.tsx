import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { acceptInvitation } from "@/lib/admin-data";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    token: typeof s.token === "string" ? s.token : undefined,
    portal: s.portal === "tafi" ? "tafi" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Tafi School Admin" },
      { name: "description", content: "Sign in to your Tafi school admin account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

async function routeAfterAuth(navigate: ReturnType<typeof useNavigate>) {
  const { data } = await supabase.from("user_roles").select("role").limit(50);
  const isSuper = (data ?? []).some((r) => r.role === "super_admin");
  navigate({ to: isSuper ? "/tafi" : "/admin" });
}

function AuthPage() {
  const search = Route.useSearch();
  const token = search?.token;
  const portal = search?.portal;
  const isTafi = portal === "tafi";
  const [mode, setMode] = useState<"signin" | "invite">(token ? "invite" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) routeAfterAuth(navigate);
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "invite") {
        if (!token) throw new Error("Invitation token is missing");
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
            data: { full_name: fullName },
          },
        });
        if (signUpError) throw signUpError;
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const schoolId = await acceptInvitation({ token });
        toast.success(schoolId ? "School account created." : "Invitation accepted.");
        await routeAfterAuth(navigate);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await routeAfterAuth(navigate);
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="size-8 rounded-lg bg-brand flex items-center justify-center text-primary-foreground font-extrabold text-sm">T</div>
          <span className="font-extrabold text-xl tracking-tight">Tafi</span>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === "invite"
                ? "Accept your invitation"
                : isTafi
                ? "Tafi admin sign in"
                : "School admin sign in"}
            </CardTitle>
            <CardDescription>
              {mode === "invite"
                ? "Create a password to accept your school invitation."
                : isTafi
                ? "Platform super-admin access. Restricted to Tafi staff."
                : "Tafi accounts are invite-only. Please sign in below."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              {mode === "invite" && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Your name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Please wait…" : mode === "invite" ? "Accept invitation" : "Sign in"}
              </Button>
            </form>
            <div className="mt-4 text-sm text-center text-muted-foreground">
              {mode === "signin" ? (
                <>Don't have an account? Accounts are by invitation only.</>
              ) : (
                <>Already have an account?{" "}
                  <button className="text-brand font-medium hover:underline" onClick={() => setMode("signin")}>Sign in</button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

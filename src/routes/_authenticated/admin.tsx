import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getMyProfile, getMyRoles, onboardSchool } from "@/lib/admin-data";
import { AdminShell } from "@/lib/admin-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Tafi" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
  errorComponent: ({ error }) => (
    <div className="p-8">
      <h1 className="text-lg font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
    </div>
  ),
});

function AdminLayout() {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });
  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ["my-roles"],
    queryFn: getMyRoles,
  });
  const isSuper = (roles ?? []).some((r) => r.role === "super_admin");

  useEffect(() => {
    if (!rolesLoading && isSuper && !data?.school_id) {
      navigate({ to: "/tafi" });
    }
  }, [rolesLoading, isSuper, data?.school_id, navigate]);

  if (isLoading || rolesLoading) {
    return <div className="p-8 text-sm text-muted-foreground">Loading…</div>;
  }

  if (isSuper && !data?.school_id) {
    return <div className="p-8 text-sm text-muted-foreground">Redirecting to Tafi admin…</div>;
  }

  if (!data?.school_id) {
    return <Onboarding onDone={() => refetch()} />;
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}

function Onboarding({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await onboardSchool({ name, email, phone });
      toast.success("School created. Welcome to Tafi.");
      onDone();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to create school");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Set up your school</CardTitle>
          <CardDescription>Tell us about your school. You can edit these later in Settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="s-name">School name</Label>
              <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-email">Contact email</Label>
              <Input id="s-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-phone">Phone</Label>
              <Input id="s-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254…" />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Creating…" : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
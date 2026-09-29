import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { listUsersAdmin, setUserActive } from "@/lib/users.functions";
import { PageHeader } from "@/lib/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Copy, Trash2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/tafi/users")({
  component: UsersPage,
});

type AppRole = Database["public"]["Enums"]["app_role"];

const ROLES: { value: AppRole; label: string }[] = [
  { value: "school_admin", label: "School admin" },
  { value: "transport_manager", label: "Transport manager" },
  { value: "operator", label: "Operator" },
  { value: "super_admin", label: "Super admin" },
];

const ROLE_LABEL: Record<string, string> = Object.fromEntries(ROLES.map((r) => [r.value, r.label]));

function UsersPage() {
  const qc = useQueryClient();
  const listUsers = useServerFn(listUsersAdmin);
  const setActive = useServerFn(setUserActive);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AppRole>("school_admin");
  const [schoolId, setSchoolId] = useState("");
  const [expiresDays, setExpiresDays] = useState(7);

  const { data: schools = [] } = useQuery({
    queryKey: ["tafi", "schools-lookup"],
    queryFn: async () => {
      const { data, error } = await supabase.from("schools").select("id, name").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: invitations = [] } = useQuery({
    queryKey: ["tafi", "invitations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_invitations")
        .select("id, email, role, school_id, token, expires_at, used_at, created_at, schools(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: users = [] } = useQuery({
    queryKey: ["tafi", "users"],
    queryFn: async () => {
      const [rolesRes, profilesRes] = await Promise.all([
        supabase.from("user_roles").select("id, user_id, role, school_id"),
        supabase.from("profiles").select("id, full_name, school_id, schools(name)"),
      ]);
      if (rolesRes.error) throw rolesRes.error;
      if (profilesRes.error) throw profilesRes.error;
      const profileById = new Map((profilesRes.data ?? []).map((p: any) => [p.id, p]));
      const schoolName = new Map((schools ?? []).map((s: any) => [s.id, s.name]));
      // Group by user
      const byUser = new Map<string, any>();
      for (const r of rolesRes.data ?? []) {
        const p = profileById.get(r.user_id) as any;
        const entry = byUser.get(r.user_id) ?? {
          user_id: r.user_id,
          full_name: p?.full_name ?? null,
          school_name: p?.schools?.name ?? (p?.school_id ? schoolName.get(p.school_id) : null) ?? null,
          roles: [] as { id: string; role: string; school_id: string | null }[],
        };
        entry.roles.push({ id: r.id, role: r.role, school_id: r.school_id });
        byUser.set(r.user_id, entry);
      }
      return Array.from(byUser.values());
    },
  });

  const { data: authUsers = [] } = useQuery({
    queryKey: ["tafi", "auth-users"],
    queryFn: () => listUsers(),
  });
  const authById = new Map(authUsers.map((u) => [u.id, u]));
  function isActive(userId: string) {
    const u = authById.get(userId);
    if (!u?.banned_until) return true;
    return new Date(u.banned_until) < new Date();
  }

  const toggleActive = useMutation({
    mutationFn: async ({ userId, active }: { userId: string; active: boolean }) =>
      setActive({ data: { userId, active } }),
    onSuccess: (_d, v) => {
      toast.success(v.active ? "Account activated" : "Account deactivated");
      qc.invalidateQueries({ queryKey: ["tafi", "auth-users"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!email) throw new Error("Email required");
      if (role !== "super_admin" && !schoolId) throw new Error("Pick a school for this role");
      const { error } = await supabase.from("school_invitations").insert({
        email,
        role,
        token: crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 16),
        expires_at: new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000).toISOString(),
        school_id: role === "super_admin" ? null : schoolId,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Invitation created");
      qc.invalidateQueries({ queryKey: ["tafi", "invitations"] });
      setEmail("");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const removeInvite = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("school_invitations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Removed");
      qc.invalidateQueries({ queryKey: ["tafi", "invitations"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const removeRole = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Role removed");
      qc.invalidateQueries({ queryKey: ["tafi", "users"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  function copyLink(token: string) {
    const url = `${window.location.origin}/auth?token=${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Copied invite link");
  }

  return (
    <div>
      <PageHeader title="Users" description="Invite new users and manage existing platform accounts." />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Invite a user</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end"
            onSubmit={(e) => { e.preventDefault(); create.mutate(); }}
          >
            <div className="space-y-1 md:col-span-2">
              <Label>Email</Label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@school.co.ke" />
            </div>
            <div className="space-y-1">
              <Label>Role</Label>
              <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={role} onChange={(e) => setRole(e.target.value as AppRole)}>
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label>School</Label>
              <select
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                disabled={role === "super_admin"}
              >
                <option value="">— select —</option>
                {schools.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Expires (days)</Label>
              <div className="flex gap-2">
                <Input type="number" min={1} value={expiresDays} onChange={(e) => setExpiresDays(Number(e.target.value))} />
                <Button type="submit" disabled={create.isPending}>Invite</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Pending invitations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {invitations.filter((i) => !i.used_at).length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">No pending invitations.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.filter((i) => !i.used_at).map((i) => {
                  const expired = new Date(i.expires_at) < new Date();
                  return (
                    <TableRow key={i.id}>
                      <TableCell>{i.email}</TableCell>
                      <TableCell>{ROLE_LABEL[i.role] ?? i.role}</TableCell>
                      <TableCell>{(i.schools as any)?.name ?? "—"}</TableCell>
                      <TableCell>
                        <span className={expired ? "text-destructive text-xs" : "text-xs"}>
                          {new Date(i.expires_at).toLocaleDateString()} {expired && "(expired)"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => copyLink(i.token)} title="Copy invite link">
                            <Copy className="size-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => { if (confirm("Revoke invitation?")) removeInvite.mutate(i.id); }}>
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {users.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">No active users yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u: any) => {
                  const active = isActive(u.user_id);
                  return (
                  <TableRow key={u.user_id}>
                    <TableCell className="font-medium">{u.full_name ?? <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell>{u.school_name ?? <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r: any) => (
                          <span key={r.id} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-muted">
                            {ROLE_LABEL[r.role] ?? r.role}
                            <button
                              type="button"
                              onClick={() => { if (confirm(`Remove ${r.role} role?`)) removeRole.mutate(r.id); }}
                              className="text-muted-foreground hover:text-destructive"
                              title="Remove role"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${active ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                        <span className={`size-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                        {active ? "Active" : "Deactivated"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={active ? "outline" : "default"}
                        disabled={toggleActive.isPending}
                        onClick={() => {
                          const msg = active ? "Deactivate this account? They will not be able to sign in." : "Reactivate this account?";
                          if (confirm(msg)) toggleActive.mutate({ userId: u.user_id, active: !active });
                        }}
                      >
                        {active ? "Deactivate" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
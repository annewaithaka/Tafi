import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/lib/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { School, Users, Bus, Wallet, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { deleteSchool } from "@/lib/tafi.functions";

export const Route = createFileRoute("/_authenticated/tafi/")({
  component: TafiDashboard,
});

const KES = (n: number) => `KES ${Math.round(n).toLocaleString()}`;

function TafiDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["tafi", "platform-stats"],
    queryFn: async () => {
      const [schools, students, vehicles, drivers, invoices, payments] = await Promise.all([
        supabase.from("schools").select("id, name, created_at").order("name"),
        supabase.from("students").select("id, school_id"),
        supabase.from("vehicles").select("id, school_id"),
        supabase.from("drivers").select("id, school_id"),
        supabase.from("invoices").select("id, school_id, amount_kes, opening_balance_kes"),
        supabase.from("payments").select("id, invoice_id, amount_kes"),
      ]);
      for (const r of [schools, students, vehicles, drivers, invoices, payments]) {
        if (r.error) throw r.error;
      }
      // Map invoice -> school and paid amount
      const invoiceSchool = new Map<string, string>();
      const invoiceDue = new Map<string, number>();
      const schoolInvoiceCount = new Map<string, number>();
      for (const inv of invoices.data ?? []) {
        invoiceSchool.set(inv.id, inv.school_id);
        const due = Number(inv.amount_kes ?? 0) + Number(inv.opening_balance_kes ?? 0);
        invoiceDue.set(inv.id, due);
        schoolInvoiceCount.set(inv.school_id, (schoolInvoiceCount.get(inv.school_id) ?? 0) + 1);
      }
      const schoolPaid = new Map<string, number>();
      const schoolBilled = new Map<string, number>();
      for (const inv of invoices.data ?? []) {
        schoolBilled.set(inv.school_id, (schoolBilled.get(inv.school_id) ?? 0) + (invoiceDue.get(inv.id) ?? 0));
      }
      for (const p of payments.data ?? []) {
        const schoolId = invoiceSchool.get(p.invoice_id ?? "");
        if (!schoolId) continue;
        schoolPaid.set(schoolId, (schoolPaid.get(schoolId) ?? 0) + Number(p.amount_kes ?? 0));
      }
      const countBy = (rows: { school_id: string }[]) => {
        const m = new Map<string, number>();
        for (const r of rows) m.set(r.school_id, (m.get(r.school_id) ?? 0) + 1);
        return m;
      };
      const studentBy = countBy(students.data ?? []);
      const vehicleBy = countBy(vehicles.data ?? []);
      const driverBy = countBy(drivers.data ?? []);

      const rows = (schools.data ?? []).map((s) => {
        const billed = schoolBilled.get(s.id) ?? 0;
        const paid = schoolPaid.get(s.id) ?? 0;
        return {
          id: s.id,
          name: s.name,
          students: studentBy.get(s.id) ?? 0,
          vehicles: vehicleBy.get(s.id) ?? 0,
          drivers: driverBy.get(s.id) ?? 0,
          invoices: schoolInvoiceCount.get(s.id) ?? 0,
          outstanding: Math.max(0, billed - paid),
        };
      }).sort((a, b) => b.outstanding - a.outstanding);

      return {
        totals: {
          schools: schools.data?.length ?? 0,
          students: students.data?.length ?? 0,
          vehicles: vehicles.data?.length ?? 0,
          outstanding: rows.reduce((s, r) => s + r.outstanding, 0),
        },
        rows,
      };
    },
  });

  return (
    <div>
      <PageHeader title="Platform overview" description="Cross-school stats for Tafi super admins." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi icon={<School className="size-4" />} label="Schools" value={data?.totals.schools ?? 0} />
        <Kpi icon={<Users className="size-4" />} label="Students" value={data?.totals.students ?? 0} />
        <Kpi icon={<Bus className="size-4" />} label="Vehicles" value={data?.totals.vehicles ?? 0} />
        <Kpi icon={<Wallet className="size-4" />} label="Outstanding" value={KES(data?.totals.outstanding ?? 0)} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Schools</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-sm text-muted-foreground">Loading…</div>
          ) : (data?.rows.length ?? 0) === 0 ? (
            <div className="p-8 text-sm text-muted-foreground">No schools yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School</TableHead>
                  <TableHead className="text-right">Students</TableHead>
                  <TableHead className="text-right">Vehicles</TableHead>
                  <TableHead className="text-right">Drivers</TableHead>
                  <TableHead className="text-right">Invoices</TableHead>
                  <TableHead className="text-right">Outstanding</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="text-right">{r.students}</TableCell>
                    <TableCell className="text-right">{r.vehicles}</TableCell>
                    <TableCell className="text-right">{r.drivers}</TableCell>
                    <TableCell className="text-right">{r.invoices}</TableCell>
                    <TableCell className={`text-right font-mono ${r.outstanding > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                      {KES(r.outstanding)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DeleteSchoolButton id={r.id} name={r.name} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex-row items-center gap-2 space-y-0">
        <div className="text-muted-foreground">{icon}</div>
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function DeleteSchoolButton({ id, name }: { id: string; name: string }) {
  const qc = useQueryClient();
  const del = useServerFn(deleteSchool);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    setBusy(true);
    try {
      await del({ data: { schoolId: id } });
      toast.success(`Deleted ${name}`);
      setOpen(false);
      setConfirm("");
      await qc.invalidateQueries({ queryKey: ["tafi", "platform-stats"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to delete school");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setConfirm(""); }}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the school and all its students, guardians, routes, vehicles, drivers,
            invoices, payments, terms, and invitations. User accounts remain but lose their access to this school.
            This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <Label htmlFor="confirm-name">Type <span className="font-mono">{name}</span> to confirm</Label>
          <Input
            id="confirm-name"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={name}
            autoComplete="off"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => { e.preventDefault(); onDelete(); }}
            disabled={busy || confirm !== name}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {busy ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Trash2 className="size-4 mr-2" />}
            Delete school
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

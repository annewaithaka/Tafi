import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getMyProfile } from "@/lib/admin-data";
import { PageHeader } from "@/lib/admin-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Receipt, Trash2, RotateCw, Pencil } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/billing")({
  component: BillingPage,
});

function BillingPage() {
  const qc = useQueryClient();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getMyProfile });
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  const schoolId = profile?.school_id;
  if (!schoolId) return null;

  const termsQuery = useQuery({
    queryKey: ["terms", schoolId],
    queryFn: async () => {
      const { data, error } = await supabase.from("terms").select("*").eq("school_id", schoolId).order("starts_on", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const invoicesQuery = useQuery({
    queryKey: ["invoices", schoolId, selectedTerm],
    queryFn: async () => {
      let q = supabase.from("invoices").select("*, students(id, full_name, class)").eq("school_id", schoolId);
      if (selectedTerm) q = q.eq("period_label", selectedTerm);
      const { data, error } = await q.order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const paymentsQuery = useQuery({
    queryKey: ["payments", schoolId],
    queryFn: async () => {
      const { data, error } = await supabase.from("payments").select("*, students(id, full_name)").eq("school_id", schoolId).order("paid_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const payments = paymentsQuery.data ?? [];
  const paidByInvoice = new Map<string, number>();
  for (const p of payments) {
    if (!p.invoice_id) continue;
    paidByInvoice.set(p.invoice_id, (paidByInvoice.get(p.invoice_id) ?? 0) + Number(p.amount_kes));
  }
  const totalOutstanding = (invoicesQuery.data ?? []).reduce(
    (sum, inv) => sum + balance(inv, paidByInvoice.get(inv.id) ?? 0),
    0,
  );

  return (
    <div>
      <PageHeader title="Billing" description="Manage terms, generate invoices, and record payments." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Terms</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{termsQuery.data?.length ?? 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Outstanding (selected term)</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">KES {totalOutstanding.toLocaleString()}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Invoices</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{invoicesQuery.data?.length ?? 0}</div></CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <TermFormDialog schoolId={schoolId} onDone={() => qc.invalidateQueries({ queryKey: ["terms"] })} />
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <Button variant={selectedTerm === null ? "default" : "outline"} onClick={() => setSelectedTerm(null)}>All invoices</Button>
        {termsQuery.data?.map((t) => (
          <Button key={t.id} variant={selectedTerm === t.name ? "default" : "outline"} onClick={() => setSelectedTerm(t.name)}>
            {t.name}
          </Button>
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Amount due = term fee + opening balance − payments recorded.</CardDescription>
          </div>
          {selectedTerm && (
            <GenerateInvoicesButton schoolId={schoolId} termName={selectedTerm} onDone={() => {
              qc.invalidateQueries({ queryKey: ["invoices"] });
              qc.invalidateQueries({ queryKey: ["payments"] });
            }} />
          )}
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Term</TableHead>
                <TableHead className="text-right">Term fee</TableHead>
                <TableHead className="text-right">Opening balance</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="w-40">Status</TableHead>
                <TableHead className="w-24 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoicesQuery.data?.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>
                    <div className="font-medium">{(inv.students as any)?.full_name ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{(inv.students as any)?.class ?? "—"}</div>
                  </TableCell>
                  <TableCell>{inv.period_label}</TableCell>
                  <TableCell className="text-right">KES {Number(inv.amount_kes).toLocaleString()}</TableCell>
                  <TableCell className="text-right">KES {Number(inv.opening_balance_kes).toLocaleString()}</TableCell>
                  <TableCell className="text-right">KES {(paidByInvoice.get(inv.id) ?? 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right font-semibold">KES {balance(inv, paidByInvoice.get(inv.id) ?? 0).toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusStyle(inv.status)}`}>{inv.status}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <RecordPaymentDialog invoice={inv} schoolId={schoolId} onDone={() => { qc.invalidateQueries({ queryKey: ["payments"] }); qc.invalidateQueries({ queryKey: ["invoices"] }); }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {invoicesQuery.data?.length === 0 && (
            <p className="p-8 text-sm text-muted-foreground">No invoices yet. Select a term and generate invoices.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent payments</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentsQuery.data?.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{(p.students as any)?.full_name ?? "—"}</TableCell>
                  <TableCell>{p.period_label ?? "—"}</TableCell>
                  <TableCell>KES {Number(p.amount_kes).toLocaleString()}</TableCell>
                  <TableCell>{p.method}</TableCell>
                  <TableCell>{new Date(p.paid_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <PaymentRowActions
                      payment={p}
                      onDone={() => {
                        qc.invalidateQueries({ queryKey: ["payments"] });
                        qc.invalidateQueries({ queryKey: ["invoices"] });
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {paymentsQuery.data?.length === 0 && <p className="p-8 text-sm text-muted-foreground">No payments recorded yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function balance(inv: any, paid: number) {
  return Math.max(0, Number(inv.amount_kes) + Number(inv.opening_balance_kes) - paid);
}

function statusStyle(status: string) {
  switch (status) {
    case "paid": return "bg-green-100 text-green-700";
    case "overdue": return "bg-red-100 text-red-700";
    case "cancelled": return "bg-gray-100 text-gray-700";
    default: return "bg-amber-100 text-amber-700";
  }
}

function TermFormDialog({ schoolId, onDone }: { schoolId: string; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [startsOn, setStartsOn] = useState("");
  const [endsOn, setEndsOn] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [fee, setFee] = useState("");
  const qc = useQueryClient();
  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("terms").insert({
        school_id: schoolId,
        name,
        starts_on: startsOn,
        ends_on: endsOn,
        due_date: dueDate,
        fee_kes: Number(fee),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Term created");
      qc.invalidateQueries({ queryKey: ["terms"] });
      setOpen(false);
      setName("");
      setStartsOn("");
      setEndsOn("");
      setDueDate("");
      setFee("");
      onDone();
    },
    onError: (e: any) => toast.error(e.message),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="size-4 mr-2" /> New term</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>New term</DialogTitle></DialogHeader>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); create.mutate(); }}>
          <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Term 1 2026" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Starts on</Label><Input type="date" value={startsOn} onChange={(e) => setStartsOn(e.target.value)} required /></div>
            <div className="space-y-2"><Label>Ends on</Label><Input type="date" value={endsOn} onChange={(e) => setEndsOn(e.target.value)} required /></div>
          </div>
          <div className="space-y-2"><Label>Due date</Label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required /></div>
          <div className="space-y-2"><Label>Default fee (KES)</Label><Input type="number" value={fee} onChange={(e) => setFee(e.target.value)} required /></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={create.isPending}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function GenerateInvoicesButton({ schoolId, termName, onDone }: { schoolId: string; termName: string; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [openingBalance, setOpeningBalance] = useState("0");
  const qc = useQueryClient();
  const generate = useMutation({
    mutationFn: async () => {
      const { data: students, error: studentsError } = await supabase.from("students").select("id, term_fee_kes").eq("school_id", schoolId);
      if (studentsError) throw studentsError;
      const { data: existing, error: existingError } = await supabase
        .from("invoices")
        .select("student_id")
        .eq("school_id", schoolId)
        .eq("period_label", termName);
      if (existingError) throw existingError;
      const already = new Set((existing ?? []).map((e: any) => e.student_id));
      const eligible = (students ?? []).filter((s) => !already.has(s.id));
      const rows = eligible.map((s) => ({
        school_id: schoolId,
        student_id: s.id,
        period_label: termName,
        amount_kes: s.term_fee_kes ?? 0,
        opening_balance_kes: Number(openingBalance) || 0,
        due_date: null,
      }));
      if ((students ?? []).length === 0) throw new Error("No students found to invoice");
      if (rows.length === 0) {
        return { created: 0, skipped: already.size };
      }
      const { error } = await supabase.from("invoices").insert(rows);
      if (error) throw error;
      return { created: rows.length, skipped: already.size };
    },
    onSuccess: (res) => {
      const created = res?.created ?? 0;
      const skipped = res?.skipped ?? 0;
      toast.success(`Generated ${created} invoice${created === 1 ? "" : "s"}${skipped ? `, skipped ${skipped} already invoiced` : ""}`);
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["invoices"] });
      onDone();
    },
    onError: (e: any) => toast.error(e.message),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Receipt className="size-4 mr-2" /> Generate invoices for {termName}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Generate invoices for {termName}</DialogTitle></DialogHeader>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); generate.mutate(); }}>
          <div className="space-y-2">
            <Label>Opening balance to add (KES)</Label>
            <Input type="number" value={openingBalance} onChange={(e) => setOpeningBalance(e.target.value)} />
            <p className="text-xs text-muted-foreground">This amount is added on top of each student's term fee. Leave as 0 if none.</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={generate.isPending}><RotateCw className="size-4 mr-2" /> Generate</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RecordPaymentDialog({ invoice, schoolId, onDone }: { invoice: any; schoolId: string; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("mpesa");
  const [paidAt, setPaidAt] = useState(new Date().toISOString().split("T")[0]);
  const qc = useQueryClient();
  const record = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("payments").insert({
        school_id: schoolId,
        student_id: invoice.student_id,
        invoice_id: invoice.id,
        period_label: invoice.period_label,
        amount_kes: Number(amount),
        method,
        paid_at: paidAt,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Payment recorded");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["invoices"] });
      onDone();
    },
    onError: (e: any) => toast.error(e.message),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Pay</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Record payment</DialogTitle></DialogHeader>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); record.mutate(); }}>
          <div className="space-y-2"><Label>Amount (KES)</Label><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required /></div>
          <div className="space-y-2">
            <Label>Method</Label>
            <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="mpesa">M-Pesa</option>
              <option value="bank">Bank transfer</option>
              <option value="cash">Cash</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2"><Label>Paid on</Label><Input type="date" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} required /></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={record.isPending}>Record</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PaymentRowActions({ payment, onDone }: { payment: any; onDone: () => void }) {
  const [editOpen, setEditOpen] = useState(false);
  const [amount, setAmount] = useState(String(payment.amount_kes ?? ""));
  const [method, setMethod] = useState(payment.method ?? "mpesa");
  const [paidAt, setPaidAt] = useState(
    payment.paid_at ? new Date(payment.paid_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
  );
  const [reference, setReference] = useState(payment.reference ?? "");

  const update = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("payments")
        .update({
          amount_kes: Number(amount),
          method,
          paid_at: paidAt,
          reference: reference || null,
        })
        .eq("id", payment.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Payment updated");
      setEditOpen(false);
      onDone();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("payments").delete().eq("id", payment.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Payment deleted");
      onDone();
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="flex justify-end gap-1">
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button size="icon" variant="ghost" title="Edit payment"><Pencil className="size-4" /></Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Edit payment</DialogTitle></DialogHeader>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); update.mutate(); }}>
            <div className="space-y-2"><Label>Amount (KES)</Label><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required /></div>
            <div className="space-y-2">
              <Label>Method</Label>
              <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="mpesa">M-Pesa</option>
                <option value="bank">Bank transfer</option>
                <option value="cash">Cash</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2"><Label>Paid on</Label><Input type="date" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} required /></div>
            <div className="space-y-2"><Label>Reference (optional)</Label><Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="M-Pesa code, receipt no." /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={update.isPending}>Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Button
        size="icon"
        variant="ghost"
        title="Delete payment"
        onClick={() => { if (confirm("Delete this payment? The invoice balance will be recalculated.")) del.mutate(); }}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

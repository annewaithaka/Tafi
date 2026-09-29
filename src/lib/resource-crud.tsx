import { useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AddressPicker } from "@/components/AddressPicker";

export type FieldType = "text" | "email" | "number" | "select" | "textarea" | "json" | "address";

export type FieldDef = {
  key: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  options?: { value: string; label: string }[];
  showInTable?: boolean;
  formatCell?: (row: any) => ReactNode;
  // For type: "address" — extra columns to sync
  latKey?: string;
  lngKey?: string;
  placeIdKey?: string;
};

export function ResourceCrud({
  table,
  title,
  fields,
  schoolId,
  orderBy = "created_at",
  ascending = false,
  additionalDefaults,
}: {
  table: string;
  title: string;
  fields: FieldDef[];
  schoolId: string;
  orderBy?: string;
  ascending?: boolean;
  additionalDefaults?: Record<string, any>;
}) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: [table, schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table as any)
        .select("*")
        .order(orderBy, { ascending });
      if (error) throw error;
      return data ?? [];
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: [table] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const shownFields = fields.filter((f) => f.showInTable !== false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {rows.length} {rows.length === 1 ? "record" : "records"}
          </p>
        </div>
        <Dialog open={creating} onOpenChange={setCreating}>
          <DialogTrigger asChild>
            <Button><Plus className="size-4 mr-2" /> New</Button>
          </DialogTrigger>
          <ResourceForm
            title={`New ${title.slice(0, -1)}`}
            table={table}
            fields={fields}
            schoolId={schoolId}
            additionalDefaults={additionalDefaults}
            onClose={() => setCreating(false)}
          />
        </Dialog>
      </div>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-sm text-muted-foreground">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              No {title.toLowerCase()} yet. Click <span className="font-medium">New</span> to add one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {shownFields.map((f) => (
                    <TableHead key={f.key}>{f.label}</TableHead>
                  ))}
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row: any) => (
                  <TableRow key={row.id}>
                    {shownFields.map((f) => (
                      <TableCell key={f.key}>
                        {f.formatCell ? f.formatCell(row) : String(row[f.key] ?? "—")}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setEditing(row)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            if (confirm("Delete this record?")) del.mutate(row.id);
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        {editing && (
          <ResourceForm
            title={`Edit ${title.slice(0, -1)}`}
            table={table}
            fields={fields}
            schoolId={schoolId}
            initial={editing}
            additionalDefaults={additionalDefaults}
            onClose={() => setEditing(null)}
          />
        )}
      </Dialog>
    </div>
  );
}

function ResourceForm({
  title,
  table,
  fields,
  schoolId,
  initial,
  additionalDefaults,
  onClose,
}: {
  title: string;
  table: string;
  fields: FieldDef[];
  schoolId: string;
  initial?: any;
  additionalDefaults?: Record<string, any>;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, any>>(() => {
    const v: Record<string, any> = {};
    for (const f of fields) {
      if (f.type === "json" && initial?.[f.key] != null) {
        v[f.key] = JSON.stringify(initial[f.key], null, 2);
      } else {
        v[f.key] = initial?.[f.key] ?? "";
      }
      if (f.type === "address") {
        if (f.latKey) v[f.latKey] = initial?.[f.latKey] ?? "";
        if (f.lngKey) v[f.lngKey] = initial?.[f.lngKey] ?? "";
        if (f.placeIdKey) v[f.placeIdKey] = initial?.[f.placeIdKey] ?? "";
      }
    }
    return v;
  });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const payload: Record<string, any> = { ...additionalDefaults };
      for (const f of fields) {
        if (f.readOnly) continue;
        let v = values[f.key];
        if (v === "") v = null;
        if (f.type === "number" && v != null) v = Number(v);
        if (f.type === "json" && v != null) {
          try {
            v = JSON.parse(v);
          } catch {
            throw new Error(`${f.label} must be valid JSON`);
          }
        }
        payload[f.key] = v;
        if (f.type === "address") {
          if (f.latKey) payload[f.latKey] = values[f.latKey] === "" || values[f.latKey] == null ? null : Number(values[f.latKey]);
          if (f.lngKey) payload[f.lngKey] = values[f.lngKey] === "" || values[f.lngKey] == null ? null : Number(values[f.lngKey]);
          if (f.placeIdKey) payload[f.placeIdKey] = values[f.placeIdKey] || null;
        }
      }
      if (initial?.id) {
        const { error } = await supabase.from(table as any).update(payload).eq("id", initial.id);
        if (error) throw error;
      } else {
        payload.school_id = schoolId;
        const { error } = await supabase.from(table as any).insert(payload);
        if (error) throw error;
      }
      toast.success(initial ? "Updated" : "Created");
      qc.invalidateQueries({ queryKey: [table] });
      onClose();
    } catch (err: any) {
      toast.error(err.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        {fields.map((f) => (
          <div key={f.key} className="space-y-2">
            {f.type !== "address" && <Label htmlFor={f.key}>{f.label}{f.required && " *"}</Label>}
            {f.readOnly ? (
              <Input
                id={f.key}
                value={values[f.key] ?? ""}
                readOnly
                className="bg-muted"
              />
            ) : f.type === "address" ? (
              <AddressPicker
                label={f.label}
                value={{
                  address: values[f.key] ?? "",
                  lat: values[f.latKey ?? ""] === "" || values[f.latKey ?? ""] == null ? null : Number(values[f.latKey ?? ""]),
                  lng: values[f.lngKey ?? ""] === "" || values[f.lngKey ?? ""] == null ? null : Number(values[f.lngKey ?? ""]),
                  place_id: values[f.placeIdKey ?? ""] ?? null,
                }}
                onChange={(v) => setValues((prev) => ({
                  ...prev,
                  [f.key]: v.address,
                  ...(f.latKey ? { [f.latKey]: v.lat ?? "" } : {}),
                  ...(f.lngKey ? { [f.lngKey]: v.lng ?? "" } : {}),
                  ...(f.placeIdKey ? { [f.placeIdKey]: v.place_id ?? "" } : {}),
                }))}
              />
            ) : f.type === "select" ? (
              <select
                id={f.key}
                required={f.required}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">— select —</option>
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : f.type === "textarea" || f.type === "json" ? (
              <textarea
                id={f.key}
                required={f.required}
                value={values[f.key] ?? ""}
                placeholder={f.placeholder}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                className="w-full min-h-20 rounded-md border border-input bg-background p-3 text-sm font-mono"
              />
            ) : (
              <Input
                id={f.key}
                type={f.type ?? "text"}
                required={f.required}
                value={values[f.key] ?? ""}
                placeholder={f.placeholder}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              />
            )}
          </div>
        ))}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export function useLookup(table: string, labelField = "name") {
  const { data = [] } = useQuery({
    queryKey: [table, "lookup"],
    queryFn: async () => {
      const { data, error } = await supabase.from(table as any).select(`id, ${labelField}`);
      if (error) throw error;
      return data ?? [];
    },
  });
  return (data as any[]).map((r) => ({ value: r.id as string, label: (r as any)[labelField] ?? "—" }));
}
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserSquare2, Route as RouteIcon, Bus, IdCard, Receipt } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function useCount(table: string) {
  return useQuery({
    queryKey: [table, "count"],
    queryFn: async () => {
      const { count, error } = await supabase.from(table as any).select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });
}

function Dashboard() {
  const students = useCount("students");
  const guardians = useCount("guardians");
  const routes = useCount("routes");
  const vehicles = useCount("vehicles");
  const drivers = useCount("drivers");
  const invoices = useCount("invoices");

  const outstanding = useQuery({
    queryKey: ["invoices", "outstanding"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("amount_kes, status");
      if (error) throw error;
      return (data ?? [])
        .filter((r: any) => r.status !== "paid")
        .reduce((acc: number, r: any) => acc + Number(r.amount_kes), 0);
    },
  });

  const stats = [
    { label: "Students", value: students.data, icon: Users, to: "/admin/students" },
    { label: "Guardians", value: guardians.data, icon: UserSquare2, to: "/admin/guardians" },
    { label: "Routes", value: routes.data, icon: RouteIcon, to: "/admin/routes" },
    { label: "Vehicles", value: vehicles.data, icon: Bus, to: "/admin/vehicles" },
    { label: "Drivers", value: drivers.data, icon: IdCard, to: "/admin/drivers" },
    { label: "Invoices", value: invoices.data, icon: Receipt, to: "/admin/billing" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-1">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-6">A snapshot of your transport operations.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
                <div className="text-3xl font-bold mt-1">{s.value ?? "—"}</div>
              </div>
              <div className="size-12 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
                <s.icon className="size-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Outstanding balance</div>
          <div className="text-3xl font-bold mt-1">
            KES {(outstanding.data ?? 0).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Sum of all invoices not yet marked paid.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
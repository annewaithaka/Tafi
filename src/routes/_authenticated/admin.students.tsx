import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ResourceCrud, useLookup } from "@/lib/resource-crud";
import { getMyProfile } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/students")({
  component: StudentsPage,
});

function StudentsPage() {
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getMyProfile });
  const guardians = useLookup("guardians", "full_name");
  const routes = useLookup("routes", "name");
  const qc = useQueryClient();
  const regen = useMutation({
    mutationFn: async (id: string) => {
      // Clear qr_code so the trigger reassigns based on current full_name
      const { error: e1 } = await supabase.from("students").update({ qr_code: null } as any).eq("id", id);
      if (e1) throw e1;
      const { error: e2 } = await supabase.from("students").update({ updated_at: new Date().toISOString() } as any).eq("id", id);
      if (e2) throw e2;
    },
    onSuccess: () => { toast.success("QR regenerated"); qc.invalidateQueries({ queryKey: ["students"] }); },
    onError: (e: any) => toast.error(e.message),
  });
  if (!profile?.school_id) return null;
  return (
    <ResourceCrud
      table="students"
      title="Students"
      schoolId={profile.school_id}
      orderBy="full_name"
      fields={[
        { key: "full_name", label: "Full name", required: true },
        { key: "class", label: "Class" },
        { key: "guardian_id", label: "Guardian", type: "select", options: guardians },
        { key: "route_id", label: "Route", type: "select", options: routes },
        {
          key: "qr_code",
          label: "QR code",
          formatCell: (r) => (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs">{r.qr_code ?? "—"}</span>
              <Button
                size="icon"
                variant="ghost"
                className="size-6"
                title="Regenerate from initials"
                onClick={(e) => { e.stopPropagation(); regen.mutate(r.id); }}
              >
                <RefreshCw className="size-3" />
              </Button>
            </div>
          ),
        },
        {
          key: "home_address",
          label: "Home pickup address",
          type: "address",
          latKey: "home_lat",
          lngKey: "home_lng",
          placeIdKey: "home_place_id",
          showInTable: false,
        },
        {
          key: "term_fee_kes",
          label: "Term fee (KES)",
          type: "number",
          formatCell: (r) => `KES ${Number(r.term_fee_kes).toLocaleString()}`,
        },
      ]}
    />
  );
}
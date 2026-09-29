import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ResourceCrud } from "@/lib/resource-crud";
import { getMyProfile } from "@/lib/admin-data";

export const Route = createFileRoute("/_authenticated/admin/guardians")({
  component: GuardiansPage,
});

function GuardiansPage() {
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getMyProfile });
  if (!profile?.school_id) return null;
  return (
    <ResourceCrud
      table="guardians"
      title="Guardians"
      schoolId={profile.school_id}
      fields={[
        { key: "full_name", label: "Full name", required: true },
        { key: "phone", label: "Phone", placeholder: "+254…" },
        { key: "whatsapp", label: "WhatsApp" },
        { key: "email", label: "Email", type: "email" },
      ]}
    />
  );
}
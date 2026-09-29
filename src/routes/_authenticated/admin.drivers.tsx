import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ResourceCrud, useLookup } from "@/lib/resource-crud";
import { getMyProfile } from "@/lib/admin-data";

export const Route = createFileRoute("/_authenticated/admin/drivers")({
  component: DriversPage,
});

function DriversPage() {
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getMyProfile });
  const vehicles = useLookup("vehicles", "plate");
  if (!profile?.school_id) return null;
  return (
    <ResourceCrud
      table="drivers"
      title="Drivers"
      schoolId={profile.school_id}
      fields={[
        { key: "full_name", label: "Full name", required: true },
        { key: "phone", label: "Phone" },
        { key: "license_no", label: "License #" },
        { key: "vehicle_id", label: "Assigned vehicle", type: "select", options: vehicles },
      ]}
    />
  );
}
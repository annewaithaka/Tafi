import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ResourceCrud, useLookup } from "@/lib/resource-crud";
import { getMyProfile } from "@/lib/admin-data";

export const Route = createFileRoute("/_authenticated/admin/vehicles")({
  component: VehiclesPage,
});

function VehiclesPage() {
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getMyProfile });
  const routes = useLookup("routes", "name");
  if (!profile?.school_id) return null;
  return (
    <ResourceCrud
      table="vehicles"
      title="Vehicles"
      schoolId={profile.school_id}
      fields={[
        { key: "plate", label: "Plate", required: true },
        { key: "capacity", label: "Capacity", type: "number" },
        { key: "route_id", label: "Assigned route", type: "select", options: routes },
      ]}
    />
  );
}
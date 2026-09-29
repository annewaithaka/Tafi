import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ResourceCrud } from "@/lib/resource-crud";
import { getMyProfile } from "@/lib/admin-data";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPinned, ExternalLink } from "lucide-react";
import { loadGoogleMaps } from "@/components/AddressPicker";

export const Route = createFileRoute("/_authenticated/admin/routes")({
  component: RoutesPage,
});

function RoutesPage() {
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getMyProfile });
  const [viewing, setViewing] = useState<any | null>(null);
  if (!profile?.school_id) return null;
  return (
    <>
    <ResourceCrud
      table="routes"
      title="Routes"
      schoolId={profile.school_id}
      orderBy="name"
      fields={[
        { key: "name", label: "Name", required: true, placeholder: "e.g. Karen — Ngong Road" },
        { key: "description", label: "Description", type: "textarea", showInTable: false },
        {
          key: "id",
          label: "Pickups",
          formatCell: (r) => (
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setViewing(r); }}>
              <MapPinned className="size-4 mr-2" /> View pickups
            </Button>
          ),
        },
      ]}
    />
    <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
      {viewing && (
        <PickupsDialog route={viewing} school={(profile as any).schools} onClose={() => setViewing(null)} />
      )}
    </Dialog>
    </>
  );
}

function PickupsDialog({ route, school, onClose }: { route: any; school: any; onClose: () => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { data: students = [], isLoading } = useQuery({
    queryKey: ["route-students", route.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select("id, full_name, home_address, home_lat, home_lng")
        .eq("route_id", route.id)
        .order("full_name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const withCoords = (students as any[]).filter((s) => s.home_lat != null && s.home_lng != null);
  const missing = (students as any[]).filter((s) => s.home_lat == null || s.home_lng == null);

  // Simple nearest-neighbour order from school
  const origin = school?.address_lat != null && school?.address_lng != null
    ? { lat: Number(school.address_lat), lng: Number(school.address_lng) }
    : null;

  const ordered = orderNearest(withCoords, origin);

  useEffect(() => {
    let cancelled = false;
    if (!mapRef.current || ordered.length === 0 && !origin) return;
    loadGoogleMaps().then((google) => {
      if (cancelled || !mapRef.current) return;
      const map = new google.maps.Map(mapRef.current, {
        center: origin ?? { lat: Number(ordered[0].home_lat), lng: Number(ordered[0].home_lng) },
        zoom: 12,
        disableDefaultUI: true,
        zoomControl: true,
      });
      const bounds = new google.maps.LatLngBounds();
      if (origin) {
        new google.maps.Marker({
          position: origin, map, label: "S",
          title: school?.name ?? "School",
        });
        bounds.extend(origin);
      }
      ordered.forEach((s: any, i: number) => {
        const pos = { lat: Number(s.home_lat), lng: Number(s.home_lng) };
        new google.maps.Marker({
          position: pos, map, label: String(i + 1), title: s.full_name,
        });
        bounds.extend(pos);
      });
      if (!bounds.isEmpty()) map.fitBounds(bounds, 60);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [route.id, ordered.length]);

  const directionsUrl = origin && ordered.length > 0
    ? `https://www.google.com/maps/dir/${origin.lat},${origin.lng}/` +
      ordered.map((s: any) => `${s.home_lat},${s.home_lng}`).join("/")
    : null;

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <MapPinned className="size-5" /> {route.name} — pickup points
        </DialogTitle>
      </DialogHeader>
      <div className="grid md:grid-cols-[1fr_260px] gap-4">
        <div ref={mapRef} className="w-full h-80 rounded-md border bg-muted" />
        <div className="space-y-2 max-h-80 overflow-auto pr-1">
          {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!isLoading && students.length === 0 && (
            <p className="text-sm text-muted-foreground">No students assigned to this route yet.</p>
          )}
          {origin && (
            <div className="text-xs p-2 rounded bg-muted">
              <span className="font-semibold">S</span> · {school?.name ?? "School"}
            </div>
          )}
          {ordered.map((s: any, i: number) => (
            <div key={s.id} className="text-xs p-2 rounded border">
              <div className="font-semibold">{i + 1}. {s.full_name}</div>
              <div className="text-muted-foreground truncate">{s.home_address ?? "—"}</div>
            </div>
          ))}
          {missing.map((s: any) => (
            <div key={s.id} className="text-xs p-2 rounded border border-dashed">
              <div className="font-semibold">{s.full_name}</div>
              <Badge variant="secondary" className="mt-1">Missing coordinates</Badge>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Order is nearest-neighbour from the school. Set pickup coordinates on each student.
        </p>
        <div className="flex gap-2">
          {directionsUrl && (
            <a href={directionsUrl} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm"><ExternalLink className="size-4 mr-2" /> Open in Google Maps</Button>
            </a>
          )}
          <Button size="sm" onClick={onClose}>Close</Button>
        </div>
      </div>
    </DialogContent>
  );
}

function orderNearest(items: any[], origin: { lat: number; lng: number } | null) {
  if (items.length === 0) return [];
  const remaining = items.slice();
  const result: any[] = [];
  let cur = origin ?? { lat: Number(remaining[0].home_lat), lng: Number(remaining[0].home_lng) };
  while (remaining.length) {
    let bestIdx = 0;
    let bestD = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const dx = Number(remaining[i].home_lat) - cur.lat;
      const dy = Number(remaining[i].home_lng) - cur.lng;
      const d = dx * dx + dy * dy;
      if (d < bestD) { bestD = d; bestIdx = i; }
    }
    const next = remaining.splice(bestIdx, 1)[0];
    result.push(next);
    cur = { lat: Number(next.home_lat), lng: Number(next.home_lng) };
  }
  return result;
}
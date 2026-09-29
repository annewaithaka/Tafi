import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, LocateFixed } from "lucide-react";

export type AddressValue = {
  address: string;
  lat: number | null;
  lng: number | null;
  place_id: string | null;
};

const BROWSER_KEY = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as string | undefined;
const CHANNEL = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID as string | undefined;

let mapsLoader: Promise<any> | null = null;
function loadGoogleMaps(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if ((window as any).google?.maps) return Promise.resolve((window as any).google);
  if (mapsLoader) return mapsLoader;
  if (!BROWSER_KEY) return Promise.reject(new Error("Google Maps browser key missing"));
  mapsLoader = new Promise<any>((resolve, reject) => {
    (window as any).__initTafiMaps = () => resolve((window as any).google);
    const s = document.createElement("script");
    const channel = CHANNEL ? `&channel=${encodeURIComponent(CHANNEL)}` : "";
    s.src = `https://maps.googleapis.com/maps/api/js?key=${BROWSER_KEY}&loading=async&libraries=places&callback=__initTafiMaps${channel}`;
    s.async = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
    // Ensure Places Autocomplete dropdown appears above shadcn Dialog overlays
    if (!document.getElementById("tafi-pac-style")) {
      const style = document.createElement("style");
      style.id = "tafi-pac-style";
      style.textContent = ".pac-container{z-index:10000 !important;}";
      document.head.appendChild(style);
    }
  });
  return mapsLoader;
}

export { loadGoogleMaps };

export function AddressPicker({
  value,
  onChange,
  label = "Address",
  placeholder = "Search a place or drag the pin",
}: {
  value: AddressValue;
  onChange: (v: AddressValue) => void;
  label?: string;
  placeholder?: string;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState(value.address ?? "");
  const [latText, setLatText] = useState(value.lat != null ? String(value.lat) : "");
  const [lngText, setLngText] = useState(value.lng != null ? String(value.lng) : "");

  useEffect(() => { setText(value.address ?? ""); }, [value.address]);
  useEffect(() => { setLatText(value.lat != null ? String(value.lat) : ""); }, [value.lat]);
  useEffect(() => { setLngText(value.lng != null ? String(value.lng) : ""); }, [value.lng]);

  function setPin(lat: number, lng: number, opts?: { recenter?: boolean; address?: string; place_id?: string | null }) {
    if (mapInstance.current && markerInstance.current) {
      markerInstance.current.setPosition({ lat, lng });
      markerInstance.current.setMap(mapInstance.current);
      if (opts?.recenter !== false) {
        mapInstance.current.setCenter({ lat, lng });
        if (mapInstance.current.getZoom() < 14) mapInstance.current.setZoom(15);
      }
    }
    onChange({
      address: opts?.address ?? value.address ?? `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      lat,
      lng,
      place_id: opts?.place_id ?? value.place_id ?? null,
    });
  }

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then((google) => {
        if (cancelled || !mapRef.current) return;
        const center = value.lat != null && value.lng != null
          ? { lat: Number(value.lat), lng: Number(value.lng) }
          : { lat: -1.286389, lng: 36.817223 }; // Nairobi default
        mapInstance.current = new google.maps.Map(mapRef.current, {
          center,
          zoom: value.lat != null ? 15 : 11,
          disableDefaultUI: true,
          zoomControl: true,
        });
        markerInstance.current = new google.maps.Marker({
          position: center,
          map: mapInstance.current,
          draggable: true,
        });
        if (value.lat == null) markerInstance.current.setMap(null);

        markerInstance.current.addListener("dragend", () => {
          const p = markerInstance.current.getPosition();
          const lat = p.lat();
          const lng = p.lng();
          onChange({ ...value, lat, lng, address: value.address || `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
        });

        // Click map to place pin
        mapInstance.current.addListener("click", (e: any) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          setPin(lat, lng, { recenter: false });
        });

        // Autocomplete
        if (searchRef.current && (google.maps as any).places?.Autocomplete) {
          const ac = new (google.maps as any).places.Autocomplete(searchRef.current, {
            fields: ["place_id", "formatted_address", "geometry", "name"],
          });
          ac.addListener("place_changed", () => {
            const place = ac.getPlace();
            if (!place.geometry?.location) return;
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const address = place.formatted_address ?? place.name ?? "";
            const place_id = place.place_id ?? null;
            mapInstance.current.setCenter({ lat, lng });
            mapInstance.current.setZoom(16);
            markerInstance.current.setPosition({ lat, lng });
            markerInstance.current.setMap(mapInstance.current);
            setText(address);
            onChange({ address, lat, lng, place_id });
          });
        }
        setReady(true);
      })
      .catch((e) => setError(e.message ?? "Map failed to load"));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function commitLatLng(latStr: string, lngStr: string) {
    const lat = Number(latStr);
    const lng = Number(lngStr);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return;
    setPin(lat, lng);
  }

  function useMyLocation() {
    if (!navigator.geolocation) { setError("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => setPin(pos.coords.latitude, pos.coords.longitude),
      (err) => setError(err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        ref={searchRef}
        value={text}
        placeholder={placeholder}
        onChange={(e) => {
          setText(e.target.value);
          onChange({ ...value, address: e.target.value });
        }}
      />
      <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
        <div>
          <Label className="text-xs text-muted-foreground">Latitude</Label>
          <Input
            inputMode="decimal"
            value={latText}
            placeholder="-1.286389"
            onChange={(e) => setLatText(e.target.value)}
            onBlur={() => commitLatLng(latText, lngText)}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Longitude</Label>
          <Input
            inputMode="decimal"
            value={lngText}
            placeholder="36.817223"
            onChange={(e) => setLngText(e.target.value)}
            onBlur={() => commitLatLng(latText, lngText)}
          />
        </div>
        <Button type="button" variant="outline" size="sm" onClick={useMyLocation} title="Use my location">
          <LocateFixed className="size-4" />
        </Button>
      </div>
      <div ref={mapRef} className="w-full h-56 rounded-md border bg-muted" />
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <MapPin className="size-3" /> Click the map, drag the pin, or type coordinates.
      </p>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {!ready && !error && <p className="text-xs text-muted-foreground">Loading map…</p>}
      {value.lat != null && value.lng != null && (
        <p className="text-xs text-muted-foreground font-mono">
          {Number(value.lat).toFixed(6)}, {Number(value.lng).toFixed(6)}
        </p>
      )}
    </div>
  );
}

export function MapPreview({ lat, lng, height = 140 }: { lat: number | null; lng: number | null; height?: number }) {
  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (lat == null || lng == null) return;
    let cancelled = false;
    loadGoogleMaps().then((google) => {
      if (cancelled || !mapRef.current) return;
      const pos = { lat: Number(lat), lng: Number(lng) };
      const map = new google.maps.Map(mapRef.current, {
        center: pos, zoom: 15, disableDefaultUI: true,
      });
      new google.maps.Marker({ position: pos, map });
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [lat, lng]);
  if (lat == null || lng == null) return null;
  return <div ref={mapRef} style={{ height }} className="w-full rounded-md border bg-muted" />;
}
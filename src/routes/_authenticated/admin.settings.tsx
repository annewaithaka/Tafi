import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getMyProfile } from "@/lib/admin-data";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AddressPicker } from "@/components/AddressPicker";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["profile"], queryFn: getMyProfile });
  const school = (data as any)?.schools;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [addressLat, setAddressLat] = useState("");
  const [addressLng, setAddressLng] = useState("");
  const [addressPlaceId, setAddressPlaceId] = useState("");

  useEffect(() => {
    if (school) {
      setName(school.name ?? "");
      setEmail(school.contact_email ?? "");
      setPhone(school.phone ?? "");
      setAddress(school.address ?? "");
      setAddressLat(school.address_lat ?? "");
      setAddressLng(school.address_lng ?? "");
      setAddressPlaceId(school.address_place_id ?? "");
    }
  }, [school]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("schools")
        .update({
          name,
          contact_email: email || null,
          phone: phone || null,
          address: address || null,
          address_lat: addressLat ? Number(addressLat) : null,
          address_lng: addressLng ? Number(addressLng) : null,
          address_place_id: addressPlaceId || null,
        })
        .eq("id", school.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>School details</CardTitle>
          <CardDescription>Update your school address and location coordinates. These are used for route planning and tracking.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
            <div className="space-y-2">
              <Label>School name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Contact email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <AddressPicker
              label="School address"
              value={{
                address,
                lat: addressLat === "" ? null : Number(addressLat),
                lng: addressLng === "" ? null : Number(addressLng),
                place_id: addressPlaceId || null,
              }}
              onChange={(v) => {
                setAddress(v.address);
                setAddressLat(v.lat == null ? "" : String(v.lat));
                setAddressLng(v.lng == null ? "" : String(v.lng));
                setAddressPlaceId(v.place_id ?? "");
              }}
            />
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
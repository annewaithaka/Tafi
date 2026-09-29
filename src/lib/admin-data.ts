import { supabase } from "@/integrations/supabase/client";

export async function getMyProfile() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone, school_id, schools(id, name, contact_email, phone, address, address_lat, address_lng, address_place_id)")
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function onboardSchool(input: { name: string; email?: string; phone?: string }) {
  const { data, error } = await supabase.rpc("onboard_school_admin", {
    p_school_name: input.name,
    p_contact_email: input.email || undefined,
    p_phone: input.phone || undefined,
  });
  if (error) throw error;
  return data as string;
}

export async function acceptInvitation(input: { token: string }) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Not signed in");
  const { data, error } = await supabase.rpc("accept_invitation", { p_token: input.token, p_user_id: user.id });
  if (error) throw error;
  return data as string | null;
}

export async function claimFirstSuperAdmin() {
  const { data, error } = await supabase.rpc("claim_first_super_admin");
  if (error) throw error;
  return data as boolean;
}

export async function getMyRoles() {
  const { data, error } = await supabase.from("user_roles").select("role, school_id");
  if (error) throw error;
  return data ?? [];
}

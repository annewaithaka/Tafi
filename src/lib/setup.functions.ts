import { createServerFn } from "@tanstack/react-start";

export const bootstrapTafi = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string; email: string; password: string; fullName: string }) => input)
  .handler(async ({ data }) => {
    const expected = process.env.TAFI_SETUP_TOKEN;
    if (!expected || data.token !== expected) {
      throw new Error("Invalid setup token");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing } = await supabaseAdmin.from("user_roles").select("id").eq("role", "super_admin").limit(1);
    if (existing && existing.length > 0) {
      throw new Error("A super admin already exists. Use the invitation system.");
    }
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName },
    });
    if (authError || !authData.user) throw authError ?? new Error("Failed to create user");
    await supabaseAdmin.from("profiles").insert({ id: authData.user.id, full_name: data.fullName });
    await supabaseAdmin.from("user_roles").insert({ user_id: authData.user.id, role: "super_admin" });
    return { ok: true };
  });

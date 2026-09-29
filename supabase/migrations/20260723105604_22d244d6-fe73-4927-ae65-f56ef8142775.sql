
-- fix set_updated_at search_path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- restrict SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.current_school_id() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_school_id() TO authenticated;

-- Replace overly-permissive INSERT policy on schools: only allow when the user has no school yet.
DROP POLICY IF EXISTS "Any authenticated can create a school (self-onboard)" ON public.schools;
CREATE POLICY "Users without a school can create one" ON public.schools
  FOR INSERT TO authenticated
  WITH CHECK (public.current_school_id() IS NULL);


CREATE OR REPLACE FUNCTION public.onboard_school_admin(
  p_school_name TEXT,
  p_contact_email TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user UUID := auth.uid();
  v_school UUID;
  v_existing UUID;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  SELECT school_id INTO v_existing FROM public.profiles WHERE id = v_user;
  IF v_existing IS NOT NULL THEN RAISE EXCEPTION 'already onboarded'; END IF;

  INSERT INTO public.schools (name, contact_email, phone)
  VALUES (p_school_name, p_contact_email, p_phone)
  RETURNING id INTO v_school;

  UPDATE public.profiles SET school_id = v_school WHERE id = v_user;

  INSERT INTO public.user_roles (user_id, role, school_id)
  VALUES (v_user, 'school_admin', v_school);

  RETURN v_school;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.onboard_school_admin(TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.onboard_school_admin(TEXT, TEXT, TEXT) TO authenticated;

-- 1. Invitations table (Tafi staff invite schools / operators)
CREATE TABLE public.school_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  school_id uuid REFERENCES public.schools(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'school_admin',
  token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days'),
  used_at timestamp with time zone,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.school_invitations TO authenticated;
GRANT ALL ON public.school_invitations TO service_role;

ALTER TABLE public.school_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins manage invitations"
ON public.school_invitations
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- 2. Terms table (Kenyan 3-month terms, payable in first month)
CREATE TABLE public.terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  starts_on date NOT NULL,
  ends_on date NOT NULL,
  due_date date NOT NULL,
  fee_kes numeric NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.terms TO authenticated;
GRANT ALL ON public.terms TO service_role;

ALTER TABLE public.terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School admins manage terms"
ON public.terms
FOR ALL
TO authenticated
USING (school_id = public.current_school_id() AND public.has_role(auth.uid(), 'school_admin'))
WITH CHECK (school_id = public.current_school_id() AND public.has_role(auth.uid(), 'school_admin'));

-- 3. Scan events for QR wristband pickup/dropoff
CREATE TABLE public.scan_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  driver_id uuid REFERENCES public.drivers(id) ON DELETE SET NULL,
  event_type text NOT NULL CHECK (event_type IN ('pickup', 'dropoff')),
  scanned_at timestamp with time zone NOT NULL DEFAULT now(),
  lat numeric,
  lng numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.scan_events TO authenticated;
GRANT ALL ON public.scan_events TO service_role;

ALTER TABLE public.scan_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School admins view scan events"
ON public.scan_events
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = scan_events.student_id
    AND s.school_id = public.current_school_id()
    AND public.has_role(auth.uid(), 'school_admin')
  )
);

-- 4. Google Maps location columns
ALTER TABLE public.schools
  ADD COLUMN IF NOT EXISTS address_lat numeric,
  ADD COLUMN IF NOT EXISTS address_lng numeric,
  ADD COLUMN IF NOT EXISTS address_place_id text;

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS home_lat numeric,
  ADD COLUMN IF NOT EXISTS home_lng numeric,
  ADD COLUMN IF NOT EXISTS home_place_id text;

-- 5. QR wristband (rename RFID -> QR, unique per school, auto-generate)
ALTER TABLE public.students RENAME COLUMN rfid_tag TO qr_code;

ALTER TABLE public.students
  ADD CONSTRAINT students_qr_code_school_unique UNIQUE (school_id, qr_code);

ALTER TABLE public.routes
  ADD COLUMN IF NOT EXISTS pickup_points jsonb DEFAULT '[]'::jsonb;

-- 6. Term billing rename + opening balance
ALTER TABLE public.students RENAME COLUMN monthly_fee_kes TO term_fee_kes;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS opening_balance_kes numeric NOT NULL DEFAULT 0;

-- 7. Functions
CREATE OR REPLACE FUNCTION public.claim_first_super_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'super_admin') THEN
    RETURN false;
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'super_admin');
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.accept_invitation(p_token text, p_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite public.school_invitations%ROWTYPE;
  v_school_id uuid;
BEGIN
  SELECT * INTO v_invite FROM public.school_invitations
  WHERE token = p_token AND used_at IS NULL AND expires_at > now();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'invalid or expired invitation';
  END IF;

  IF v_invite.school_id IS NULL THEN
    INSERT INTO public.schools (name, contact_email)
    VALUES ('New school', v_invite.email)
    RETURNING id INTO v_school_id;
  ELSE
    v_school_id := v_invite.school_id;
  END IF;

  UPDATE public.profiles SET school_id = v_school_id WHERE id = p_user_id;

  INSERT INTO public.user_roles (user_id, role, school_id)
  VALUES (p_user_id, v_invite.role, v_school_id);

  UPDATE public.school_invitations SET used_at = now() WHERE id = v_invite.id;

  RETURN v_school_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_student_qr_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.qr_code IS NULL OR NEW.qr_code = '' THEN
    NEW.qr_code := 'TAFI-' ||
      COALESCE(UPPER(LEFT((SELECT s.name FROM public.schools s WHERE s.id = NEW.school_id), 3)), 'SCH') ||
      '-' ||
      UPPER(LEFT(REPLACE(gen_random_uuid()::text, '-', ''), 6));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_student_qr_code
BEFORE INSERT ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.generate_student_qr_code();

-- Backfill existing students with QR codes
UPDATE public.students s
SET qr_code = 'TAFI-' || COALESCE(UPPER(LEFT(sch.name, 3)), 'SCH') || '-' || UPPER(LEFT(REPLACE(gen_random_uuid()::text, '-', ''), 6))
FROM public.schools sch
WHERE s.school_id = sch.id AND (s.qr_code IS NULL OR s.qr_code = '');

-- Updated set_updated_at trigger for terms and invitations
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER update_terms_updated_at
BEFORE UPDATE ON public.terms
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_school_invitations_updated_at
BEFORE UPDATE ON public.school_invitations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Revoke execution of sensitive functions from PUBLIC (keep authenticated)
REVOKE EXECUTE ON FUNCTION public.claim_first_super_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_first_super_admin() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.accept_invitation(text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.accept_invitation(text, uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_student_qr_code() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.generate_student_qr_code() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.onboard_school_admin(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.onboard_school_admin(text, text, text) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.current_school_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_school_id() TO authenticated;

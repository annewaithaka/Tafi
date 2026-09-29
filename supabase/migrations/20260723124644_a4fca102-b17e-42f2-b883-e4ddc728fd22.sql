CREATE OR REPLACE FUNCTION public.generate_student_qr_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_initials text;
  v_parts text[];
  v_part text;
  v_count int := 0;
BEGIN
  IF NEW.qr_code IS NULL OR NEW.qr_code = '' THEN
    v_initials := '';
    IF NEW.full_name IS NOT NULL AND length(trim(NEW.full_name)) > 0 THEN
      v_parts := regexp_split_to_array(trim(NEW.full_name), '\s+');
      FOREACH v_part IN ARRAY v_parts LOOP
        EXIT WHEN v_count >= 3;
        IF length(v_part) > 0 THEN
          v_initials := v_initials || upper(left(v_part, 1));
          v_count := v_count + 1;
        END IF;
      END LOOP;
    END IF;
    IF v_initials = '' THEN v_initials := 'STU'; END IF;
    NEW.qr_code := 'TAFI-' || v_initials || '-' ||
      UPPER(LEFT(REPLACE(gen_random_uuid()::text, '-', ''), 6));
  END IF;
  RETURN NEW;
END;
$function$;
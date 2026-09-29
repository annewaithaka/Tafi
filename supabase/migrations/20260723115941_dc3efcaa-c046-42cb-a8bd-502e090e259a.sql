
CREATE UNIQUE INDEX IF NOT EXISTS invoices_school_student_term_uidx
  ON public.invoices (school_id, student_id, period_label);

CREATE OR REPLACE FUNCTION public.recompute_invoice_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invoice_id uuid := COALESCE(NEW.invoice_id, OLD.invoice_id);
  v_total_due numeric;
  v_total_paid numeric;
BEGIN
  IF v_invoice_id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  SELECT COALESCE(amount_kes,0) + COALESCE(opening_balance_kes,0)
    INTO v_total_due
    FROM public.invoices WHERE id = v_invoice_id;

  SELECT COALESCE(SUM(amount_kes),0)
    INTO v_total_paid
    FROM public.payments WHERE invoice_id = v_invoice_id;

  UPDATE public.invoices
     SET status = CASE
       WHEN v_total_due > 0 AND v_total_paid >= v_total_due THEN 'paid'::invoice_status
       WHEN v_total_paid > 0 THEN 'partial'::invoice_status
       ELSE 'pending'::invoice_status
     END,
     updated_at = now()
   WHERE id = v_invoice_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS payments_recompute_invoice_status ON public.payments;
CREATE TRIGGER payments_recompute_invoice_status
AFTER INSERT OR UPDATE OR DELETE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.recompute_invoice_status();

UPDATE public.invoices i
SET status = CASE
  WHEN COALESCE(i.amount_kes,0) + COALESCE(i.opening_balance_kes,0) > 0
    AND COALESCE((SELECT SUM(amount_kes) FROM public.payments WHERE invoice_id = i.id),0)
        >= COALESCE(i.amount_kes,0) + COALESCE(i.opening_balance_kes,0)
    THEN 'paid'::invoice_status
  WHEN COALESCE((SELECT SUM(amount_kes) FROM public.payments WHERE invoice_id = i.id),0) > 0
    THEN 'partial'::invoice_status
  ELSE i.status
END;

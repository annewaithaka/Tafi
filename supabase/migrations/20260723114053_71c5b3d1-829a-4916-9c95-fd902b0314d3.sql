ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS student_id uuid REFERENCES public.students(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS period_label text;

COMMENT ON COLUMN public.payments.student_id IS 'The student whose invoice this payment covers';
COMMENT ON COLUMN public.payments.period_label IS 'The term/period label this payment is for';

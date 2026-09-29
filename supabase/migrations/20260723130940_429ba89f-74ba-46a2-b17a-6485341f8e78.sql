UPDATE public.profiles SET school_id = NULL
WHERE id IN (SELECT user_id FROM public.user_roles WHERE role = 'super_admin');
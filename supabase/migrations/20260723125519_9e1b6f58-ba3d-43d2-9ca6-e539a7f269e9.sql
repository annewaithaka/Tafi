-- Super admin read policies (dashboard needs cross-school visibility)
CREATE POLICY "Super admins read all schools" ON public.schools FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins read all students" ON public.students FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins read all vehicles" ON public.vehicles FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins read all drivers" ON public.drivers FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins read all invoices" ON public.invoices FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins read all payments" ON public.payments FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins read all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins read all user_roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

-- Super admins can manage user_roles (assign / revoke)
CREATE POLICY "Super admins insert user_roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins update user_roles" ON public.user_roles FOR UPDATE USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins delete user_roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'super_admin'));
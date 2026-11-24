GRANT SELECT, UPDATE ON public.orders TO authenticated;
DROP POLICY IF EXISTS "admins read orders" ON public.orders;
CREATE POLICY "admins read orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "admins update orders" ON public.orders;
CREATE POLICY "admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "admins read payment proofs" ON storage.objects;
CREATE POLICY "admins read payment proofs" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'payment-proofs' AND public.has_role(auth.uid(), 'admin'));
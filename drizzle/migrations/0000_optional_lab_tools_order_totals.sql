ALTER TABLE public.orders ADD COLUMN lab_tools_total numeric(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.orders ADD CONSTRAINT orders_lab_tools_nonnegative CHECK (lab_tools_total >= 0);
ALTER TABLE public.orders DROP CONSTRAINT orders_total_matches;
ALTER TABLE public.orders ADD CONSTRAINT orders_total_matches CHECK (total IS NULL OR total = subtotal + shipping + lab_tools_total);
COMMENT ON COLUMN public.orders.lab_tools_total IS 'Server-priced optional research lab-tools charge, excluded from merchandise subtotal for shipping eligibility.';
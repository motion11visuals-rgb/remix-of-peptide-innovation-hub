ALTER TABLE public.orders ADD COLUMN processing_fee numeric(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.orders ADD CONSTRAINT orders_processing_fee_nonnegative CHECK (processing_fee >= 0);
ALTER TABLE public.orders DROP CONSTRAINT orders_total_matches;
ALTER TABLE public.orders ADD CONSTRAINT orders_total_matches CHECK (total IS NULL OR total = subtotal + shipping + lab_tools_total + processing_fee);
COMMENT ON COLUMN public.orders.processing_fee IS 'Server-calculated per-order processing fee, excluded from merchandise subtotal for shipping eligibility.';
COMMENT ON COLUMN public.orders.lab_tools_total IS 'DEPRECATED: retained for historical orders only; new orders no longer offer lab tools.';
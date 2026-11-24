import { Truck } from "lucide-react";
import { WAREHOUSE_SHIPPING_LABEL } from "@/lib/china-warehouse";

export function WarehousePromo() {
  return (
    <div className="rounded-lg border border-primary bg-accent px-6 py-5 text-center">
      <p className="flex items-center justify-center gap-2 font-classic text-lg font-semibold text-primary">
        <Truck className="size-5" /> FREE SHIPPING on orders over $280
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        China warehouse orders under $280 ship for $35 · Normal shipping {WAREHOUSE_SHIPPING_LABEL}
      </p>
    </div>
  );
}

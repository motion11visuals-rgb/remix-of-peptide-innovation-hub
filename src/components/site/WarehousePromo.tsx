import { Truck } from "lucide-react";
import { WAREHOUSE_SHIPPING_LABEL } from "@/lib/china-warehouse";
import { SaleCountdown } from "@/components/site/SaleCountdown";

export function WarehousePromo() {
  return (
    <div className="overflow-hidden rounded-lg border border-primary">
      <SaleCountdown headline="35% OFF all China warehouse kits" sub="Discount applied automatically at checkout · No code needed" />
      <p className="flex items-center justify-center gap-2 bg-accent px-6 py-3 text-center text-sm text-muted-foreground">
        <Truck className="size-4 text-primary" /> $35 shipping on China warehouse orders · Normal shipping {WAREHOUSE_SHIPPING_LABEL}
      </p>
    </div>
  );
}

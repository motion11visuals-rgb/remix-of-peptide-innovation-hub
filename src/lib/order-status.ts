export const ORDER_STATUSES = ["pending_review", "approved"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending_review: "Pending review",
  approved: "Review successful",
};

export function parseOrderStatusInput(input: unknown): { id: string; status: OrderStatus } {
  const v = (input ?? {}) as { id?: unknown; status?: unknown };
  if (typeof v.id !== "string" || !/^[0-9a-f-]{36}$/i.test(v.id)) throw new Error("Invalid order id");
  if (typeof v.status !== "string" || !(ORDER_STATUSES as readonly string[]).includes(v.status)) throw new Error("Invalid status");
  return { id: v.id, status: v.status as OrderStatus };
}

export function statusLabel(status: string): string {
  return (ORDER_STATUS_LABEL as Record<string, string>)[status] ?? status;
}

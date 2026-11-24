import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ middleware: vi.fn(), auth: {}, rpc: vi.fn(), from: vi.fn() }));
vi.mock("./order-auth", () => ({ requireOrderAuth: mocks.auth, ordersDatabaseMismatch: () => false, ORDERS_DATABASE_MISMATCH: "mismatch" }));
vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => {
    const builder = {
      middleware: (values: unknown[]) => { mocks.middleware(values); return builder; },
      inputValidator: () => builder,
      handler: (handler: unknown) => handler,
    };
    return builder;
  },
}));
import { listOrders, setOrderStatus } from "./admin.functions";

describe("owner order authorization", () => {
  beforeEach(() => { mocks.rpc.mockReset(); mocks.from.mockReset(); });
  const context = { supabase: { rpc: mocks.rpc, from: mocks.from }, userId: "verified-owner" };

  it("uses the same verified-session middleware for listing and approval", () => {
    expect(mocks.middleware).toHaveBeenCalledTimes(2);
    expect(mocks.middleware).toHaveBeenNthCalledWith(1, [mocks.auth]);
    expect(mocks.middleware).toHaveBeenNthCalledWith(2, [mocks.auth]);
  });
  it("does not read orders for a signed-in non-owner", async () => {
    mocks.rpc.mockResolvedValue({ data: false });
    const handler = listOrders as unknown as (args: { context: typeof context }) => Promise<unknown>;
    expect(await handler({ context })).toEqual({ ok: false, error: null, orders: [] });
    expect(mocks.rpc).toHaveBeenCalledWith("has_role", { _user_id: "verified-owner", _role: "admin" });
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("does not approve orders for a signed-in non-owner", async () => {
    mocks.rpc.mockResolvedValue({ data: false });
    const handler = setOrderStatus as unknown as (args: { context: typeof context; data: { id: string; status: string } }) => Promise<unknown>;
    await expect(handler({ context, data: { id: "order-id", status: "approved" } })).rejects.toThrow("Not allowed");
    expect(mocks.from).not.toHaveBeenCalled();
  });
});
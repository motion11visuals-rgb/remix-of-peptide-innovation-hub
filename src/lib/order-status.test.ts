import { describe, expect, it } from "vitest";
import { parseOrderStatusInput, statusLabel } from "./order-status";

const id = "11111111-2222-3333-4444-555555555555";
describe("order review status", () => {
  it("accepts approving an order", () => {
    expect(parseOrderStatusInput({ id, status: "approved" })).toEqual({ id, status: "approved" });
  });
  it("accepts moving an order back to pending review", () => {
    expect(parseOrderStatusInput({ id, status: "pending_review" }).status).toBe("pending_review");
  });
  it("rejects unknown statuses", () => {
    expect(() => parseOrderStatusInput({ id, status: "shipped" })).toThrow();
  });
  it("rejects a bad order id", () => {
    expect(() => parseOrderStatusInput({ id: "x", status: "approved" })).toThrow();
  });
  it("shows approved orders as review successful", () => {
    expect(statusLabel("approved")).toBe("Review successful");
  });
});

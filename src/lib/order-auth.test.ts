import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(), createClient: vi.fn(), request: vi.fn(),
}));
vi.mock("@tanstack/react-start", () => ({ createMiddleware: () => ({ server: (handler: unknown) => handler }) }));
vi.mock("@tanstack/react-start/server", () => ({ getRequest: mocks.request }));
vi.mock("@supabase/supabase-js", () => ({ createClient: mocks.createClient }));
import { orderAuthConfig, requireOrderAuth } from "./order-auth";

describe("order sign-in verification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createClient.mockReturnValue({ auth: { getUser: mocks.getUser } });
    mocks.request.mockReturnValue(new Request("https://store.example/admin/orders", { headers: { Authorization: "Bearer signed-owner-token" } }));
    mocks.getUser.mockResolvedValue({ data: { user: { id: "verified-owner" } }, error: null });
  });

  it("uses the browser connection when Vercel's server connection differs", () => {
    expect(orderAuthConfig("https://browser.example", "browser-key", "https://other.example", "other-key"))
      .toEqual({ url: "https://browser.example", key: "browser-key" });
  });
  it("uses the internal preview connection only when the keys match", () => {
    expect(orderAuthConfig("https://preview.example", "same-key", "https://internal.example", "same-key"))
      .toEqual({ url: "https://internal.example", key: "same-key" });
  });
  it("never combines a partial browser configuration with a different server key", () => {
    expect(orderAuthConfig("https://browser.example", undefined, "https://server.example", "server-key"))
      .toEqual({ url: "https://server.example", key: "server-key" });
    expect(() => orderAuthConfig(undefined, undefined, undefined, undefined)).toThrow("not configured");
  });
  it("verifies the bearer with the auth service before granting request context", async () => {
    const next = vi.fn();
    // Runtime middleware handler is exposed by the test double above.
    const handler = requireOrderAuth as unknown as (args: { next: typeof next }) => Promise<unknown>;
    await handler({ next });
    expect(mocks.getUser).toHaveBeenCalledWith("signed-owner-token");
    expect(next).toHaveBeenCalledWith({ context: { supabase: expect.any(Object), userId: "verified-owner" } });
  });
  it("rejects invalid tokens without trusting an unverified identity", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: { message: "Invalid JWT" } });
    const next = vi.fn();
    const handler = requireOrderAuth as unknown as (args: { next: typeof next }) => Promise<unknown>;
    await expect(handler({ next })).rejects.toThrow("could not be verified");
    expect(next).not.toHaveBeenCalled();
  });
  it("rejects missing bearer tokens before any database or auth call", async () => {
    mocks.request.mockReturnValue(new Request("https://store.example/admin/orders"));
    const next = vi.fn();
    const handler = requireOrderAuth as unknown as (args: { next: typeof next }) => Promise<unknown>;
    await expect(handler({ next })).rejects.toThrow("sign-in has expired");
    expect(mocks.createClient).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
import { ordersDatabaseMismatch } from "./order-auth";
describe("orders database mismatch", () => {
  it("flags sign-in on one project while orders save to another", () => {
    expect(ordersDatabaseMismatch("https://aaa.supabase.co", "sb_publishable_a", "https://bbb.supabase.co", "sb_publishable_b")).toBe(true);
  });
  it("flags it when the server key is not set", () => {
    expect(ordersDatabaseMismatch("https://aaa.supabase.co", "sb_publishable_a", "https://bbb.supabase.co", undefined)).toBe(true);
  });
  it("accepts the same project", () => {
    expect(ordersDatabaseMismatch("https://aaa.supabase.co", "k1", "https://aaa.supabase.co", "k2")).toBe(false);
  });
  it("accepts an internal server address with the same key", () => {
    expect(ordersDatabaseMismatch("https://aaa.supabase.co", "k", "http://internal:54321", "k")).toBe(false);
  });
});

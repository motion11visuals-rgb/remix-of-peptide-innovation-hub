import { describe, expect, it } from "vitest";
import { isGateValid, validateGate } from "./research-gate";

describe("research visitor gate", () => {
  it("accepts when both boxes are checked", () => {
    expect(validateGate({ isAdult: true, researchOnly: true })).toEqual({});
  });

  it("requires both 21+ and research-use-only confirmations", () => {
    expect(validateGate({ isAdult: false, researchOnly: true }).isAdult).toBeDefined();
    expect(validateGate({ isAdult: true, researchOnly: false }).researchOnly).toBeDefined();
  });

  it("asks again after 30 days", () => {
    const day = 24 * 60 * 60 * 1000;
    expect(isGateValid({ acceptedAt: 0 }, 29 * day)).toBe(true);
    expect(isGateValid({ acceptedAt: 0 }, 31 * day)).toBe(false);
  });
});

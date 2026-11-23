import { describe, expect, it } from "vitest";
import { isGateValid, validateGate, type GateInput } from "./research-gate";

const valid: GateInput = {
  affiliation: "university",
  otherDetail: "",
  organization: "MIT Koch Institute",
  isAdult: true,
  researchOnly: true,
};

describe("research visitor gate", () => {
  it("accepts a complete answer", () => {
    expect(validateGate(valid)).toEqual({});
  });

  it("requires an affiliation to be chosen", () => {
    expect(validateGate({ ...valid, affiliation: "" }).affiliation).toBeDefined();
  });

  it("requires a description when 'Other' is chosen", () => {
    expect(
      validateGate({ ...valid, affiliation: "other", otherDetail: "" }).otherDetail,
    ).toBeDefined();
    expect(
      validateGate({ ...valid, affiliation: "other", otherDetail: "Veterinary school" }),
    ).toEqual({});
  });

  it("requires the institution name", () => {
    expect(validateGate({ ...valid, organization: " " }).organization).toBeDefined();
  });

  it("requires both 21+ and research-use-only confirmations", () => {
    expect(validateGate({ ...valid, isAdult: false }).isAdult).toBeDefined();
    expect(validateGate({ ...valid, researchOnly: false }).researchOnly).toBeDefined();
  });

  it("asks again after 30 days", () => {
    const day = 24 * 60 * 60 * 1000;
    const record = { affiliation: "pharma" as const, organization: "Acme Bio", acceptedAt: 0 };
    expect(isGateValid(record, 29 * day)).toBe(true);
    expect(isGateValid(record, 31 * day)).toBe(false);
  });
});

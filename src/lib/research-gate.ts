export type GateInput = {
  isAdult: boolean;
  researchOnly: boolean;
};

export type GateRecord = {
  acceptedAt: number;
};

export type GateErrors = Partial<Record<keyof GateInput, string>>;

export const GATE_STORAGE_KEY = "aurum-research-gate";
/** Visitors are asked again after this many days. */
export const GATE_VALID_DAYS = 30;

export function validateGate(input: GateInput): GateErrors {
  const errors: GateErrors = {};
  if (!input.isAdult) errors.isAdult = "You must confirm you are 21 or older.";
  if (!input.researchOnly) errors.researchOnly = "You must confirm research-use-only purchasing.";
  return errors;
}

export function isGateValid(record: GateRecord | null, now: number): boolean {
  if (!record) return false;
  return now - record.acceptedAt < GATE_VALID_DAYS * 24 * 60 * 60 * 1000;
}

export function parseGateRecord(raw: string | null): GateRecord | null {
  if (!raw) return null;
  try {
    const d: unknown = JSON.parse(raw);
    if (typeof d === "object" && d !== null && typeof (d as GateRecord).acceptedAt === "number") {
      return { acceptedAt: (d as GateRecord).acceptedAt };
    }
  } catch {
    // ignore malformed storage
  }
  return null;
}

export function readGateRecord(): GateRecord | null {
  if (typeof window === "undefined") return null;
  return parseGateRecord(window.localStorage.getItem(GATE_STORAGE_KEY));
}

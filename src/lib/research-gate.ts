export const AFFILIATIONS = [
  { value: "university", label: "University / Academic lab" },
  { value: "pharma", label: "Pharmaceutical / Biotech company" },
  { value: "cro", label: "Contract research organization (CRO)" },
  { value: "independent", label: "Independent / private research lab" },
  { value: "government", label: "Government / Public research institute" },
  { value: "other", label: "Other" },
] as const;

export type AffiliationValue = (typeof AFFILIATIONS)[number]["value"];

export type GateInput = {
  affiliation: AffiliationValue | "";
  otherDetail: string;
  organization: string;
  isAdult: boolean;
  researchOnly: boolean;
};

export type GateRecord = {
  affiliation: AffiliationValue;
  otherDetail?: string;
  organization: string;
  acceptedAt: number;
};

export type GateErrors = Partial<Record<keyof GateInput, string>>;

export const GATE_STORAGE_KEY = "aurum-research-gate";
/** Visitors are asked again after this many days. */
export const GATE_VALID_DAYS = 30;

export function validateGate(input: GateInput): GateErrors {
  const errors: GateErrors = {};
  if (!input.affiliation) errors.affiliation = "Select your affiliation.";
  if (input.affiliation === "other" && input.otherDetail.trim().length < 2)
    errors.otherDetail = "Tell us what type of organization you're with.";
  if (input.organization.trim().length < 2)
    errors.organization = "Enter your institution, lab or company name.";
  if (!input.isAdult) errors.isAdult = "You must confirm you are 21 or older.";
  if (!input.researchOnly) errors.researchOnly = "You must agree to research-use-only terms.";
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
    if (
      typeof d === "object" &&
      d !== null &&
      "affiliation" in d &&
      "organization" in d &&
      "acceptedAt" in d &&
      AFFILIATIONS.some((a) => a.value === (d as GateRecord).affiliation) &&
      typeof (d as GateRecord).organization === "string" &&
      typeof (d as GateRecord).acceptedAt === "number"
    ) {
      return d as GateRecord;
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

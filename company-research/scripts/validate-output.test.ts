import { describe, test, expect } from "bun:test";
import { validateEnvelope } from "./validate-output";

const validStep2 = {
  step: "step-2",
  status: "APPROVED",
  data: { industry: "Retail", subindustry: "E-commerce", services_offered: ["Online sales"] },
  sources: [{ url: "https://example.com", title: "Example", tier: 1, accessed: "2026-05-22" }],
  confidence: "high",
};

describe("validateEnvelope", () => {
  test("accepts a well-formed step-2 envelope", () => {
    const result = validateEnvelope(validStep2);
    expect(result.ok).toBe(true);
  });

  test("rejects envelope with unknown step id", () => {
    const bad = { ...validStep2, step: "step-99" };
    const result = validateEnvelope(bad);
    expect(result.ok).toBe(false);
    expect(result.errors.join(" ")).toMatch(/step/);
  });

  test("rejects envelope missing required data field", () => {
    const bad = { ...validStep2, data: { subindustry: "E-commerce" } };
    const result = validateEnvelope(bad);
    expect(result.ok).toBe(false);
    expect(result.errors.join(" ")).toMatch(/industry|required/);
  });

  test("rejects envelope with invalid status", () => {
    const bad = { ...validStep2, status: "MAYBE" };
    const result = validateEnvelope(bad);
    expect(result.ok).toBe(false);
  });

  test("rejects envelope with non-uri source URL", () => {
    const bad = { ...validStep2, sources: [{ url: "not-a-url", title: "x", tier: 1, accessed: "2026-05-22" }] };
    const result = validateEnvelope(bad);
    expect(result.ok).toBe(false);
  });

  test("rejects envelope with out-of-range source tier", () => {
    const bad = { ...validStep2, sources: [{ url: "https://example.com", title: "x", tier: 5, accessed: "2026-05-22" }] };
    const result = validateEnvelope(bad);
    expect(result.ok).toBe(false);
  });
});

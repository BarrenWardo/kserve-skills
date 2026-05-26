import { describe, test, expect } from "bun:test";
import { formatReport, type Envelope } from "./format-report";

const minimalEnvelopes: Envelope[] = [
  {
    step: "step-2",
    status: "APPROVED",
    data: { industry: "Retail", subindustry: "E-commerce", services_offered: ["Online sales"] },
    sources: [{ url: "https://example.com", title: "Example", tier: 1, accessed: "2026-05-22" }],
    confidence: "high",
  },
];

const minimalTemplate = `# {{company}}\n\n## Line of Business\n{{step-2.industry}} — {{step-2.subindustry}}\n`;

describe("formatReport", () => {
  test("substitutes {{company}} and step fields", () => {
    const out = formatReport({ company: "Acme Corp", envelopes: minimalEnvelopes, template: minimalTemplate });
    expect(out).toContain("# Acme Corp");
    expect(out).toContain("Retail — E-commerce");
  });

  test("renders DATA QUALITY footer with no-gap defaults", () => {
    const out = formatReport({ company: "Acme", envelopes: minimalEnvelopes, template: `{{data_quality_footer}}` });
    expect(out).toContain("**Data gaps:** None");
    expect(out).toContain("**Security events:** None");
    expect(out).toContain("**Overall confidence:**");
  });

  test("renders RETRY_EXHAUSTED steps and security events into DATA QUALITY footer", () => {
    const withGap: Envelope[] = [...minimalEnvelopes, { step: "step-3", status: "RETRY_EXHAUSTED", data: {}, sources: [], confidence: "low", notes: "no public turnover data" }];
    const out = formatReport({ company: "Acme", envelopes: withGap, template: `{{data_quality_footer}}`, securityEvents: ["INJECTION_FLAGGED: step-2 — Glassdoor"] });
    expect(out).toMatch(/step-3/);
    expect(out).toMatch(/RETRY_EXHAUSTED/);
    expect(out).toMatch(/INJECTION_FLAGGED/);
  });
});

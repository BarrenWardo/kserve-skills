import { describe, test, expect } from "bun:test";
import { scoreICP, type ICPInputs } from "./score-icp";

// Fixtures align with monolith Step 10B discrete-band table (SKILL.md lines 607–657).
// Monolith dimensions: industry_match, revenue_band, headcount_band, pain_point_evidence,
// review_quality, growth_signal, dm_access, job_postings, social_presence, data_confidence.

const highFit: ICPInputs = {
  industry_match: "exact",
  revenue_band: "50-500",
  headcount_band: "50-2000",
  pain_point_evidence: "high-fit",
  review_quality: "1-4",
  growth_signal: "active",
  dm_access: "accessible",
  job_postings: "active",
  social_presence: "active",
  data_confidence: "high",
};

const lowFit: ICPInputs = {
  industry_match: "none",
  revenue_band: "lt-10",
  headcount_band: "gt-5000",
  pain_point_evidence: "none",
  review_quality: "7-10",
  growth_signal: "contraction",
  dm_access: "none",
  job_postings: "not-run",
  social_presence: "inactive",
  data_confidence: "low",
};

describe("scoreICP", () => {
  test("high-fit inputs produce a Tier 1 score (>=75)", () => {
    const r = scoreICP(highFit);
    expect(r.score).toBeGreaterThanOrEqual(75);
    expect(r.tier).toBe("A");
  });

  test("low-fit inputs produce a Deprioritize score (<25)", () => {
    const r = scoreICP(lowFit);
    expect(r.score).toBeLessThan(25);
    expect(r.tier).toBe("D");
  });

  test("breakdown sums to score", () => {
    const r = scoreICP(highFit);
    const sum = Object.values(r.breakdown).reduce((a, b) => a + b, 0);
    expect(sum).toBe(r.score);
  });

  test("max attainable score is exactly 100", () => {
    const r = scoreICP(highFit);
    expect(r.score).toBe(100);
    expect(r.score).toBeLessThanOrEqual(100);
    expect(r.score).toBeGreaterThanOrEqual(0);
  });

  test("degraded growth signal reduces the score", () => {
    const base = scoreICP({ ...highFit, growth_signal: "active" });
    const degraded = scoreICP({ ...highFit, growth_signal: "contraction" });
    expect(degraded.score).toBeLessThan(base.score);
  });
});

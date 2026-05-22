// Step 10B ICP scorer. Formula extracted verbatim from monolith SKILL.md lines 607–657.
// Total points 100; ten discrete-band dimensions; tier thresholds 75/50/25.

export type IndustryMatch = "exact" | "adjacent" | "none";
export type RevenueBand = "50-500" | "10-50" | "500-2000" | "lt-10" | "gt-5000" | "not-disclosed";
export type HeadcountBand = "50-2000" | "lt-50" | "2000-5000" | "gt-5000" | "unknown";
export type PainPointEvidence = "high-fit" | "medium-fit" | "none";
export type ReviewQuality = "1-4" | "5-6" | "7-10" | "na";
export type GrowthSignal = "active" | "stable" | "contraction";
export type DMAccess = "accessible" | "none";
export type JobPostings = "active" | "none" | "not-run";
export type SocialPresence = "active" | "inactive";
export type DataConfidence = "high" | "mixed" | "low";

export type ICPTier = "Tier 1" | "Tier 2" | "Tier 3" | "Deprioritize";

export interface ICPInputs {
  industry_match: IndustryMatch;          // Step 2
  revenue_band: RevenueBand;              // Step 3
  headcount_band: HeadcountBand;          // Steps 3, 7, 7B
  pain_point_evidence: PainPointEvidence; // Step 10
  review_quality: ReviewQuality;          // Step 9
  growth_signal: GrowthSignal;            // Steps 14, 6
  dm_access: DMAccess;                    // Step 6
  job_postings: JobPostings;              // Step 7B
  social_presence: SocialPresence;        // Step 12
  data_confidence: DataConfidence;        // Steps 2–9 tally
}

export interface ICPResult {
  score: number;
  tier: ICPTier;
  breakdown: Record<string, number>;
}

const INDUSTRY: Record<IndustryMatch, number> = { "exact": 15, "adjacent": 8, "none": 0 };
const REVENUE: Record<RevenueBand, number> = {
  "50-500": 10, "10-50": 6, "500-2000": 6, "lt-10": 2, "gt-5000": 2, "not-disclosed": 4,
};
const HEADCOUNT: Record<HeadcountBand, number> = {
  "50-2000": 10, "lt-50": 5, "2000-5000": 5, "gt-5000": 2, "unknown": 2,
};
const PAIN: Record<PainPointEvidence, number> = { "high-fit": 15, "medium-fit": 8, "none": 0 };
const REVIEW: Record<ReviewQuality, number> = { "1-4": 10, "5-6": 7, "7-10": 3, "na": 4 };
const GROWTH: Record<GrowthSignal, number> = { "active": 10, "stable": 5, "contraction": 2 };
const DM: Record<DMAccess, number> = { "accessible": 10, "none": 3 };
const JOBS: Record<JobPostings, number> = { "active": 10, "none": 5, "not-run": 3 };
const SOCIAL: Record<SocialPresence, number> = { "active": 5, "inactive": 0 };
const DATACONF: Record<DataConfidence, number> = { "high": 5, "mixed": 3, "low": 0 };

export function scoreICP(i: ICPInputs): ICPResult {
  const breakdown: Record<string, number> = {
    industry_match: INDUSTRY[i.industry_match],
    revenue_band: REVENUE[i.revenue_band],
    headcount_band: HEADCOUNT[i.headcount_band],
    pain_point_evidence: PAIN[i.pain_point_evidence],
    review_quality: REVIEW[i.review_quality],
    growth_signal: GROWTH[i.growth_signal],
    dm_access: DM[i.dm_access],
    job_postings: JOBS[i.job_postings],
    social_presence: SOCIAL[i.social_presence],
    data_confidence: DATACONF[i.data_confidence],
  };
  const score = Object.values(breakdown).reduce((a, b) => a + b, 0);
  return { score, tier: tierOf(score), breakdown };
}

function tierOf(score: number): ICPTier {
  if (score >= 75) return "Tier 1";
  if (score >= 50) return "Tier 2";
  if (score >= 25) return "Tier 3";
  return "Deprioritize";
}

if (import.meta.main) {
  const path = process.argv[2];
  if (!path) {
    console.error("usage: bun run scripts/score-icp.ts <inputs.json>");
    process.exit(2);
  }
  const inputs = JSON.parse(await Bun.file(path).text()) as ICPInputs;
  const out = scoreICP(inputs);
  console.log(JSON.stringify(out, null, 2));
}

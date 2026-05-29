export type Envelope = {
  step: string;
  status: "APPROVED" | "RETRY_EXHAUSTED";
  data: Record<string, unknown>;
  sources: Array<{ url: string; title: string; tier: 1 | 2 | 3; accessed: string }>;
  confidence: "high" | "medium" | "low";
  notes?: string;
};

export interface FormatInput {
  company: string;
  envelopes: Envelope[];
  template: string;
  securityEvents?: string[];
}

export function formatReport({ company, envelopes, template, securityEvents }: FormatInput): string {
  let out = template.replaceAll("{{company}}", company);

  // Substitute {{step-N.field}} placeholders
  out = out.replace(/\{\{(step-[0-9a-z]+)\.([a-zA-Z0-9_]+)\}\}/g, (_match, stepId, field) => {
    const env = envelopes.find((e) => e.step === stepId);
    if (!env) return `[missing: ${stepId}]`;
    const v = (env.data as Record<string, unknown>)[field];
    if (v === undefined || v === null) return `[missing: ${stepId}.${field}]`;
    return Array.isArray(v) ? (v.length > 0 && typeof v[0] === "object" ? JSON.stringify(v) : v.join(", ")) : String(v);
  });

  // DATA QUALITY footer
  if (out.includes("{{data_quality_footer}}")) {
    const lines: string[] = [];
    const gaps = envelopes.filter((e) => e.status === "RETRY_EXHAUSTED");
    if (gaps.length > 0) {
      lines.push("**Data gaps:**");
      gaps.forEach((g) => lines.push(`- ${g.step}: RETRY_EXHAUSTED${g.notes ? ` — ${g.notes}` : ""}`));
    } else {
      lines.push("**Data gaps:** None");
    }
    const sec = securityEvents ?? [];
    if (sec.length > 0) {
      lines.push("**Security events:**");
      sec.forEach((e) => lines.push(`- ${e}`));
    } else {
      lines.push("**Security events:** None");
    }
    lines.push("**Per-step confidence:**");
    const stepOrder = ["step-2","step-3","step-4","step-5","step-6","step-7","step-7b","step-7c","step-8","step-9","step-10","step-10b","step-11","step-12","step-13","step-14","step-15","step-16","step-17"];
    const stepLabels: Record<string, string> = {
      "step-2": "Line of Business", "step-3": "Turnover", "step-4": "Head Office", "step-5": "Years in Existence",
      "step-6": "Directors", "step-7": "Branches", "step-7b": "Job Postings", "step-7c": "Tech Stack",
      "step-8": "Reviews", "step-9": "Overall Rating", "step-10": "KServe Fit", "step-10b": "ICP Score",
      "step-11": "Customer Care", "step-12": "Social Media", "step-13": "Tracxn", "step-14": "M&A/Legal",
      "step-15": "BD Briefing", "step-16": "Outsourcing", "step-17": "Competitors"
    };
    for (const id of stepOrder) {
      const env = envelopes.find((e) => e.step === id);
      if (!env) continue;
      const label = stepLabels[id] ?? id;
      const conf = env.confidence.toUpperCase();
      const status = env.status === "RETRY_EXHAUSTED" ? " ⚠️" : "";
      lines.push(`  \`${id}\` ${label}: ${conf}${status}`);
    }
    const tally: Record<string, number> = {};
    envelopes.forEach((e) => { tally[e.confidence] = (tally[e.confidence] || 0) + 1; });
    const total = envelopes.length;
    const tallyStr = Object.entries(tally)
      .sort((a, b) => b[1] - a[1])
      .map(([level, count]) => `${count}/${total} ${level.toUpperCase()}`)
      .join(" · `");
    lines.push(`**Confidence tally:** ${tallyStr}`);
    const allDates = envelopes.flatMap((e) => e.sources.map((s) => s.accessed)).filter(Boolean).sort();
    lines.push(`**Oldest source:** ${allDates.length > 0 ? allDates[0] : "N/A"}`);
    out = out.replaceAll("{{data_quality_footer}}", lines.join("\n"));
  }
  return out;
}

if (import.meta.main) {
  const [companyArg, envelopesPath, templatePath] = process.argv.slice(2);
  if (!companyArg || !envelopesPath || !templatePath) {
    console.error("usage: bun run scripts/format-report.ts <company> <envelopes.json> <template.md>");
    process.exit(2);
  }
  const envelopes = JSON.parse(await Bun.file(envelopesPath).text()) as Envelope[];
  const template = await Bun.file(templatePath).text();
  console.log(formatReport({ company: companyArg, envelopes, template }));
}

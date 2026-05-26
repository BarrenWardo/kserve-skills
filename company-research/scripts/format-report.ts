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
}

export function formatReport({ company, envelopes, template }: FormatInput): string {
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
  const gaps = envelopes.filter((e) => e.status === "RETRY_EXHAUSTED");
  if (out.includes("{{data_quality_footer}}")) {
    const footer = gaps.length === 0
      ? ""
      : "## DATA QUALITY\n\n" + gaps.map((g) => `- ${g.step}: RETRY_EXHAUSTED${g.notes ? ` — ${g.notes}` : ""}`).join("\n");
    out = out.replaceAll("{{data_quality_footer}}", footer);
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

import Ajv, { type ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import registry from "../output-schemas.json" assert { type: "json" };

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const envelopeSchema = {
  ...registry.definitions.Envelope,
  definitions: registry.definitions,
};
const validateEnvelopeBase = ajv.compile(envelopeSchema as object);

const dataValidators: Record<string, ReturnType<typeof ajv.compile>> = {};
for (const [stepKey, schema] of Object.entries(registry.schemas)) {
  dataValidators[stepKey] = ajv.compile(schema as object);
}

export type ValidationResult = { ok: true } | { ok: false; errors: string[] };

export function validateEnvelope(envelope: unknown): ValidationResult {
  if (!validateEnvelopeBase(envelope)) {
    return { ok: false, errors: formatErrors(validateEnvelopeBase.errors) };
  }
  const env = envelope as { step: string; data: unknown };
  const dataValidator = dataValidators[env.step];
  if (!dataValidator) {
    return { ok: false, errors: [`no data schema registered for ${env.step}`] };
  }
  if (!dataValidator(env.data)) {
    return { ok: false, errors: formatErrors(dataValidator.errors) };
  }
  return { ok: true };
}

function formatErrors(errors: ErrorObject[] | null | undefined): string[] {
  if (!errors) return [];
  return errors.map((e) => `${e.instancePath || "(root)"} ${e.message ?? ""}`.trim());
}

// CLI: bun run scripts/validate-output.ts <envelope.json>
if (import.meta.main) {
  const path = process.argv[2];
  if (!path) {
    console.error("usage: bun run scripts/validate-output.ts <envelope.json>");
    process.exit(2);
  }
  const env = JSON.parse(await Bun.file(path).text());
  const result = validateEnvelope(env);
  if (result.ok) {
    console.log(`OK: ${env.step}`);
    process.exit(0);
  }
  console.error(`FAIL: ${env.step ?? "(unknown step)"}`);
  for (const err of result.errors) console.error("  -", err);
  process.exit(1);
}

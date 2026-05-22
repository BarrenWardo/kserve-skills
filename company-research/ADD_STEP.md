# Adding a New Step to company-research

This skill is structured as a tree (parent SKILL.md + 3 wave coordinators + step files + reference files + scripts). Adding a new step requires updates in several places. Follow this checklist exactly. The CI lint scripts will block a merge if any step is skipped.

## Authoritative checklist

1. **Create** `wave<N>/step<X>-<slug>/SKILL.md` from the canonical step-file template (below).
2. **Add** schema entry for the new step under `schemas.step-<x>` in `output-schemas.json`. Use the existing entries as shape references.
3. **Add** the step's node + edges in `dependencies.yaml` under `waves.wave<N>`. List every prior-step envelope the new step consumes.
4. **Register** the worker in `wave<N>/SKILL.md`'s "Workers in this wave" table (path + depends_on).
5. **If consumed by Wave 3 synthesis** (`step-10`, `step-10b`, `step-15`): update the consumer's `## Inputs` section to declare the new prior-step fields, and update `dependencies.yaml` `depends_on` for that consumer.
6. **Run** `company-research/scripts/validate-deps.sh` — must exit 0.
7. **Run** `company-research/scripts/lint-trust-preamble.sh` — must exit 0.
8. **Run** `bun test company-research/scripts/` — all script tests must still pass.
9. **Add** an acceptance test on a real or fixture company that exercises the new step end-to-end (Worker output passes Checker + Sanitizer; renders into the final report).

> Note: cold-email and other sibling skills are intentionally NOT in this checklist. They must tolerate company-research output by parsing the rendered Markdown report defensively. `output-schemas.json` is INTERNAL to this skill.

## Canonical step-file template

```markdown
---
name: company-research-<step-slug>
description: >
  Internal worker for company-research <Step ID> (<topic>). DO NOT invoke as a standalone skill.
  Invoked only by the parent wave coordinator with a spawn prompt. Triggering this skill
  outside that context will produce an incomplete report.
---

**NOTE: Content trust boundary applies.** See `company-research/references/research-principles.md`.

# Step <ID> — <Name>

## Inputs

(None | bullet list of prior-step envelope fields)

## Instructions

Research instructions, BD framing, special handling.

## Output schema

See `schemas.step-<id>` in `company-research/output-schemas.json`.

## Output format

Markdown block as it appears in the final report.
```

## Worked example — adding step-18 ("Sustainability disclosures")

(Hypothetical — illustrative only.)

1. Create `wave1/step18-sustainability/SKILL.md` from the template.
2. Add to `output-schemas.json`:

   ```json
   "step-18": {
     "type": "object",
     "required": ["disclosures"],
     "properties": {
       "disclosures": { "type": "array", "items": { "type": "object" } }
     }
   }
   ```

3. Add to `dependencies.yaml` under `waves.wave1`:

   ```yaml
   - step: step-18
     depends_on: []
   ```

4. Update `output-schemas.json`'s `$.definitions.Envelope.properties.step.pattern` to include `18`.
5. Register in `wave1/SKILL.md`'s workers table.
6. If consumed by step-15 (BD briefing): add `step-18` to step-15's `depends_on` and to its `## Inputs` declaration.
7. Run validators (Steps 6 and 7 of the checklist).
8. Add an acceptance test.
9. Open a PR.

## What you do NOT need to do

- Touch cold-email or any sibling skill.
- Update the README's user-facing trigger phrases (the skill description already covers them).
- Bump the package version (the publisher handles that at release time).

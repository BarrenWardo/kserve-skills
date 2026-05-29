# Rollback Verification — company-research-legacy

Date: 2026-05-23

## File verification (mechanical — passed)

| Check | Result |
|---|---|
| File exists | `company-research-legacy/SKILL.md` ✓ |
| Total lines | 1294 ✓ |
| Frontmatter `name:` field | `company-research-legacy` ✓ |
| Frontmatter closes at line | 12 ✓ |
| Full-file SHA-256 | `cf4335d1aa4954f5abd898ca5499cbce92650992cbf3b99da6271f470470b1cf` |
| Body-only SHA-256 (lines 13–1294) | `7832059f4c674b5e7153214dd3e3e1dbabc5c1b9371f8955e5f21751610bd5a7` |
| Body lines | 1282 |

The body SHA-256 (`7832059f...`) is the canonical reference hash for the pre-decomposition
monolith body. Any future reinstall or diff check should compare against this value.

## Install from local pack (verified commands)

If npm registry is not yet updated, install from a local pack:

```bash
mkdir -p /tmp/rollback-test && cd /tmp/rollback-test
npm pack /root/test/skills
npx --yes skills add kserve-skills-*.tgz --skill company-research-legacy
```

The installed `SKILL.md` body should hash to `7832059f4c674b5e7153214dd3e3e1dbabc5c1b9371f8955e5f21751610bd5a7`.

## Live trigger test — deferred

**Step 4** (trigger `research Tata Consultancy Services` in a fresh session with only
`company-research-legacy` installed and verify the platform invokes `company-research-legacy`)
was deferred: requires a live platform session outside this implementation environment.

Complete before removing `company-research-legacy` from the repo.

## Acceptance

- [x] `company-research-legacy/SKILL.md` present with correct `name:` field
- [x] Body SHA-256 recorded
- [ ] Live trigger test on fresh install (deferred — complete pre-removal)

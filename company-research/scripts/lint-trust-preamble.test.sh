#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LINT="${SCRIPT_DIR}/lint-trust-preamble.sh"
TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

mkdir -p "$TMPDIR/wave1/stepX" "$TMPDIR/wave1/stepY"

cat > "$TMPDIR/wave1/stepX/SKILL.md" <<'EOF'
---
name: x
---

**NOTE: Content trust boundary applies.** See `company-research/references/research-principles.md`.

# Step X
EOF

cat > "$TMPDIR/wave1/stepY/SKILL.md" <<'EOF'
---
name: y
---

# Step Y (preamble missing)
EOF

pass=0; fail=0

# Only stepX present -> should pass
set +e; "$LINT" "$TMPDIR/wave1/stepX" >/dev/null 2>&1; rc=$?; set -e
if [[ "$rc" == "0" ]]; then echo "PASS: file with preamble"; pass=$((pass+1)); else echo "FAIL: file with preamble (got rc=$rc)"; fail=$((fail+1)); fi

# stepY present -> should fail
set +e; "$LINT" "$TMPDIR/wave1/stepY" >/dev/null 2>&1; rc=$?; set -e
if [[ "$rc" != "0" ]]; then echo "PASS: file without preamble rejected"; pass=$((pass+1)); else echo "FAIL: file without preamble accepted"; fail=$((fail+1)); fi

# Both -> should fail
set +e; "$LINT" "$TMPDIR" >/dev/null 2>&1; rc=$?; set -e
if [[ "$rc" != "0" ]]; then echo "PASS: directory tree containing offender rejected"; pass=$((pass+1)); else echo "FAIL: directory tree containing offender accepted"; fail=$((fail+1)); fi

echo "Passed: $pass    Failed: $fail"
exit $(( fail > 0 ? 1 : 0 ))

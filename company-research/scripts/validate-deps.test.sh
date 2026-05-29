#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VALIDATE="${SCRIPT_DIR}/validate-deps.sh"
TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

pass=0; fail=0
assert() {
  local label="$1" expected_exit="$2" actual_exit="$3"
  if [[ "$expected_exit" == "$actual_exit" ]]; then
    echo "PASS: $label"; pass=$((pass+1))
  else
    echo "FAIL: $label (expected exit=$expected_exit, got $actual_exit)"; fail=$((fail+1))
  fi
}

# Fixture 1: valid acyclic DAG
cat > "$TMPDIR/valid.yaml" <<'YAML'
waves:
  wave1:
    - step: step-a
      depends_on: []
  wave2:
    - step: step-b
      depends_on: [step-a]
YAML
set +e; "$VALIDATE" "$TMPDIR/valid.yaml" >/dev/null 2>&1; rc=$?; set -e
assert "acyclic DAG passes" 0 "$rc"

# Fixture 2: cycle
cat > "$TMPDIR/cycle.yaml" <<'YAML'
waves:
  wave1:
    - step: step-a
      depends_on: [step-b]
    - step: step-b
      depends_on: [step-a]
YAML
set +e; "$VALIDATE" "$TMPDIR/cycle.yaml" >/dev/null 2>&1; rc=$?; set -e
assert "cycle is rejected" 1 "$rc"

# Fixture 3: dangling reference
cat > "$TMPDIR/dangling.yaml" <<'YAML'
waves:
  wave1:
    - step: step-a
      depends_on: [step-ghost]
YAML
set +e; "$VALIDATE" "$TMPDIR/dangling.yaml" >/dev/null 2>&1; rc=$?; set -e
assert "dangling reference is rejected" 1 "$rc"

# Fixture 4: malformed YAML
echo "not: [ valid" > "$TMPDIR/bad.yaml"
set +e; "$VALIDATE" "$TMPDIR/bad.yaml" >/dev/null 2>&1; rc=$?; set -e
assert "malformed YAML is rejected" 1 "$rc"

echo
echo "Passed: $pass    Failed: $fail"
exit $(( fail > 0 ? 1 : 0 ))

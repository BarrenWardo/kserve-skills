#!/usr/bin/env bash
# validate-deps.sh — checks dependencies.yaml for acyclicity and edge resolution.
# Usage: validate-deps.sh [path-to-yaml]
# Default path: company-research/dependencies.yaml relative to repo root.
set -euo pipefail
command -v bun >/dev/null 2>&1 || { echo "bun not installed" >&2; exit 1; }

YAML="${1:-company-research/dependencies.yaml}"

if [[ ! -f "$YAML" ]]; then
  echo "ERROR: file not found: $YAML" >&2
  exit 1
fi

# Parse with yq; on parse error yq returns non-zero
if ! yq '.' "$YAML" >/dev/null 2>&1; then
  echo "ERROR: malformed YAML: $YAML" >&2
  exit 1
fi

# Build adjacency lists: NODE  DEP1 DEP2 ...
declare -A DEPS
mapfile -t NODES < <(yq -r '.waves[][].step' "$YAML")

for node in "${NODES[@]}"; do
  mapfile -t edges < <(yq -r ".waves[][] | select(.step == \"$node\") | .depends_on[]?" "$YAML")
  DEPS["$node"]="${edges[*]:-}"
done

# Edge resolution: every dep must be a declared node
for node in "${!DEPS[@]}"; do
  for dep in ${DEPS[$node]}; do
    found=0
    for n in "${NODES[@]}"; do
      [[ "$n" == "$dep" ]] && { found=1; break; }
    done
    if [[ "$found" -eq 0 ]]; then
      echo "ERROR: $node depends on '$dep' which is not a declared step" >&2
      exit 1
    fi
  done
done

# Cycle detection via DFS
declare -A COLOR  # 0=white 1=gray 2=black
for node in "${NODES[@]}"; do COLOR["$node"]=0; done

cycle_dfs() {
  local n="$1"
  COLOR["$n"]=1
  for dep in ${DEPS[$n]}; do
    if [[ "${COLOR[$dep]}" == "1" ]]; then
      echo "ERROR: cycle detected involving $n -> $dep" >&2
      return 1
    fi
    if [[ "${COLOR[$dep]}" == "0" ]]; then
      cycle_dfs "$dep" || return 1
    fi
  done
  COLOR["$n"]=2
}

for node in "${NODES[@]}"; do
  if [[ "${COLOR[$node]}" == "0" ]]; then
    cycle_dfs "$node" || exit 1
  fi
done

echo "OK: ${#NODES[@]} steps, acyclic, all edges resolved"

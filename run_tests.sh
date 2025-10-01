#!/usr/bin/env bash


PARSER="node ccjsonparser.js"
BASE_DIR="${1:-tests/step1}"


  if [ ! -d "$BASE_DIR" ]; then
    echo "No test directory found at '$BASE_DIR'"
    exit 1
  fi
shopt -s nullglob
json_files=("$BASE_DIR"/*.json)
if [${#json_files[@]} -gt 0 ]; then
echo "=== Testing in $BASE_DIR ==="
for f in "${json_files[@]}"; do
  echo "Testing $f"
  $PARSER "$f"
  echo "Exit code: $?"
  echo "----"
done
exit 0
fi

for step_dir in "$BASE_DIR"/*; do
 if [ -d "$step_dir" ]; then
   echo "=== Testing in directory: $step_dir ==="
  for f in "$step_dir"/*.json; do
    [ -e "$f" ] || continue // skip if no files found
    echo "Testing $f"
    $PARSER "$f"
    echo "Exit code: $?"
    echo "----"
  done
 fi
done


# End of script

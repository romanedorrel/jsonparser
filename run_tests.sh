#!/usr/bin/env bash


PARSER="node ccjsonparser.js"
BASE_DIR="${1:-tests/step1}"


  if [ ! -d "$BASE_DIR" ]; then
    echo "No test directory found at '$BASE_DIR'"
    exit 1
  fi
  
for f in "$BASE_DIR"/*.json; do
  echo "Testing $f"
  $PARSER "$f"
  echo "Exit code: $?"
  echo "----"
done


# End of script

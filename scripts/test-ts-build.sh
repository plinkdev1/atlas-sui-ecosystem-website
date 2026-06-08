#!/bin/bash

# TypeScript Build Test Script
# Runs tsc --noEmit to check for type errors without emitting files

echo "Running TypeScript compiler to check for type errors..."
echo "========================================================"

npx tsc --noEmit 2>&1 | tee ts-build-output.txt

# Count the total number of errors
ERROR_COUNT=$(grep -c "error TS" ts-build-output.txt || echo "0")

echo ""
echo "========================================================"
echo "TypeScript Build Summary:"
echo "========================================================"
echo "Total Errors: $ERROR_COUNT"
echo ""

# Show error breakdown by category
echo "Error Categories:"
echo "- 'any' type errors: $(grep -c "any" ts-build-output.txt || echo "0")"
echo "- Missing type errors: $(grep -c "Type" ts-build-output.txt || echo "0")"
echo "- Property errors: $(grep -c "property" ts-build-output.txt || echo "0")"
echo "- Argument errors: $(grep -c "argument" ts-build-output.txt || echo "0")"
echo ""

if [ "$ERROR_COUNT" -lt 50 ]; then
  echo "✓ SUCCESS: Error count ($ERROR_COUNT) is below target of 50!"
  exit 0
else
  echo "⚠ ATTENTION: Error count ($ERROR_COUNT) exceeds target of 50"
  exit 1
fi

#!/bin/bash
set -e

echo "=== Vercel Install Script ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

echo "=== Checking package.json ==="
if grep -q "@testing-library/react" package.json; then
  echo "ERROR: @testing-library/react found in package.json!"
  cat package.json | grep -A 2 -B 2 "@testing-library/react" || true
  exit 1
else
  echo "✓ No @testing-library/react in package.json"
fi

echo "=== Cleaning up ==="
rm -rf node_modules package-lock.json .next

echo "=== Installing dependencies ==="
npm install --legacy-peer-deps --force

echo "=== Verifying installation ==="
if [ -d "node_modules/@testing-library/react" ]; then
  echo "ERROR: @testing-library/react was installed!"
  exit 1
else
  echo "✓ @testing-library/react not installed (correct)"
fi

echo "=== Install complete ==="


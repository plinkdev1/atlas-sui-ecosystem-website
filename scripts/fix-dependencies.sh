#!/bin/bash

# Remove node_modules and lock files to force clean reinstall
echo "Clearing dependency cache..."

# Remove node_modules
if [ -d "node_modules" ]; then
  echo "Removing node_modules..."
  rm -rf node_modules
fi

# Remove lock files
if [ -f "pnpm-lock.yaml" ]; then
  echo "Removing pnpm-lock.yaml..."
  rm -f pnpm-lock.yaml
fi

if [ -f "bun.lock" ]; then
  echo "Removing bun.lock..."
  rm -f bun.lock
fi

echo "Dependency cache cleared. Dependencies will be reinstalled on next build."

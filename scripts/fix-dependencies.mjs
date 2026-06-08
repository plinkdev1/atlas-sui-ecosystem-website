import fs from 'fs';
import path from 'path';

console.log('[v0] Clearing dependency cache to resolve SuiClient export conflict...');

// Remove node_modules
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('[v0] Removing node_modules...');
  fs.rmSync(nodeModulesPath, { recursive: true, force: true });
  console.log('[v0] ✓ Removed node_modules');
}

// Remove pnpm lock
const pnpmLockPath = path.join(process.cwd(), 'pnpm-lock.yaml');
if (fs.existsSync(pnpmLockPath)) {
  console.log('[v0] Removing pnpm-lock.yaml...');
  fs.unlinkSync(pnpmLockPath);
  console.log('[v0] ✓ Removed pnpm-lock.yaml');
}

// Remove bun lock
const bunLockPath = path.join(process.cwd(), 'bun.lock');
if (fs.existsSync(bunLockPath)) {
  console.log('[v0] Removing bun.lock...');
  fs.unlinkSync(bunLockPath);
  console.log('[v0] ✓ Removed bun.lock');
}

console.log('[v0] ✓ Dependency cache cleared successfully!');
console.log('[v0] Dependencies will be reinstalled with corrected @suiet/wallet-kit@0.8.6');

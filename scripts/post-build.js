import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

console.log('[Post-Build] Preparing GitHub Pages distribution artifacts...');

// 1. Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('[Post-Build] dist directory does not exist! Run vite build first.');
  process.exit(1);
}

// 2. Generate dist/404.html for GitHub Pages SPA client-side routing
const indexPath = path.join(distDir, 'index.html');
const notFoundPath = path.join(distDir, '404.html');
if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, notFoundPath);
  console.log('[Post-Build] ✓ Created dist/404.html from dist/index.html');
}

// 3. Add .nojekyll to dist to bypass Jekyll processing on GitHub Pages
const nojekyllPath = path.join(distDir, '.nojekyll');
fs.writeFileSync(nojekyllPath, '');
console.log('[Post-Build] ✓ Created dist/.nojekyll');

// Helper to copy directory if it exists
function copyDirIfExists(sourceRel, targetRel) {
  const src = path.join(rootDir, sourceRel);
  const dest = path.join(distDir, targetRel);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true, force: true });
    console.log(`[Post-Build] ✓ Copied ${sourceRel} -> dist/${targetRel}`);
  }
}

// 3. Copy static asset directories to dist
copyDirIfExists('data', 'data');
copyDirIfExists('image', 'image');
copyDirIfExists('img', 'img');

console.log('[Post-Build] All distribution assets ready for GitHub Pages.');

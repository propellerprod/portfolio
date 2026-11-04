/**
 * Synchronizes data/projects.json and data/collabs.json into src/data/constants.ts
 * so the bundled JS always has the freshest initial data on GitHub Pages.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const projectsFile = path.join(rootDir, 'data', 'projects.json');
const collabsFile = path.join(rootDir, 'data', 'collabs.json');
const constantsFile = path.join(rootDir, 'src', 'data', 'constants.ts');

try {
  const projectsData = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
  const collabsData = JSON.parse(fs.readFileSync(collabsFile, 'utf8'));

  const projects = Array.isArray(projectsData.projects) ? projectsData.projects : [];
  const collabs = Array.isArray(collabsData.collabs) ? collabsData.collabs : [];

  let constants = fs.readFileSync(constantsFile, 'utf8');

  const pMarker = 'export const DEFAULT_PROJECTS: Project[] =';
  const pIndex = constants.indexOf(pMarker);

  if (pIndex !== -1) {
    const topPart = constants.slice(0, pIndex);
    const newContent = `${topPart}${pMarker} ${JSON.stringify(projects, null, 2)};\n\nexport const DEFAULT_COLLABS: Collab[] = ${JSON.stringify(collabs, null, 2)};\n`;
    fs.writeFileSync(constantsFile, newContent, 'utf8');
    console.log(`[Sync-Constants] ✓ Synchronized ${projects.length} projects and ${collabs.length} collabs into src/data/constants.ts`);
  }
} catch (err) {
  console.warn('[Sync-Constants] Skipped or failed:', err.message);
}

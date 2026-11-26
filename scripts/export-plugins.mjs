import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const releaseDir = path.join(root, 'release');
const platforms = [
  { name: 'figma', main: 'code.js' },
  { name: 'mastergo', main: 'main.js' }
];

for (const platform of platforms) {
  const source = path.join(root, platform.name);
  const manifest = JSON.parse(fs.readFileSync(path.join(source, 'manifest.json'), 'utf8'));
  if (manifest.main !== platform.main || manifest.ui !== 'ui.html') {
    throw new Error(`Check the runtime paths in ${platform.name}/manifest.json.`);
  }
  for (const file of [platform.main, manifest.ui]) {
    const stat = fs.statSync(path.join(source, file), { throwIfNoEntry: false });
    if (!stat?.isFile() || stat.size === 0) {
      throw new Error(`Missing ${platform.name}/${file}. Run npm run build:export.`);
    }
  }
}

fs.mkdirSync(releaseDir, { recursive: true });
const staging = fs.mkdtempSync(path.join(releaseDir, '.export-'));
try {
  for (const { name, main } of platforms) {
    const files = [main, 'ui.html', 'manifest.json'];
    const prepared = path.join(staging, name);
    fs.mkdirSync(prepared);
    for (const file of files) {
      fs.copyFileSync(path.join(root, name, file), path.join(prepared, file));
    }
  }

  for (const { name, main } of platforms) {
    const destination = path.join(releaseDir, name);
    fs.mkdirSync(destination, { recursive: true });
    for (const file of [main, 'ui.html', 'manifest.json']) {
      fs.renameSync(path.join(staging, name, file), path.join(destination, file));
    }
    console.log(`${name}: ${path.join(destination, 'manifest.json')}`);
  }
} finally {
  fs.rmSync(staging, { recursive: true, force: true });
}

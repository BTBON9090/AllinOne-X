import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const mastergoRoot = path.resolve(here, '..');
const repoRoot = path.resolve(mastergoRoot, '..');
const figmaRoot = path.join(repoRoot, 'figma');

const figmaMainPath = path.join(figmaRoot, 'code.ts');
const figmaUiPath = path.join(figmaRoot, 'ui.html');
if (!fs.existsSync(figmaMainPath) || !fs.existsSync(figmaUiPath)) {
  console.warn('未找到同级 Figma 源码，已跳过跨平台功能等价检查。');
  process.exit(0);
}

const read = (file) => fs.readFileSync(file, 'utf8');
const figmaMain = read(figmaMainPath);
const mastergoMain = read(path.join(mastergoRoot, 'main.ts'));
const figmaUi = read(figmaUiPath);
const mastergoUi = read(path.join(mastergoRoot, 'ui.html'));

const collect = (source, regex) => new Set(Array.from(source.matchAll(regex), (match) => match[1]));
const diff = (expected, actual) => [...expected].filter((item) => !actual.has(item)).sort();

const checks = [
  ['主线程消息分支', collect(figmaMain, /case\s+['"]([^'"]+)['"]\s*:/g), collect(mastergoMain, /case\s+['"]([^'"]+)['"]\s*:/g)],
  ['导航功能入口', collect(figmaUi, /data-nav=["']([^"']+)["']/g), collect(mastergoUi, /data-nav=["']([^"']+)["']/g)],
  ['UI 元素 ID', collect(figmaUi, /\sid=["']([^"']+)["']/g), collect(mastergoUi, /\sid=["']([^"']+)["']/g)],
  ['国际化键', collect(figmaUi, /data-key=["']([^"']+)["']/g), collect(mastergoUi, /data-key=["']([^"']+)["']/g)]
];

let failed = false;
for (const [label, expected, actual] of checks) {
  const missing = diff(expected, actual);
  if (missing.length > 0) {
    failed = true;
    console.error(`${label}缺失 (${missing.length}): ${missing.join(', ')}`);
  } else {
    console.log(`${label}: ${expected.size}/${expected.size}`);
  }
}

const forbidden = [
  /\bfigma\./,
  /getNodeByIdAsync/,
  /setCurrentPageAsync/,
  /getLocal(?:Paint|Text|Effect)StylesAsync/,
  /\bimageHash\b/,
  /\blayoutMode\b/,
  /\bprimaryAxisAlignItems\b/,
  /\bcounterAxisAlignItems\b/,
  /\bprimaryAxisSizingMode\b/,
  /\bcounterAxisSizingMode\b/,
  /\bcornerSmoothing\b/
];

for (const pattern of forbidden) {
  if (pattern.test(mastergoMain)) {
    failed = true;
    console.error(`仍包含未迁移的 Figma API: ${pattern}`);
  }
}

if (failed) process.exit(1);
console.log('MasterGo 功能等价静态检查通过。');

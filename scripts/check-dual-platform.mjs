import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const figmaMain = read('figma/code.ts');
const mastergoMain = read('mastergo/main.ts');
const figmaUi = read('figma/ui.html');
const mastergoUi = read('mastergo/ui.html');

const collect = (source, regex) => new Set(Array.from(source.matchAll(regex), match => match[1]));
const difference = (left, right) => [...left].filter(value => !right.has(value)).sort();
const checks = [];
const check = (label, condition, detail = '') => checks.push([label, Boolean(condition), detail]);

const releaseVersion = json('package.json').version;
check('统一版本号', [json('figma/package.json').version, json('mastergo/package.json').version]
  .every(version => version === releaseVersion), releaseVersion);

for (const [label, regex] of [
  ['主线程消息分支', /case\s+['"]([^'"]+)['"]\s*:/g],
  ['导航功能入口', /data-nav=["']([^"']+)["']/g],
  ['UI 元素 ID', /\sid=["']([^"']+)["']/g],
  ['国际化键', /data-key=["']([^"']+)["']/g]
]) {
  const figmaSet = collect(label === '主线程消息分支' ? figmaMain : figmaUi, regex);
  const mastergoSet = collect(label === '主线程消息分支' ? mastergoMain : mastergoUi, regex);
  const missingInFigma = difference(mastergoSet, figmaSet);
  const missingInMasterGo = difference(figmaSet, mastergoSet);
  check(`${label}双向一致`, missingInFigma.length === 0 && missingInMasterGo.length === 0,
    `Figma 缺失: ${missingInFigma.join(', ') || '-'}；MasterGo 缺失: ${missingInMasterGo.join(', ') || '-'}`);
}

for (const [platform, ui, main] of [
  ['Figma', figmaUi, figmaMain],
  ['MasterGo', mastergoUi, mastergoMain]
]) {
  check(`${platform} 超级选择读取真实范围`, ui.includes("#scopeGroup .seg-btn.active")
    && !ui.includes("#scopeGroup .filter-tag.active"));
  check(`${platform} 子孙范围递归`, main.includes("if ('findAll' in node)")
    && main.includes('searchTargets.push(...children)'));
  check(`${platform} 自定义字段随机入口`, ui.includes("runCustomFill(${index}, 'random', event)"));
  check(`${platform} 自定义随机模式传递`, ui.includes("task.type === 'custom' ? (task.distribution || 'order') : 'order'"));
  check(`${platform} 后端随机取值`, main.includes("if (distribution === 'random')")
    && main.includes('Math.floor(Math.random() * dataList.length)'));
  check(`${platform} 空列表保护`, main.includes('!Array.isArray(dataList) || dataList.length === 0'));
}

let failed = false;
for (const [label, ok, detail] of checks) {
  if (ok) console.log(`✓ ${label}${detail ? ` (${detail})` : ''}`);
  else {
    failed = true;
    console.error(`✗ ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

if (failed) process.exit(1);
console.log(`双平台等价检查通过 (${checks.length}/${checks.length})。`);

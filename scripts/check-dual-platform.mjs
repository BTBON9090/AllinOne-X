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
  check(`${platform} 查重整行同时定位`, ui.includes("postMsg('focus-layers', { ids: [pair.aId, pair.bId] })"));
  check(`${platform} 查重结果持久化`, ui.includes("PersistentCache.set('dup_last_result'")
    && ui.includes("PersistentCache.get('dup_last_result')"));
  check(`${platform} 查重左右等分布局`, ui.includes('grid-template-columns: minmax(0, 1fr) 28px minmax(0, 1fr)'));
  check(`${platform} 矩阵精确边距间距`, main.includes('padding * 2 + xArray.length * maxWidth + Math.max(0, xArray.length - 1) * gapX')
    && main.includes('(maxWidth - v.width) / 2'));
  check(`${platform} 说明书内置预设`, ui.includes('compactLight:')
    && ui.includes('compactDark:')
    && ui.includes('landscapeMinimal:')
    && ui.includes('portraitFull:'));
  check(`${platform} 批量排布并入说明书`, ui.includes('id="showcaseScope"')
    && ui.includes("postMsg('generate-batch-showcase'"));
  check(`${platform} CompKit 操作按钮不拉伸`, ui.includes('#compkitPanel .compkit-action')
    && ui.includes('flex: 0 0 auto'));
  check(`${platform} 说明书组件集保持顶层`, main.includes('组件集直接挂在最外层说明书画板下'));
  check(`${platform} 实例逆向紧凑网格`, main.includes('Math.ceil(Math.sqrt(')
    && main.includes('columns * maxWidth + Math.max(0, columns - 1) * 24'));
  check(`${platform} AI 组件优化选择上限`, main.includes('selection.length <= 10')
    && main.includes("case 'component-ai-inspect'")
    && main.includes("case 'component-ai-apply'"));
  check(`${platform} AI 组件优化审核后应用`, ui.includes('id="componentAiFeedback"')
    && ui.includes('normalizeComponentAiPlan')
    && ui.includes("postMsg('component-ai-apply'"));
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

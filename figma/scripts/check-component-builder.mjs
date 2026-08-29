import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const main = fs.readFileSync(path.join(root, 'code.ts'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'ui.html'), 'utf8');

const checks = [
  ['实例逆向消息分支', main.includes("case 'component-builder-reverse'")],
  ['Frame 构建消息分支', main.includes("case 'component-builder-create'")],
  ['原实例保持不变', main.includes('clone = source.clone()') && main.includes('clone.detachInstance()')],
  ['结构失败使用母版副本', main.includes('selectedComponent = main.clone()')],
  ['结构彻底失败使用视觉快照', main.includes('createReverseVisualSnapshot') && main.includes("recoveryMode = 'raster'")],
  ['原生 Frame 组件化', main.includes('figma.createComponentFromNode')],
  ['创建组件集', main.includes('figma.combineAsVariants')],
  ['完整变体上限', main.includes('const MAX_REVERSED_VARIANTS = 100')],
  ['组件属性恢复', main.includes('restoreBuilderProperties')],
  ['文字属性生成', main.includes("addComponentProperty(name, 'TEXT'")],
  ['实例切换属性生成', main.includes("'INSTANCE_SWAP'") && main.includes('mainComponent: property')],
  ['三种构建模式', ['single', 'multiple', 'set'].every(mode => ui.includes(`data-builder-mode="${mode}"`))],
  ['组件构建器导航', ui.includes('data-nav="componentBuilder"')],
  ['实例逆向入口', ui.includes("trackAndRun('component-builder-reverse')")],
  ['属性选项默认不勾选', /id="builderExposeText"(?![^>]*checked)/.test(ui) && /id="builderExposeInstances"(?![^>]*checked)/.test(ui)]
];

let failed = false;
for (const [label, ok] of checks) {
  if (ok) console.log(`✓ ${label}`);
  else {
    failed = true;
    console.error(`✗ ${label}`);
  }
}

if (failed) process.exit(1);
console.log(`Figma 组件构建器静态检查通过 (${checks.length}/${checks.length})。`);

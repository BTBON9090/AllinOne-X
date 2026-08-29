import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const html = fs.readFileSync(path.join(root, 'ui.html'), 'utf8');
const scripts = Array.from(
  html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi),
  (match) => match[1]
);

if (scripts.length === 0) {
  console.error('ui.html 中没有找到内联脚本');
  process.exit(1);
}

for (const [index, source] of scripts.entries()) {
  try {
    new Function(source);
  } catch (error) {
    console.error(`ui.html 第 ${index + 1} 个脚本存在语法错误: ${error.message}`);
    process.exit(1);
  }
}

console.log(`UI 脚本语法检查通过 (${scripts.length}/${scripts.length})。`);

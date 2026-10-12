import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const css = fs.readFileSync(path.join(root, 'shared/ui-shell.css'), 'utf8');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'shared/tabler-icons.json'), 'utf8'));
const icons = Object.fromEntries(Object.entries(catalog.icons).map(([name, data]) => [name, data.body]));
const js = fs.readFileSync(path.join(root, 'shared/ui-shell.js'), 'utf8').replace('__TABLER_ICONS__', () => JSON.stringify(icons))
  + '\n' + fs.readFileSync(path.join(root, 'shared/fill-generators.js'), 'utf8')
  + '\n' + fs.readFileSync(path.join(root, 'shared/chinese-names.js'), 'utf8')
  + '\n' + fs.readFileSync(path.join(root, 'shared/theory-data.js'), 'utf8')
  + '\n' + fs.readFileSync(path.join(root, 'shared/theory-locales.js'), 'utf8')
  + '\n' + fs.readFileSync(path.join(root, 'shared/localization-core.js'), 'utf8')
  + '\n' + fs.readFileSync(path.join(root, 'shared/localization-ui.js'), 'utf8')
  + '\n' + fs.readFileSync(path.join(root, 'shared/theory-workspace.js'), 'utf8')
  + '\n' + fs.readFileSync(path.join(root, 'shared/window-workspace.js'), 'utf8')
  + '\n' + fs.readFileSync(path.join(root, 'shared/bookmark-workspace.js'), 'utf8')
  + '\n' + fs.readFileSync(path.join(root, 'shared/workspace.js'), 'utf8');
for (const platform of ['figma', 'mastergo']) {
  const file = path.join(root, platform, 'ui.html');
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/\n<!-- shared-shell-style:start -->[\s\S]*?<!-- shared-shell-style:end -->/g, '');
  html = html.replace(/\n<!-- shared-shell-script:start -->[\s\S]*?<!-- shared-shell-script:end -->/g, '');
  html = html.replace(/^[ \t]*<!-- workspace-header:start -->[\s\S]*?<!-- workspace-header:end -->/gm, '');
  html = html.replace(/^[ \t]*<!-- workspace-home:start -->[\s\S]*?<!-- workspace-home:end -->/gm, '');
  html = html.replace('</head>', () => '\n<!-- shared-shell-style:start -->\n<style>\n' + css + '</style>\n<!-- shared-shell-style:end -->\n</head>');
  html = html.replace('</body>', () => '\n<!-- shared-shell-script:start -->\n<script>\n' + js + '\n</script>\n<!-- shared-shell-script:end -->\n</body>');
  fs.writeFileSync(file, html);
}
console.log('Synced offline UI shell and Tabler icons to both platforms.');

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const css = fs.readFileSync(path.join(root, 'shared/ui-shell.css'), 'utf8');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'shared/tabler-icons.json'), 'utf8'));
const icons = Object.fromEntries(Object.entries(catalog.icons).map(([name, data]) => [name, data.body]));
const js = fs.readFileSync(path.join(root, 'shared/ui-shell.js'), 'utf8').replace('__TABLER_ICONS__', () => JSON.stringify(icons))
  + '\n' + fs.readFileSync(path.join(root, 'shared/fill-generators.js'), 'utf8')
  + '\n' + fs.readFileSync(path.join(root, 'shared/workspace.js'), 'utf8');
const header = fs.readFileSync(path.join(root, 'shared/workspace-header.html'), 'utf8');
const home = fs.readFileSync(path.join(root, 'shared/workspace-home.html'), 'utf8');
for (const platform of ['figma', 'mastergo']) {
  const file = path.join(root, platform, 'ui.html');
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/\n<!-- shared-shell-style:start -->[\s\S]*?<!-- shared-shell-style:end -->/g, '');
  html = html.replace(/\n<!-- shared-shell-script:start -->[\s\S]*?<!-- shared-shell-script:end -->/g, '');
  html = html.replace(/<!-- workspace-header:start -->[\s\S]*?<!-- workspace-header:end -->/g, () => '<!-- workspace-header:start -->\n' + header + '<!-- workspace-header:end -->');
  html = html.replace(/<!-- workspace-home:start -->[\s\S]*?<!-- workspace-home:end -->/g, () => '<!-- workspace-home:start -->\n' + home + '<!-- workspace-home:end -->');
  html = html.replace('</head>', () => '\n<!-- shared-shell-style:start -->\n<style>\n' + css + '</style>\n<!-- shared-shell-style:end -->\n</head>');
  html = html.replace('</body>', () => '\n<!-- shared-shell-script:start -->\n<script>\n' + js + '\n</script>\n<!-- shared-shell-script:end -->\n</body>');
  fs.writeFileSync(file, html);
}
console.log('Synced offline UI shell and Tabler icons to both platforms.');

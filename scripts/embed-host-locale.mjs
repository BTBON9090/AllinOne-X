import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const platform = process.argv[2];
if (!['figma','mastergo'].includes(platform)) throw new Error('Choose figma or mastergo');
const target = path.join(root, platform, platform === 'figma' ? 'code.js' : 'main.js');
const code = fs.readFileSync(target, 'utf8').replace(/^\/\/ shared-host-locale:start[\s\S]*?\/\/ shared-host-locale:end\n/, '');
const core = fs.readFileSync(path.join(root,'shared/localization-core.js'),'utf8');
const adapter = fs.readFileSync(path.join(root,'shared/localization-host.js'),'utf8').replaceAll('__PLUGIN_HOST__', platform === 'figma' ? 'figma' : 'mg');
const clipperSource = fs.readFileSync(path.join(root, platform, 'node_modules/clipper-lib/clipper.js'), 'utf8').replace(/[^\S\n]+$/gm, '');
const clipperLicense = fs.readFileSync(path.join(root, 'shared/CLIPPER-LICENSE.txt'), 'utf8').split('\n').map(line => ('// ' + line).trimEnd()).join('\n');
// Select Clipper's CommonJS branch in the plugin sandbox. Scope its legacy
// Number.toInteger browser probe locally instead of modifying host intrinsics.
const clipper = clipperLicense + '\nconst iconfontClipper = (() => {\nconst module = { exports: {} };\nconst Number = { toInteger: null };\n' +
  clipperSource + '\nmodule.exports.Error = message => { throw new Error(message); };\nreturn module.exports;\n})();';
const layers = ['ai-transport.js', 'layer-core.js', 'layer-host.js', 'iconfont-boolean.js', 'iconfont-geometry.js', 'iconfont-host.js', 'iconfont-inplace.js',
  ...(platform === 'mastergo' ? ['iconfont-inplace-mastergo.js'] : []),
  'iconfont-batch.js'].map(file => fs.readFileSync(path.join(root,'shared',file),'utf8')).join('\n').replaceAll('__PLUGIN_HOST__', platform === 'figma' ? 'figma' : 'mg').replaceAll('__PLUGIN_PLATFORM__', JSON.stringify(platform));
const windowHost = fs.readFileSync(path.join(root,'shared/window-host.js'),'utf8');
const windowAdapter = fs.readFileSync(path.join(root,'shared/window-adapters.js'),'utf8').replaceAll('__PLUGIN_PLATFORM__', JSON.stringify(platform));
fs.writeFileSync(target, '// shared-host-locale:start\n' + core + '\n' + adapter + '\n' + windowHost + '\n' + windowAdapter + '\n' + clipper + '\n' + layers + '\n// shared-host-locale:end\n' + code);

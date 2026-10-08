import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from '../figma/node_modules/typescript/lib/typescript.js';
const read = file => fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const context = vm.createContext({});
vm.runInContext(read('shared/localization-core.js') + read('shared/theory-data.js') + read('shared/theory-locales.js') + '\nglobalThis.sourceTheories = theoryDB;', context);
const han = /[\u3400-\u9fff]/;
let sections = 0;
for (const source of context.sourceTheories) {
  const translated = context.TheoryLocale.item(source, 'en');
  assert.equal(translated.id, source.id);
  assert.equal(translated.cat, source.cat);
  assert.equal(translated.subItems.length, source.subItems.length);
  for (const value of [translated.title, translated.subtitle, translated.desc, ...translated.subItems.flatMap(item => [item.title,item.core,item.case,item.val])]) {
    assert.equal(typeof value, 'string'); assert(value.trim()); assert(!han.test(value), source.id + ': untranslated theory content');
  }
  sections += translated.subItems.length;
}
assert.equal(context.sourceTheories.length, 18); assert.equal(sections, 58);
for (const [input, expected] of [
  ['已填充 3 个文本','Filled 3 text layers.'],
  ['已创建语言组件集，并生成文字属性、实例属性；2 项已跳过','Created a language component set; exposed text and instance swap properties; 2 items skipped'],
  ['已将 2 个图层设为 320 × 480，1 个图层调整失败','Resized 2 layers to 320 × 480; 1 failed.'],
  ['移除 4 个自动布局','Removed Auto Layout from 4 layers.']
]) {
  assert.equal(context.PluginLocale.translate(input,'en'), expected);
  assert.equal(context.PluginLocale.translate(input,'zh'), input);
}
// Every direct notification literal in either host has an English rendering.
for (const platform of ['figma','mastergo']) {
  const source = read(platform === 'figma' ? 'figma/code.ts' : 'mastergo/main.ts');
  const ast = ts.createSourceFile('host.ts',source,ts.ScriptTarget.Latest,true);
  function check(node) {
    if (ts.isCallExpression(node) && node.expression.getText(ast) === 'notifyInUiLanguage') {
      function literals(value) {
        if (ts.isStringLiteralLike(value) && han.test(value.text)) {
          assert(!han.test(context.PluginLocale.translate(value.text,'en')), platform + ': ' + value.text);
        } else if (ts.isConditionalExpression(value)) { literals(value.whenTrue); literals(value.whenFalse); }
      }
      if (node.arguments[0]) literals(node.arguments[0]);
    }
    ts.forEachChild(node, check);
  }
  check(ast);
  const calls = [];
  const hostContext = vm.createContext({ [platform === 'figma' ? 'figma' : 'mg']: { notify:(text,options) => calls.push([text,options]) } });
  vm.runInContext(read('shared/localization-core.js') + read('shared/localization-host.js').replaceAll('__PLUGIN_HOST__',platform === 'figma' ? 'figma' : 'mg'),hostContext);
  vm.runInContext("pluginUiLanguage = 'en'; notifyInUiLanguage('请选择图层', { error:true });",hostContext);
  assert.equal(calls[0][0],'Select layers first.'); assert.equal(calls[0][1].error,true);
}
console.log('Localization checks passed: all 18 theories / 58 sections, English host notifications and preserved message parameters.');

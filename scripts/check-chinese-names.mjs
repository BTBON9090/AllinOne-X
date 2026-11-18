import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../shared/chinese-names.js', import.meta.url), 'utf8');
const context = vm.createContext({});
vm.runInContext(source, context);
const entries = Array.from(context.ChineseNameLibrary.entries);
assert.equal(entries.length, 512);
assert.equal(new Set(entries.map(entry => entry.name)).size, entries.length, 'The curated library has no duplicate full names');
assert.equal(new Set(entries.map(entry => entry.style)).size, 16);
const surnames = new Set('张 李 王 陈 刘 赵 周 吴 徐 孙 朱 胡 高 林 苏 沈'.split(' '));
const compoundSurnames = new Set(['欧阳', '司马', '上官', '夏侯']);
const lengths = new Map();
for (const entry of entries) {
  assert.match(entry.name, /^[\p{Script=Han}]{2,4}$/u);
  const surname = compoundSurnames.has(entry.name.slice(0, 2)) ? entry.name.slice(0, 2) : entry.name[0];
  assert(compoundSurnames.has(surname) || surnames.has(surname), 'A recognized surname starts every sample');
  assert(entry.name.length > surname.length, 'A surname must be followed by a given name');
  const givenName = entry.name.slice(surname.length);
  assert(!/(.)\1/.test(givenName) || ['悦悦', '果果', '依依'].includes(givenName), 'Only intentional affectionate repeated names are included');
  lengths.set(entry.name.length, (lengths.get(entry.name.length) || 0) + 1);
}
assert.deepEqual([...lengths.keys()].sort(), [2, 3, 4]);
for (const style of new Set(entries.map(entry => entry.style))) {
  for (const gender of ['male', 'female']) assert.equal(entries.filter(entry => entry.style === style && entry.gender === gender).length, 16);
}
const genderOf = new Map(entries.map(entry => [entry.name, entry.gender]));
// Exercise cycles under the extremes of the shuffle and a normal random source.
for (const random of ['() => 0', '() => .999999', null]) {
  const run = vm.createContext({});
  if (random) vm.runInContext('Math.random = ' + random, run);
  vm.runInContext(source, run);
  let lastGender;
  for (let cycle = 0; cycle < 3; cycle++) {
    const names = [];
    for (let i = 0; i < entries.length; i++) {
      const name = run.ChineseNameLibrary.next();
      const gender = genderOf.get(name);
      assert(gender, 'Only curated full names can be returned');
      if (lastGender) assert.notEqual(gender, lastGender, 'Gender variety continues across cycle boundaries');
      lastGender = gender;
      names.push(name);
    }
    assert.equal(new Set(names).size, entries.length, 'Every name is used once before a cycle repeats');
  }
}
console.log('Chinese name checks passed: 512 unique names, 16 styles, both gender groups, 2–4 characters, valid surname/given-name structure and varied non-repeating cycles.');

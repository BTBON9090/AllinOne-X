import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';

const source = fs.readFileSync(new URL('../shared/iconfont-geometry.js', import.meta.url), 'utf8');
const adapter = fs.readFileSync(new URL('../shared/iconfont-boolean.js', import.meta.url), 'utf8');
const requireFromFigma = createRequire(new URL('../figma/package.json', import.meta.url));
const {normalize, canonicalize} = vm.runInNewContext(adapter + '\n' + source + '\nIconfontGeometry', {
  iconfontClipper: requireFromFigma('clipper-lib')
});
const path = (data, windingRule = 'EVENODD') => ({data, windingRule});
const square = (min, max) => `M ${min} ${min} H ${max} V ${max} H ${min} Z`;
const squareBack = (min, max) => `M ${min} ${min} V ${max} H ${max} V ${min} Z`;

// Sign of each normalized polygon (the fixtures using this helper contain lines only).
function areas(data) {
  return data.split(/\s*M\s+/).slice(1).map(part => {
    const numbers = part.match(/-?[\d.]+/g).map(Number);
    let area = 0;
    for (let i = 0; i < numbers.length; i += 2) {
      const next = (i + 2) % numbers.length;
      area += numbers[i] * numbers[next + 1] - numbers[i + 1] * numbers[next];
    }
    return area / 2;
  });
}

const signs = data => areas(data).map(Math.sign);

assert.equal(canonicalize('m 3 2 v 8 h 8 v -8 z'), 'M 3 2 L 3 10 L 11 10 L 11 2 Z');
assert.equal(canonicalize('M 2 3 4 3 6 3 H 8 v 2'), 'M 2 3 L 8 3 L 8 5 Z');
assert.equal(canonicalize('M 9 6 l -2 0 0 6 z m 1 2 l 1 0 0 1z'), 'M 9 6 L 7 6 L 7 12 Z M 10 8 L 11 8 L 11 9 Z');

const nested = [square(0, 20), square(4, 16), square(6, 14)].join(' ');
const donut = normalize([path(nested)]);
assert.equal(donut.length, 1);
assert.equal(donut[0].windingRule, 'NONZERO');
assert.deepEqual(signs(donut[0].data), [1, -1, 1]);
assert.equal(normalize(donut)[0].data, donut[0].data);
assert.deepEqual(signs(normalize([path(nested, 'NONZERO')])[0].data), [1]);
assert.deepEqual(signs(normalize([path([squareBack(4, 16), square(0, 20)].join(' '), 'Nonzero')])[0].data), [-1, 1]);
assert.deepEqual(signs(normalize([path(square(0, 20)), path(squareBack(4, 16))])[0].data), [1, 1]);

// SVG fills implicitly close the filled open triangle. Empty centerlines must not fill.
assert.equal(normalize([path('m 2 3 10 0 0 10'), path('M 0 0 L 3 0 L 3 3', 'NONE')])[0].data, 'M 2 3 L 12 3 L 12 13 Z');
assert.equal(normalize([path('M 0 0 L 0 0 C 0 0 0 0 0 0 L 4 0 L 4 4 L 0 0 Z')])[0].data, 'M 0 0 L 4 0 L 4 4 Z');
assert.match(normalize([path('M 3 0 C 2 0 0 1 0 3 C 0 5 2 6 3 6 C 4 6 6 5 6 3 C 6 1 4 0 3 0 Z')])[0].data, /^M 3 0 C 4 0 6 1 6 3/);
assert.match(normalize([path('M 0 0 Q 0 2 2 2 T 4 0 Z')])[0].data, /Q 4 2 2 2 Q 0 2 0 0 Z/);
assert.equal(normalize([path('M 0 0 H 1e-6 L 1 0 L 1 1 Z')])[0].data, 'M 0 0 L 1 0 L 1 1 Z');
assert.match(normalize([path('M 0 0 H 1e-6 L 1 0.01 L 1 1 Z')])[0].data, /L 0.000001 0/);

const fails = (paths, code) => assert.throws(() => normalize(paths), err => err.code === code);
fails([], 'geometry-empty');
fails([path('M 0 0 L 2 2 Z')], 'geometry-empty');
fails([path('M 0 0 L 4 0 L 4 4 Z', 'NONE')], 'geometry-empty');
fails([path('M 0 0 A 4 4 0 1 0 4 4 Z')], 'geometry-invalid');
fails([path('M 0 0 L 4 ? 4')], 'geometry-invalid');
fails([path('M 0 0 L 0 1e999')], 'geometry-invalid');
fails([path('M 0 0 1')], 'geometry-invalid');
// Boolean repair resolves overlaps using the source rule, including zero signed
// area in a bowtie. Losing a lobe, or unioning an EVENODD overlap, changes area.
const totalArea = (data, rule) => areas(normalize([path(data, rule)])[0].data).reduce((a, b) => a + b, 0);
assert.equal(totalArea('M 1 1 L 4 4 L 1 4 L 4 1 Z', 'EVENODD'), 4.5);
const overlap = square(0, 4) + ' ' + square(3, 5);
assert.equal(totalArea(overlap, 'EVENODD'), 18);
assert.equal(totalArea(overlap, 'NONZERO'), 19);
assert.equal(totalArea(square(0, 4) + ' ' + square(4, 5), 'EVENODD'), 17);
fails([path(square(0, 4) + ' ' + square(0, 4))], 'geometry-empty');

console.log('Iconfont contour geometry checks passed.');

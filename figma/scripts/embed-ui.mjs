import fs from 'node:fs';

const html = fs.readFileSync('ui.html', 'utf8');
const js = fs.readFileSync('code.js', 'utf8');
// A replacement callback preserves literal $&, $' and $backtick in the UI source.
fs.writeFileSync('code.js', js.replace(/__html__/g, () => JSON.stringify(html)));

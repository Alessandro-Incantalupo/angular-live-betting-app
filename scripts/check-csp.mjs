// The theme script in src/index.html runs before Angular, inline, so the CSP in netlify.toml
// allows it by hash. This check reads the built page (run it after `pnpm build`) and fails when
// the script changed and the hash didn't. `--print` prints the hashes to paste.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/live-odds/browser/index.html', import.meta.url), 'utf8');

const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const hashes = scripts.map((s) => `'sha256-${createHash('sha256').update(s).digest('base64')}'`);

if (process.argv.includes('--print')) {
  console.log(hashes.join(' '));
  process.exit(0);
}

const config = readFileSync(new URL('../netlify.toml', import.meta.url), 'utf8');
const missing = hashes.filter((hash) => !config.includes(hash));
if (missing.length > 0) {
  console.error(`netlify.toml CSP is missing ${missing.join(', ')} for the inline script(s).`);
  process.exit(1);
}
console.log(`CSP covers ${hashes.length} inline script(s).`);

// Build script for the 21 November 2026 edition: renders poster.html to
// the committed entry.png. Not part of the graded run — main.ts is — this
// is the press that printed the poster, kept in the repo so the entry is
// reproducible end to end.
//
// How it works:
//   1. poster.html draws its hero (an Antalya waterfront at dawn) on a
//      <canvas> with a seeded PRNG, so the artwork is identical on every
//      build. The page is served over a throwaway loopback HTTP server
//      because Chromium treats file:// module/CORS rules inconsistently;
//      nothing leaves the machine.
//   2. Headless Chromium screenshots the page at 2x (2048x2048).
//   3. PIL shrinks the shot to the final 1024x1024 with Lanczos, which
//      keeps the small panel type crisp after the downscale.
//   4. sharpen_hero.py applies a hero-only unsharp mask (OpenCV) so the
//      dawn scene keeps its edge bite without touching the typeset
//      masthead, panels or ticker.
//
// Playwright is borrowed from ~/workspace/tools/pw on this machine; the
// repo deliberately carries no node_modules of its own.
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { statSync, unlinkSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const rawShot = join(root, '.entry-2x.png');
const finalImage = join(root, 'entry.png');

const require = createRequire('/home/hatch/workspace/tools/pw/package.json');
const { chromium } = require('playwright');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
};

const server = createServer(async (req, res) => {
  try {
    const rel = decodeURIComponent(new URL(req.url, 'http://loopback').pathname);
    const path = normalize(join(root, rel));
    if (!path.startsWith(root)) { res.writeHead(403).end(); return; }
    const body = await readFile(path);
    res.writeHead(200, { 'content-type': MIME[extname(path)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const url = `http://127.0.0.1:${server.address().port}/poster.html`;

const browser = await chromium.launch({ args: ['--no-proxy-server'] });
try {
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 2 });
  page.on('pageerror', err => console.log(`[pageerror] ${err.message}`));
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__sceneReady === true, null, { timeout: 30000 });
  await page.waitForTimeout(120);
  await page.screenshot({ path: rawShot, type: 'png' });
  console.log(`2x capture -> ${rawShot}`);
} finally {
  await browser.close();
  server.close();
}

execFileSync('python3', ['-c', `
from PIL import Image
import sys
im = Image.open(sys.argv[1])
assert im.size == (2048, 2048), im.size
im.resize((1024, 1024), Image.LANCZOS).save(sys.argv[2], optimize=True)
print('downscaled 2048 -> 1024 (Lanczos)')
`, rawShot, finalImage], { stdio: 'inherit' });

execFileSync('/home/hatch/workspace/tools/pyvenv/bin/python',
  [join(root, 'sharpen_hero.py'), finalImage], { stdio: 'inherit' });

unlinkSync(rawShot);
console.log(`entry.png finished: ${statSync(finalImage).size} bytes`);

// news-image-20261121 — "The World in One Picture", Saturday 21 November 2026.
//
// The whole entry is one pre-rendered image, entry.png, committed beside
// this file. The poster was drawn once, deterministically, by the build
// pipeline in this repo (poster.html + render.mjs + sharpen_hero.py) and
// frozen as a PNG; this program's only job is to deliver those exact
// bytes into the output directory, so every run — in the grader's
// container or anywhere else — produces the identical file.
//
// The output directory comes from MAKEFUN_OUTPUT_DIR when set and is
// /output otherwise. It is created if missing and never removed: in the
// grader it is a mounted volume, and deleting the mount point itself
// would fail the run.
//
// Run it:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');
if (!existsSync(source)) {
  console.error(`entry.png is missing beside main.ts (looked in ${here})`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });

const target = join(outDir, 'entry.png');
copyFileSync(source, target);
console.log(`entry.png -> ${target}`);

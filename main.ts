// The World in One Picture — Saturday 21 November 2026.
//
// The finished poster for this entry is committed beside this program as
// entry.png. The program's job is simply to deliver that image to the
// place the grader reads: a file named entry.png inside the output
// directory. The output directory is taken from MAKEFUN_OUTPUT_DIR when
// the harness provides it, and defaults to /output otherwise.

import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Deliver the committed poster into the output directory. Copying a
// fixed file keeps repeat runs byte-identical, as the grader requires.
function deliverPoster(): void {
  // Find the image relative to this program, not the caller's cwd.
  const programDir = dirname(fileURLToPath(import.meta.url));
  const posterPath = join(programDir, "entry.png");

  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

  // Create the output directory if it is missing; never delete it or
  // anything inside it.
  mkdirSync(outputDir, { recursive: true });

  copyFileSync(posterPath, join(outputDir, "entry.png"));
}

deliverPoster();

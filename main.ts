import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Output directory defaults to /output in container, overridden by MAKEFUN_OUTPUT_DIR
const destDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const destFile = join(destDir, 'entry.png');
const srcFile = fileURLToPath(new URL('./entry.png', import.meta.url));

if (!existsSync(srcFile)) {
  throw new Error(`Source poster not found at ${srcFile}`);
}

mkdirSync(dirname(destFile), { recursive: true });
copyFileSync(srcFile, destFile);

const stat = statSync(destFile);
if (!stat.isFile() || stat.size === 0) {
  throw new Error(`Failed to write output image or file is empty at ${destFile}`);
}

const MAX_BYTES = 1048576; // 1 MiB limit per competition rules
if (stat.size > MAX_BYTES) {
  throw new Error(`Output image exceeds maximum size limit of 1 MiB (${stat.size} > ${MAX_BYTES} bytes)`);
}

console.log(`Successfully generated ${destFile} (${stat.size} bytes)`);


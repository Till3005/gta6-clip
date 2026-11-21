// gta6-clipper-01 entrypoint (authored). Job: hand the gate the video address.
// Reads VIDEO.json from the bot dir, checks it names one YouTube url, and writes
// the exact bytes into the output dir where the house reads it. No network, no
// wall clock, stdlib only; two runs write identical bytes.
//
// Locally: mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(message: string): never {
  console.error(`gta6-clipper-01: ${message}`);
  process.exit(1);
}

const source = join(BOT_DIR, 'VIDEO.json');

let parsed: { url?: unknown };
try {
  parsed = JSON.parse(readFileSync(source, 'utf8'));
} catch (err) {
  fail(`VIDEO.json at ${source} is not valid JSON: ${(err as Error).message}`);
}

if (typeof parsed.url !== 'string' || !/^https:\/\/(www\.)?youtube\.com\//.test(parsed.url)) {
  fail(`VIDEO.json must hold a youtube.com url, got: ${JSON.stringify(parsed.url ?? null)}`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(source, join(OUTPUT_DIR, 'VIDEO.json'));

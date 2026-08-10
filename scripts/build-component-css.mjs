#!/usr/bin/env node
/**
 * build-component-css.mjs
 *
 * Generates per-component CSS files in dist/components/<name>/:
 *   - source.css  — raw (non-Tailwind) CSS extracted by tsup (copied from index.css)
 *   - styles.css  — self-contained Tailwind build scoped to that component
 *
 * Run:  node scripts/build-component-css.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync, rmSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const SRC_COMPONENTS = resolve(ROOT, "src/components");
const THEME_DIR = resolve(ROOT, "src/theme");
const TAILWIND_BIN = resolve(ROOT, "node_modules/.bin/tailwindcss");

const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf8"));

const components = [];
for (const [key] of Object.entries(pkg.exports)) {
  const m = key.match(/^\.\/([^/]+)\/styles\.css$/);
  if (m) components.push(m[1]);
}

const srcDirs = readdirSync(SRC_COMPONENTS);
const srcDirMap = new Map(srcDirs.map((d) => [d.toLowerCase(), d]));

const tmpDir = resolve(ROOT, ".tmp-component-css");
if (existsSync(tmpDir)) rmSync(tmpDir, { recursive: true });
mkdirSync(tmpDir, { recursive: true });

const CONCURRENCY = 8;
let built = 0;
let skipped = 0;

function findCssFiles(dir) {
  const results = [];
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith(".css")) {
        results.push(resolve(dir, entry.name));
      }
    }
  } catch {
    // ignore
  }
  return results;
}

async function buildComponent(name) {
  const actualDir = srcDirMap.get(name.toLowerCase()) ?? name;
  const srcDir = resolve(SRC_COMPONENTS, actualDir);
  const distDir = resolve(DIST, "components", name.toLowerCase());

  if (!existsSync(srcDir)) {
    skipped++;
    return;
  }

  mkdirSync(distDir, { recursive: true });

  const indexCss = resolve(distDir, "index.css");
  const sourceCss = resolve(distDir, "source.css");
  if (existsSync(indexCss)) {
    cpSync(indexCss, sourceCss);
  } else {
    writeFileSync(sourceCss, "/* No component-specific CSS */\n");
  }

  const componentCssImports = findCssFiles(srcDir)
    .map((f) => `@import "${f}";`)
    .join("\n");

  const inputCss = [
    `@import "tailwindcss";`,
    `@import "${resolve(THEME_DIR, "sapphire-theme.css")}";`,
    `@import "${resolve(THEME_DIR, "tokens.css")}";`,
    componentCssImports,
    `@source "${srcDir}";`,
    `@custom-variant dark (&:is(.dark *, .theme-dark *));`,
  ].join("\n");

  const inputFile = resolve(tmpDir, `${name}.css`);
  writeFileSync(inputFile, inputCss);

  const outputFile = resolve(distDir, "styles.css");

  try {
    await execFileAsync(TAILWIND_BIN, ["-i", inputFile, "-o", outputFile, "--minify"], { cwd: ROOT });
    built++;
  } catch (err) {
    console.error(`\x1b[31mbuild-component-css:\x1b[0m failed for ${name}:`, err.stderr);
    skipped++;
  }
}

async function run() {
  const queue = [...components];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length > 0) {
      await buildComponent(queue.shift());
    }
  });
  await Promise.all(workers);

  rmSync(tmpDir, { recursive: true });
  console.log(`\x1b[35mbuild-component-css:\x1b[0m ${built} components built, ${skipped} skipped`);
}

run();

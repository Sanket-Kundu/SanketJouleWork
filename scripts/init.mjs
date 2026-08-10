#!/usr/bin/env node

/**
 * Generates a Tailwind CSS entry file with Sapphire theme setup.
 *
 * Produces a concise CSS file that imports from the package:
 *   - Tailwind v4
 *   - @theme block (utility class mappings)
 *   - Token values (light/dark defaults) — inlined for customization
 *   - Component CSS (non-Tailwind styles)
 *
 * Usage:
 *   npx @sap-ui/fx-components init                    # writes src/index.css
 *   npx @sap-ui/fx-components init src/styles.css      # writes to custom path
 *   npx @sap-ui/fx-components init --stdout             # prints to stdout
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load a CSS file from src, dist, or scripts
function loadFile(name, ...extraPaths) {
  const paths = [
    resolve(__dirname, `../src/theme/${name}`),
    resolve(__dirname, `../dist/${name}`),
    ...extraPaths.map((p) => resolve(__dirname, p)),
  ];
  for (const p of paths) {
    try {
      return readFileSync(p, "utf-8");
    } catch {
      // try next
    }
  }
  console.error(`Error: Could not find ${name}`);
  process.exit(1);
}

// Strip the file header comment (first block comment)
function stripHeader(css) {
  return css.replace(/\/\*[\s\S]*?\*\/\s*\n/, "");
}

// Build the complete CSS output
function buildCSS(tokens) {
  return `/* Sapphire Theme — npx @sap-ui/fx-components init */

@import "tailwindcss";
@import "@sap-ui/fx-components/theme.css";
@import "@sap-ui/fx-components/components.css";

/* Uncomment for SAP 72 font (copy .woff2 files to public/fonts/) */
/* @import url('/fonts/72.css'); */

@custom-variant dark (&:is(.dark *, .theme-dark *));

/* Sapphire token values — edit to customize your theme */

${tokens.trim()}
`;
}

async function confirm(question) {
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  return new Promise((res) => {
    rl.question(question, (answer) => {
      rl.close();
      res(answer.toLowerCase().startsWith("y"));
    });
  });
}

// Main
const args = process.argv.slice(2);

const tokens = stripHeader(loadFile("tokens.css"));
const fontCSS = loadFile("72.css", "../fonts/72.css");

const SUBCOMMANDS = new Set(["init"]);
const target = args.find((a) => !a.startsWith("-") && !SUBCOMMANDS.has(a)) || "src/index.css";

if (args.includes("--stdout")) {
  process.stdout.write(buildCSS(tokens));
  process.exit(0);
}

const targetPath = resolve(process.cwd(), target);
const output = buildCSS(tokens);

if (existsSync(targetPath)) {
  const ok = await confirm(`\n  ${target} already exists. Overwrite? [y/N] `);
  if (!ok) {
    console.log("  Aborted.");
    process.exit(0);
  }
}

mkdirSync(dirname(targetPath), { recursive: true });
writeFileSync(targetPath, output);

// Generate public/fonts/72.css
const fontsDir = resolve(process.cwd(), "public/fonts");
const fontCSSPath = resolve(fontsDir, "72.css");
if (!existsSync(fontCSSPath)) {
  mkdirSync(fontsDir, { recursive: true });
  writeFileSync(fontCSSPath, fontCSS);
}

const dim = (s) => `\x1b[2m${s}\x1b[22m`;
const bold = (s) => `\x1b[1m${s}\x1b[22m`;
const green = (s) => `\x1b[32m${s}\x1b[39m`;
const cyan = (s) => `\x1b[36m${s}\x1b[39m`;
const yellow = (s) => `\x1b[33m${s}\x1b[39m`;

// Check if tailwindcss is installed in the consumer's project
const hasTailwind = existsSync(resolve(process.cwd(), "node_modules/tailwindcss"));

let step = 1;
const lines = [
  `  ${green("✓")} ${bold(target)}`,
  `  ${green("✓")} ${bold("public/fonts/72.css")}`,
  "",
];

if (!hasTailwind) {
  lines.push(
    `  ${yellow("!")} Tailwind CSS v4 is required but not installed`,
    `     ${cyan("npm install -D tailwindcss @tailwindcss/vite")}    ${dim("# Vite")}`,
    `     ${cyan("npm install -D tailwindcss @tailwindcss/postcss")}  ${dim("# Next.js / PostCSS")}`,
    "",
  );
}

lines.push(
  `  ${bold("Next steps")}`,
  "",
  `  ${dim(`${step++}.`)} Import the generated file in your app entry point`,
  `     ${cyan(`import "./${target}";`)}`,
  "",
  `  ${dim(`${step++}.`)} Wrap your app with ThemeProvider`,
  `     ${cyan(`import { ThemeProvider } from "@sap-ui/fx-components";`)}`,
  "",
  `     ${cyan(`<ThemeProvider`)}`,
  `       ${cyan(`themes={[{ id: "light", name: "Light" }, { id: "dark", name: "Dark" }]}`)}`,
  `       ${cyan(`defaultTheme="light"`)}>`,
  `       ${cyan(`<App />`)}`,
  `     ${cyan(`</ThemeProvider>`)}`,
  "",
  `  ${dim("Tip:")}   Don't need Tailwind? Use the pre-built CSS instead:`,
  `     ${cyan(`import "@sap-ui/fx-components/styles.css";`)}`,
  "",
  `  ${dim("Fonts:")} Copy .woff2 files into public/fonts/ and uncomment the import in ${target}`,
  `  ${dim("Docs:")}  https://github.tools.sap/ui/fx-components`,
);

console.log("\n" + lines.join("\n") + "\n");

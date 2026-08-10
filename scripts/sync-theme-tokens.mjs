#!/usr/bin/env node
/**
 * sync-theme-tokens.mjs
 *
 * Fully generates sapphire-theme.css from tokens.css.
 *
 * Naming rules (what gets which prefix):
 *   DIRECT (no prefix):
 *     --color-*   palette   → --color-purple-500   → bg-purple-500
 *     Core shadcn           → --color-background   → bg-background
 *
 *   PREFIXED (sapphire-):
 *     --spacing-*           → --spacing-sapphire-3xs → p-sapphire-3xs
 *     --radius-*            → --radius-sapphire-s   (foundation primitives)
 *     --border-width-*      → --border-width-sapphire-s
 *     --size-*              → --size-sapphire-s
 *     --disabled-opacity    → --opacity-sapphire-disabled
 *     --text-*              → --color-sapphire-text-tertiary
 *     --button-*            → --color-sapphire-button-accent
 *     --chrome-*            → --color-sapphire-chrome-bg-primary
 *     --icon-*              → --color-sapphire-icon-accent
 *     --prompt-*            → --color-sapphire-prompt-accent
 *     --border-* (semantic) → --color-sapphire-border-active
 *     --background-*        → --color-sapphire-background-tertiary
 *     --canvas-*, --card-bg-*, --negative, --positive, --warning, --info, etc.
 *
 * Static entries (shadcn radius, font) are embedded in the template.
 *
 * Run:   node scripts/sync-theme-tokens.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS_PATH = resolve(__dirname, "../src/theme/tokens.css");
const THEME_PATH = resolve(__dirname, "../src/theme/sapphire-theme.css");

// ── Configuration ───────────────────────────────────────────────────────

// Core shadcn tokens: --name → --color-name (direct, no sapphire prefix)
const CORE_SHADCN = new Set([
  "--background", "--foreground",
  "--card", "--card-foreground",
  "--popover", "--popover-foreground",
  "--primary", "--primary-foreground",
  "--secondary", "--secondary-foreground",
  "--muted", "--muted-foreground",
  "--accent", "--accent-foreground",
  "--destructive", "--destructive-foreground",
  "--border", "--input", "--ring",
]);

// Tokens to skip entirely (not colors/spacing, or handled in static template)
const SKIP = new Set(["--radius"]);

/**
 * Extract unique typescale level names from --typo-* tokens.
 * E.g. "--typo-heading1-size" → "heading1", "--typo-caption-mono-tracking" → "caption-mono"
 *
 * The suffix is always one of: size, line-height, weight, tracking
 */
const TYPO_SUFFIXES = ["line-height", "size", "weight", "tracking"];

function extractTypoLevel(tokenName) {
  // strip "--typo-"
  const rest = tokenName.slice("--typo-".length);
  for (const suffix of TYPO_SUFFIXES) {
    if (rest.endsWith(`-${suffix}`)) {
      return rest.slice(0, -(suffix.length + 1)); // +1 for the dash
    }
  }
  return null;
}

// Static tail: radius, font family, font sizes (not derivable from tokens.css)
const STATIC_TAIL = `
  /* ============================================
   * Border Radius
   * ============================================ */
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);

  /* ============================================
   * Font Family
   * ============================================ */
  --font-sans: '72', '72full', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

  /* ============================================
   * Font Size — SAP 72 Typescale (from Figma)
   *
   * text-xs (12/16) and text-sm (14/20) match
   * Tailwind defaults — no override needed.
   * ============================================ */

  --font-size-base: 1rem / 1.375;        /* 16px / 22px (Figma: 16-Regular) */

  --font-size-lg: 1.125rem / 1.445;      /* 18px / ~26px — interpolated for SAP 72 rhythm */

  --font-size-xl: 1.25rem / 1.6;         /* 20px / 32px (Figma: 20-Regular) */

  --font-size-2xl: 2rem / 1.25;          /* 32px / 40px (Figma: 32-Regular) */

  --font-size-3xl: 2.5rem / 1.2;         /* 40px / 48px (Figma: 40-Regular) */

  --font-size-4xl: 3.5rem / 1.143;       /* 56px / 64px (Figma: 56-Light) */

  /* ============================================
   * Font Weight Override
   * ============================================ */
  --font-weight-bold: 600;                /* Figma "SemiBold" — matches Title-Strong spec */`;

// ── Parsing ─────────────────────────────────────────────────────────────

/**
 * Extract all custom property names from the :root block of tokens.css
 */
function extractTokenNames(css) {
  const rootMatch = css.match(/:root\s*\{([\s\S]*?)\n\}/);
  if (!rootMatch) return [];

  const names = [];
  const re = /^\s*(--[\w-]+)\s*:/gm;
  let m;
  while ((m = re.exec(rootMatch[1])) !== null) {
    names.push(m[1]);
  }
  return names;
}

// ── Naming ──────────────────────────────────────────────────────────────

/**
 * Map a token name to its @theme variable name.
 *
 * --color-purple-500 → --color-purple-500          (direct)
 * --spacing-3xs      → --spacing-sapphire-3xs      (prefixed)
 * --background       → --color-background          (core shadcn)
 * --prompt-accent    → --color-sapphire-prompt-accent (semantic)
 */
function toThemeVar(tokenName) {
  // Palette: already --color-*, register directly
  if (tokenName.startsWith("--color-")) return tokenName;

  // Spacing: --spacing-X → --spacing-sapphire-X (prefixed to avoid clashing with Tailwind built-in sizes)
  if (tokenName.startsWith("--spacing-")) {
    const name = tokenName.slice("--spacing-".length);
    return `--spacing-sapphire-${name}`;
  }

  // Foundation primitives: radius, border-width, size → prefixed with sapphire
  if (tokenName.startsWith("--radius-")) {
    const name = tokenName.slice("--radius-".length);
    return `--radius-sapphire-${name}`;
  }
  if (tokenName.startsWith("--border-width-")) {
    const name = tokenName.slice("--border-width-".length);
    return `--border-width-sapphire-${name}`;
  }
  if (tokenName.startsWith("--size-")) {
    const name = tokenName.slice("--size-".length);
    return `--size-sapphire-${name}`;
  }

  // Opacity: --disabled-opacity → --opacity-sapphire-disabled
  if (tokenName === "--disabled-opacity") {
    return "--opacity-sapphire-disabled";
  }

  // Core shadcn: --name → --color-name
  if (CORE_SHADCN.has(tokenName)) return `--color-${tokenName.slice(2)}`;

  // Semantic: --name → --color-sapphire-name
  return `--color-sapphire-${tokenName.slice(2)}`;
}

function shouldSkip(name) {
  if (SKIP.has(name)) return true;
  // --typo-* tokens are handled separately in the Typography section
  if (name.startsWith("--typo-")) return true;
  return false;
}

// ── Grouping ────────────────────────────────────────────────────────────

function groupTokens(tokenNames) {
  const coreShadcn = [];
  const palette = [];      // --color-*
  const spacing = [];       // --spacing-*
  const foundation = [];    // --radius-*, --border-width-*, --size-*, --disabled-opacity
  const semantic = [];      // everything else

  for (const name of tokenNames) {
    if (shouldSkip(name)) continue;

    const themeVar = toThemeVar(name);

    if (CORE_SHADCN.has(name)) {
      coreShadcn.push({ themeVar, tokenName: name });
    } else if (name.startsWith("--color-")) {
      palette.push({ themeVar, tokenName: name });
    } else if (name.startsWith("--spacing-")) {
      spacing.push({ themeVar, tokenName: name });
    } else if (
      name.startsWith("--radius-") ||
      name.startsWith("--border-width-") ||
      name.startsWith("--size-") ||
      name === "--disabled-opacity"
    ) {
      foundation.push({ themeVar, tokenName: name });
    } else {
      semantic.push({ themeVar, tokenName: name });
    }
  }

  return { coreShadcn, palette, spacing, foundation, semantic };
}

/**
 * Sub-group entries by first meaningful segment for comments.
 * --color-purple-500 → "Purple", --prompt-accent → "Prompt"
 */
function subGroup(entries, stripPrefix) {
  const groups = new Map();
  for (const entry of entries) {
    const rest = entry.tokenName.slice(stripPrefix.length);
    const seg = rest.split("-")[0];
    const label = seg.charAt(0).toUpperCase() + seg.slice(1);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(entry);
  }
  return groups;
}

// ── Generation ──────────────────────────────────────────────────────────

function generateThemeFile(tokenNames) {
  const { coreShadcn, palette, spacing, foundation, semantic } = groupTokens(tokenNames);
  const lines = [];

  const push = (s) => lines.push(s);
  const blank = () => lines.push("");
  const entry = ({ themeVar, tokenName }) =>
    push(`  ${themeVar}: var(${tokenName});`);

  // Header
  push("/*");
  push(" * Sapphire Theme — Tailwind v4 @theme tokens");
  push(" *");
  push(" * AUTO-GENERATED by scripts/sync-theme-tokens.mjs from tokens.css.");
  push(" * Do not edit manually — changes will be overwritten on next build.");
  push(" *");
  push(" * This file must be committed to the repo. Tailwind reads it at build");
  push(" * time to know which utility classes to generate. If you see it change");
  push(" * after editing tokens.css, commit the updated version alongside your");
  push(" * token changes.");
  push(" *");
  push(" * Naming:");
  push(" *   --color-*   palette  → bg-purple-500, text-neutral-700 (direct)");
  push(" *   shadcn core          → bg-background, text-foreground  (direct)");
  push(" *   --spacing-* scale    → p-sapphire-3xs, gap-sapphire-xl (prefixed)");
  push(" *   semantic (text, button, chrome, icon, prompt, ...) → sapphire-* (prefixed)");
  push(" */");
  blank();
  push("@theme {");

  // Core shadcn
  push("  /* ============================================");
  push("   * Core shadcn tokens");
  push("   * ============================================ */");
  for (const e of coreShadcn) entry(e);

  // Palette
  blank();
  push("  /* ============================================");
  push("   * Palette");
  push("   * ============================================ */");
  const paletteGroups = subGroup(palette, "--color-");
  for (const [label, entries] of paletteGroups) {
    blank();
    push(`  /* ${label} */`);
    for (const e of entries) entry(e);
  }

  // Spacing
  if (spacing.length > 0) {
    blank();
    push("  /* ============================================");
    push("   * Spacing Scale");
    push("   * ============================================ */");
    for (const e of spacing) entry(e);
  }

  // Foundation primitives (radius, border-width, size, opacity)
  if (foundation.length > 0) {
    blank();
    push("  /* ============================================");
    push("   * Foundation Primitives");
    push("   * ============================================ */");
    for (const e of foundation) entry(e);
  }

  // Semantic
  if (semantic.length > 0) {
    blank();
    push("  /* ============================================");
    push("   * Semantic Tokens");
    push("   * ============================================ */");
    const semGroups = subGroup(semantic, "--");
    for (const [label, entries] of semGroups) {
      blank();
      push(`  /* ${label} */`);
      for (const e of entries) entry(e);
    }
  }

  // Typography: --typo-* → --font-size-sapphire-*, --line-height-sapphire-*, --font-weight-sapphire-*, --tracking-sapphire-*
  {
    // Collect unique levels in insertion order
    const seenLevels = new Map(); // level → Set<suffix>
    for (const name of tokenNames) {
      if (!name.startsWith("--typo-")) continue;
      const level = extractTypoLevel(name);
      if (!level) continue;
      if (!seenLevels.has(level)) seenLevels.set(level, new Set());
      const rest = name.slice("--typo-".length);
      for (const suffix of TYPO_SUFFIXES) {
        if (rest.endsWith(`-${suffix}`)) {
          seenLevels.get(level).add(suffix);
          break;
        }
      }
    }

    if (seenLevels.size > 0) {
      blank();
      push("  /* ============================================");
      push("   * Typography — Sapphire Typescale");
      push("   * ============================================ */");

      for (const [level, suffixes] of seenLevels) {
        blank();
        push(`  /* ${level} */`);
        if (suffixes.has("size")) {
          push(`  --font-size-sapphire-${level}: var(--typo-${level}-size);`);
        }
        if (suffixes.has("line-height")) {
          push(`  --line-height-sapphire-${level}: var(--typo-${level}-line-height);`);
        }
        if (suffixes.has("weight")) {
          push(`  --font-weight-sapphire-${level}: var(--typo-${level}-weight);`);
        }
        if (suffixes.has("tracking")) {
          push(`  --tracking-sapphire-${level}: var(--typo-${level}-tracking);`);
        }
      }
    }
  }

  // Static tail (radius, fonts)
  push(STATIC_TAIL);

  // Close
  blank();
  push("}");
  blank();

  // Source directive — tells consumer-side Tailwind where to find class strings
  push("/* Scan library source so Tailwind generates the classes our components use */");
  push('@source ".";');
  blank();

  return lines.join("\n");
}

// ── Sync ────────────────────────────────────────────────────────────────

function sync() {
  const tokensCss = readFileSync(TOKENS_PATH, "utf8");
  const tokenNames = extractTokenNames(tokensCss);

  const newContent = generateThemeFile(tokenNames);
  const oldContent = readFileSync(THEME_PATH, "utf8");

  if (newContent === oldContent) return [];

  writeFileSync(THEME_PATH, newContent, "utf8");
  return tokenNames.filter((n) => !shouldSkip(n));
}

// ── Main ────────────────────────────────────────────────────────────────

const result = sync();
if (result.length > 0) {
  console.log(
    `\x1b[35msync-theme-tokens:\x1b[0m regenerated sapphire-theme.css (${result.length} tokens)`
  );
} else {
  console.log("\x1b[35msync-theme-tokens:\x1b[0m sapphire-theme.css is up to date.");
}

const fs = require("fs");
const path = require("path");

// ─── Configuration ───────────────────────────────────────────────────────────

// Raw SVG sources — v4 base, v5 overrides (per-file, v5 wins when both exist)
const V4_DIR = path.join(__dirname, "illustrations");
const V5_DIR = path.join(__dirname, "illustrations-v5");

// Fiori: v4 only (no v5 fiori folder exists)
const FIORI_SVG_DIRS = [V4_DIR];
// TNT: v4 base + v5 override
const TNT_SVG_DIRS = [path.join(V4_DIR, "tnt"), path.join(V5_DIR, "tnt")];

// i18n: check local copy first, fall back to UI5 source checkout
const I18N_LOCAL = path.join(__dirname, "illustrations", "messagebundle_en.properties");
const I18N_UI5 = "/Users/i524143/SAPDevelop/ui5-webcomponents/packages/fiori/src/i18n/messagebundle_en.properties";
const I18N_FILE = fs.existsSync(I18N_LOCAL) ? I18N_LOCAL : I18N_UI5;

const OUT_DIR = path.join(__dirname, "src", "illustrations");

const SIZES = ["Dot", "Spot", "Dialog", "Scene"];

// Maps SVG file size names to modern names
const SIZE_TO_MODERN = {
  Dot: "ExtraSmall",
  Spot: "Small",
  Dialog: "Medium",
  Scene: "Large",
};

// ─── SVG to JSX Conversion ──────────────────────────────────────────────────

const ATTR_MAP = {
  "fill-rule": "fillRule",
  "clip-rule": "clipRule",
  "clip-path": "clipPath",
  "fill-opacity": "fillOpacity",
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-opacity": "strokeOpacity",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "flood-color": "floodColor",
  "flood-opacity": "floodOpacity",
  "color-interpolation": "colorInterpolation",
  "color-interpolation-filters": "colorInterpolationFilters",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-style": "fontStyle",
  "font-weight": "fontWeight",
  "text-anchor": "textAnchor",
  "text-decoration": "textDecoration",
  "dominant-baseline": "dominantBaseline",
  "alignment-baseline": "alignmentBaseline",
  "baseline-shift": "baselineShift",
  "enable-background": "enableBackground",
  "xlink:href": "xlinkHref",
  "xml:space": "xmlSpace",
  "xmlns:xlink": null, // remove
  "xml:lang": null, // remove
  class: "className",
};

function svgToJsx(svgContent) {
  let jsx = svgContent;

  // Remove id attribute from root <svg>
  jsx = jsx.replace(/(<svg[^>]*)\s+id="[^"]*"/, "$1");

  // Add className={className} to root <svg>
  jsx = jsx.replace(/<svg([^>]*)>/, '<svg$1 className={className}>');

  // Convert HTML attributes to JSX
  for (const [html, react] of Object.entries(ATTR_MAP)) {
    if (react === null) {
      const removeRegex = new RegExp(`\\s+${escapeRegex(html)}="[^"]*"`, "g");
      jsx = jsx.replace(removeRegex, "");
    } else {
      const attrRegex = new RegExp(`\\b${escapeRegex(html)}=`, "g");
      jsx = jsx.replace(attrRegex, `${react}=`);
    }
  }

  return jsx.trim();
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─── i18n Parsing ────────────────────────────────────────────────────────────

function parseI18n(filePath) {
  const texts = {};
  if (!fs.existsSync(filePath)) return texts;

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  for (const line of lines) {
    const titleMatch = line.match(/^IM_TITLE_(\w+)=(.*)$/);
    if (titleMatch) {
      const name = titleMatch[1];
      const value = titleMatch[2].replace(/''/g, "'");
      if (!texts[name]) texts[name] = {};
      texts[name].title = value;
    }

    const subtitleMatch = line.match(/^IM_SUBTITLE_(\w+)=(.*)$/);
    if (subtitleMatch) {
      const name = subtitleMatch[1];
      const value = subtitleMatch[2].replace(/''/g, "'");
      if (!texts[name]) texts[name] = {};
      texts[name].subtitle = value;
    }
  }

  return texts;
}

// ─── Illustration Name Discovery ─────────────────────────────────────────────

function discoverIllustrations(svgDirs, prefix) {
  const names = new Set();
  const regex = new RegExp(`^${escapeRegex(prefix)}-(?:${SIZES.join("|")})-(.+)\\.svg$`);

  for (const svgDir of svgDirs) {
    if (!fs.existsSync(svgDir)) continue;
    const files = fs.readdirSync(svgDir).filter((f) => f.endsWith(".svg"));
    for (const file of files) {
      const match = file.match(regex);
      if (match) names.add(match[1]);
    }
  }

  return Array.from(names).sort();
}

// ─── File Generation (Folder-per-illustration) ──────────────────────────────

/**
 * Generate a single size variant file (e.g., ExtraSmall.tsx).
 * Exports the SVG component as default.
 */
function writeSizeVariantFile(modernName, svgJsx, outputDir) {
  const content = `import * as React from "react";

const ${modernName}: React.FC<{ className?: string }> = ({ className }) => (
  ${svgJsx}
);

export default ${modernName};
`;
  fs.writeFileSync(path.join(outputDir, `${modernName}.tsx`), content);
}

/**
 * Generate the main illustration component file that lazy-loads size variants.
 * No static imports — everything is loaded on demand.
 */
function writeMainComponentFile(name, set, texts, outputDir) {
  const escapedTitle = (texts.title || "").replace(/'/g, "\\'").replace(/"/g, '\\"');
  const escapedSubtitle = (texts.subtitle || "").replace(/'/g, "\\'").replace(/"/g, '\\"');

  const metadataName = set === "tnt" ? `Tnt${name}` : name;

  const content = `import { createIllustration } from "../../createIllustration";

export const ${name} = createIllustration({
  name: "${metadataName}",
  title: "${escapedTitle}",
  subtitle: "${escapedSubtitle}",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default ${name};
`;

  fs.writeFileSync(path.join(outputDir, `${name}.tsx`), content);
}

/**
 * Write the folder barrel index (re-exports the main component).
 */
function writeFolderIndex(name, outputDir) {
  const content = `export { ${name} } from "./${name}";
export { default } from "./${name}";
`;
  fs.writeFileSync(path.join(outputDir, "index.ts"), content);
}

/**
 * Generate one illustration as a folder with separate size variant files.
 */
function generateIllustrationFolder(name, svgDirs, prefix, set, i18nTexts, parentDir) {
  const sizeSvgs = {};

  // Merge: iterate dirs in order, later dirs override earlier
  for (const svgDir of svgDirs) {
    for (const size of SIZES) {
      const svgFile = path.join(svgDir, `${prefix}-${size}-${name}.svg`);
      if (fs.existsSync(svgFile)) {
        sizeSvgs[size] = fs.readFileSync(svgFile, "utf8");
      }
    }
  }

  // Warn about sizes missing from all directories
  for (const size of SIZES) {
    if (!sizeSvgs[size]) {
      console.warn(`  Warning: Missing ${size} for ${name}`);
    }
  }

  if (Object.keys(sizeSvgs).length === 0) {
    console.warn(`  Skipping ${name}: no SVG files found`);
    return false;
  }

  // Create folder
  const folderDir = path.join(parentDir, name);
  if (!fs.existsSync(folderDir)) fs.mkdirSync(folderDir, { recursive: true });

  // Write individual size variant files
  for (const size of SIZES) {
    const modernName = SIZE_TO_MODERN[size];
    let svgContent;
    if (sizeSvgs[size]) {
      svgContent = sizeSvgs[size];
    } else {
      // Fallback to closest available size
      const fallbackSize = SIZES.find((s) => sizeSvgs[s]) || "Dialog";
      svgContent = sizeSvgs[fallbackSize];
    }
    writeSizeVariantFile(modernName, svgToJsx(svgContent), folderDir);
  }

  // Get i18n texts
  const i18nKey = name.toUpperCase().replace(/_/g, "");
  const texts = i18nTexts[name.toUpperCase()] ||
    i18nTexts[i18nKey] ||
    Object.values(i18nTexts).find((_, idx) => {
      const key = Object.keys(i18nTexts)[idx];
      return key.toUpperCase() === i18nKey;
    }) ||
    { title: "", subtitle: "" };

  // Write main component file
  writeMainComponentFile(name, set, texts, folderDir);

  // Write folder barrel
  writeFolderIndex(name, folderDir);

  return true;
}

/**
 * Generate the set-level barrel (e.g., fiori/index.ts).
 */
function generateSetBarrelIndex(names, outputDir) {
  const exports = names
    .map((name) => `export { ${name} } from "./${name}";`)
    .join("\n");

  fs.writeFileSync(path.join(outputDir, "index.ts"), exports + "\n");
}

// ─── Clean up old flat files ────────────────────────────────────────────────

function cleanOutputDir(dir) {
  if (!fs.existsSync(dir)) return;

  // Remove old flat .tsx files (not in subdirectories)
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".tsx") && entry.name !== "createIllustration.tsx" && entry.name !== "types.ts") {
      fs.unlinkSync(path.join(dir, entry.name));
    }
    // Remove old subdirectory illustration folders (regenerate fresh)
    if (entry.isDirectory() && entry.name !== "fiori" && entry.name !== "tnt") {
      // skip non-illustration dirs
    }
  }
}

function cleanSetDir(dir) {
  if (!fs.existsSync(dir)) return;
  // Remove everything in the set dir to regenerate fresh
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  console.log("Generating illustrations (folder-per-illustration)...\n");

  // Parse i18n
  const i18nTexts = parseI18n(I18N_FILE);
  console.log(`Parsed ${Object.keys(i18nTexts).length} i18n entries\n`);

  // ── Fiori Illustrations ──
  const fioriDir = path.join(OUT_DIR, "fiori");
  cleanSetDir(fioriDir);

  const fioriNames = discoverIllustrations(FIORI_SVG_DIRS, "sapIllus");
  console.log(`Found ${fioriNames.length} Fiori illustrations`);

  let fioriCount = 0;
  for (const name of fioriNames) {
    const ok = generateIllustrationFolder(
      name, FIORI_SVG_DIRS, "sapIllus", "fiori", i18nTexts, fioriDir
    );
    if (ok) fioriCount++;
  }

  generateSetBarrelIndex(fioriNames, fioriDir);
  console.log(`Generated ${fioriCount} Fiori illustration folders\n`);

  // ── TNT Illustrations ──
  const tntDir = path.join(OUT_DIR, "tnt");
  cleanSetDir(tntDir);

  const tntNames = discoverIllustrations(TNT_SVG_DIRS, "tnt");
  console.log(`Found ${tntNames.length} TNT illustrations`);

  let tntCount = 0;
  for (const name of tntNames) {
    const ok = generateIllustrationFolder(
      name, TNT_SVG_DIRS, "tnt", "tnt", i18nTexts, tntDir
    );
    if (ok) tntCount++;
  }

  generateSetBarrelIndex(tntNames, tntDir);
  console.log(`Generated ${tntCount} TNT illustration folders\n`);

  // ── Main index (with Tnt prefix to avoid name conflicts) ──
  const tntReExports = tntNames
    .map((name) => `  ${name} as Tnt${name},`)
    .join("\n");

  const mainIndex = `// Re-export fiori as-is (primary set)
export * from "./fiori";

// Re-export tnt with Tnt prefix to avoid name conflicts (e.g., UnableToLoad)
export {
${tntReExports}
} from "./tnt";

export { createIllustration } from "./createIllustration";
export type { IllustrationProps, IllustrationMeta, IllustrationComponent } from "./types";
`;
  fs.writeFileSync(path.join(OUT_DIR, "index.ts"), mainIndex);

  // ── Summary ──
  const totalFiles = fioriCount + tntCount;
  const totalSizeFiles = totalFiles * 4; // 4 size variant files per illustration
  console.log(`Done! Generated ${totalFiles} illustration folders.`);
  console.log(`  Fiori: ${fioriCount} folders`);
  console.log(`  TNT:   ${tntCount} folders`);
  console.log(`  Total files: ${totalFiles * 6} (4 size variants + main + index per folder)`);
  console.log(`  Each size variant is a separate chunk for lazy loading.`);
}

main();

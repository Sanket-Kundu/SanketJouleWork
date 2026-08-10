import { defineConfig } from "tsup";
import { readdirSync, existsSync } from "fs";
import { join } from "path";

// Auto-discover all component entry points
const componentsDir = "src/components";
const componentEntries: Record<string, string> = {};
for (const name of readdirSync(componentsDir)) {
  const indexPath = join(componentsDir, name, "index.ts");
  if (existsSync(indexPath)) {
    // Normalize directory name to lowercase for consistent dist paths
    componentEntries[`components/${name.toLowerCase()}/index`] = indexPath;
  }
}

export default defineConfig({
  entry: {
    index: "src/index.ts",
    ...componentEntries,
    "illustrations/index": "src/illustrations/index.ts",
    "illustrations/fiori/index": "src/illustrations/fiori/index.ts",
    "illustrations/tnt/index": "src/illustrations/tnt/index.ts",
    "icons/index": "src/icons/index.ts",
    "icons-fx/index": "src/icons-fx/index.ts",
  },
  format: ["cjs", "esm"],
  dts: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "i18next", "react-i18next"],
  treeshake: true,
});

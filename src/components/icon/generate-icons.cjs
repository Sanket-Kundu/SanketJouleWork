const fs = require('fs');
const path = require('path');

const iconData = JSON.parse(fs.readFileSync(path.join(__dirname, 'sap-icons-data.json'), 'utf8'));

// Output to src/icons/
const outputDir = path.join(__dirname, '..', '..', 'icons');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Clean existing generated files
for (const f of fs.readdirSync(outputDir)) {
  fs.unlinkSync(path.join(outputDir, f));
}

function toCamelCase(str) {
  return str.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function toPascalCase(str) {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

const iconExports = [];
let count = 0;

for (const [iconName, iconInfo] of Object.entries(iconData.data)) {
  const kebabName = iconName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(?:^-|-$)/g, '');
  const paths = iconInfo.paths || (iconInfo.path ? [iconInfo.path] : []);

  if (paths.length === 0) continue;

  const pascalName = toPascalCase(kebabName);
  const componentName = pascalName + 'Icon';
  const arrayLiteral = `[\n  ${paths.map(p => `'${p}'`).join(',\n  ')}\n]`;

  const content = `import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = ${arrayLiteral} as const;

type ${componentName}Props = Omit<IconProps, "pathData">;

export const ${componentName} = Object.assign(
  React.forwardRef<IconRef, ${componentName}Props>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "${componentName}", iconName: "${iconName}" as const }
);
`;

  fs.writeFileSync(path.join(outputDir, `${pascalName}.tsx`), content);
  iconExports.push({ pascalName, componentName, iconName });
  count++;
}

// Generate index.ts barrel
const sorted = iconExports.sort((a, b) => a.pascalName.localeCompare(b.pascalName));

const indexContent = sorted
  .map(e => `export { ${e.componentName} } from "./${e.pascalName}";`)
  .join('\n') + '\n';

fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent);

console.log(`Generated ${count} icon components + index.ts in src/icons/`);

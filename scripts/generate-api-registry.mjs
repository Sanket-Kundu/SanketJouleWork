// AUTO-GENERATED api-registry builder
// Parses src/types/*.ts and outputs api-registry.generated.ts
// Usage: node scripts/generate-api-registry.mjs

import { createRequire } from "module";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, resolve, basename } from "path";

// Resolve typescript from root node_modules
const require = createRequire(join(import.meta.dirname, "..", "package.json"));
const ts = require("typescript");

const ROOT = resolve(import.meta.dirname, "..");
const TYPES_DIR = join(ROOT, "src/types");
const OUTPUT = join(ROOT, "demos/demo/src/components/api-registry.generated.ts");

// Map type file → page ID and which interface is the "main" Props
const FILE_MAP = {
  "avatar.ts":             { pageId: "avatar",             propsInterface: "AvatarProps" },
  "badge.ts":              { pageId: "badge",              propsInterface: "BadgeProps" },
  "bar.ts":                { pageId: "bar",                propsInterface: "BarProps" },
  "breadcrumbs.ts":        { pageId: "breadcrumbs",        propsInterface: "BreadcrumbsProps" },
  "busy-indicator.ts":     { pageId: "busyindicator",      propsInterface: "BusyIndicatorProps" },
  "button.ts":             { pageId: "button",             propsInterface: "ButtonProps" },
  "calendar.ts":           { pageId: "calendar",           propsInterface: "CalendarProps" },
  "card.ts":               { pageId: "card",               propsInterface: "CardProps" },
  "checkbox.ts":           { pageId: "checkbox",           propsInterface: "CheckBoxProps" },
  "combobox.ts":           { pageId: "combobox",           propsInterface: "ComboBoxProps" },
  "datepicker.ts":         { pageId: "datepicker",         propsInterface: "DatePickerProps" },
  "dialog.ts":             { pageId: "dialog",             propsInterface: "DialogProps" },
  "file-uploader.ts":      { pageId: "fileuploader",       propsInterface: "FileUploaderProps" },
  "search-field.ts":       { pageId: "searchfield",        propsInterface: "SearchFieldProps" },
  "icon.ts":               { pageId: "icon",               propsInterface: "IconProps" },
  "illustrated-message.ts":{ pageId: "illustratedmessage", propsInterface: "IllustratedMessageProps" },
  "input.ts":              { pageId: "input",              propsInterface: "InputProps" },
  "label.ts":              { pageId: "label",              propsInterface: "LabelProps" },
  "link.ts":               { pageId: "link",               propsInterface: "LinkProps" },
  "list.ts":               { pageId: "list",               propsInterface: "ListProps" },
  "menu.ts":               { pageId: "menu",               propsInterface: "MenuProps" },
  "messagestrip.ts":       { pageId: "messagestrip",       propsInterface: "MessageStripProps" },
  "notification.ts":       { pageId: "notification",       propsInterface: "NotificationListProps" },
  "panel.ts":              { pageId: "panel",              propsInterface: "PanelProps" },
  "popover.ts":            { pageId: "popover",            propsInterface: "PopoverProps" },
  "progress-indicator.ts": { pageId: "progressindicator",  propsInterface: "ProgressIndicatorProps" },
  "radiobutton.ts":        { pageId: "radiobutton",        propsInterface: "RadioButtonProps" },
  "responsive-popover.ts": { pageId: "responsive-popover", propsInterface: "ResponsivePopoverProps" },
  "segmented-button.ts":   { pageId: "segmentedbutton",    propsInterface: "SegmentedButtonProps" },
  "select.ts":             { pageId: "select",             propsInterface: "SelectProps" },
  "split-button.ts":       { pageId: "splitbutton",        propsInterface: "SplitButtonProps" },
  "switch.ts":             { pageId: "switch",             propsInterface: "SwitchProps" },
  "tabbar.ts":             { pageId: "tabbar",             propsInterface: "TabbarProps" },
  "table.ts":              { pageId: "table",              propsInterface: "TableProps" },
  "tabs.ts":               { pageId: "tabcontainer",       propsInterface: "TabContainerProps" },
  "tag.ts":                { pageId: "tag",                propsInterface: "TagProps" },
  "token.ts":              { pageId: "token",              propsInterface: "TokenProps" },
  "tokenizer.ts":          { pageId: "tokenizer",          propsInterface: "TokenizerProps" },
  "text.ts":               { pageId: "text",               propsInterface: "TextProps" },
  "textarea.ts":           { pageId: "textarea",           propsInterface: "TextareaProps" },
  "toggle.ts":             { pageId: "toggle",             propsInterface: "ToggleProps" },
  "toggle-button.ts":      { pageId: "togglebutton",       propsInterface: "ToggleButtonProps" },
  "toolbar.ts":            { pageId: "toolbar",            propsInterface: "ToolbarProps" },
  "user-menu.ts":          { pageId: "usermenu",           propsInterface: "UserMenuProps" },
};

// Ref interface name mapping (file → ref interface name)
const REF_MAP = {
  "avatar.ts": "AvatarRef",
  "badge.ts": "BadgeRef",
  "bar.ts": "BarRef",
  "breadcrumbs.ts": "BreadcrumbsRef",
  "busy-indicator.ts": "BusyIndicatorRef",
  "button.ts": "ButtonRef",
  "calendar.ts": "CalendarRef",
  "card.ts": "CardRef",
  "checkbox.ts": "CheckBoxRef",
  "dialog.ts": "DialogRef",
  "file-uploader.ts": "FileUploaderRef",
  "search-field.ts": "SearchFieldRef",
  "icon.ts": "IconRef",
  "illustrated-message.ts": "IllustratedMessageRef",
  "input.ts": "InputRef",
  "link.ts": "LinkRef",
  "list.ts": "ListRef",
  "menu.ts": "MenuRef",
  "messagestrip.ts": null,
  "notification.ts": "NotificationListRef",
  "panel.ts": "PanelRef",
  "popover.ts": "PopoverRef",
  "progress-indicator.ts": "ProgressIndicatorRef",
  "radiobutton.ts": "RadioButtonRef",
  "responsive-popover.ts": "ResponsivePopoverRef",
  "split-button.ts": "SplitButtonRef",
  "switch.ts": null,
  "table.ts": "TableRef",
  "tabs.ts": "TabContainerRef",
  "tag.ts": "TagRef",
  "token.ts": "TokenRef",
  "tokenizer.ts": "TokenizerRef",
  "text.ts": "TextRef",
  "textarea.ts": "TextareaRef",
  "toggle-button.ts": "ToggleButtonRef",
  "toolbar.ts": "ToolbarRef",
  "user-menu.ts": "UserMenuRef",
};

// Standard HTML props to skip (present on every component)
const SKIP_PROPS = new Set([
  "className", "style", "id", "data-testid", "\"data-testid\"", "data-ai-field", "\"data-ai-field\"", "data-ai-context", "\"data-ai-context\"",
]);

// ─── Helpers ────────────────────────────────────────────────────────────────

function getJSDoc(node, sourceFile) {
  // ts stores JSDoc in node.jsDoc array
  if (node.jsDoc && node.jsDoc.length > 0) {
    const doc = node.jsDoc[node.jsDoc.length - 1];
    if (doc.comment) {
      if (typeof doc.comment === "string") return doc.comment.trim();
      // ts 5.x: can be NodeArray<JSDocText | JSDocLink>
      return doc.comment.map(c => c.text || "").join("").trim();
    }
  }
  return "";
}

function getLeadingCategoryComment(node, sourceFile) {
  const fullText = sourceFile.getFullText();
  const start = node.getFullStart();
  const leading = fullText.substring(start, node.getStart(sourceFile));
  // Match "// === Category ===" or "// Category" style section comments
  const match = leading.match(/\/\/\s*={0,3}\s*(.+?)\s*={0,3}\s*$/m);
  if (match) {
    const cat = match[1].trim();
    // Filter out non-category comments (e.g., file headers)
    if (cat.length < 40 && !cat.startsWith("@") && !cat.startsWith("Re-export")) {
      return cat;
    }
  }
  return null;
}

function simplifyType(typeText) {
  if (!typeText) return "unknown";
  // Clean up import() references
  let t = typeText.replace(/import\([^)]+\)\./g, "");
  // Clean up template literal union: ButtonDesign | `${ButtonDesign}` → ButtonDesign
  t = t.replace(/\s*\|\s*`\$\{(\w+)\}`/g, "");
  // Clean up React. prefix
  t = t.replace(/React\./g, "");
  // Clean up ReactNode
  t = t.replace(/import\("react"\)\.ReactNode/g, "ReactNode");
  // Shorten long union types
  if (t.length > 80) {
    t = t.substring(0, 77) + "...";
  }
  return t.trim();
}

function extractEventDetailType(typeNode, sourceFile) {
  if (!typeNode) return "";
  const text = typeNode.getText(sourceFile);
  // Extract from function signature: (detail: FooDetail) => void
  const match = text.match(/\(\s*(?:detail|e|event|value)\s*:\s*([^)]+)\)\s*=>/);
  if (match) return simplifyType(match[1].trim());
  // Simple callback: () => void
  if (text.includes("() =>")) return "void";
  // (value: string) => void
  const simpleMatch = text.match(/\(\s*(\w+)\s*:\s*(\w+)\s*\)/);
  if (simpleMatch) return simpleMatch[2];
  return simplifyType(text);
}

// ─── Main parsing ───────────────────────────────────────────────────────────

function parseFile(filePath, fileName) {
  const config = FILE_MAP[fileName];
  if (!config) return null;

  const sourceText = readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest, true);

  const componentName = config.propsInterface.replace(/Props$/, "");
  const props = [];
  const events = [];
  const enums = [];
  const refMethods = [];
  let description = "";

  let currentCategory = null;

  function visit(node) {
    // Enums
    if (ts.isEnumDeclaration(node)) {
      const enumName = node.name.getText(sourceFile);
      const values = [];
      for (const member of node.members) {
        values.push({
          name: member.name.getText(sourceFile),
          description: getJSDoc(member, sourceFile),
        });
      }
      enums.push({ name: enumName, values });
    }

    // The main Props interface
    if (ts.isInterfaceDeclaration(node) && node.name.getText(sourceFile) === config.propsInterface) {
      description = getJSDoc(node, sourceFile);
      currentCategory = null;

      for (const member of node.members) {
        if (!ts.isPropertySignature(member)) continue;

        const propName = member.name.getText(sourceFile);
        if (SKIP_PROPS.has(propName)) continue;

        // Check for category comment
        const cat = getLeadingCategoryComment(member, sourceFile);
        if (cat) currentCategory = cat;

        const typeText = member.type ? simplifyType(member.type.getText(sourceFile)) : "unknown";
        const doc = getJSDoc(member, sourceFile);
        const isRequired = !member.questionToken;
        const isInternal = doc.includes("@internal");

        if (isInternal) continue;

        // Extract default from JSDoc @default
        let defaultVal;
        if (member.jsDoc) {
          for (const jd of member.jsDoc) {
            if (jd.tags) {
              for (const tag of jd.tags) {
                if (tag.tagName.getText(sourceFile) === "default") {
                  defaultVal = tag.comment?.toString().replace(/^["']|["']$/g, "");
                }
              }
            }
          }
        }

        // Is it an event? (starts with "on" and is a function type)
        if (/^on[A-Z]/.test(propName) && member.type && (
          ts.isFunctionTypeNode(member.type) ||
          member.type.getText(sourceFile).includes("=>")
        )) {
          events.push({
            name: propName,
            detailType: extractEventDetailType(member.type, sourceFile),
            description: doc.replace(/@default\s+.*/g, "").trim(),
          });
        } else {
          const prop = {
            name: propName,
            type: typeText,
            description: doc.replace(/@default\s+.*/g, "").trim(),
          };
          if (defaultVal) prop.default = defaultVal;
          if (isRequired) prop.required = true;
          if (currentCategory) prop.category = currentCategory;
          props.push(prop);
        }
      }
    }

    // Ref interface
    const refName = REF_MAP[fileName];
    if (refName && ts.isInterfaceDeclaration(node) && node.name.getText(sourceFile) === refName) {
      for (const member of node.members) {
        const doc = getJSDoc(member, sourceFile);
        if (ts.isMethodSignature(member)) {
          const name = member.name.getText(sourceFile);
          const params = member.parameters
            .map(p => `${p.name.getText(sourceFile)}${p.questionToken ? "?" : ""}: ${p.type ? simplifyType(p.type.getText(sourceFile)) : "any"}`)
            .join(", ");
          const ret = member.type ? simplifyType(member.type.getText(sourceFile)) : "void";
          refMethods.push({
            name,
            signature: `${name}(${params}): ${ret}`,
            description: doc,
          });
        } else if (ts.isPropertySignature(member)) {
          const name = member.name.getText(sourceFile);
          const typeText = member.type ? simplifyType(member.type.getText(sourceFile)) : "unknown";
          const isReadonly = member.modifiers?.some(m => m.kind === ts.SyntaxKind.ReadonlyKeyword);
          refMethods.push({
            name,
            signature: `${isReadonly ? "readonly " : ""}${name}: ${typeText}`,
            description: doc,
          });
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  const result = {
    name: componentName,
    props,
  };
  if (description) result.description = description;
  if (events.length > 0) result.events = events;
  if (enums.length > 0) result.enums = enums;
  if (refMethods.length > 0) result.refMethods = refMethods;

  return { pageId: config.pageId, data: result };
}

// ─── Generate output ────────────────────────────────────────────────────────

function generate() {
  const files = readdirSync(TYPES_DIR).filter(f => f.endsWith(".ts") && FILE_MAP[f]);
  const entries = [];

  for (const file of files) {
    const result = parseFile(join(TYPES_DIR, file), file);
    if (result && result.data.props.length > 0) {
      entries.push(result);
    }
  }

  // Sort by page ID
  entries.sort((a, b) => a.pageId.localeCompare(b.pageId));

  // Build output
  let out = `// AUTO-GENERATED — do not edit manually.
// Source: src/types/*.ts
// Regenerate: npm run generate:api-registry

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
  category?: string;
}

export interface EventDef {
  name: string;
  detailType: string;
  description: string;
}

export interface EnumDef {
  name: string;
  values: { name: string; description: string }[];
}

export interface RefMethodDef {
  name: string;
  signature: string;
  description: string;
}

export interface ComponentApiData {
  name: string;
  description?: string;
  props: PropDef[];
  events?: EventDef[];
  enums?: EnumDef[];
  refMethods?: RefMethodDef[];
}

export const apiRegistry: Record<string, ComponentApiData> = `;

  out += JSON.stringify(
    Object.fromEntries(entries.map(e => [e.pageId, e.data])),
    null,
    2,
  );

  out += ";\n";

  writeFileSync(OUTPUT, out, "utf-8");
  console.log(`Generated ${OUTPUT} with ${entries.length} components`);
}

generate();

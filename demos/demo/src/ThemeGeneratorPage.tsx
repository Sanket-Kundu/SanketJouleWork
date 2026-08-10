import { useState } from "react";
import {
  Button, ButtonDesign,
  ToggleButton,
  Input,
  Select, Option,
  CheckBox,
  RadioButton,
  Switch,
  Label,
  Tag, TagDesign,
  MessageStrip, MessageStripDesign,
  Link, LinkDesign,
  Avatar, AvatarShape, AvatarSize, AvatarColorScheme,
  Table, TableHeaderRow, TableHeaderCell, TableRow, TableCell,
  TabContainer, Tab,
  SegmentedButton, SegmentedButtonItem,
  Breadcrumbs, BreadcrumbsItem,
  List, ListItem,
  Title, TitleLevel,
  Text,
  Panel,
} from "@sap-ui/fx-components";

// ─── Color helpers ──────────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/** Perceived luminance (0-1). Used to pick contrasting text color. */
function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastColor(bg: string): string {
  return luminance(bg) > 0.4 ? "#111111" : "#FFFFFF";
}

// ─── Token definitions ──────────────────────────────────────────────────────

interface TokenGroup {
  label: string;
  tokens: { variable: string; name: string }[];
}

const TOKEN_GROUPS: TokenGroup[] = [
  {
    label: "base",
    tokens: [
      { variable: "--background", name: "100" },
      { variable: "--card", name: "200" },
      { variable: "--border", name: "300" },
      { variable: "--foreground", name: "content" },
    ],
  },
  {
    label: "primary",
    tokens: [
      { variable: "--primary", name: "color" },
      { variable: "--primary-foreground", name: "content" },
    ],
  },
  {
    label: "secondary",
    tokens: [
      { variable: "--secondary", name: "color" },
      { variable: "--secondary-foreground", name: "content" },
    ],
  },
  {
    label: "accent",
    tokens: [
      { variable: "--accent", name: "color" },
      { variable: "--accent-foreground", name: "content" },
    ],
  },
  {
    label: "muted",
    tokens: [
      { variable: "--muted", name: "color" },
      { variable: "--muted-foreground", name: "content" },
    ],
  },
  {
    label: "info",
    tokens: [
      { variable: "--info", name: "color" },
      { variable: "--info-bg", name: "bg" },
    ],
  },
  {
    label: "success",
    tokens: [
      { variable: "--positive", name: "color" },
      { variable: "--positive-bg", name: "bg" },
    ],
  },
  {
    label: "warning",
    tokens: [
      { variable: "--warning", name: "color" },
      { variable: "--warning-bg", name: "bg" },
    ],
  },
  {
    label: "error",
    tokens: [
      { variable: "--negative", name: "color" },
      { variable: "--negative-bg", name: "bg" },
    ],
  },
];

// Spacing tokens
const SPACING_TOKENS = [
  { variable: "--spacing-3xs", name: "3xs", default: "4px" },
  { variable: "--spacing-2xs", name: "2xs", default: "8px" },
  { variable: "--spacing-xs", name: "xs", default: "12px" },
  { variable: "--spacing-s", name: "s", default: "16px" },
  { variable: "--spacing-m", name: "m", default: "20px" },
  { variable: "--spacing-l", name: "l", default: "24px" },
  { variable: "--spacing-xl", name: "xl", default: "32px" },
  { variable: "--spacing-2xl", name: "2xl", default: "40px" },
  { variable: "--spacing-3xl", name: "3xl", default: "48px" },
  { variable: "--spacing-4xl", name: "4xl", default: "64px" },
];

// All CSS variables we track (for export / import)
const ALL_VARS = [
  "--background", "--foreground", "--card", "--card-foreground",
  "--popover", "--popover-foreground",
  "--primary", "--primary-foreground",
  "--secondary", "--secondary-foreground",
  "--muted", "--muted-foreground",
  "--accent", "--accent-foreground",
  "--destructive", "--destructive-foreground",
  "--border", "--input", "--ring", "--radius",
  "--negative", "--warning", "--info", "--positive",
  "--negative-bg", "--positive-bg", "--warning-bg", "--info-bg",
  ...SPACING_TOKENS.map((t) => t.variable),
];

type TokenMap = Record<string, string>;

// ─── Built-in themes ────────────────────────────────────────────────────────

interface BuiltInTheme {
  id: string;
  name: string;
  tokens: TokenMap;
}

// Default spacing values (shared by all built-in themes)
const DEFAULT_SPACING: TokenMap = Object.fromEntries(
  SPACING_TOKENS.map((t) => [t.variable, t.default])
);

const BUILT_IN_THEMES: BuiltInTheme[] = [
  {
    id: "light", name: "Sapphire Light",
    tokens: {
      "--background": "#F9FAFB", "--foreground": "#131625",
      "--card": "#FFFFFF", "--card-foreground": "#131625",
      "--popover": "#FFFFFF", "--popover-foreground": "#131625",
      "--primary": "#0070F2", "--primary-foreground": "#FFFFFF",
      "--secondary": "#F3F4F6", "--secondary-foreground": "#212635",
      "--muted": "#F3F4F6", "--muted-foreground": "#4D5261",
      "--accent": "#F3F4F6", "--accent-foreground": "#212635",
      "--destructive": "#C72F2B", "--destructive-foreground": "#FFFFFF",
      "--border": "#E6E7EA", "--input": "#E6E7EA", "--ring": "#0070F2",
      "--radius": "0.5rem",
      "--negative": "#C72F2B", "--warning": "#CA7E0C", "--info": "#0064D9", "--positive": "#007B3E",
      "--negative-bg": "#F6E6E7", "--positive-bg": "#DFEFE6", "--warning-bg": "#FEF5C8", "--info-bg": "#E2E9F8",
      ...DEFAULT_SPACING,
    },
  },
  {
    id: "dark", name: "Sapphire Dark",
    tokens: {
      "--background": "#040511", "--foreground": "#F3F4F6",
      "--card": "#040511", "--card-foreground": "#F3F4F6",
      "--popover": "#040511", "--popover-foreground": "#F3F4F6",
      "--primary": "#2CA0FF", "--primary-foreground": "#040511",
      "--secondary": "#181a1f", "--secondary-foreground": "#E6E7EA",
      "--muted": "#181a1f", "--muted-foreground": "#9EA1AD",
      "--accent": "#212635", "--accent-foreground": "#E6E7EA",
      "--destructive": "#F63F3B", "--destructive-foreground": "#FFFFFF",
      "--border": "#212635", "--input": "#212635", "--ring": "#2CA0FF",
      "--radius": "0.5rem",
      "--negative": "#F63F3B", "--warning": "#FAAB19", "--info": "#1B90FB", "--positive": "#039F32",
      "--negative-bg": "#401B1A", "--positive-bg": "#112015", "--warning-bg": "#501507", "--info-bg": "#142B41",
      ...DEFAULT_SPACING,
    },
  },
  {
    id: "rose", name: "Rose",
    tokens: {
      "--background": "#FFFFFF", "--foreground": "#0a0a12",
      "--card": "#FFFFFF", "--card-foreground": "#0a0a12",
      "--popover": "#FFFFFF", "--popover-foreground": "#0a0a12",
      "--primary": "#E11D48", "--primary-foreground": "#FFF1F2",
      "--secondary": "#F5F5F6", "--secondary-foreground": "#18181B",
      "--muted": "#F5F5F6", "--muted-foreground": "#6E6E77",
      "--accent": "#F5F5F6", "--accent-foreground": "#18181B",
      "--destructive": "#E11D48", "--destructive-foreground": "#FAFAFA",
      "--border": "#E4E4E7", "--input": "#E4E4E7", "--ring": "#E11D48",
      "--radius": "0.5rem",
      "--negative": "#C72F2B", "--warning": "#CA7E0C", "--info": "#0064D9", "--positive": "#007B3E",
      "--negative-bg": "#F6E6E7", "--positive-bg": "#DFEFE6", "--warning-bg": "#FEF5C8", "--info-bg": "#E2E9F8",
      ...DEFAULT_SPACING,
    },
  },
  {
    id: "green", name: "Green",
    tokens: {
      "--background": "#FFFFFF", "--foreground": "#0a0a12",
      "--card": "#FFFFFF", "--card-foreground": "#0a0a12",
      "--popover": "#FFFFFF", "--popover-foreground": "#0a0a12",
      "--primary": "#16A34A", "--primary-foreground": "#F0FDF4",
      "--secondary": "#F5F5F6", "--secondary-foreground": "#18181B",
      "--muted": "#F5F5F6", "--muted-foreground": "#6E6E77",
      "--accent": "#F5F5F6", "--accent-foreground": "#18181B",
      "--destructive": "#E11D48", "--destructive-foreground": "#FAFAFA",
      "--border": "#E4E4E7", "--input": "#E4E4E7", "--ring": "#16A34A",
      "--radius": "0.5rem",
      "--negative": "#C72F2B", "--warning": "#CA7E0C", "--info": "#0064D9", "--positive": "#007B3E",
      "--negative-bg": "#F6E6E7", "--positive-bg": "#DFEFE6", "--warning-bg": "#FEF5C8", "--info-bg": "#E2E9F8",
      ...DEFAULT_SPACING,
    },
  },
  {
    id: "orange", name: "Orange",
    tokens: {
      "--background": "#FFFFFF", "--foreground": "#1C1108",
      "--card": "#FFFFFF", "--card-foreground": "#1C1108",
      "--popover": "#FFFFFF", "--popover-foreground": "#1C1108",
      "--primary": "#EA580C", "--primary-foreground": "#FFF7ED",
      "--secondary": "#F5F5F0", "--secondary-foreground": "#1C1108",
      "--muted": "#F5F5F0", "--muted-foreground": "#78716C",
      "--accent": "#F5F5F0", "--accent-foreground": "#1C1108",
      "--destructive": "#E11D48", "--destructive-foreground": "#FAFAFA",
      "--border": "#E7E5E4", "--input": "#E7E5E4", "--ring": "#EA580C",
      "--radius": "0.5rem",
      "--negative": "#C72F2B", "--warning": "#CA7E0C", "--info": "#0064D9", "--positive": "#007B3E",
      "--negative-bg": "#F6E6E7", "--positive-bg": "#DFEFE6", "--warning-bg": "#FEF5C8", "--info-bg": "#E2E9F8",
      ...DEFAULT_SPACING,
    },
  },
  {
    id: "cyberpunk", name: "Cyberpunk",
    tokens: {
      "--background": "#1A0533", "--foreground": "#E8B4F8",
      "--card": "#240847", "--card-foreground": "#E8B4F8",
      "--popover": "#240847", "--popover-foreground": "#E8B4F8",
      "--primary": "#FF0080", "--primary-foreground": "#1A0533",
      "--secondary": "#00FFFF", "--secondary-foreground": "#1A0533",
      "--muted": "#2E1250", "--muted-foreground": "#C89DDB",
      "--accent": "#00FFFF", "--accent-foreground": "#1A0533",
      "--destructive": "#FF0000", "--destructive-foreground": "#1A0533",
      "--border": "#3D1A66", "--input": "#3D1A66", "--ring": "#FF0080",
      "--radius": "0.25rem",
      "--negative": "#F63F3B", "--warning": "#FAAB19", "--info": "#1B90FB", "--positive": "#039F32",
      "--negative-bg": "#401B1A", "--positive-bg": "#112015", "--warning-bg": "#501507", "--info-bg": "#142B41",
      ...DEFAULT_SPACING,
    },
  },
  {
    id: "forest", name: "Forest",
    tokens: {
      "--background": "#1A2E1F", "--foreground": "#C5E0C5",
      "--card": "#233829", "--card-foreground": "#C5E0C5",
      "--popover": "#233829", "--popover-foreground": "#C5E0C5",
      "--primary": "#3CB371", "--primary-foreground": "#1A2E1F",
      "--secondary": "#2D5C47", "--secondary-foreground": "#C5E0C5",
      "--muted": "#2A4433", "--muted-foreground": "#8DB68D",
      "--accent": "#7ACC40", "--accent-foreground": "#1A2E1F",
      "--destructive": "#CC4444", "--destructive-foreground": "#C5E0C5",
      "--border": "#3A5C3A", "--input": "#3A5C3A", "--ring": "#3CB371",
      "--radius": "0.5rem",
      "--negative": "#F63F3B", "--warning": "#FAAB19", "--info": "#1B90FB", "--positive": "#039F32",
      "--negative-bg": "#401B1A", "--positive-bg": "#112015", "--warning-bg": "#501507", "--info-bg": "#142B41",
      ...DEFAULT_SPACING,
    },
  },
  {
    id: "sunset", name: "Sunset",
    tokens: {
      "--background": "#FFF8F5", "--foreground": "#2D1810",
      "--card": "#FFFBFA", "--card-foreground": "#2D1810",
      "--popover": "#FFFBFA", "--popover-foreground": "#2D1810",
      "--primary": "#EF4444", "--primary-foreground": "#FFFFFF",
      "--secondary": "#F59E0B", "--secondary-foreground": "#FFFFFF",
      "--muted": "#FDE8D8", "--muted-foreground": "#7A5240",
      "--accent": "#FBBF24", "--accent-foreground": "#2D1810",
      "--destructive": "#DC2626", "--destructive-foreground": "#FAFAFA",
      "--border": "#F5D5C5", "--input": "#F5D5C5", "--ring": "#EF4444",
      "--radius": "1rem",
      "--negative": "#C72F2B", "--warning": "#CA7E0C", "--info": "#0064D9", "--positive": "#007B3E",
      "--negative-bg": "#F6E6E7", "--positive-bg": "#DFEFE6", "--warning-bg": "#FEF5C8", "--info-bg": "#E2E9F8",
      ...DEFAULT_SPACING,
    },
  },
  {
    id: "ocean", name: "Ocean Deep",
    tokens: {
      "--background": "#0A1929", "--foreground": "#B2DFDB",
      "--card": "#0D2137", "--card-foreground": "#B2DFDB",
      "--popover": "#0D2137", "--popover-foreground": "#B2DFDB",
      "--primary": "#26A69A", "--primary-foreground": "#0A1929",
      "--secondary": "#1A4064", "--secondary-foreground": "#B2DFDB",
      "--muted": "#163050", "--muted-foreground": "#6DA8A0",
      "--accent": "#00BFA5", "--accent-foreground": "#0A1929",
      "--destructive": "#EF6C00", "--destructive-foreground": "#0A1929",
      "--border": "#1A4064", "--input": "#1A4064", "--ring": "#26A69A",
      "--radius": "0.75rem",
      "--negative": "#F63F3B", "--warning": "#FAAB19", "--info": "#1B90FB", "--positive": "#039F32",
      "--negative-bg": "#401B1A", "--positive-bg": "#112015", "--warning-bg": "#501507", "--info-bg": "#142B41",
      ...DEFAULT_SPACING,
    },
  },
];

// ─── Random theme generation ────────────────────────────────────────────────

function generateRandomTheme(mode: "light" | "dark"): TokenMap {
  const hue = Math.floor(Math.random() * 360);
  const radiusOptions = ["0rem", "0.25rem", "0.5rem", "1rem", "2rem"];
  const radius = radiusOptions[Math.floor(Math.random() * radiusOptions.length)];
  const isDark = mode === "dark";

  if (isDark) {
    const bg = hslToHex(hue, 30, 6);
    const fg = hslToHex(hue, 15, 90);
    const card = hslToHex(hue, 25, 10);
    const primary = hslToHex(hue, 80, 60);
    const secondary = hslToHex((hue + 30) % 360, 30, 15);
    const muted = hslToHex(hue, 15, 18);
    const accent = hslToHex((hue + 60) % 360, 40, 20);
    const border = hslToHex(hue, 20, 22);
    return {
      "--background": bg, "--foreground": fg,
      "--card": card, "--card-foreground": fg,
      "--popover": card, "--popover-foreground": fg,
      "--primary": primary, "--primary-foreground": contrastColor(primary),
      "--secondary": secondary, "--secondary-foreground": fg,
      "--muted": muted, "--muted-foreground": hslToHex(hue, 10, 60),
      "--accent": accent, "--accent-foreground": fg,
      "--destructive": "#F63F3B", "--destructive-foreground": "#FFFFFF",
      "--border": border, "--input": border, "--ring": primary,
      "--radius": radius,
      "--negative": "#F63F3B", "--warning": "#FAAB19", "--info": "#1B90FB", "--positive": "#039F32",
      "--negative-bg": "#401B1A", "--positive-bg": "#112015", "--warning-bg": "#501507", "--info-bg": "#142B41",
      ...DEFAULT_SPACING,
    };
  } else {
    const bg = hslToHex(hue, 20, 98);
    const fg = hslToHex(hue, 30, 10);
    const card = hslToHex(hue, 15, 100);
    const primary = hslToHex(hue, 75, 48);
    const secondary = hslToHex((hue + 30) % 360, 20, 96);
    const muted = hslToHex(hue, 15, 96);
    const accent = hslToHex((hue + 60) % 360, 25, 96);
    const border = hslToHex(hue, 15, 90);
    return {
      "--background": bg, "--foreground": fg,
      "--card": card, "--card-foreground": fg,
      "--popover": card, "--popover-foreground": fg,
      "--primary": primary, "--primary-foreground": contrastColor(primary),
      "--secondary": secondary, "--secondary-foreground": fg,
      "--muted": muted, "--muted-foreground": hslToHex(hue, 10, 40),
      "--accent": accent, "--accent-foreground": fg,
      "--destructive": "#C72F2B", "--destructive-foreground": "#FFFFFF",
      "--border": border, "--input": border, "--ring": primary,
      "--radius": radius,
      "--negative": "#C72F2B", "--warning": "#CA7E0C", "--info": "#0064D9", "--positive": "#007B3E",
      "--negative-bg": "#F6E6E7", "--positive-bg": "#DFEFE6", "--warning-bg": "#FEF5C8", "--info-bg": "#E2E9F8",
      ...DEFAULT_SPACING,
    };
  }
}

// ─── CSS export ─────────────────────────────────────────────────────────────

function themeToCSS(tokens: TokenMap): string {
  const lines = ALL_VARS
    .filter((v) => tokens[v])
    .map((v) => `  ${v}: ${tokens[v]};`);
  return `:root {\n${lines.join("\n")}\n}`;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

/** A clickable color swatch with an "A" letter showing text contrast */
function ColorSwatch({
  color,
  contentColor,
  label,
  onColorChange,
  onContentChange,
}: {
  color: string;
  contentColor?: string;
  label: string;
  onColorChange: (hex: string) => void;
  onContentChange?: (hex: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        {/* Main color swatch */}
        <label
          className="w-10 h-10 rounded-lg border border-black/10 cursor-pointer hover:scale-105 transition-transform block relative overflow-hidden"
          style={{ backgroundColor: color }}
          title={label}
        >
          <input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>

        {/* Content/text-on-color swatch */}
        {contentColor && onContentChange && (
          <label
            className="w-10 h-10 rounded-lg border border-black/10 cursor-pointer hover:scale-105 transition-transform flex items-center justify-center font-bold text-sm relative overflow-hidden"
            style={{ backgroundColor: color, color: contentColor }}
            title={`${label} content`}
          >
            A
            <input
              type="color"
              value={contentColor}
              onChange={(e) => onContentChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
        )}
      </div>
      <span className="text-[11px] text-secondary-foreground">{label}</span>
    </div>
  );
}

/** Radius selector with visual previews */
function RadiusSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = ["0rem", "0.25rem", "0.5rem", "1rem", "2rem"];
  return (
    <div>
      <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
        <svg className="w-4 h-4 text-secondary-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
        </svg>
        Radius
      </h3>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`w-10 h-10 border-2 transition-colors ${
              value === opt
                ? "border-primary bg-primary/10"
                : "border-border hover:border-muted-foreground"
            }`}
            style={{ borderRadius: opt }}
            title={opt}
          />
        ))}
      </div>
    </div>
  );
}

/** Spacing scale editor — numeric inputs with visual bars */
function SpacingEditor({ tokens, onChange }: { tokens: TokenMap; onChange: (variable: string, value: string) => void }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
        <svg className="w-4 h-4 text-secondary-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </svg>
        Spacing
      </h3>
      <div className="space-y-1.5">
        {SPACING_TOKENS.map((t) => {
          const val = tokens[t.variable] || t.default;
          const px = parseInt(val);
          return (
            <div key={t.variable} className="flex items-center gap-2">
              <span className="text-[11px] text-secondary-foreground w-7 shrink-0 text-right">{t.name}</span>
              <div className="flex-1 h-5 flex items-center">
                <div
                  className="h-3 rounded-sm bg-primary/30"
                  style={{ width: `${Math.min(px, 64)}px` }}
                />
              </div>
              <input
                type="number"
                value={parseInt(val)}
                onChange={(e) => onChange(t.variable, `${e.target.value}px`)}
                className="w-14 px-1.5 py-0.5 text-xs text-right rounded border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                min={0}
                max={128}
              />
              <span className="text-[10px] text-secondary-foreground">px</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Table data for preview ──────────────────────────────────────────────────

interface Transaction {
  id: string;
  name: string;
  status: string;
  statusDesign: string;
  date: string;
  amount: string;
}

const TABLE_DATA: Transaction[] = [
  { id: "1", name: "Alice Chen", status: "Completed", statusDesign: "Positive", date: "Mar 28", amount: "$1,200.00" },
  { id: "2", name: "Bob Smith", status: "In progress", statusDesign: "Information", date: "Mar 27", amount: "$840.50" },
  { id: "3", name: "Charlie Kim", status: "Failed", statusDesign: "Negative", date: "Mar 26", amount: "$350.00" },
  { id: "4", name: "Dana Lee", status: "Pending", statusDesign: "Critical", date: "Mar 25", amount: "$625.75" },
];

/** Live preview panel — interactive dashboard card grid scoped via inline CSS variables */
function PreviewPanel({ tokens }: { tokens: TokenMap }) {
  // Re-apply Sapphire alias tokens so they resolve against the overridden base
  // tokens on this element (CSS var inheritance resolves at the level they're set).
  const aliasTokens: Record<string, string> = {
    // Text aliases
    "--text-primary": "var(--foreground)",
    "--text-secondary": "var(--secondary-foreground)",
    "--text-accent": "var(--primary)",
    "--text-on-surface": "var(--primary-foreground)",
    // Background aliases
    "--background-primary": "var(--background)",
    "--background-secondary": "var(--secondary)",
    "--background-tertiary": "var(--secondary)",
    "--canvas-primary": "var(--card)",
    "--card-bg-primary": "var(--card)",
    // Border aliases
    "--border-primary": "var(--border)",
    "--border-accent": "var(--ring)",
    // Button aliases
    "--brand-background": "var(--primary)",
    "--button-bg-disabled": "var(--secondary)",
    "--neutral-foreground-white": "var(--primary-foreground)",
    // Chrome aliases
    "--chrome-bg-primary": "var(--primary-foreground)",
    "--chrome-button-bg-selected": "var(--secondary)",
    "--chrome-button-fg-selected": "var(--primary)",
    "--chrome-button-bg-default": "var(--primary-foreground)",
    // Notification aliases (Sapphire tokens → Tailwind classes)
    "--color-sapphire-negative": "var(--negative)",
    "--color-sapphire-warning": "var(--warning)",
    "--color-sapphire-info": "var(--info)",
    "--color-sapphire-positive": "var(--positive)",
    "--color-sapphire-negative-bg": "var(--negative-bg)",
    "--color-sapphire-positive-bg": "var(--positive-bg)",
    "--color-sapphire-warning-bg": "var(--warning-bg)",
    "--color-sapphire-info-bg": "var(--info-bg)",
    // Border-radius aliases (rounded-lg/md/sm → --radius-lg/md/sm)
    "--radius-lg": "var(--radius)",
    "--radius-md": "calc(var(--radius) - 2px)",
    "--radius-sm": "calc(var(--radius) - 4px)",
    // Tailwind theme-layer aliases (used by bg-primary, bg-sapphire-brand-background, etc.)
    "--color-primary": "var(--primary)",
    "--color-primary-foreground": "var(--primary-foreground)",
    "--color-secondary": "var(--secondary)",
    "--color-secondary-foreground": "var(--secondary-foreground)",
    "--color-muted": "var(--muted)",
    "--color-muted-foreground": "var(--muted-foreground)",
    "--color-accent": "var(--accent)",
    "--color-accent-foreground": "var(--accent-foreground)",
    "--color-background": "var(--background)",
    "--color-foreground": "var(--foreground)",
    "--color-border": "var(--border)",
    "--color-input": "var(--input)",
    "--color-ring": "var(--ring)",
    "--color-card": "var(--card)",
    "--color-card-foreground": "var(--card-foreground)",
    "--color-destructive": "var(--destructive)",
    "--color-destructive-foreground": "var(--destructive-foreground)",
    "--color-sapphire-button-fg-disabled": "var(--button-fg-disabled, var(--muted-foreground))",
    "--color-sapphire-button-bg-disabled": "var(--button-bg-disabled)",
    "--color-sapphire-border-accent": "var(--border-accent)",
    "--color-sapphire-brand-foreground": "var(--brand-foreground, var(--primary))",
  };

  const style = Object.fromEntries([
    ...Object.entries(tokens).map(([k, v]) => [k, v]),
    ...Object.entries(aliasTokens),
  ]) as React.CSSProperties;

  const v = (name: string) => `var(${name})`;

  const cardStyle = {
    backgroundColor: v("--card"),
    border: `1px solid ${v("--border")}`,
    borderRadius: v("--radius"),
    padding: v("--spacing-m"),
  };

  const [checked, setChecked] = useState(false);
  const [toggled, setToggled] = useState(true);
  const [inputVal, setInputVal] = useState("");
  const [radioValue, setRadioValue] = useState("option1");
  const [selectedTab, setSelectedTab] = useState("tab1");
  const [segmentedId, setSegmentedId] = useState("view");
  const [selectValue, setSelectValue] = useState("opt1");
  const [toggleBtnPressed, setToggleBtnPressed] = useState(false);

  return (
    <div style={style} className="h-full overflow-hidden">
      <div
        className="h-full overflow-y-auto"
        style={{ backgroundColor: v("--background"), color: v("--foreground"), padding: v("--spacing-l") }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" style={{ gap: v("--spacing-s") }}>

          {/* ── Stat cards row ── */}
          <div className="rounded-lg" style={cardStyle}>
            <div className="text-xs font-medium" style={{ color: v("--muted-foreground"), marginBottom: v("--spacing-3xs") }}>Revenue</div>
            <div className="text-2xl font-bold" style={{ color: v("--foreground") }}>$12,450</div>
            <div className="text-xs font-medium" style={{ color: v("--positive"), marginTop: v("--spacing-2xs") }}>+15.3% from last week</div>
          </div>

          <div className="rounded-lg" style={cardStyle}>
            <div className="text-xs font-medium" style={{ color: v("--muted-foreground"), marginBottom: v("--spacing-3xs") }}>Active Users</div>
            <div className="text-2xl font-bold" style={{ color: v("--foreground") }}>2,847</div>
            <div className="text-xs font-medium" style={{ color: v("--info"), marginTop: v("--spacing-2xs") }}>+4.1% from yesterday</div>
          </div>

          <div className="rounded-lg" style={cardStyle}>
            <div className="text-xs font-medium" style={{ color: v("--muted-foreground"), marginBottom: v("--spacing-3xs") }}>Error Rate</div>
            <div className="text-2xl font-bold" style={{ color: v("--foreground") }}>0.12%</div>
            <div className="text-xs font-medium" style={{ color: v("--negative"), marginTop: v("--spacing-2xs") }}>+0.02% from last hour</div>
          </div>

          {/* ── Buttons card ── */}
          <div className="rounded-lg" style={cardStyle}>
            <div className="text-sm font-semibold" style={{ color: v("--foreground"), marginBottom: v("--spacing-xs") }}>Buttons</div>
            <div className="flex flex-wrap" style={{ gap: v("--spacing-2xs") }}>
              <Button design={ButtonDesign.Primary}>Primary</Button>
              <Button design={ButtonDesign.Secondary}>Default</Button>
              <Button design={ButtonDesign.Neutral}>Neutral</Button>
              <Button design={ButtonDesign.Tertiary}>Transparent</Button>
            </div>
            <div className="flex flex-wrap" style={{ gap: v("--spacing-2xs"), marginTop: v("--spacing-2xs") }}>
              <Button design={ButtonDesign.Neutral}>Flat</Button>
              <Button design={ButtonDesign.PrimaryJoule}>Joule</Button>
              <Button design={ButtonDesign.SecondaryJoule}>Joule Default</Button>
            </div>
            <div className="flex flex-wrap" style={{ gap: v("--spacing-2xs"), marginTop: v("--spacing-2xs") }}>
              <Button design={ButtonDesign.Primary} disabled>Disabled</Button>
              <ToggleButton pressed={toggleBtnPressed} onClick={() => setToggleBtnPressed((p) => !p)}>Toggle</ToggleButton>
            </div>
          </div>

          {/* ── Form Controls card ── */}
          <div className="rounded-lg" style={cardStyle}>
            <div className="text-sm font-semibold" style={{ color: v("--foreground"), marginBottom: v("--spacing-xs") }}>Form Controls</div>
            <div style={{ display: "flex", flexDirection: "column", gap: v("--spacing-xs") }}>
              <div>
                <Label showColon>Name</Label>
                <Input placeholder="Type something..." value={inputVal} onInput={(d) => setInputVal(d.value)} />
              </div>
              <div>
                <Label showColon>Category</Label>
                <Select value={selectValue} onChange={(d) => setSelectValue(d.selectedOption.value)}>
                  <Option value="opt1">Design</Option>
                  <Option value="opt2">Engineering</Option>
                  <Option value="opt3">Marketing</Option>
                </Select>
              </div>
              <CheckBox checked={checked} onChange={(d) => setChecked(d.checked)}>Remember me</CheckBox>
              <div className="flex items-center" style={{ gap: v("--spacing-xs") }}>
                <Switch checked={toggled} onChange={(d) => setToggled(d.checked)} />
                <span className="text-sm" style={{ color: v("--muted-foreground") }}>Notifications</span>
              </div>
              <div className="flex" style={{ gap: v("--spacing-xs") }}>
                <RadioButton name="preview-radio" value="option1" checked={radioValue === "option1"} onChange={() => setRadioValue("option1")}>Option A</RadioButton>
                <RadioButton name="preview-radio" value="option2" checked={radioValue === "option2"} onChange={() => setRadioValue("option2")}>Option B</RadioButton>
              </div>
            </div>
          </div>

          {/* ── Status & Feedback card ── */}
          <div className="rounded-lg" style={cardStyle}>
            <div className="text-sm font-semibold" style={{ color: v("--foreground"), marginBottom: v("--spacing-xs") }}>Status & Feedback</div>
            <div className="flex flex-wrap" style={{ gap: v("--spacing-2xs") }}>
              <Tag design={TagDesign.Information}>Info</Tag>
              <Tag design={TagDesign.Positive}>Success</Tag>
              <Tag design={TagDesign.Critical}>Warning</Tag>
              <Tag design={TagDesign.Negative}>Error</Tag>
              <Tag design={TagDesign.None}>Neutral</Tag>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: v("--spacing-2xs"), marginTop: v("--spacing-xs") }}>
              <MessageStrip design={MessageStripDesign.Information} hideCloseButton>System update available</MessageStrip>
              <MessageStrip design={MessageStripDesign.Positive} hideCloseButton>Deployment successful</MessageStrip>
              <MessageStrip design={MessageStripDesign.Warning} hideCloseButton>High memory usage</MessageStrip>
              <MessageStrip design={MessageStripDesign.Negative} hideCloseButton>Connection lost</MessageStrip>
            </div>
          </div>

          {/* ── Table card — spans 2 columns ── */}
          <div className="rounded-lg col-span-1 md:col-span-2 xl:col-span-2" style={cardStyle}>
            <div className="text-sm font-semibold" style={{ color: v("--foreground"), marginBottom: v("--spacing-xs") }}>Data Table</div>
            <Table accessibleName="Transactions">
              <TableHeaderRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell horizontalAlign="End">Amount</TableHeaderCell>
              </TableHeaderRow>
              {TABLE_DATA.map((t) => (
                <TableRow key={t.id} rowKey={t.id}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell><Tag design={t.statusDesign as TagDesign}>{t.status}</Tag></TableCell>
                  <TableCell>{t.date}</TableCell>
                  <TableCell>{t.amount}</TableCell>
                </TableRow>
              ))}
            </Table>
          </div>

          {/* ── Navigation card ── */}
          <div className="rounded-lg" style={cardStyle}>
            <div className="text-sm font-semibold" style={{ color: v("--foreground"), marginBottom: v("--spacing-xs") }}>Navigation</div>
            <div style={{ display: "flex", flexDirection: "column", gap: v("--spacing-xs") }}>
              <Breadcrumbs>
                <BreadcrumbsItem>Home</BreadcrumbsItem>
                <BreadcrumbsItem>Products</BreadcrumbsItem>
                <BreadcrumbsItem>Detail</BreadcrumbsItem>
              </Breadcrumbs>

              <TabContainer selectedTabId={selectedTab} onSelectionChange={(d) => setSelectedTab(d.selectedTabId)}>
                <Tab id="tab1" text="Overview">Overview content</Tab>
                <Tab id="tab2" text="Details">Details content</Tab>
                <Tab id="tab3" text="Reviews" additionalText="3">Reviews content</Tab>
              </TabContainer>

              <SegmentedButton selectedId={segmentedId} onSelectionChange={(d) => setSegmentedId(d.selectedId)}>
                <SegmentedButtonItem id="view" text="View" />
                <SegmentedButtonItem id="edit" text="Edit" />
                <SegmentedButtonItem id="test" text="Test" />
              </SegmentedButton>
            </div>
          </div>

          {/* ── Data Display card ── */}
          <div className="rounded-lg col-span-1 md:col-span-2 xl:col-span-2" style={cardStyle}>
            <div className="text-sm font-semibold" style={{ color: v("--foreground"), marginBottom: v("--spacing-xs") }}>Data Display</div>
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: v("--spacing-s") }}>
              <div style={{ display: "flex", flexDirection: "column", gap: v("--spacing-xs") }}>
                <div className="flex items-center" style={{ gap: v("--spacing-2xs") }}>
                  <Avatar size={AvatarSize.S} colorScheme={AvatarColorScheme.Accent1} initials="AC" />
                  <Avatar size={AvatarSize.S} colorScheme={AvatarColorScheme.Accent3} initials="BS" />
                  <Avatar size={AvatarSize.S} colorScheme={AvatarColorScheme.Accent6} initials="CK" />
                  <Avatar size={AvatarSize.S} shape={AvatarShape.Square} colorScheme={AvatarColorScheme.Accent8} initials="DL" />
                </div>
                <div className="flex flex-wrap" style={{ gap: v("--spacing-xs") }}>
                  <Link design={LinkDesign.Default} href="#">Default Link</Link>
                  <Link design={LinkDesign.Subtle} href="#">Subtle</Link>
                  <Link design={LinkDesign.Emphasized} href="#">Emphasized</Link>
                </div>
                <Panel headerText="Collapsible Section" defaultCollapsed>
                  <Text>Panel content goes here. This section can be expanded and collapsed.</Text>
                </Panel>
              </div>
              <div>
                <List>
                  <ListItem description="Software Engineer">Alice Chen</ListItem>
                  <ListItem description="Product Manager">Bob Smith</ListItem>
                  <ListItem description="UX Designer">Charlie Kim</ListItem>
                </List>
              </div>
            </div>
          </div>

          {/* ── Typography & Colors card ── */}
          <div className="rounded-lg col-span-1" style={cardStyle}>
            <div className="text-sm font-semibold" style={{ color: v("--foreground"), marginBottom: v("--spacing-xs") }}>Typography & Colors</div>
            <div style={{ display: "flex", flexDirection: "column", gap: v("--spacing-2xs") }}>
              <Title level={TitleLevel.H4}>Heading text</Title>
              <Text>Body text in foreground color</Text>
              <p className="text-sm" style={{ color: v("--secondary-foreground") }}>Secondary text</p>
              <p className="text-sm" style={{ color: v("--muted-foreground") }}>Muted description text</p>
              <Link design={LinkDesign.Default} href="#">Primary accent link</Link>
            </div>
            <div className="flex flex-wrap" style={{ gap: v("--spacing-2xs"), marginTop: v("--spacing-xs") }}>
              <div className="flex items-center" style={{ gap: v("--spacing-2xs") }}>
                <div className="w-8 h-8 rounded" style={{ backgroundColor: v("--background"), border: `1px solid ${v("--border")}` }} />
                <span className="text-xs" style={{ color: v("--muted-foreground") }}>BG</span>
              </div>
              <div className="flex items-center" style={{ gap: v("--spacing-2xs") }}>
                <div className="w-8 h-8 rounded" style={{ backgroundColor: v("--card"), border: `1px solid ${v("--border")}` }} />
                <span className="text-xs" style={{ color: v("--muted-foreground") }}>Card</span>
              </div>
              <div className="flex items-center" style={{ gap: v("--spacing-2xs") }}>
                <div className="w-8 h-8 rounded" style={{ backgroundColor: v("--muted") }} />
                <span className="text-xs" style={{ color: v("--muted-foreground") }}>Muted</span>
              </div>
              <div className="flex items-center" style={{ gap: v("--spacing-2xs") }}>
                <div className="w-8 h-8 rounded" style={{ backgroundColor: v("--accent") }} />
                <span className="text-xs" style={{ color: v("--muted-foreground") }}>Accent</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── CSS Export Modal ───────────────────────────────────────────────────────

function CSSExportModal({
  open,
  onClose,
  tokens,
}: {
  open: boolean;
  onClose: () => void;
  tokens: TokenMap;
}) {
  const [copied, setCopied] = useState(false);
  const css = themeToCSS(tokens);

  if (!open) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-lg">{"{ }"}</span>
            <span className="text-sm">
              Add theme to your CSS file
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-border hover:bg-muted transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
            </svg>
            {copied ? "Copied!" : "Copy to clipboard"}
          </button>
        </div>
        {/* Code */}
        <div className="overflow-y-auto p-5">
          <pre className="text-xs font-mono whitespace-pre-wrap text-secondary-foreground bg-muted/50 p-4 rounded-lg">
            {css}
          </pre>
        </div>
        {/* Close */}
        <div className="flex justify-end px-5 py-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export function ThemeGeneratorPage() {
  const [tokens, setTokens] = useState<TokenMap>({ ...BUILT_IN_THEMES[0].tokens });
  const [selectedThemeId, setSelectedThemeId] = useState("light");
  const [exportOpen, setExportOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"themes" | "editor" | "preview">("editor");

  const updateToken = (variable: string, value: string) => {
    setTokens((prev) => ({ ...prev, [variable]: value }));
    setSelectedThemeId(""); // mark as custom
  };

  const loadTheme = (theme: BuiltInTheme) => {
    setTokens({ ...theme.tokens });
    setSelectedThemeId(theme.id);
  };

  const handleRandom = () => {
    const mode = document.documentElement.classList.contains("theme-dark") ? "dark" : "light";
    setTokens(generateRandomTheme(mode));
    setSelectedThemeId("");
  };

  // ── Reusable content fragments ──

  const themeListContent = (
    <div className="space-y-0.5">
      {BUILT_IN_THEMES.map((theme) => (
        <button
          key={theme.id}
          type="button"
          onClick={() => loadTheme(theme)}
          className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 transition-colors ${
            selectedThemeId === theme.id
              ? "bg-primary/10 text-primary font-medium"
              : "text-secondary-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <span className="flex gap-0.5 shrink-0">
            <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: theme.tokens["--primary"] }} />
            <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: theme.tokens["--secondary"] }} />
            <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: theme.tokens["--accent"] }} />
          </span>
          {theme.name}
        </button>
      ))}
    </div>
  );

  const themeStripContent = (
    <div className="flex gap-1.5 overflow-x-auto pb-2 px-1">
      {BUILT_IN_THEMES.map((theme) => (
        <button
          key={theme.id}
          type="button"
          onClick={() => loadTheme(theme)}
          className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-full border transition-colors ${
            selectedThemeId === theme.id
              ? "border-primary bg-primary/10 text-primary font-medium"
              : "border-border text-secondary-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: theme.tokens["--primary"] }} />
          {theme.name}
        </button>
      ))}
    </div>
  );

  const editorContent = (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleRandom}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
          </svg>
          Random
        </button>
        <button
          type="button"
          onClick={() => setExportOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity"
        >
          <span className="font-mono text-xs">{"{ }"}</span>
          CSS
        </button>
      </div>

      {/* Color groups */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-secondary-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
          </svg>
          Change Colors
        </h3>

        <div className="space-y-5">
          {TOKEN_GROUPS.map((group) => {
            const isColorPair = group.tokens.length === 2 && group.tokens[1].name === "content";
            const isBgPair = group.tokens.length === 2 && group.tokens[1].name === "bg";

            if (isColorPair) {
              const [main, content] = group.tokens;
              return (
                <ColorSwatch
                  key={group.label}
                  color={tokens[main.variable] || "#000000"}
                  contentColor={tokens[content.variable] || "#FFFFFF"}
                  label={group.label}
                  onColorChange={(hex) => updateToken(main.variable, hex)}
                  onContentChange={(hex) => updateToken(content.variable, hex)}
                />
              );
            }

            if (isBgPair) {
              const [main, bg] = group.tokens;
              return (
                <div key={group.label} className="flex flex-col gap-1.5">
                  <div className="flex gap-1.5">
                    <ColorSwatch
                      color={tokens[main.variable] || "#000000"}
                      label=""
                      onColorChange={(hex) => updateToken(main.variable, hex)}
                    />
                    <ColorSwatch
                      color={tokens[bg.variable] || "#F0F0F0"}
                      label=""
                      onColorChange={(hex) => updateToken(bg.variable, hex)}
                    />
                  </div>
                  <span className="text-[11px] text-secondary-foreground">{group.label}</span>
                </div>
              );
            }

            // Base group: 4 swatches in a row
            return (
              <div key={group.label} className="flex flex-col gap-1.5">
                <div className="flex gap-1.5">
                  {group.tokens.map((t) => (
                    <div key={t.variable}>
                      <ColorSwatch
                        color={tokens[t.variable] || "#000000"}
                        label=""
                        onColorChange={(hex) => updateToken(t.variable, hex)}
                      />
                      <span className="text-[10px] text-secondary-foreground block mt-0.5">{t.name}</span>
                    </div>
                  ))}
                </div>
                <span className="text-[11px] text-secondary-foreground">{group.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Radius */}
      <RadiusSelector
        value={tokens["--radius"] || "0.5rem"}
        onChange={(v) => updateToken("--radius", v)}
      />

      {/* Spacing */}
      <SpacingEditor
        tokens={tokens}
        onChange={updateToken}
      />
    </div>
  );

  const previewContent = (
    <PreviewPanel tokens={tokens} />
  );

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* ── Mobile tab bar (< md) ── */}
      <div className="flex md:hidden border-b border-border shrink-0">
        {(["themes", "editor", "preview"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setMobileTab(tab)}
            className={`flex-1 px-3 py-2.5 text-sm font-medium capitalize transition-colors ${
              mobileTab === tab
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-secondary-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Mobile layout (< md): one tab at a time ── */}
      <div className="flex-1 overflow-hidden md:hidden">
        {mobileTab === "themes" && (
          <div className="h-full overflow-y-auto bg-card p-3">
            <h2 className="text-sm font-semibold text-foreground mb-3">Themes</h2>
            {themeListContent}
          </div>
        )}
        {mobileTab === "editor" && (
          <div className="h-full overflow-y-auto p-5">
            {editorContent}
          </div>
        )}
        {mobileTab === "preview" && (
          <div className="h-full overflow-hidden bg-muted/30 p-2">
            {previewContent}
          </div>
        )}
      </div>

      {/* ── Tablet layout (md to lg): two columns ── */}
      <div className="hidden md:flex lg:hidden flex-1 overflow-hidden">
        {/* Left: theme strip + editor */}
        <div className="w-72 shrink-0 border-r border-border overflow-y-auto">
          <div className="p-3 border-b border-border">
            <h2 className="text-xs font-semibold text-secondary-foreground uppercase tracking-wider mb-2">Themes</h2>
            {themeStripContent}
          </div>
          <div className="p-5">
            {editorContent}
          </div>
        </div>
        {/* Right: preview */}
        <div className="flex-1 overflow-hidden bg-muted/30 p-2">
          {previewContent}
        </div>
      </div>

      {/* ── Desktop layout (lg+): three columns ── */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Left: Theme list sidebar */}
        <div className="w-48 shrink-0 border-r border-border overflow-y-auto bg-card">
          <div className="p-3">
            <h2 className="text-sm font-semibold text-foreground mb-3">Themes</h2>
            {themeListContent}
          </div>
        </div>
        {/* Middle: Color editor */}
        <div className="w-[340px] shrink-0 border-r border-border overflow-y-auto p-5">
          {editorContent}
        </div>
        {/* Right: Live preview */}
        <div className="flex-1 overflow-hidden bg-muted/30 p-2">
          {previewContent}
        </div>
      </div>

      {/* Export modal */}
      <CSSExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        tokens={tokens}
      />
    </div>
  );
}

import type { ReactNode } from "react";

/**
 * A single theme entry in the available themes list.
 * The id is the CSS class suffix (e.g. "dark" -> .theme-dark).
 * An empty string "" means the default theme (no class applied, :root defaults).
 */
export interface ThemeDefinition {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

/**
 * The value exposed by useTheme().
 */
export interface ThemeContextValue {
  /** The stored preference — "system" or a theme id like "" | "dark" | "slate" */
  theme: string;
  /** The actually-applied theme id (resolves "system" to "" or "dark") */
  resolvedTheme: string;
  /** Whether the system color scheme is dark */
  systemIsDark: boolean;
  /** All available themes */
  themes: ThemeDefinition[];
  /** Change the active theme */
  setTheme: (theme: string) => void;
}

/**
 * Props for ThemeProvider.
 */
export interface ThemeProviderProps {
  /**
   * The list of themes this instance knows about.
   * Required so the provider can clean up old classes on change.
   * Each id must match the CSS class suffix used in your CSS.
   */
  themes: ThemeDefinition[];
  /**
   * Initial/default theme id.
   * Defaults to "light".
   */
  defaultTheme?: string;
  children: ReactNode;
}

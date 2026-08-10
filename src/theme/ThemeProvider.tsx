import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ThemeContextValue, ThemeProviderProps } from "./types";

const STORAGE_KEY = "fx-theme";

function getSystemIsDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getStoredTheme(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeTheme(theme: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors
  }
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Provider component for theme management.
 *
 * Manages theme state, applies CSS classes to `<html>`,
 * and detects system color scheme preference.
 * Theme selection is persisted to localStorage.
 *
 * @example
 * ```tsx
 * const THEMES = [
 *   { id: "light", name: "Light" },
 *   { id: "dark", name: "Dark" },
 *   { id: "ocean", name: "Ocean Deep" },
 * ];
 *
 * <ThemeProvider themes={THEMES}>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  themes,
  defaultTheme = "light",
  children,
}: ThemeProviderProps) {
  const [theme, setThemeRaw] = useState<string>(() => getStoredTheme() ?? defaultTheme);
  const [systemIsDark, setSystemIsDark] = useState<boolean>(getSystemIsDark);

  // Listen to OS color scheme changes
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const resolvedTheme = theme === "system" ? (systemIsDark ? "dark" : "light") : theme;

  // Apply theme class and color-scheme to <html>
  useEffect(() => {
    const root = document.documentElement;
    // Remove all known theme classes + shadcn compat class
    root.classList.remove("dark");
    themes.forEach((t) => {
      if (t.id) root.classList.remove(`theme-${t.id}`);
    });
    // Add current theme class
    if (resolvedTheme) {
      root.classList.add(`theme-${resolvedTheme}`);
      // Add .dark for shadcn compatibility
      if (resolvedTheme === "dark") {
        root.classList.add("dark");
      }
    }
    // Set color-scheme so the browser doesn't override with OS preference.
    // When theme is "system", let the browser follow the OS preference.
    if (theme === "system") {
      root.style.colorScheme = "";
    } else {
      root.style.colorScheme = resolvedTheme === "dark" ? "dark" : "light";
    }
  }, [theme, resolvedTheme, themes]);

  const setTheme = useCallback((next: string) => {
    setThemeRaw(next);
    storeTheme(next);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, systemIsDark, themes, setTheme }),
    [theme, resolvedTheme, systemIsDark, themes, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access theme state and controls.
 *
 * @example
 * ```tsx
 * function ThemeToggle() {
 *   const { theme, resolvedTheme, setTheme } = useTheme();
 *   return (
 *     <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
 *       Currently: {resolvedTheme}
 *     </button>
 *   );
 * }
 * ```
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return ctx;
}

ThemeProvider.displayName = "ThemeProvider";

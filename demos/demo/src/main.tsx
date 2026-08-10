import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import ReactDOM from "react-dom/client";
import Calendar from "./Calendar.tsx";
import ComboBoxPage from "./ComboBoxPage.tsx";
import SelectPage from "./SelectPage.tsx";
import { InputPage } from "./InputPage.tsx";
import { IconPage } from "./IconPage.tsx";
import { TextareaPage } from "./TextareaPage.tsx";
import { DatePickerPage } from "./DatePickerPage.tsx";
import { TablePage } from "./TablePage.tsx";
import { ButtonPage } from "./ButtonPage.tsx";
import { CheckBoxPage } from "./CheckBoxPage.tsx";
import RadioButtonPage from "./RadioButtonPage.tsx";
import LabelPage from "./LabelPage.tsx";
import { TabContainerPage } from "./TabContainerPage.tsx";
import { CardPage } from "./CardPage.tsx";
import { TagPage } from "./TagPage.tsx";
import { TokenPage } from "./TokenPage.tsx";
import { TokenizerPage } from "./TokenizerPage.tsx";
import { BarPage } from "./BarPage.tsx";
import { BusyIndicatorPage } from "./BusyIndicatorPage.tsx";
import { LinkPage } from "./LinkPage.tsx";
import { MessageStripPage } from "./MessageStripPage.tsx";
import { MultiComboBoxPage } from "./MultiComboBoxPage.tsx";
import { SwitchPage } from "./SwitchPage.tsx";
import { ToggleButtonPage } from "./ToggleButtonPage.tsx";
import { ListPage } from "./ListPage.tsx";
import { BreadcrumbsPage } from "./BreadcrumbsPage.tsx";
import { PanelPage } from "./PanelPage.tsx";
import { NotificationPage } from "./NotificationPage.tsx";
import { DialogPage } from "./DialogPage.tsx";
import { FileUploaderPage } from "./FileUploaderPage.tsx";
import { PopoverPage } from "./PopoverPage.tsx";
import { ProgressIndicatorPage } from "./ProgressIndicatorPage.tsx";
import { IllustratedMessagePage } from "./IllustratedMessagePage.tsx";
import { SplitButtonPage } from "./SplitButtonPage.tsx";
import { SkeletonPage } from "./SkeletonPage.tsx";
import { SliderPage } from "./SliderPage.tsx";
import { SegmentedButtonPage } from "./SegmentedButtonPage.tsx";
import { SearchFieldPage } from "./SearchFieldPage.tsx";
import { ResponsivePopoverPage } from "./ResponsivePopoverPage.tsx";
import { MenuPage } from "./MenuPage.tsx";
import { ApiPanel } from "./components/ApiPanel.tsx";
import { TextPage } from "./TextPage.tsx";
import { TitlePage } from "./TitlePage.tsx";
import { ToolbarPage } from "./ToolbarPage.tsx";
import { ToastPage } from "./ToastPage.tsx";
import { PreviewPage } from "./PreviewPage.tsx";
import { InstallationPage } from "./InstallationPage.tsx";
import { AvatarPage } from "./AvatarPage.tsx";
import { ThemingPage } from "./ThemingPage.tsx";
import TabbarDemo from "./pages/TabbarDemo.tsx";
import { ThemeGeneratorPage } from "./ThemeGeneratorPage.tsx";
import { apiRegistry } from "./components/api-registry.generated.ts";
import type { ThemeDefinition } from "@sap-ui/fx-components";
import { initFxI18n, loadFxTranslations, isRTLLocale, ensureCldr, ThemeProvider, useTheme, Select, Option, Dialog, Button, fixSafariActiveState } from "@sap-ui/fx-components";
import i18n from "i18next";
import packageJson from "../../../package.json";

import "./index.css";

// Apply Safari iOS active state fix on load
// This ensures :active CSS state works properly for touch interactions
fixSafariActiveState();

// Component demo pages (alphabetical)
const DEMO_PAGES = [
  { id: "installation", name: "Getting Started", doc: true },
  { id: "theming", name: "Theming", doc: true },
  { id: "theme-generator", name: "Theme Generator", doc: true },
  { id: "preview", name: "Components", doc: true },
  { id: "avatar", name: "Avatar", ready: true },
  { id: "breadcrumbs", name: "Breadcrumbs", ready: true },
  { id: "busyindicator", name: "BusyIndicator", ready: true },
  { id: "button", name: "Button", ready: true },
  { id: "calendar", name: "Calendar", ready: true },
  { id: "card", name: "Card", ready: true },
  { id: "checkbox", name: "CheckBox", ready: true },
  { id: "combobox", name: "ComboBox", ready: true },
  { id: "datepicker", name: "DatePicker", ready: true },
  { id: "dialog", name: "Dialog", ready: true },
  { id: "fileuploader", name: "FileUploader", ready: true },
  { id: "icon", name: "Icon", ready: true },
  { id: "illustratedmessage", name: "IllustratedMessage", ready: true },
  { id: "input", name: "Input", ready: true },
  { id: "label", name: "Label", ready: true },
  { id: "link", name: "Link", ready: true },
  { id: "list", name: "List", ready: true },
  { id: "messagestrip", name: "MessageStrip", ready: true },
  { id: "panel", name: "Panel", ready: true },
  { id: "popover", name: "Popover", ready: true },
  { id: "progressindicator", name: "ProgressIndicator", ready: true },
  { id: "radiobutton", name: "RadioButton", ready: true },
  { id: "segmentedbutton", name: "SegmentedButton", ready: true },
  { id: "select", name: "Select", ready: true },
  { id: "searchfield", name: "SearchField", ready: true },
  { id: "splitbutton", name: "SplitButton", ready: true },
  { id: "tag", name: "Tag", ready: true },
  { id: "menu", name: "Menu", ready: true },
  { id: "multicombobox", name: "MultiComboBox", ready: true },
  { id: "notification", name: "NotificationList", ready: true },
  { id: "table", name: "Table", ready: true },
  { id: "tabbar", name: "Tabbar", ready: true },
  { id: "token", name: "Token", ready: true },
  { id: "text", name: "Text", ready: true },
  { id: "textarea", name: "Textarea", ready: true },
  { id: "title", name: "Title", ready: true },
  { id: "toast", name: "Toast", ready: true },
  { id: "switch", name: "Switch", ready: true },
  { id: "togglebutton", name: "ToggleButton", ready: true },
  { id: "toolbar", name: "Toolbar", ready: true },
  { id: "responsive-popover", name: "ResponsivePopover", ready: true },
];

// Available locales — aligned with shell-ui supported languages
const LOCALES = [
  { code: "en-US", name: "English", native: "English", dir: "ltr" as const },
  { code: "de-DE", name: "German", native: "Deutsch", dir: "ltr" as const },
  { code: "es-ES", name: "Spanish", native: "Español", dir: "ltr" as const },
  { code: "fr-FR", name: "French", native: "Français", dir: "ltr" as const },
  { code: "ja-JP", name: "Japanese", native: "日本語", dir: "ltr" as const },
  { code: "pt-BR", name: "Portuguese", native: "Português", dir: "ltr" as const },
  { code: "zh-CN", name: "Chinese (Simplified)", native: "简体中文", dir: "ltr" as const },
];

// Available themes
const THEMES: ThemeDefinition[] = [
  { id: "light", name: "Sapphire Light", description: "Light theme" },
  { id: "dark", name: "Sapphire Dark", description: "Dark theme" },
];

// App-level locale context for components that need to know the current locale
interface AppLocaleContextValue {
  locale: string;
  dir: "ltr" | "rtl";
  dirOverride: "ltr" | "rtl" | null;
  toggleDir: () => void;
  setLocale: (code: string) => void;
}

const AppLocaleContext = createContext<AppLocaleContextValue>({
  locale: "en-US",
  dir: "ltr",
  dirOverride: null,
  toggleDir: () => {},
  setLocale: () => {},
});

export const useAppLocale = () => useContext(AppLocaleContext);

// Language selector component using shadcn-ui5 Select
function LanguageSelector() {
  const { locale, setLocale } = useAppLocale();

  return (
    <Select
      value={locale}
      onChange={(detail) => {
        if (detail.selectedOption?.value) {
          setLocale(detail.selectedOption.value);
        }
      }}
      className="min-w-[180px]"
    >
      {LOCALES.map((loc) => (
        <Option
          key={loc.code}
          value={loc.code}
          additionalText={loc.dir.toUpperCase()}
        >
          {loc.native}
        </Option>
      ))}
    </Select>
  );
}

// Theme selector component using shadcn-ui5 Select
function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <Select
      value={theme}
      onChange={(detail) => {
        setTheme(detail.selectedOption?.value ?? "");
      }}
      className="min-w-[160px]"
    >
      {THEMES.map((t) => (
        <Option key={t.id} value={t.id}>
          {t.name}
        </Option>
      ))}
    </Select>
  );
}

const SM_BREAKPOINT = 640;
const MD_BREAKPOINT = 768;

// RTL toggle button component
function RTLToggle() {
  const { dir, dirOverride, toggleDir } = useAppLocale();
  const isOverridden = dirOverride !== null;

  return (
    <button
      type="button"
      onClick={toggleDir}
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono font-medium
        transition-colors border
        ${isOverridden
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
        }
      `}
      title={
        isOverridden
          ? `Direction overridden to ${dir.toUpperCase()} (click to reset to auto)`
          : `Current: ${dir.toUpperCase()} (from locale). Click to toggle.`
      }
      aria-label={`Text direction: ${dir.toUpperCase()}${isOverridden ? " (overridden)" : ""}. Click to toggle.`}
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12H3M3 12l4-4M3 12l4 4M21 6h-8M21 18h-8" />
      </svg>
      {dir.toUpperCase()}
      {isOverridden && <span className="text-[10px] opacity-70">*</span>}
    </button>
  );
}

// Simple router based on hash
// Supports section anchors: #theming:color-tokens → page "theming", section "color-tokens"
function getPageFromHash(): string {
  const hash = window.location.hash.slice(1) || "installation";
  const colonIdx = hash.indexOf(":");
  return colonIdx !== -1 ? hash.slice(0, colonIdx) : hash;
}

function Router() {
  const [page, setPage] = useState(getPageFromHash);
  const [locale, setLocale] = useState("en-US");
  const [dirOverride, setDirOverride] = useState<"ltr" | "rtl" | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= SM_BREAKPOINT);
  const [apiPanelOpen, setApiPanelOpen] = useState(() => window.innerWidth >= MD_BREAKPOINT);
  const [filter, setFilter] = useState("");
  const [readyFilter, setReadyFilter] = useState<"all" | "ready" | "unready">("all");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const mainRef = React.useRef<HTMLElement>(null);

  // Auto-collapse panels when resizing to small screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < SM_BREAKPOINT) {
        setSidebarOpen(false);
      }
      if (window.innerWidth < MD_BREAKPOINT) {
        setApiPanelOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const localeDir = isRTLLocale(locale) ? "rtl" : "ltr";
  const dir = dirOverride ?? localeDir;

  // Sync i18next language and load CLDR data when locale changes
  useEffect(() => {
    const lang = locale.split("-")[0];
    const translations = loadFxTranslations(lang);
    i18n.addResourceBundle(lang, "fx", translations, true, true);
    i18n.changeLanguage(lang);
    ensureCldr(locale);
  }, [locale]);

  // Toggle: locale-dir → opposite → back to auto (locale-dir)
  const toggleDir = useCallback(() => {
    setDirOverride((prev) => {
      if (prev === null) return localeDir === "ltr" ? "rtl" : "ltr";
      return null;
    });
  }, [localeDir]);

  // Reset override when locale changes (new locale has its own direction)
  useEffect(() => {
    setDirOverride(null);
  }, [locale]);

  // Sync document.documentElement.dir so root-level CSS selectors work
  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);

  const scrollToSection = React.useCallback(() => {
    const hash = window.location.hash.slice(1);
    const colonIdx = hash.indexOf(":");
    if (colonIdx !== -1) {
      const sectionId = hash.slice(colonIdx + 1);
      requestAnimationFrame(() => {
        const el = document.getElementById(sectionId);
        if (el && mainRef.current) {
          const top = el.offsetTop - mainRef.current.offsetTop;
          mainRef.current.scrollTo({ top, behavior: "smooth" });
        }
      });
      return true;
    }
    return false;
  }, []);

  React.useEffect(() => {
    const handleHashChange = () => {
      const newPage = getPageFromHash();
      setPage((prev) => {
        if (prev === newPage) {
          // Same page, just scroll to section
          scrollToSection();
        }
        return newPage;
      });
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [scrollToSection]);

  // Scroll main content to top on page change, or to section if hash has one
  React.useEffect(() => {
    if (!scrollToSection()) {
      mainRef.current?.scrollTo(0, 0);
    }
  }, [page, scrollToSection]);

  // Enhance section headings with anchor links for deep-linking
  React.useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const sections = main.querySelectorAll<HTMLElement>("section[id]");
    sections.forEach((section) => {
      const heading = section.querySelector("h2");
      if (!heading || heading.querySelector("[data-anchor]")) return;

      heading.classList.add("group", "cursor-pointer", "scroll-mt-6");

      const anchor = document.createElement("a");
      anchor.setAttribute("data-anchor", "");
      anchor.href = `#${page}:${section.id}`;
      anchor.className = "ml-2 opacity-0 group-hover:opacity-60 transition-opacity text-muted-foreground text-base font-normal";
      anchor.textContent = "#";
      anchor.setAttribute("aria-label", `Copy link to ${heading.textContent}`);

      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const hash = `${page}:${section.id}`;
        window.location.hash = hash;
        const url = `${window.location.origin}${window.location.pathname}#${hash}`;
        navigator.clipboard.writeText(url).catch(() => {});
      });

      heading.addEventListener("click", () => {
        anchor.click();
      });

      heading.appendChild(anchor);
    });
  }, [page]);

  const handlePageClick = (id: string) => {
    window.location.hash = id;
  };

  const currentPageName = DEMO_PAGES.find((p) => p.id === page)?.name ?? page;

  return (
    <AppLocaleContext.Provider value={{ locale, dir, dirOverride, toggleDir, setLocale }}>
      <div dir={dir}>
        <div className="h-screen flex flex-col overflow-hidden">
          {/* Top bar */}
          <nav className="bg-card border-b border-border sticky top-0 z-50">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-14 items-center">
                <div className="flex items-center gap-3">
                  {/* Burger button */}
                  <button
                    type="button"
                    onClick={() => setSidebarOpen((o) => !o)}
                    className="inline-flex items-center justify-center rounded-md p-2 text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    aria-label="Toggle sidebar"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      {sidebarOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                      )}
                    </svg>
                  </button>
                  <span className="text-sm font-semibold">{currentPageName}</span>
                </div>

                {/* Settings button (small screens only) */}
                <button
                  type="button"
                  onClick={() => setSettingsOpen(true)}
                  className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-label="Settings"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>

                {/* Language, Theme, RTL selectors (large screens) */}
                <div className="hidden sm:flex items-center gap-2">
                  <ThemeSelector />
                  <LanguageSelector />
                  <RTLToggle />
                  <a
                    href="https://github.tools.sap/ui/fx-components"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md p-2 text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    aria-label="Open GitHub repository"
                    title="GitHub Repository"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </a>
                  <span className="text-xs text-secondary-foreground font-mono">v{packageJson.version}</span>
                </div>
              </div>
            </div>
          </nav>

          {/* Settings dialog (small screens) */}
          <Dialog
            open={settingsOpen}
            onOpenChange={setSettingsOpen}
            headerText="Settings"
            footer={
              <div className="flex justify-end">
                <Button onClick={() => setSettingsOpen(false)}>Close</Button>
              </div>
            }
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Theme</label>
                <ThemeSelector />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Language</label>
                <LanguageSelector />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Text Direction</label>
                <RTLToggle />
              </div>
            </div>
          </Dialog>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <aside
              className={`
                bg-card border-r border-border flex flex-col shrink-0 transition-all duration-200
                ${sidebarOpen ? "w-56" : "w-0"}
              `}
            >
              <div className="px-3 py-2 border-b border-border space-y-2">
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filter..."
                  className="w-full px-2 py-1.5 text-sm rounded-md border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {(() => {
                  const components = DEMO_PAGES.filter((p) => !("doc" in p));
                  const readyCount = components.filter((p) => "ready" in p && p.ready).length;
                  const unreadyCount = components.length - readyCount;
                  const totalCount = components.length;
                  return (
                    <div className="flex rounded-md border border-border overflow-hidden text-[11px] font-medium">
                      <button
                        type="button"
                        onClick={() => setReadyFilter("ready")}
                        className={`flex-1 px-3 py-1 transition-colors ${
                          readyFilter === "ready"
                            ? "bg-sapphire-positive/15 text-sapphire-positive"
                            : "text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        Ready ({readyCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setReadyFilter("unready")}
                        className={`flex-1 px-3 py-1 transition-colors border-l border-border ${
                          readyFilter === "unready"
                            ? "bg-sapphire-warning/15 text-sapphire-warning"
                            : "text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        WIP ({unreadyCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setReadyFilter("all")}
                        className={`flex-1 px-3 py-1 transition-colors border-l border-border ${
                          readyFilter === "all"
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        All ({totalCount})
                      </button>
                    </div>
                  );
                })()}
              </div>
              <nav className="py-2 overflow-y-auto flex-1">
                {DEMO_PAGES.filter((p) =>
                  p.name.toLowerCase().includes(filter.toLowerCase()) &&
                  (readyFilter === "all" || (readyFilter === "ready" && "ready" in p && p.ready) || (readyFilter === "unready" && !("doc" in p) && !("ready" in p && p.ready)))
                ).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePageClick(p.id)}
                    className={`
                      w-full text-left px-4 py-2 text-sm transition-colors whitespace-nowrap flex items-center justify-between gap-2
                      ${page === p.id
                        ? "bg-primary/10 text-primary font-medium border-r-2 border-primary"
                        : "text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
                      }
                    `}
                  >
                    {p.name}
                    {"ready" in p && p.ready && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-sapphire-positive/15 text-sapphire-positive leading-none">
                        Ready
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main content */}
            <main ref={mainRef} className={`flex-1 overflow-y-auto bg-background ${page === "theme-generator" ? "" : "p-4 sm:p-8"}`}>
              {page === "theme-generator" && <ThemeGeneratorPage />}
              <div className={page === "theme-generator" ? "hidden" : "max-w-7xl mx-auto"}>
                {page === "installation" && <InstallationPage />}
                {page === "theming" && <ThemingPage />}
                {page === "preview" && <PreviewPage />}
                {page === "breadcrumbs" && <BreadcrumbsPage />}
                {page === "busyindicator" && <BusyIndicatorPage />}
                {page === "calendar" && <Calendar />}
                {page === "avatar" && <AvatarPage />}
                {page === "tag" && <TagPage />}
                {page === "bar" && <BarPage />}
                {page === "button" && <ButtonPage />}
                {page === "card" && <CardPage />}
                {page === "checkbox" && <CheckBoxPage />}
                {page === "datepicker" && <DatePickerPage />}
                {page === "dialog" && <DialogPage />}
                {page === "fileuploader" && <FileUploaderPage />}
                {page === "radiobutton" && <RadioButtonPage />}
                {page === "input" && <InputPage />}
                {page === "icon" && <IconPage />}
                {page === "illustratedmessage" && <IllustratedMessagePage />}
                {page === "textarea" && <TextareaPage />}
                {page === "label" && <LabelPage />}
                {page === "link" && <LinkPage />}
                {page === "messagestrip" && <MessageStripPage />}
                {page === "notification" && <NotificationPage />}
                {page === "switch" && <SwitchPage />}
                {page === "slider" && <SliderPage />}
                {page === "togglebutton" && <ToggleButtonPage />}
                {page === "toolbar" && <ToolbarPage />}
                {page === "combobox" && <ComboBoxPage />}
                {page === "multicombobox" && <MultiComboBoxPage />}
                {page === "select" && <SelectPage />}
                {page === "searchfield" && <SearchFieldPage />}
                {page === "list" && <ListPage />}
                {page === "panel" && <PanelPage />}
                {page === "text" && <TextPage />}
                {page === "title" && <TitlePage />}
                {page === "toast" && <ToastPage />}
                {page === "table" && <TablePage />}
                {page === "tabcontainer" && <TabContainerPage />}
                {page === "tabbar" && <TabbarDemo />}
                {page === "menu" && <MenuPage />}
                {page === "popover" && <PopoverPage />}
                {page === "progressindicator" && <ProgressIndicatorPage />}
                {page === "responsive-popover" && <ResponsivePopoverPage />}
                {page === "segmentedbutton" && <SegmentedButtonPage />}
                {page === "skeleton" && <SkeletonPage />}
                {page === "splitbutton" && <SplitButtonPage />}
                {page === "token" && <TokenPage />}
                {page === "tokenizer" && <TokenizerPage />}
              </div>
            </main>

            {/* API Panel (hidden on Preview All) */}
            {page !== "preview" && page !== "installation" && page !== "theming" && page !== "theme-generator" && (
              <ApiPanel
                data={apiRegistry[page]}
                open={apiPanelOpen}
                onToggle={() => setApiPanelOpen((o) => !o)}
              />
            )}
          </div>
        </div>
      </div>
    </AppLocaleContext.Provider>
  );
}

// Initialize i18next with fx-components translations before React renders
initFxI18n("en");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider themes={THEMES}>
      <Router />
    </ThemeProvider>
  </React.StrictMode>
);

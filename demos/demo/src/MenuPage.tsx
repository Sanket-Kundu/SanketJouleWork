import { useState, useRef, useCallback } from "react";
import {
  Menu,
  MenuItem,
  MenuSeparator,
  MenuHeader,
  MenuItemGroup,
  MenuItemGroupCheckMode,
  Button,
  ButtonDesign,
  ButtonSize,
  ButtonRef,
} from "@sap-ui/fx-components";
import {
  EditIcon,
  CopyIcon,
  DeleteIcon,
  SettingsIcon,
  DocumentTextIcon,
  Share2Icon,
  DownloadIcon,
  UploadIcon,
  FavoriteIcon,
  FolderIcon,
  ShowIcon,
  PrintIcon,
  EmailIcon,
  FolderFullIcon,
  BookmarkIcon,
  HistoryIcon,
  SortAscendingIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  PushpinOnIcon,
  DeclineIcon,
  AcceptIcon,
} from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

/**
 * Helper to manage menu open state with an opener ref.
 * Button uses useImperativeHandle so ref.current is a ButtonRef, not HTMLElement.
 * We extract nativeElement for Menu's opener prop.
 */
function useMenuOpener() {
  const [open, setOpen] = useState(false);
  const ref = useRef<ButtonRef>(null);
  return {
    open,
    setOpen,
    ref,
    get opener(): HTMLElement | null {
      return ref.current?.nativeElement ?? null;
    },
  };
}

export function MenuPage() {
  // Figma samples
  const figmaDefault = useMenuOpener();
  const figmaActions = useMenuOpener();
  const figmaMultiSection = useMenuOpener();
  const [figmaStatus, setFigmaStatus] = useState("");
  const [figmaSelected, setFigmaSelected] = useState("Annual Report");

  // States (selected / hover)
  const figmaStates = useMenuOpener();

  // Subtitle
  const figmaSubtitle = useMenuOpener();

  // Basic menu
  const basic = useMenuOpener();
  const [basicStatus, setBasicStatus] = useState("Click a menu item...");

  // Separators & Headers
  const headers = useMenuOpener();
  const headerText = useMenuOpener();

  // Submenus
  const submenus = useMenuOpener();
  const [submenuStatus, setSubmenuStatus] = useState("");

  // Additional text
  const addText = useMenuOpener();

  // Single check
  const singleCheck = useMenuOpener();
  const [sortBy, setSortBy] = useState("name");

  // Single check - alignment example
  const alignCheck = useMenuOpener();
  const [align, setAlign] = useState("left");

  // Multiple check
  const multiCheck = useMenuOpener();
  const [showOptions, setShowOptions] = useState({
    toolbar: true,
    sidebar: true,
    statusBar: false,
  });

  // Loading states
  const loadingMenu = useMenuOpener();
  const [menuLoading, setMenuLoading] = useState(false);
  const loadingSub = useMenuOpener();

  // Placements
  const placements = {
    "bottom-start": useMenuOpener(),
    "bottom-end": useMenuOpener(),
    "top-start": useMenuOpener(),
    "top-end": useMenuOpener(),
    "right-start": useMenuOpener(),
    "right-end": useMenuOpener(),
    "left-start": useMenuOpener(),
    "left-end": useMenuOpener(),
  } as const;

  // Lifecycle events
  const lifecycle = useMenuOpener();
  const [lifecycleLog, setLifecycleLog] = useState<string[]>([]);
  const logEvent = useCallback((name: string) => {
    setLifecycleLog((prev) => [...prev.slice(-5), `${new Date().toLocaleTimeString()} - ${name}`]);
  }, []);

  const toggleMulti = (key: keyof typeof showOptions) => {
    setShowOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Menu</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Menu, MenuItem } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* ── Figma Design Samples ── */}
      <section id="figma-design-samples" className="space-y-4">
        <h2 className="text-xl font-semibold">Figma Design Samples</h2>
        <p className="text-sm text-secondary-foreground">
          Menus matching the Figma Sapphire design specs: section headers with items, icon action menus, and multi-section layout.
        </p>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Default — section header + plain items */}
          <Button
            ref={figmaDefault.ref}
            onClick={() => figmaDefault.setOpen(true)}
          >
            Default
          </Button>

          {/* Pin + Rename + Delete — icon actions */}
          <Button
            ref={figmaActions.ref}
            onClick={() => figmaActions.setOpen(true)}
            design={ButtonDesign.Primary}
          >
            Pin + Rename + Delete
          </Button>

          {/* Multi-section */}
          <Button
            ref={figmaMultiSection.ref}
            onClick={() => figmaMultiSection.setOpen(true)}
            design={ButtonDesign.Secondary}
          >
            Multi-Section
          </Button>

          {/* States — selected / hover */}
          <Button
            ref={figmaStates.ref}
            onClick={() => figmaStates.setOpen(true)}
            design={ButtonDesign.Tertiary}
          >
            States (Selected)
          </Button>

          {figmaStatus && <span className="text-sm text-secondary-foreground">{figmaStatus}</span>}
        </div>

        {/* Default: section header with action icons + 3 items */}
        <Menu
          open={figmaDefault.open}
          opener={figmaDefault.opener}
          onClose={() => figmaDefault.setOpen(false)}
          onItemClick={(detail) => { setFigmaSelected(detail.text); setFigmaStatus(`Selected: ${detail.text}`); }}
        >
          <MenuHeader
            text="Documents"
            endContent={
              <>
                <Button
                  design={ButtonDesign.Tertiary}
                  size={ButtonSize.Medium}
                  icon={<DeclineIcon />}
                  iconOnly
                  onClick={() => figmaDefault.setOpen(false)}
                />
                <Button
                  design={ButtonDesign.Primary}
                  size={ButtonSize.Medium}
                  icon={<AcceptIcon />}
                  iconOnly
                  onClick={() => { setFigmaStatus("Accepted"); figmaDefault.setOpen(false); }}
                />
              </>
            }
          />
          <MenuItem text="Annual Report" checked={figmaSelected === "Annual Report"} />
          <MenuItem text="Quarterly Review" checked={figmaSelected === "Quarterly Review"} />
          <MenuItem text="Project Plan" checked={figmaSelected === "Project Plan"} />
        </Menu>

        {/* Pin + Rename + Delete */}
        <Menu
          open={figmaActions.open}
          opener={figmaActions.opener}
          onClose={() => figmaActions.setOpen(false)}
          onItemClick={(detail) => setFigmaStatus(`Clicked: ${detail.text}`)}
        >
          <MenuItem text="Pin" icon={<PushpinOnIcon />} />
          <MenuItem text="Rename" icon={<EditIcon />} />
          <MenuItem text="Delete" icon={<DeleteIcon />} />
        </Menu>

        {/* Multi-section with headers and separators */}
        <Menu
          open={figmaMultiSection.open}
          opener={figmaMultiSection.opener}
          onClose={() => figmaMultiSection.setOpen(false)}
          onItemClick={(detail) => setFigmaStatus(`Clicked: ${detail.text}`)}
        >
          <MenuHeader
            text="Recent"
            endContent={
              <>
                <Button
                  design={ButtonDesign.Tertiary}
                  size={ButtonSize.Medium}
                  icon={<DeclineIcon />}
                  iconOnly
                />
                <Button
                  design={ButtonDesign.Primary}
                  size={ButtonSize.Medium}
                  icon={<AcceptIcon />}
                  iconOnly
                />
              </>
            }
          />
          <MenuItem text="Annual Report" icon={<DocumentTextIcon />} />
          <MenuItem text="Budget Overview" icon={<DocumentTextIcon />} />
          <MenuSeparator />
          <MenuHeader
            text="Favorites"
            endContent={
              <>
                <Button
                  design={ButtonDesign.Tertiary}
                  size={ButtonSize.Medium}
                  icon={<DeclineIcon />}
                  iconOnly
                />
                <Button
                  design={ButtonDesign.Primary}
                  size={ButtonSize.Medium}
                  icon={<AcceptIcon />}
                  iconOnly
                />
              </>
            }
          />
          <MenuItem text="Project Plan" icon={<FavoriteIcon />} />
          <MenuItem text="Team Notes" icon={<BookmarkIcon />} />
          <MenuSeparator />
          <MenuHeader text="Actions" />
          <MenuItem text="Pin" icon={<PushpinOnIcon />} />
          <MenuItem text="Rename" icon={<EditIcon />} />
          <MenuItem text="Delete" icon={<DeleteIcon />} />
        </Menu>

        {/* States: selected item for testing selected / hover-on-selected */}
        <Menu
          open={figmaStates.open}
          opener={figmaStates.opener}
          onClose={() => figmaStates.setOpen(false)}
          onItemClick={(detail) => setFigmaStatus(`Clicked: ${detail.text}`)}
        >
          <MenuItem text="Pin" icon={<PushpinOnIcon />} />
          <MenuItem text="Rename" icon={<EditIcon />} />
          <MenuItem text="Delete" icon={<DeleteIcon />} checked />
        </Menu>
      </section>

      {/* ── Subtitle ── */}
      <section id="subtitle" className="space-y-4">
        <h2 className="text-xl font-semibold">Subtitle</h2>
        <p className="text-sm text-secondary-foreground">
          The <code>subtitle</code> prop displays secondary text below the title. Subtitle color remains constant across all interaction states.
        </p>
        <div className="flex items-center gap-4">
          <Button
            ref={figmaSubtitle.ref}
            onClick={() => figmaSubtitle.setOpen(true)}
          >
            Menu with Subtitles
          </Button>
        </div>
        <Menu
          open={figmaSubtitle.open}
          opener={figmaSubtitle.opener}
          onClose={() => figmaSubtitle.setOpen(false)}
          onItemClick={(detail) => setFigmaStatus(`Clicked: ${detail.text}`)}
        >
          <MenuItem text="Annual Report" subtitle="Q4 Financial Summary" icon={<DocumentTextIcon />} checked />
          <MenuItem text="Project Plan" subtitle="2026 Roadmap" icon={<DocumentTextIcon />} />
          <MenuItem text="Team Notes" subtitle="Weekly standup notes" icon={<BookmarkIcon />} />
          <MenuItem text="Settings" icon={<SettingsIcon />} />
        </Menu>
      </section>
      <section id="basic-menu" className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Menu</h2>
        <p className="text-sm text-secondary-foreground">
          A simple menu with icons, text, disabled items, and click handling.
        </p>
        <div className="flex items-center gap-4">
          <Button
            ref={basic.ref}
            onClick={() => basic.setOpen(true)}
          >
            Open Menu
          </Button>
          <span className="text-sm text-secondary-foreground">{basicStatus}</span>
        </div>
        <Menu
          open={basic.open}
          opener={basic.opener}
          onClose={() => basic.setOpen(false)}
          onItemClick={(detail) => setBasicStatus(`Clicked: ${detail.text}`)}
        >
          <MenuItem text="Edit" icon={<EditIcon />} />
          <MenuItem text="Copy" icon={<CopyIcon />} />
          <MenuItem text="Delete" icon={<DeleteIcon />} />
          <MenuSeparator />
          <MenuItem text="Disabled Item" icon={<FolderIcon />} disabled />
          <MenuItem text="Settings" icon={<SettingsIcon />} />
        </Menu>
      </section>

      {/* Separators & Headers */}
      <section id="separators-headers" className="space-y-4">
        <h2 className="text-xl font-semibold">Separators & Headers</h2>
        <p className="text-sm text-secondary-foreground">
          Use MenuSeparator, MenuHeader, and the <code>headerText</code> prop.
        </p>
        <div className="flex items-center gap-4">
          <Button
            ref={headers.ref}
            onClick={() => headers.setOpen(true)}
          >
            With Headers
          </Button>
          <Button
            ref={headerText.ref}
            onClick={() => headerText.setOpen(true)}
            design={ButtonDesign.Primary}
          >
            headerText Prop
          </Button>
        </div>
        <Menu
          open={headers.open}
          opener={headers.opener}
          onClose={() => headers.setOpen(false)}
        >
          <MenuHeader text="File Operations" />
          <MenuItem text="New File" icon={<DocumentTextIcon />} />
          <MenuItem text="Open" icon={<FolderFullIcon />} />
          <MenuSeparator />
          <MenuHeader text="Share" />
          <MenuItem text="Share" icon={<Share2Icon />} />
          <MenuItem text="Email" icon={<EmailIcon />} />
        </Menu>
        <Menu
          open={headerText.open}
          opener={headerText.opener}
          onClose={() => headerText.setOpen(false)}
          headerText="Quick Actions"
        >
          <MenuItem text="Bookmark" icon={<BookmarkIcon />} />
          <MenuItem text="Print" icon={<PrintIcon />} />
          <MenuItem text="Download" icon={<DownloadIcon />} />
        </Menu>
      </section>

      {/* Submenus */}
      <section id="submenus" className="space-y-4">
        <h2 className="text-xl font-semibold">Submenus</h2>
        <p className="text-sm text-secondary-foreground">
          Nested MenuItems create submenus. Open on hover or ArrowRight, close with ArrowLeft or Escape.
        </p>
        <div className="flex items-center gap-4">
          <Button
            ref={submenus.ref}
            onClick={() => submenus.setOpen(true)}
          >
            Open with Submenus
          </Button>
          {submenuStatus && <span className="text-sm text-secondary-foreground">{submenuStatus}</span>}
        </div>
        <Menu
          open={submenus.open}
          opener={submenus.opener}
          onClose={() => submenus.setOpen(false)}
          onItemClick={(detail) => setSubmenuStatus(`Selected: ${detail.text}`)}
        >
          <MenuItem text="View" icon={<ShowIcon />} />
          <MenuItem text="Export" icon={<UploadIcon />}>
            <MenuItem text="Export as PDF" icon={<DocumentTextIcon />} />
            <MenuItem text="Export as CSV" icon={<DocumentTextIcon />} />
            <MenuSeparator />
            <MenuItem text="More Formats">
              <MenuItem text="JSON" />
              <MenuItem text="XML" />
              <MenuItem text="YAML" />
            </MenuItem>
          </MenuItem>
          <MenuItem text="Share" icon={<Share2Icon />}>
            <MenuItem text="Copy Link" icon={<CopyIcon />} />
            <MenuItem text="Email" icon={<EmailIcon />} />
          </MenuItem>
          <MenuSeparator />
          <MenuItem text="Settings" icon={<SettingsIcon />} />
        </Menu>
      </section>

      {/* Additional Text */}
      <section id="additional-text" className="space-y-4">
        <h2 className="text-xl font-semibold">Additional Text</h2>
        <p className="text-sm text-secondary-foreground">
          The <code>additionalText</code> prop shows secondary text (e.g., keyboard shortcuts) on the right.
          It is hidden when <code>endContent</code> or a submenu is present (submenu arrow takes priority).
        </p>
        <Button
          ref={addText.ref}
          onClick={() => addText.setOpen(true)}
        >
          Edit Menu
        </Button>
        <Menu
          open={addText.open}
          opener={addText.opener}
          onClose={() => addText.setOpen(false)}
        >
          <MenuItem text="Cut" icon={<EditIcon />} additionalText="Ctrl+X" />
          <MenuItem text="Copy" icon={<CopyIcon />} additionalText="Ctrl+C" />
          <MenuItem text="Paste" additionalText="Ctrl+V" />
          <MenuSeparator />
          <MenuItem text="Select All" additionalText="Ctrl+A" />
          <MenuItem text="Find" additionalText="Ctrl+F" />
        </Menu>
      </section>

      {/* Single Check Mode */}
      <section id="single-check-mode" className="space-y-4">
        <h2 className="text-xl font-semibold">Single Check Mode</h2>
        <p className="text-sm text-secondary-foreground">
          MenuItemGroup with <code>checkMode="Single"</code> — radio-button behavior.
          Use <code>onCheck</code> to handle selection changes.
        </p>
        <div className="flex items-center gap-4">
          <Button
            ref={singleCheck.ref}
            onClick={() => singleCheck.setOpen(true)}
            icon={<SortAscendingIcon />}
          >
            Sort By: {sortBy}
          </Button>
          <Button
            ref={alignCheck.ref}
            onClick={() => alignCheck.setOpen(true)}
          >
            Alignment
          </Button>
        </div>
        <Menu
          open={singleCheck.open}
          opener={singleCheck.opener}
          onClose={() => singleCheck.setOpen(false)}
          onCheck={(detail) => {
            if (detail.item.data) {
              setSortBy(detail.item.data as string);
            }
          }}
        >
          <MenuItemGroup checkMode={MenuItemGroupCheckMode.Single}>
            <MenuItem text="Name" checked={sortBy === "name"} data="name" />
            <MenuItem text="Date Modified" checked={sortBy === "date"} data="date" />
            <MenuItem text="Size" checked={sortBy === "size"} data="size" />
            <MenuItem text="Type" checked={sortBy === "type"} data="type" />
          </MenuItemGroup>
        </Menu>
        <Menu
          open={alignCheck.open}
          opener={alignCheck.opener}
          onClose={() => alignCheck.setOpen(false)}
          onCheck={(detail) => {
            if (detail.item.data) {
              setAlign(detail.item.data as string);
            }
          }}
        >
          <MenuItemGroup checkMode={MenuItemGroupCheckMode.Single}>
            <MenuItem text="Left Align" icon={<TextAlignLeftIcon />} checked={align === "left"} data="left" />
            <MenuItem text="Center Align" icon={<TextAlignCenterIcon />} checked={align === "center"} data="center" />
            <MenuItem text="Right Align" icon={<TextAlignRightIcon />} checked={align === "right"} data="right" />
          </MenuItemGroup>
        </Menu>
      </section>

      {/* Multiple Check Mode */}
      <section id="multiple-check-mode" className="space-y-4">
        <h2 className="text-xl font-semibold">Multiple Check Mode</h2>
        <p className="text-sm text-secondary-foreground">
          MenuItemGroup with <code>checkMode="Multiple"</code> — checkbox behavior.
          Hold Shift+Enter/Space to check items without closing the menu.
        </p>
        <div className="flex items-center gap-2 text-sm text-secondary-foreground">
          <span>Toolbar: {showOptions.toolbar ? "On" : "Off"}</span>
          <span>|</span>
          <span>Sidebar: {showOptions.sidebar ? "On" : "Off"}</span>
          <span>|</span>
          <span>Status Bar: {showOptions.statusBar ? "On" : "Off"}</span>
        </div>
        <Button
          ref={multiCheck.ref}
          onClick={() => multiCheck.setOpen(true)}
          icon={<ShowIcon />}
        >
          View Options
        </Button>
        <Menu
          open={multiCheck.open}
          opener={multiCheck.opener}
          onClose={() => multiCheck.setOpen(false)}
          onCheck={(detail) => {
            const key = detail.item.data as keyof typeof showOptions;
            if (key) toggleMulti(key);
          }}
        >
          <MenuHeader text="Show / Hide" />
          <MenuItemGroup checkMode={MenuItemGroupCheckMode.Multiple}>
            <MenuItem text="Toolbar" checked={showOptions.toolbar} data="toolbar" />
            <MenuItem text="Sidebar" checked={showOptions.sidebar} data="sidebar" />
            <MenuItem text="Status Bar" checked={showOptions.statusBar} data="statusBar" />
          </MenuItemGroup>
        </Menu>
      </section>

      {/* Loading States */}
      <section id="loading-states" className="space-y-4">
        <h2 className="text-xl font-semibold">Loading States</h2>
        <p className="text-sm text-secondary-foreground">
          Menu-level loading replaces all content with a spinner. Item-level loading shows a spinner
          in the submenu popover. Both support <code>loadingDelay</code> (default 50ms).
        </p>
        <div className="flex items-center gap-4">
          <Button
            ref={loadingMenu.ref}
            onClick={() => {
              setMenuLoading(true);
              loadingMenu.setOpen(true);
              setTimeout(() => setMenuLoading(false), 2500);
            }}
          >
            Menu Loading
          </Button>
          <Button
            ref={loadingSub.ref}
            onClick={() => loadingSub.setOpen(true)}
            design={ButtonDesign.Primary}
          >
            Submenu Loading
          </Button>
        </div>
        <Menu
          open={loadingMenu.open}
          opener={loadingMenu.opener}
          onClose={() => loadingMenu.setOpen(false)}
          loading={menuLoading}
          loadingDelay={500}
        >
          <MenuItem text="Data Loaded" icon={<FavoriteIcon />} />
          <MenuItem text="Another Item" icon={<HistoryIcon />} />
        </Menu>
        <Menu
          open={loadingSub.open}
          opener={loadingSub.opener}
          onClose={() => loadingSub.setOpen(false)}
        >
          <MenuItem text="View" icon={<ShowIcon />} />
          <MenuItem text="Load Options" icon={<DownloadIcon />} loading>
            <MenuItem text="Will show after loading..." />
          </MenuItem>
          <MenuItem text="Settings" icon={<SettingsIcon />} />
        </Menu>
      </section>

      {/* Placements */}
      <section id="placements" className="space-y-4">
        <h2 className="text-xl font-semibold">Placements</h2>
        <p className="text-sm text-secondary-foreground">
          All 8 placement options for positioning the menu relative to the opener.
        </p>
        <div className="grid grid-cols-4 gap-3 max-w-2xl">
          {(Object.keys(placements) as Array<keyof typeof placements>).map(
            (pl) => {
              const p = placements[pl];
              return (
                <div key={pl}>
                  <Button
                    ref={p.ref}
                    onClick={() => p.setOpen(true)}
                    design={ButtonDesign.Tertiary}
                    className="w-full text-xs"
                  >
                    {pl}
                  </Button>
                  <Menu
                    open={p.open}
                    opener={p.opener}
                    onClose={() => p.setOpen(false)}
                    placement={pl}
                  >
                    <MenuItem text={`Placed: ${pl}`} />
                    <MenuItem text="Item 2" />
                    <MenuItem text="Item 3" />
                  </Menu>
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* Lifecycle Events */}
      <section id="lifecycle-events" className="space-y-4">
        <h2 className="text-xl font-semibold">Lifecycle Events</h2>
        <p className="text-sm text-secondary-foreground">
          <code>onBeforeOpen</code>, <code>onOpen</code>, and <code>onBeforeClose</code> (with <code>escPressed</code> detail).
        </p>
        <Button
          ref={lifecycle.ref}
          onClick={() => lifecycle.setOpen(true)}
        >
          Open (Watch Log)
        </Button>
        <Menu
          open={lifecycle.open}
          opener={lifecycle.opener}
          onClose={() => lifecycle.setOpen(false)}
          onBeforeOpen={() => logEvent("onBeforeOpen")}
          onOpen={() => logEvent("onOpen")}
          onBeforeClose={(detail) => logEvent(`onBeforeClose (escPressed: ${detail.escPressed})`)}
        >
          <MenuItem text="Action A" />
          <MenuItem text="Action B" />
          <MenuItem text="Action C" />
        </Menu>
        <div className="bg-muted/50 rounded-lg p-3 text-xs font-mono space-y-1 min-h-[60px]">
          {lifecycleLog.length === 0 && (
            <span className="text-secondary-foreground">Open and close the menu to see events...</span>
          )}
          {lifecycleLog.map((entry, i) => (
            <div key={i}>{entry}</div>
          ))}
        </div>
      </section>

      {/* Keyboard Navigation Reference */}
      <section id="keyboard-navigation" className="space-y-4">
        <h2 className="text-xl font-semibold">Keyboard Navigation</h2>
        <div className="rounded-lg border border-border bg-muted/30 p-6 space-y-3">
          <div className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
            <kbd className="font-mono bg-muted px-2 py-0.5 rounded text-xs w-fit">Arrow Down</kbd>
            <span className="text-secondary-foreground">Move focus to next menu item</span>
            <kbd className="font-mono bg-muted px-2 py-0.5 rounded text-xs w-fit">Arrow Up</kbd>
            <span className="text-secondary-foreground">Move focus to previous menu item</span>
            <kbd className="font-mono bg-muted px-2 py-0.5 rounded text-xs w-fit">Home</kbd>
            <span className="text-secondary-foreground">Jump to first menu item</span>
            <kbd className="font-mono bg-muted px-2 py-0.5 rounded text-xs w-fit">End</kbd>
            <span className="text-secondary-foreground">Jump to last menu item</span>
            <kbd className="font-mono bg-muted px-2 py-0.5 rounded text-xs w-fit">Arrow Right</kbd>
            <span className="text-secondary-foreground">Open submenu (on item with submenu)</span>
            <kbd className="font-mono bg-muted px-2 py-0.5 rounded text-xs w-fit">Arrow Left</kbd>
            <span className="text-secondary-foreground">Close submenu, return focus to parent</span>
            <kbd className="font-mono bg-muted px-2 py-0.5 rounded text-xs w-fit">Escape</kbd>
            <span className="text-secondary-foreground">Close current submenu or entire menu</span>
            <kbd className="font-mono bg-muted px-2 py-0.5 rounded text-xs w-fit">Enter / Space</kbd>
            <span className="text-secondary-foreground">Activate focused menu item</span>
            <kbd className="font-mono bg-muted px-2 py-0.5 rounded text-xs w-fit">Shift + Enter</kbd>
            <span className="text-secondary-foreground">Check item without closing menu (in check groups)</span>
            <kbd className="font-mono bg-muted px-2 py-0.5 rounded text-xs w-fit">Type-ahead</kbd>
            <span className="text-secondary-foreground">Focus item matching typed characters (500ms buffer)</span>
          </div>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { useRef, useState } from "react";
import {
  Menu,
  MenuItem,
  MenuSeparator,
  Button,
  ButtonRef,
  EditIcon,
  CopyIcon,
  DeleteIcon,
} from "@sap-ui/fx-components";

function MyComponent() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<ButtonRef>(null);

  return (
    <>
      <Button ref={btnRef} onClick={() => setOpen(true)}>
        Actions
      </Button>

      <Menu
        open={open}
        opener={btnRef.current?.nativeElement ?? null}
        onClose={() => setOpen(false)}
        onItemClick={(detail) => console.log(detail.text)}
      >
        <MenuItem text="Edit" icon={<EditIcon />} />
        <MenuItem text="Copy" icon={<CopyIcon />} />
        <MenuSeparator />
        <MenuItem text="Delete" icon={<DeleteIcon />} />

        {/* Submenu */}
        <MenuItem text="Export">
          <MenuItem text="Export as PDF" />
          <MenuItem text="Export as CSV" />
        </MenuItem>
      </Menu>
    </>
  );
}`}
        />
      </section>
    </div>
  );
}

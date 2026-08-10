import { useState, useRef } from "react";
import {
  SplitButton,
  Menu,
  MenuItem,
  MenuSeparator,
  MenuHeader,
  Button,
  ButtonDesign,
  ButtonSize,
  SaveIcon,
  DownloadIcon,
  DeleteIcon,
  CopyIcon,
  PrintIcon,
  DocumentIcon,
  ShareIcon,
  UploadIcon,
  AddIcon,
  DeclineIcon,
  AcceptIcon,
  PushpinOnIcon,
  EditIcon,
} from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";
import type { SplitButtonRef } from "@sap-ui/fx-components";
import type { ButtonDesign as ButtonDesignType } from "@sap-ui/fx-components";

/** Helper: SplitButton + Menu wired together (consumer-side pattern) */
function SplitButtonWithDropdown({
  text,
  icon,
  design,
  disabled,
  loading,
  onClick,
  onArrowClick,
  children,
}: {
  text: string;
  icon?: React.ReactNode;
  design?: ButtonDesignType | `${ButtonDesignType}`;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  onArrowClick?: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<SplitButtonRef>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <SplitButton
        ref={ref}
        text={text}
        icon={icon}
        design={design}
        disabled={disabled}
        loading={loading}
        onClick={onClick}
        onArrowClick={() => {
          setOpen(prev => !prev);
          onArrowClick?.();
        }}
        activeArrowButton={open}
      />
      <Menu
        opener={ref.current?.nativeElement ?? undefined}
        open={open}
        onClose={() => setOpen(false)}
      >
        {children}
      </Menu>
    </>
  );
}

export function SplitButtonPage() {
  const [lastAction, setLastAction] = useState("None");
  const [clickCount, setClickCount] = useState(0);
  const [arrowCount, setArrowCount] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState("Annual Report");

  const handleClick = (label: string) => {
    setLastAction(label);
    setClickCount(c => c + 1);
  };

  const handleArrow = () => {
    setArrowCount(c => c + 1);
  };

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">SplitButton</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { SplitButton } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Action Tracker */}
      <section className="p-4 border border-border rounded-lg bg-muted/50">
        <div className="flex items-center gap-4 text-sm">
          <span><strong>Last Action:</strong> {lastAction}</span>
          <span><strong>Clicks:</strong> {clickCount}</span>
          <span><strong>Arrow Clicks:</strong> {arrowCount}</span>
        </div>
      </section>

      {/* Basic */}
      <section id="basic" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic</h2>
        <p className="text-secondary-foreground mb-4">
          A button with a primary action and a dropdown arrow. The SplitButton fires separate click and arrow-click events.
        </p>
        <div className="flex flex-wrap gap-4">
          <SplitButtonWithDropdown
            text="Save"
            icon={<SaveIcon className="h-4 w-4" />}
            onClick={() => handleClick("Save")}
            onArrowClick={handleArrow}
          >
            <MenuItem text="Save As..." onClick={() => handleClick("Save As")} />
            <MenuItem text="Save All" onClick={() => handleClick("Save All")} />
            <MenuItem text="Save Copy" onClick={() => handleClick("Save Copy")} />
          </SplitButtonWithDropdown>
          <SplitButtonWithDropdown
            text="Download"
            icon={<DownloadIcon className="h-4 w-4" />}
            design="SecondaryJoule"
            onClick={() => handleClick("Download")}
            onArrowClick={handleArrow}
          >
            <MenuItem text="Download as PDF" onClick={() => handleClick("Download PDF")} />
            <MenuItem text="Download as CSV" onClick={() => handleClick("Download CSV")} />
            <MenuItem text="Download as Excel" onClick={() => handleClick("Download Excel")} />
          </SplitButtonWithDropdown>
        </div>
      </section>

      {/* Design Variants */}
      <section id="variants" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Variants</h2>
        <p className="text-secondary-foreground mb-4">
          SplitButton supports all button design variants.
        </p>

        {/* Brand */}
        <h3 className="text-lg font-medium mb-3">Brand</h3>
        {(["Large", "Medium", "Small"] as const).map((size) => (
          <div key={size} className="mb-6">
            <span className="text-sm font-bold text-secondary-foreground block mb-2">{size}</span>
            <div className="grid grid-cols-[auto_repeat(3,auto)] gap-x-4 gap-y-2 justify-start items-center">
              <span></span>
              <span className="text-xs font-medium text-secondary-foreground">Primary</span>
              <span className="text-xs font-medium text-secondary-foreground">Secondary</span>
              <span className="text-xs font-medium text-secondary-foreground">Tertiary</span>

              <span className="text-xs text-secondary-foreground">Regular</span>
              <SplitButton text="Action" icon={<AddIcon className="h-4 w-4" />} design="Primary" {...(size !== "Large" ? { size } : {})} onClick={() => handleClick("Primary")} onArrowClick={handleArrow} />
              <SplitButton text="Action" icon={<AddIcon className="h-4 w-4" />} design="Secondary" {...(size !== "Large" ? { size } : {})} onClick={() => handleClick("Secondary")} onArrowClick={handleArrow} />
              <SplitButton text="Action" icon={<AddIcon className="h-4 w-4" />} design="Tertiary" {...(size !== "Large" ? { size } : {})} onClick={() => handleClick("Tertiary")} onArrowClick={handleArrow} />

              <span className="text-xs text-secondary-foreground">Disabled</span>
              <SplitButton text="Action" icon={<AddIcon className="h-4 w-4" />} design="Primary" {...(size !== "Large" ? { size } : {})} disabled />
              <SplitButton text="Action" icon={<AddIcon className="h-4 w-4" />} design="Secondary" {...(size !== "Large" ? { size } : {})} disabled />
              <SplitButton text="Action" icon={<AddIcon className="h-4 w-4" />} design="Tertiary" {...(size !== "Large" ? { size } : {})} disabled />
            </div>
          </div>
        ))}

        {/* Joule */}
        <h3 className="text-lg font-medium mb-3 mt-8">Joule</h3>
        {(["Large", "Medium", "Small"] as const).map((size) => (
          <div key={size} className="mb-6">
            <span className="text-sm font-bold text-secondary-foreground block mb-2">{size}</span>
            <div className="grid grid-cols-[auto_repeat(3,auto)] gap-x-4 gap-y-2 justify-start items-center">
              <span></span>
              <span className="text-xs font-medium text-secondary-foreground">Primary</span>
              <span className="text-xs font-medium text-secondary-foreground">Secondary</span>
              <span className="text-xs font-medium text-secondary-foreground">Tertiary</span>

              <span className="text-xs text-secondary-foreground">Regular</span>
              <SplitButton text="Action" icon={<AddIcon className="h-4 w-4" />} design="PrimaryJoule" {...(size !== "Large" ? { size } : {})} onClick={() => handleClick("PrimaryJoule")} onArrowClick={handleArrow} />
              <SplitButton text="Action" icon={<AddIcon className="h-4 w-4" />} design="SecondaryJoule" {...(size !== "Large" ? { size } : {})} onClick={() => handleClick("SecondaryJoule")} onArrowClick={handleArrow} />
              <SplitButton text="Action" icon={<AddIcon className="h-4 w-4" />} design="TertiaryJoule" {...(size !== "Large" ? { size } : {})} onClick={() => handleClick("TertiaryJoule")} onArrowClick={handleArrow} />

              <span className="text-xs text-secondary-foreground">Disabled</span>
              <SplitButton text="Action" icon={<AddIcon className="h-4 w-4" />} design="PrimaryJoule" {...(size !== "Large" ? { size } : {})} disabled />
              <SplitButton text="Action" icon={<AddIcon className="h-4 w-4" />} design="SecondaryJoule" {...(size !== "Large" ? { size } : {})} disabled />
              <SplitButton text="Action" icon={<AddIcon className="h-4 w-4" />} design="TertiaryJoule" {...(size !== "Large" ? { size } : {})} disabled />
            </div>
          </div>
        ))}

        {/* Neutral */}
        <h3 className="text-lg font-medium mb-3 mt-8">Neutral</h3>
        {(["Large", "Medium", "Small"] as const).map((size) => (
          <div key={size} className="mb-6">
            <span className="text-sm font-bold text-secondary-foreground block mb-2">{size}</span>
            <div className="grid grid-cols-[auto_repeat(3,auto)] gap-x-4 gap-y-2 justify-start items-center">
              <span></span>
              <span className="text-xs font-medium text-secondary-foreground">Neutral</span>
              <span className="text-xs font-medium text-secondary-foreground">SecondaryNeutral</span>
              <span className="text-xs font-medium text-secondary-foreground">TertiaryNeutral</span>

              <span className="text-xs text-secondary-foreground">Regular</span>
              <SplitButton text="Action" icon={<AddIcon className="h-4 w-4" />} design="Neutral" {...(size !== "Large" ? { size } : {})} onClick={() => handleClick("Neutral")} onArrowClick={handleArrow} />
              <SplitButton text="Action" icon={<AddIcon className="h-4 w-4" />} design="SecondaryNeutral" {...(size !== "Large" ? { size } : {})} onClick={() => handleClick("SecondaryNeutral")} onArrowClick={handleArrow} />
              <SplitButton text="Action" icon={<AddIcon className="h-4 w-4" />} design="TertiaryNeutral" {...(size !== "Large" ? { size } : {})} onClick={() => handleClick("TertiaryNeutral")} onArrowClick={handleArrow} />

              <span className="text-xs text-secondary-foreground">Disabled</span>
              <SplitButton text="Action" icon={<AddIcon className="h-4 w-4" />} design="Neutral" {...(size !== "Large" ? { size } : {})} disabled />
              <SplitButton text="Action" icon={<AddIcon className="h-4 w-4" />} design="SecondaryNeutral" {...(size !== "Large" ? { size } : {})} disabled />
              <SplitButton text="Action" icon={<AddIcon className="h-4 w-4" />} design="TertiaryNeutral" {...(size !== "Large" ? { size } : {})} disabled />
            </div>
          </div>
        ))}
      </section>

      {/* With Menu */}
      <section id="with-menu" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">With Menu</h2>
        <p className="text-secondary-foreground mb-4">
          Wire a <code className="bg-muted px-1 rounded">Menu</code> to the arrow button using <code className="bg-muted px-1 rounded">activeArrowButton</code> for the toggled state.
          The Menu supports headers, separators, icons, and checked items.
        </p>
        <div className="flex flex-wrap gap-4">
          {/* Figma-style: header with actions + selectable items */}
          <SplitButtonWithDropdown
            text="Documents"
            icon={<DocumentIcon className="h-4 w-4" />}
            onClick={() => handleClick(selectedDoc)}
            onArrowClick={handleArrow}
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
                  />
                  <Button
                    design={ButtonDesign.Primary}
                    size={ButtonSize.Medium}
                    icon={<AcceptIcon />}
                    iconOnly
                    onClick={() => handleClick(`Confirmed: ${selectedDoc}`)}
                  />
                </>
              }
            />
            <MenuItem text="Annual Report" checked={selectedDoc === "Annual Report"} onClick={() => setSelectedDoc("Annual Report")} />
            <MenuItem text="Quarterly Review" checked={selectedDoc === "Quarterly Review"} onClick={() => setSelectedDoc("Quarterly Review")} />
            <MenuItem text="Project Plan" checked={selectedDoc === "Project Plan"} onClick={() => setSelectedDoc("Project Plan")} />
          </SplitButtonWithDropdown>

          {/* Icon actions menu */}
          <SplitButtonWithDropdown
            text="Manage"
            design="Primary"
            onClick={() => handleClick("Manage")}
            onArrowClick={handleArrow}
          >
            <MenuItem text="Pin" icon={<PushpinOnIcon />} onClick={() => handleClick("Pin")} />
            <MenuItem text="Rename" icon={<EditIcon />} onClick={() => handleClick("Rename")} />
            <MenuSeparator />
            <MenuItem text="Delete" icon={<DeleteIcon />} onClick={() => handleClick("Delete")} />
          </SplitButtonWithDropdown>

          {/* Simple items */}
          <SplitButtonWithDropdown
            text="Save"
            icon={<SaveIcon className="h-4 w-4" />}
            onClick={() => handleClick("Save")}
            onArrowClick={handleArrow}
          >
            <MenuItem text="Save As..." onClick={() => handleClick("Save As")} />
            <MenuItem text="Save All" onClick={() => handleClick("Save All")} />
            <MenuItem text="Save Copy" onClick={() => handleClick("Save Copy")} />
          </SplitButtonWithDropdown>
        </div>
      </section>

      {/* Practical Example */}
      <section id="practical-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Practical Example</h2>
        <p className="text-secondary-foreground mb-4">
          A document toolbar with common split button patterns.
        </p>
        <div className="flex flex-wrap gap-3 p-3 border border-border rounded-lg bg-muted/30">
          <SplitButtonWithDropdown text="New" icon={<DocumentIcon className="h-4 w-4" />} design="Primary" onClick={() => handleClick("New Document")} onArrowClick={handleArrow}>
            <MenuItem text="New Document" onClick={() => handleClick("New Document")} />
            <MenuItem text="New Spreadsheet" onClick={() => handleClick("New Spreadsheet")} />
            <MenuItem text="New Presentation" onClick={() => handleClick("New Presentation")} />
          </SplitButtonWithDropdown>
          <SplitButtonWithDropdown text="Export" icon={<UploadIcon className="h-4 w-4" />} onClick={() => handleClick("Export")} onArrowClick={handleArrow}>
            <MenuItem text="Export as PDF" onClick={() => handleClick("Export PDF")} />
            <MenuItem text="Export as CSV" onClick={() => handleClick("Export CSV")} />
            <MenuItem text="Export as Excel" onClick={() => handleClick("Export Excel")} />
          </SplitButtonWithDropdown>
          <SplitButtonWithDropdown text="Share" icon={<ShareIcon className="h-4 w-4" />} onClick={() => handleClick("Share")} onArrowClick={handleArrow}>
            <MenuItem text="Share via Email" onClick={() => handleClick("Share Email")} />
            <MenuItem text="Copy Link" icon={<CopyIcon />} onClick={() => handleClick("Copy Link")} />
          </SplitButtonWithDropdown>
        </div>
      </section>

      {/* Disabled & Loading */}
      <section id="disabled-loading" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Disabled & Loading</h2>
        <p className="text-secondary-foreground mb-4">
          SplitButtons in disabled and loading states.
        </p>
        <div className="flex flex-wrap gap-4">
          <SplitButton text="Disabled" disabled />
          <SplitButton text="Disabled" icon={<SaveIcon className="h-4 w-4" />} disabled design="Primary" />
          <SplitButton text="Loading..." loading />
          <SplitButton text="Loading..." loading design="Primary" />
        </div>
      </section>

      {/* Keyboard Interaction */}
      <section id="keyboard-interaction" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Keyboard Interaction</h2>
        <p className="text-secondary-foreground mb-4">
          Try the following keyboard shortcuts on the SplitButton below:
        </p>
        <div className="mb-4">
          <SplitButtonWithDropdown
            text="Test Keyboard"
            icon={<DocumentIcon className="h-4 w-4" />}
            design="Primary"
            onClick={() => handleClick("Keyboard: Default action")}
            onArrowClick={() => { handleArrow(); setLastAction("Keyboard: Arrow action"); }}
          >
            <MenuItem text="Dropdown Item 1" onClick={() => handleClick("Dropdown 1")} />
            <MenuItem text="Dropdown Item 2" onClick={() => handleClick("Dropdown 2")} />
          </SplitButtonWithDropdown>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-muted rounded"><kbd className="font-mono">Enter</kbd> / <kbd className="font-mono">Space</kbd></div>
          <div className="p-2">Triggers default action (click)</div>
          <div className="p-2 bg-muted rounded"><kbd className="font-mono">Arrow Down</kbd> / <kbd className="font-mono">Arrow Up</kbd></div>
          <div className="p-2">Triggers arrow action (opens dropdown)</div>
          <div className="p-2 bg-muted rounded"><kbd className="font-mono">Alt + Arrow Down</kbd> / <kbd className="font-mono">Alt + Arrow Up</kbd></div>
          <div className="p-2">Triggers arrow action</div>
          <div className="p-2 bg-muted rounded"><kbd className="font-mono">F4</kbd></div>
          <div className="p-2">Triggers arrow action</div>
          <div className="p-2 bg-muted rounded"><kbd className="font-mono">Shift</kbd> or <kbd className="font-mono">Escape</kbd> during Space hold</div>
          <div className="p-2">Cancels default action</div>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock language="tsx" code={`import { SplitButton, Menu, MenuItem, SaveIcon } from '@sap-ui/fx-components';
import type { SplitButtonRef } from '@sap-ui/fx-components';
import { useRef, useState } from 'react';

function MyComponent() {
  const ref = useRef<SplitButtonRef>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <SplitButton
        ref={ref}
        text="Save"
        icon={<SaveIcon className="h-4 w-4" />}
        design="Primary"
        onClick={() => save()}
        onArrowClick={() => setOpen(prev => !prev)}
        activeArrowButton={open}
      />
      <Menu
        opener={ref.current?.nativeElement ?? undefined}
        open={open}
        onClose={() => setOpen(false)}
      >
        <MenuItem text="Save As..." onClick={() => saveAs()} />
        <MenuItem text="Save All" onClick={() => saveAll()} />
      </Menu>
    </>
  );
}`} />
      </section>
    </div>
  );
}

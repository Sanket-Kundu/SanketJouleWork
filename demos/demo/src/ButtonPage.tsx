import { useState, useEffect, useRef } from "react";
import {
  Button,
  ButtonDesign,
  ButtonClickEventDetail,
  ButtonState,
  ButtonStateTransition,
  Select,
  Option,
  CheckBox,
  BusyIndicator,
  SaveIcon,
  DeleteIcon,
  SettingsIcon,
  DownloadIcon,
  UploadIcon,
  EditIcon,
  AddIcon,
  SearchIcon,
  RefreshIcon,
  HeartIcon,
  FavoriteIcon,
  ShareIcon,
  EmailIcon,
  BellIcon,
  AiIcon,
  PlayIcon,
  PauseIcon,
  MediaForwardIcon,
  SoundIcon,
  SoundOffIcon,
  PaperPlaneIcon,
  AcceptIcon,
  DeclineIcon,
  CopyIcon,
  GlobeIcon,
  LockedIcon,
  UnlockedIcon,
  ShowIcon,
  HideIcon,
  UndoIcon,
  ArrowRightIcon,
  BookmarkIcon,
  FilterIcon,
  OverflowIcon,
  SlimArrowDownIcon,
  ActionSettingsIcon,
} from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

const SapPlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" {...props}>
    <path d="M8.75 0C9.26777 0 9.6875 0.419733 9.6875 0.9375V7.8125H16.5625C17.0803 7.8125 17.5 8.23223 17.5 8.75C17.5 9.26777 17.0803 9.6875 16.5625 9.6875H13.125H9.6875V16.5625C9.6875 17.0803 9.26777 17.5 8.75 17.5C8.23223 17.5 7.8125 17.0803 7.8125 16.5625V9.6875H0.9375C0.419733 9.6875 0 9.26777 0 8.75C0 8.23223 0.419733 7.8125 0.9375 7.8125H7.8125V0.9375C7.8125 0.419733 8.23223 0 8.75 0Z" fill="currentColor"/>
  </svg>
);

export function ButtonPage() {
  const [clickCount, setClickCount] = useState(0);
  const [lastClickType, setLastClickType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (detail: ButtonClickEventDetail) => {
    setClickCount((c) => c + 1);
    setLastClickType(detail.isKeyboard ? "Keyboard" : "Mouse");
  };

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Button</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Button } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Click Tracker */}
      <section className="p-4 border border-border rounded-lg bg-muted/50">
        <div className="flex items-center gap-4 text-sm">
          <span>
            <strong>Click Count:</strong> {clickCount}
          </span>
          <span>
            <strong>Last Click:</strong> {lastClickType || "None"}
          </span>
        </div>
      </section>

      {/* Basic */}
      <section id="basic" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic</h2>
        <p className="text-secondary-foreground mb-4">
          Simple buttons with common designs and configurations.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button design="Primary" icon={<SapPlusIcon />} onClick={handleClick}>Create</Button>
          <Button design="Secondary" icon={<SaveIcon className="h-4 w-4" />} onClick={handleClick}>Save</Button>
          <Button design="Tertiary" onClick={handleClick}>Cancel</Button>
          <Button design="PrimaryJoule" icon={<AiIcon className="h-4 w-4" />} onClick={handleClick}>Generate</Button>
          <Button design="Neutral" icon={<SettingsIcon className="h-4 w-4" />} onClick={handleClick}>Settings</Button>
        </div>
      </section>

      {/* Design Variants — organized by Figma taxonomy */}
      <section id="variants" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Variants</h2>
        <p className="text-secondary-foreground mb-6">
          Button variants aligned with the Figma design spec. Each type has a standard (brand/blue) and Joule (AI/purple) variant, except Neutral.
        </p>

        {/* Grid: headers + buttons aligned in columns */}
        <span className="text-sm font-bold text-secondary-foreground block mb-2">Large</span>
        <div className="grid grid-cols-[auto_repeat(6,auto)] gap-x-4 gap-y-2 justify-start items-center mb-6">
          {/* Header row */}
          <span></span>
          <span className="text-xs font-medium text-secondary-foreground">Primary</span>
          <span className="text-xs font-medium text-secondary-foreground">Secondary</span>
          <span className="text-xs font-medium text-secondary-foreground">Tertiary</span>
          <span className="text-xs font-medium text-secondary-foreground">Primary <span className="font-normal">(Joule)</span></span>
          <span className="text-xs font-medium text-secondary-foreground">Secondary <span className="font-normal">(Joule)</span></span>
          <span className="text-xs font-medium text-secondary-foreground">Tertiary <span className="font-normal">(Joule)</span></span>

          {/* Large — regular */}
          <span className="text-xs text-secondary-foreground">Regular</span>
          <Button design="Primary" icon={<SapPlusIcon />}>Button</Button>
          <Button design="Secondary" icon={<SapPlusIcon />}>Button</Button>
          <Button design="Tertiary" icon={<SapPlusIcon />}>Button</Button>
          <Button design="PrimaryJoule" icon={<SapPlusIcon />}>Button</Button>
          <Button design="SecondaryJoule" icon={<SapPlusIcon />}>Button</Button>
          <Button design="TertiaryJoule" icon={<SapPlusIcon />}>Button</Button>

          {/* Large — disabled */}
          <span className="text-xs text-secondary-foreground">Disabled</span>
          <Button design="Primary" icon={<SapPlusIcon />} disabled>Button</Button>
          <Button design="Secondary" icon={<SapPlusIcon />} disabled>Button</Button>
          <Button design="Tertiary" icon={<SapPlusIcon />} disabled>Button</Button>
          <Button design="PrimaryJoule" icon={<SapPlusIcon />} disabled>Button</Button>
          <Button design="SecondaryJoule" icon={<SapPlusIcon />} disabled>Button</Button>
          <Button design="TertiaryJoule" icon={<SapPlusIcon />} disabled>Button</Button>
        </div>

        {/* Medium */}
        <span className="text-sm font-bold text-secondary-foreground block mb-2">Medium</span>
        <div className="grid grid-cols-[auto_repeat(6,auto)] gap-x-4 gap-y-2 justify-start items-center mb-8">
          {/* Medium — regular */}
          <span className="text-xs text-secondary-foreground">Regular</span>
          <Button design="Primary" size="Medium" icon={<SapPlusIcon />}>Button</Button>
          <Button design="Secondary" size="Medium" icon={<SapPlusIcon />}>Button</Button>
          <Button design="Tertiary" size="Medium" icon={<SapPlusIcon />}>Button</Button>
          <Button design="PrimaryJoule" size="Medium" icon={<SapPlusIcon />}>Button</Button>
          <Button design="SecondaryJoule" size="Medium" icon={<SapPlusIcon />}>Button</Button>
          <Button design="TertiaryJoule" size="Medium" icon={<SapPlusIcon />}>Button</Button>

          {/* Medium — disabled */}
          <span className="text-xs text-secondary-foreground">Disabled</span>
          <Button design="Primary" size="Medium" icon={<SapPlusIcon />} disabled>Button</Button>
          <Button design="Secondary" size="Medium" icon={<SapPlusIcon />} disabled>Button</Button>
          <Button design="Tertiary" size="Medium" icon={<SapPlusIcon />} disabled>Button</Button>
          <Button design="PrimaryJoule" size="Medium" icon={<SapPlusIcon />} disabled>Button</Button>
          <Button design="SecondaryJoule" size="Medium" icon={<SapPlusIcon />} disabled>Button</Button>
          <Button design="TertiaryJoule" size="Medium" icon={<SapPlusIcon />} disabled>Button</Button>
        </div>

        {/* Small */}
        <span className="text-sm font-bold text-secondary-foreground block mb-2">Small</span>
        <div className="grid grid-cols-[auto_repeat(6,auto)] gap-x-4 gap-y-2 justify-start items-center mb-8">
          {/* Small — regular */}
          <span className="text-xs text-secondary-foreground">Regular</span>
          <Button design="Primary" size="Small" icon={<SapPlusIcon />}>Button</Button>
          <Button design="Secondary" size="Small" icon={<SapPlusIcon />}>Button</Button>
          <Button design="Tertiary" size="Small" icon={<SapPlusIcon />}>Button</Button>
          <Button design="PrimaryJoule" size="Small" icon={<SapPlusIcon />}>Button</Button>
          <Button design="SecondaryJoule" size="Small" icon={<SapPlusIcon />}>Button</Button>
          <Button design="TertiaryJoule" size="Small" icon={<SapPlusIcon />}>Button</Button>

          {/* Small — disabled */}
          <span className="text-xs text-secondary-foreground">Disabled</span>
          <Button design="Primary" size="Small" icon={<SapPlusIcon />} disabled>Button</Button>
          <Button design="Secondary" size="Small" icon={<SapPlusIcon />} disabled>Button</Button>
          <Button design="Tertiary" size="Small" icon={<SapPlusIcon />} disabled>Button</Button>
          <Button design="PrimaryJoule" size="Small" icon={<SapPlusIcon />} disabled>Button</Button>
          <Button design="SecondaryJoule" size="Small" icon={<SapPlusIcon />} disabled>Button</Button>
          <Button design="TertiaryJoule" size="Small" icon={<SapPlusIcon />} disabled>Button</Button>
        </div>

        {/* Neutral — separate section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-2">Neutral</h3>
          <div className="grid grid-cols-[auto_repeat(3,auto)] gap-x-4 gap-y-2 justify-start items-center mb-4">
            <span></span>
            <span className="text-xs font-medium text-secondary-foreground">Neutral</span>
            <span className="text-xs font-medium text-secondary-foreground">SecondaryNeutral</span>
            <span className="text-xs font-medium text-secondary-foreground">TertiaryNeutral</span>

            <span className="text-xs text-secondary-foreground">Regular</span>
            <Button design="Neutral" icon={<SapPlusIcon />}>Button</Button>
            <Button design="SecondaryNeutral" icon={<SapPlusIcon />}>Button</Button>
            <Button design="TertiaryNeutral" icon={<SapPlusIcon />}>Button</Button>
            <span className="text-xs text-secondary-foreground">Disabled</span>
            <Button design="Neutral" icon={<SapPlusIcon />} disabled>Button</Button>
            <Button design="SecondaryNeutral" icon={<SapPlusIcon />} disabled>Button</Button>
            <Button design="TertiaryNeutral" icon={<SapPlusIcon />} disabled>Button</Button>
          </div>
          <span className="text-sm font-bold text-secondary-foreground block mb-2">Medium</span>
          <div className="grid grid-cols-[auto_repeat(3,auto)] gap-x-4 gap-y-2 justify-start items-center mb-4">
            <span className="text-xs text-secondary-foreground">Regular</span>
            <Button design="Neutral" size="Medium" icon={<SapPlusIcon />}>Button</Button>
            <Button design="SecondaryNeutral" size="Medium" icon={<SapPlusIcon />}>Button</Button>
            <Button design="TertiaryNeutral" size="Medium" icon={<SapPlusIcon />}>Button</Button>
            <span className="text-xs text-secondary-foreground">Disabled</span>
            <Button design="Neutral" size="Medium" icon={<SapPlusIcon />} disabled>Button</Button>
            <Button design="SecondaryNeutral" size="Medium" icon={<SapPlusIcon />} disabled>Button</Button>
            <Button design="TertiaryNeutral" size="Medium" icon={<SapPlusIcon />} disabled>Button</Button>
          </div>
          <span className="text-sm font-bold text-secondary-foreground block mb-2">Small</span>
          <div className="grid grid-cols-[auto_repeat(3,auto)] gap-x-4 gap-y-2 justify-start items-center">
            <span className="text-xs text-secondary-foreground">Regular</span>
            <Button design="Neutral" size="Small" icon={<SapPlusIcon />}>Button</Button>
            <Button design="SecondaryNeutral" size="Small" icon={<SapPlusIcon />}>Button</Button>
            <Button design="TertiaryNeutral" size="Small" icon={<SapPlusIcon />}>Button</Button>
            <span className="text-xs text-secondary-foreground">Disabled</span>
            <Button design="Neutral" size="Small" icon={<SapPlusIcon />} disabled>Button</Button>
            <Button design="SecondaryNeutral" size="Small" icon={<SapPlusIcon />} disabled>Button</Button>
            <Button design="TertiaryNeutral" size="Small" icon={<SapPlusIcon />} disabled>Button</Button>
          </div>
        </div>

      </section>

   {/* Icon Only */}
   <section id="iconbutton" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">IconButton</h2>
        <p className="text-secondary-foreground mb-4">
          Icon-only buttons with tooltips for accessibility. Shown in all three sizes.
        </p>
        <div className="space-y-4">
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              Large (40px)
            </span>
            <div className="flex flex-wrap gap-4">
              <Button
                icon={<SaveIcon className="h-4 w-4" />}
                iconOnly
                tooltip="Primary"
                accessibleName="Save"
                design="Primary"
              />
              <Button
                icon={<SapPlusIcon />}
                iconOnly
                tooltip="Secondary"
                accessibleName="Add"
                design="Secondary"
              />
              <Button
                icon={<CopyIcon className="h-4 w-4" />}
                iconOnly
                tooltip="Tertiary"
                accessibleName="Copy"
                design="Tertiary"
              />
              <Button
                icon={<AiIcon className="h-4 w-4" />}
                iconOnly
                tooltip="PrimaryJoule"
                accessibleName="Generate"
                design="PrimaryJoule"
              />
              <Button
                icon={<AiIcon className="h-4 w-4" />}
                iconOnly
                tooltip="SecondaryJoule"
                accessibleName="AI"
                design="SecondaryJoule"
              />
              <Button
                icon={<AiIcon className="h-4 w-4" />}
                iconOnly
                tooltip="TertiaryJoule"
                accessibleName="AI"
                design="TertiaryJoule"
              />
              <Button
                icon={<SettingsIcon className="h-4 w-4" />}
                iconOnly
                tooltip="Neutral"
                accessibleName="Settings"
                design="Neutral"
              />
              <Button
                icon={<SettingsIcon className="h-4 w-4" />}
                iconOnly
                tooltip="SecondaryNeutral"
                accessibleName="Settings"
                design="SecondaryNeutral"
              />
              <Button
                icon={<SettingsIcon className="h-4 w-4" />}
                iconOnly
                tooltip="TertiaryNeutral"
                accessibleName="Settings"
                design="TertiaryNeutral"
              />
            </div>
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              Medium (32px)
            </span>
            <div className="flex flex-wrap gap-4">
              <Button
                icon={<SaveIcon className="h-4 w-4" />}
                iconOnly size="Medium"
                tooltip="Primary"
                accessibleName="Save"
                design="Primary"
              />
              <Button
                icon={<SapPlusIcon />}
                iconOnly size="Medium"
                tooltip="Secondary"
                accessibleName="Add"
                design="Secondary"
              />
              <Button
                icon={<CopyIcon className="h-4 w-4" />}
                iconOnly size="Medium"
                tooltip="Tertiary"
                accessibleName="Copy"
                design="Tertiary"
              />
              <Button
                icon={<AiIcon className="h-4 w-4" />}
                iconOnly size="Medium"
                tooltip="PrimaryJoule"
                accessibleName="Generate"
                design="PrimaryJoule"
              />
              <Button
                icon={<AiIcon className="h-4 w-4" />}
                iconOnly size="Medium"
                tooltip="SecondaryJoule"
                accessibleName="AI"
                design="SecondaryJoule"
              />
              <Button
                icon={<AiIcon className="h-4 w-4" />}
                iconOnly size="Medium"
                tooltip="TertiaryJoule"
                accessibleName="AI"
                design="TertiaryJoule"
              />
              <Button
                icon={<SettingsIcon className="h-4 w-4" />}
                iconOnly size="Medium"
                tooltip="Neutral"
                accessibleName="Settings"
                design="Neutral"
              />
              <Button
                icon={<SettingsIcon className="h-4 w-4" />}
                iconOnly size="Medium"
                tooltip="SecondaryNeutral"
                accessibleName="Settings"
                design="SecondaryNeutral"
              />
              <Button
                icon={<SettingsIcon className="h-4 w-4" />}
                iconOnly size="Medium"
                tooltip="TertiaryNeutral"
                accessibleName="Settings"
                design="TertiaryNeutral"
              />
            </div>
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              Small (24px)
            </span>
            <div className="flex flex-wrap gap-4">
              <Button
                icon={<SaveIcon className="h-3.5 w-3.5" />}
                iconOnly size="Small"
                tooltip="Primary"
                accessibleName="Save"
                design="Primary"
              />
              <Button
                icon={<SapPlusIcon />}
                iconOnly size="Small"
                tooltip="Secondary"
                accessibleName="Add"
                design="Secondary"
              />
              <Button
                icon={<CopyIcon className="h-3.5 w-3.5" />}
                iconOnly size="Small"
                tooltip="Tertiary"
                accessibleName="Copy"
                design="Tertiary"
              />
              <Button
                icon={<AiIcon className="h-3.5 w-3.5" />}
                iconOnly size="Small"
                tooltip="PrimaryJoule"
                accessibleName="Generate"
                design="PrimaryJoule"
              />
              <Button
                icon={<AiIcon className="h-3.5 w-3.5" />}
                iconOnly size="Small"
                tooltip="SecondaryJoule"
                accessibleName="AI"
                design="SecondaryJoule"
              />
              <Button
                icon={<AiIcon className="h-3.5 w-3.5" />}
                iconOnly size="Small"
                tooltip="TertiaryJoule"
                accessibleName="AI"
                design="TertiaryJoule"
              />
              <Button
                icon={<SettingsIcon className="h-3.5 w-3.5" />}
                iconOnly size="Small"
                tooltip="Neutral"
                accessibleName="Settings"
                design="Neutral"
              />
              <Button
                icon={<SettingsIcon className="h-3.5 w-3.5" />}
                iconOnly size="Small"
                tooltip="SecondaryNeutral"
                accessibleName="Settings"
                design="SecondaryNeutral"
              />
              <Button
                icon={<SettingsIcon className="h-3.5 w-3.5" />}
                iconOnly size="Small"
                tooltip="TertiaryNeutral"
                accessibleName="Settings"
                design="TertiaryNeutral"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Text Only */}
      <section id="text-only" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Text Only</h2>
        <p className="text-secondary-foreground mb-4">
          Text-only buttons without icons, shown in all three sizes.
        </p>
        <div className="space-y-4">
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              Large (40px)
            </span>
            <div className="flex flex-wrap gap-4">
              <Button design="Primary">Primary</Button>
              <Button design="Secondary">Secondary</Button>
              <Button design="Tertiary">Tertiary</Button>
              <Button design="PrimaryJoule">PrimaryJoule</Button>
              <Button design="SecondaryJoule">SecondaryJoule</Button>
              <Button design="TertiaryJoule">TertiaryJoule</Button>
              <Button design="Neutral">Neutral</Button>
              <Button design="SecondaryNeutral">SecondaryNeutral</Button>
              <Button design="TertiaryNeutral">TertiaryNeutral</Button>
            </div>
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              Medium (32px)
            </span>
            <div className="flex flex-wrap gap-4">
              <Button design="Primary" size="Medium">Primary</Button>
              <Button design="Secondary" size="Medium">Secondary</Button>
              <Button design="Tertiary" size="Medium">Tertiary</Button>
              <Button design="PrimaryJoule" size="Medium">PrimaryJoule</Button>
              <Button design="SecondaryJoule" size="Medium">SecondaryJoule</Button>
              <Button design="TertiaryJoule" size="Medium">TertiaryJoule</Button>
              <Button design="Neutral" size="Medium">Neutral</Button>
              <Button design="SecondaryNeutral" size="Medium">SecondaryNeutral</Button>
              <Button design="TertiaryNeutral" size="Medium">TertiaryNeutral</Button>
            </div>
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              Small (24px)
            </span>
            <div className="flex flex-wrap gap-4">
              <Button design="Primary" size="Small">Primary</Button>
              <Button design="Secondary" size="Small">Secondary</Button>
              <Button design="Tertiary" size="Small">Tertiary</Button>
              <Button design="PrimaryJoule" size="Small">PrimaryJoule</Button>
              <Button design="SecondaryJoule" size="Small">SecondaryJoule</Button>
              <Button design="TertiaryJoule" size="Small">TertiaryJoule</Button>
              <Button design="Neutral" size="Small">Neutral</Button>
              <Button design="SecondaryNeutral" size="Small">SecondaryNeutral</Button>
              <Button design="TertiaryNeutral" size="Small">TertiaryNeutral</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sizes */}
      <section id="sizes" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Sizes</h2>
        <p className="text-secondary-foreground mb-4">
          Three size variants: Large (default, 40px), Medium (32px), and Small (24px).
        </p>
        <div className="space-y-4">
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              Large — default
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <Button design="Primary" size="Large">
                Primary Large
              </Button>
              <Button design="Secondary" size="Large" icon={<SaveIcon className="h-4 w-4" />}>
                Save
              </Button>
              <Button
                design="PrimaryJoule"
                size="Large"
                icon={<AiIcon className="h-4 w-4" />}
                iconOnly
                tooltip="Generate"
                accessibleName="Generate"
              />
            </div>
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              Medium
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <Button design="Primary" size="Medium">
                Primary Medium
              </Button>
              <Button design="Secondary" size="Medium" icon={<SaveIcon className="h-4 w-4" />}>
                Save
              </Button>
              <Button
                design="PrimaryJoule"
                size="Medium"
                icon={<AiIcon className="h-4 w-4" />}
                iconOnly
                tooltip="Generate"
                accessibleName="Generate"
              />
            </div>
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              Small
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <Button design="Primary" size="Small">
                Primary Small
              </Button>
              <Button design="Secondary" size="Small" icon={<SaveIcon className="h-4 w-4" />}>
                Save
              </Button>
              <Button design="Primary" size="Small" icon={<SaveIcon className="h-3.5 w-3.5" />} iconOnly tooltip="Primary" accessibleName="Save" />
              <Button design="Secondary" size="Small" icon={<SapPlusIcon />} iconOnly tooltip="Secondary" accessibleName="Add" />
              <Button design="PrimaryJoule" size="Small" icon={<AiIcon className="h-3.5 w-3.5" />} iconOnly tooltip="PrimaryJoule" accessibleName="Generate" />
            </div>
          </div>
        </div>
      </section>

      {/* With Icons */}
      <section id="with-text-icons" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">With Text + Icons</h2>
        <p className="text-secondary-foreground mb-4">
          Buttons can have icons at the start, end, or both positions.
        </p>
        <div className="space-y-4">
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              Start icon
            </span>
            <div className="flex flex-wrap gap-4">
              <Button icon={<SaveIcon className="h-4 w-4" />} design="Primary">
                Save
              </Button>
              <Button icon={<DeleteIcon className="h-4 w-4" />} design="Secondary">
                Delete
              </Button>
              <Button icon={<EditIcon className="h-4 w-4" />} design="Neutral">
                Edit
              </Button>
              <Button icon={<SapPlusIcon />} design="PrimaryJoule">
                Create
              </Button>
              <Button icon={<AiIcon className="h-4 w-4" />} design="SecondaryJoule">
                Generate
              </Button>
              <Button icon={<CopyIcon className="h-4 w-4" />} design="Tertiary">
                Copy
              </Button>
              <Button icon={<FilterIcon className="h-4 w-4" />} design="TertiaryJoule">
                Filter
              </Button>
            </div>
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              End icon
            </span>
            <div className="flex flex-wrap gap-4">
              <Button endIcon={<SlimArrowDownIcon className="h-4 w-4" />}>
                Options
              </Button>
              <Button endIcon={<DownloadIcon className="h-4 w-4" />} design="Secondary">
                Download
              </Button>
              <Button endIcon={<ArrowRightIcon className="h-4 w-4" />} design="Primary">
                Continue
              </Button>
              <Button endIcon={<ActionSettingsIcon className="h-4 w-4" />} design="Neutral">
                Open link
              </Button>
            </div>
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              Both icons
            </span>
            <div className="flex flex-wrap gap-4">
              <Button
                icon={<SearchIcon className="h-4 w-4" />}
                endIcon={<SlimArrowDownIcon className="h-4 w-4" />}
                design="Neutral"
              >
                Search
              </Button>
              <Button
                icon={<AiIcon className="h-4 w-4" />}
                endIcon={<SlimArrowDownIcon className="h-4 w-4" />}
                design="PrimaryJoule"
              >
                AI Actions
              </Button>
              <Button
                icon={<SettingsIcon className="h-4 w-4" />}
                endIcon={<SlimArrowDownIcon className="h-4 w-4" />}
                design="Neutral"
              >
                Settings
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Loading State */}
      <section id="loading-state" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Loading State</h2>
        <p className="text-secondary-foreground mb-4">
          Buttons show a busy indicator when loading. Click the first button to see the
          interactive effect.
        </p>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button loading={loading} onClick={handleLoadingDemo} design="Primary">
              {loading ? "Saving..." : "Click to Save"}
            </Button>
            <Button loading design="Primary">
              Loading Primary
            </Button>
            <Button loading design="Secondary">
              Loading Secondary
            </Button>
            <Button loading design="PrimaryJoule">
              Loading PrimaryJoule
            </Button>
            <Button loading design="Neutral">
              Loading Neutral
            </Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button
              loading
              icon={<DownloadIcon className="h-4 w-4" />}
              design="Secondary"
            >
              Downloading...
            </Button>
            <Button loading design="Neutral">
              Loading Neutral
            </Button>
            <Button loading design="Tertiary">
              Loading Tertiary
            </Button>
          </div>
        </div>
      </section>

      {/* Disabled State */}
      <section id="disabled-state" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Disabled State</h2>
        <p className="text-secondary-foreground mb-4">
          Disabled buttons cannot be clicked and have reduced opacity. All designs shown.
        </p>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button disabled design="Primary">
              Primary
            </Button>
            <Button disabled design="PrimaryJoule">
              PrimaryJoule
            </Button>
            <Button disabled design="Secondary">
              Secondary
            </Button>
            <Button disabled design="SecondaryJoule">
              SecondaryJoule
            </Button>
            <Button disabled design="Tertiary">
              Tertiary
            </Button>
            <Button disabled design="TertiaryJoule">
              TertiaryJoule
            </Button>
            <Button disabled design="Neutral">
              Neutral
            </Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button
              disabled
              icon={<SettingsIcon className="h-4 w-4" />}
              iconOnly
              tooltip="Disabled settings"
              accessibleName="Settings"
            />
            <Button disabled icon={<SaveIcon className="h-4 w-4" />} design="Primary">
              Save
            </Button>
            <Button disabled icon={<AiIcon className="h-4 w-4" />} design="PrimaryJoule">
              Generate
            </Button>
          </div>
        </div>
      </section>

      {/* Accessible Role: Link */}
      <section id="accessible-role-link" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Accessible Role: Link</h2>
        <p className="text-secondary-foreground mb-4">
          Buttons with <code className="text-sm bg-muted px-1 rounded">accessibleRole="Link"</code> are
          announced as links by screen readers, useful for navigation-style actions.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            accessibleRole="Link"
            design="Neutral"
            endIcon={<ActionSettingsIcon className="h-4 w-4" />}
          >
            View documentation
          </Button>
          <Button
            accessibleRole="Link"
            design="Tertiary"
            icon={<GlobeIcon className="h-4 w-4" />}
          >
            Visit website
          </Button>
          <Button
            accessibleRole="Link"
            design="Secondary"
            endIcon={<ArrowRightIcon className="h-4 w-4" />}
          >
            Go to next page
          </Button>
        </div>
      </section>

      {/* Form Integration */}
      <section id="form-integration" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Form Integration</h2>
        <p className="text-secondary-foreground mb-4">
          Buttons with Submit, Reset, and Button types for form integration.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Form submitted!");
          }}
          onReset={() => {
            alert("Form reset!");
          }}
          className="flex flex-wrap gap-4"
        >
          <Button type="Submit" design="Primary" icon={<AcceptIcon className="h-4 w-4" />}>
            Submit Form
          </Button>
          <Button type="Reset" design="Secondary" icon={<UndoIcon className="h-4 w-4" />}>
            Reset Form
          </Button>
          <Button type="Button" design="Tertiary">
            Cancel (Button)
          </Button>
        </form>
      </section>

      {/* Accessibility - Popup Trigger */}
      <section id="popup-trigger" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Popup Trigger</h2>
        <p className="text-secondary-foreground mb-4">
          Buttons that control popups with proper ARIA attributes.
        </p>
        <div className="flex flex-wrap gap-4 items-start">
          <div className="relative">
            <Button
              accessibilityAttributes={{
                expanded: menuOpen,
                hasPopup: "menu",
                controls: "demo-menu",
              }}
              endIcon={
                <SlimArrowDownIcon
                  className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                />
              }
              onClick={() => setMenuOpen(!menuOpen)}
            >
              Options Menu
            </Button>
            {menuOpen && (
              <div
                id="demo-menu"
                className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-md py-1 z-10"
              >
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-accent">
                  Option 1
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-accent">
                  Option 2
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-accent">
                  Option 3
                </button>
              </div>
            )}
          </div>
          <Button
            icon={<BellIcon className="h-4 w-4" />}
            iconOnly
            tooltip="Notifications (3)"
            accessibleName="Notifications, 3 unread"
            accessibilityAttributes={{
              hasPopup: "dialog",
            }}
          />
          <Button
            accessibilityAttributes={{
              hasPopup: "listbox",
            }}
            endIcon={<SlimArrowDownIcon className="h-4 w-4" />}
            design="Neutral"
          >
            Select Value
          </Button>
        </div>
      </section>

      {/* Toggle Button */}
      <section id="toggle-button" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Toggle Button</h2>
        <p className="text-secondary-foreground mb-4">
          Buttons with pressed state for toggle functionality.
        </p>
        <ToggleButtonDemo />
      </section>

      {/* Multi-State Buttons (AI Button style) */}
      <section id="multi-state-buttons" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Multi-State Buttons</h2>
        <p className="text-secondary-foreground mb-4">
          Buttons with multiple states that animate when transitioning. Click to
          cycle through states.
        </p>
        <MultiStateButtonDemo />
      </section>

      {/* Real-World Patterns */}
      <section id="real-world-patterns" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Real-World Patterns</h2>
        <p className="text-secondary-foreground mb-4">
          Common button patterns you'd find in a real application.
        </p>
        <div className="space-y-6">
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              Dialog footer
            </span>
            <div className="flex justify-end gap-3 p-4 border border-border rounded-lg bg-muted/30">
              <Button design="Tertiary">Cancel</Button>
              <Button design="Secondary">Save Draft</Button>
              <Button design="Primary" icon={<AcceptIcon className="h-4 w-4" />}>
                Confirm
              </Button>
            </div>
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              Toolbar
            </span>
            <div className="flex items-center gap-2 p-3 border border-border rounded-lg bg-muted/30">
              <Button design="Primary" size="Medium" icon={<SapPlusIcon />}>
                New
              </Button>
              <Button design="Secondary" size="Medium" icon={<UploadIcon className="h-4 w-4" />}>
                Import
              </Button>
              <Button design="Secondary" size="Medium" icon={<DownloadIcon className="h-4 w-4" />}>
                Export
              </Button>
              <div className="flex-1" />
              <Button
                design="Tertiary"
                size="Medium"
                icon={<FilterIcon className="h-4 w-4" />}
                iconOnly
                tooltip="Filter"
                accessibleName="Filter"
              />
              <Button
                design="Tertiary"
                size="Medium"
                icon={<SettingsIcon className="h-4 w-4" />}
                iconOnly
                tooltip="Settings"
                accessibleName="Settings"
              />
              <Button
                design="Tertiary"
                size="Medium"
                icon={<OverflowIcon className="h-4 w-4" />}
                iconOnly
                tooltip="More actions"
                accessibleName="More actions"
              />
            </div>
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              Destructive action confirmation
            </span>
            <div className="flex gap-3 p-4 border border-border rounded-lg bg-muted/30">
              <Button design="Tertiary">Cancel</Button>
              <Button design="Secondary" icon={<DeleteIcon className="h-4 w-4" />}>
                Delete permanently
              </Button>
            </div>
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              AI suggestion bar
            </span>
            <div className="flex items-center gap-2 p-3 border border-border rounded-lg bg-muted/30">
              <Button design="PrimaryJoule" icon={<AiIcon className="h-4 w-4" />}>
                Generate
              </Button>
              <Button design="SecondaryJoule" icon={<AiIcon className="h-4 w-4" />}>
                Improve
              </Button>
              <Button design="Tertiary" size="Medium" icon={<RefreshIcon className="h-4 w-4" />}>
                Regenerate
              </Button>
              <div className="flex-1" />
              <Button design="Neutral" size="Medium" icon={<CopyIcon className="h-4 w-4" />}>
                Copy
              </Button>
              <Button design="Neutral" size="Medium" icon={<BookmarkIcon className="h-4 w-4" />}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { Button, SaveIcon, AiIcon, ActionSettingsIcon, SettingsIcon } from '@sap-ui/fx-components';

function MyComponent() {
  return (
    <div className="flex gap-4">
      {/* Basic button */}
      <Button>Click me</Button>

      {/* Primary with icon */}
      <Button design="Primary" icon={<SaveIcon className="h-4 w-4" />}>
        Save
      </Button>

      {/* Joule AI button */}
      <Button design="PrimaryJoule" icon={<AiIcon className="h-4 w-4" />}>
        Generate
      </Button>

      {/* Outlined Joule */}
      <Button design="SecondaryJoule" icon={<AiIcon className="h-4 w-4" />}>
        AI Assist
      </Button>

      {/* Neutral */}
      <Button design="Neutral">Secondary action</Button>

      {/* Tertiary */}
      <Button design="Tertiary" endIcon={<ActionSettingsIcon className="h-4 w-4" />}>
        View docs
      </Button>

      {/* Transparent */}
      <Button design="Tertiary">Cancel</Button>

      {/* Small size */}
      <Button design="Primary" size="Medium">Medium</Button>

      {/* Icon only */}
      <Button
        icon={<SettingsIcon className="h-4 w-4" />}
        iconOnly
        tooltip="Settings"
        accessibleName="Settings"
      />

      {/* Loading state */}
      <Button loading>Saving...</Button>

      {/* Form submit */}
      <Button type="Submit" design="Primary">Submit</Button>

      {/* Link role */}
      <Button accessibleRole="Link" design="Neutral">Navigate</Button>
    </div>
  );
}`}
        />
      </section>
    </div>
  );
}

// Helper component for toggle button demo
function ToggleButtonDemo() {
  const [pressed, setPressed] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [visibility, setVisibility] = useState(true);
  const [locked, setLocked] = useState(false);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button
          accessibilityAttributes={{ pressed }}
          design={pressed ? "Primary" : "Secondary"}
          icon={<HeartIcon className={`h-4 w-4 ${pressed ? "fill-current" : ""}`} />}
          onClick={() => setPressed(!pressed)}
        >
          {pressed ? "Liked" : "Like"}
        </Button>

        <Button
          accessibilityAttributes={{ pressed: visibility }}
          design={visibility ? "Secondary" : "Neutral"}
          icon={visibility ? <ShowIcon className="h-4 w-4" /> : <HideIcon className="h-4 w-4" />}
          onClick={() => setVisibility(!visibility)}
        >
          {visibility ? "Visible" : "Hidden"}
        </Button>

        <Button
          accessibilityAttributes={{ pressed: locked }}
          design={locked ? "Primary" : "Neutral"}
          icon={locked ? <LockedIcon className="h-4 w-4" /> : <UnlockedIcon className="h-4 w-4" />}
          iconOnly
          tooltip={locked ? "Unlock" : "Lock"}
          accessibleName={locked ? "Unlock" : "Lock"}
          onClick={() => setLocked(!locked)}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        {["Item 1", "Item 2", "Item 3"].map((item, i) => (
          <Button
            key={i}
            accessibilityAttributes={{ pressed: favorites.has(item) }}
            design={favorites.has(item) ? "PrimaryJoule" : "Tertiary"}
            icon={
              <FavoriteIcon
                className={`h-4 w-4 ${favorites.has(item) ? "fill-current" : ""}`}
              />
            }
            iconOnly
            tooltip={favorites.has(item) ? `Remove ${item}` : `Add ${item}`}
            accessibleName={
              favorites.has(item) ? `Remove ${item}` : `Add ${item}`
            }
            onClick={() => toggleFavorite(item)}
          />
        ))}
      </div>
    </div>
  );
}

// Helper component for multi-state button demo
function MultiStateButtonDemo() {
  // Transition selector
  const [transition, setTransition] = useState<ButtonStateTransition>("slide-up");
  const [pulsingEnabled, setPulsingEnabled] = useState(true);
  const transitions: ButtonStateTransition[] = [
    "slide-up",
    "slide-down",
    "slide-left",
    "slide-right",
    "fade",
    "scale",
    "flip",
    "none",
  ];

  // AI-style generate button with click-triggered transitions
  const [aiState, setAiState] = useState("generate");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const generatingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const aiStates: ButtonState[] = [
    {
      name: "generate",
      text: "Generate",
      icon: <AiIcon className="h-4 w-4" />,
    },
    {
      name: "generating",
      text: "Stop Generating",
      icon: <DeclineIcon className="h-4 w-4" />,
      pulsing: pulsingEnabled,
    },
    {
      name: "revise",
      text: "Revise",
      icon: <AiIcon className="h-4 w-4" />,
      endIcon: <SlimArrowDownIcon className="h-4 w-4" />,
    },
  ];

  // When entering "generating" state, auto-complete after 2 seconds
  useEffect(() => {
    if (aiState === "generating") {
      generatingTimerRef.current = setTimeout(() => {
        setAiState("revise");
      }, 2000);
      return () => {
        if (generatingTimerRef.current) {
          clearTimeout(generatingTimerRef.current);
        }
      };
    }
  }, [aiState]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);

  const handleAiButtonClick = () => {
    if (aiState === "generate") {
      setAiState("generating");
    } else if (aiState === "generating") {
      // Cancel - go back to generate
      if (generatingTimerRef.current) {
        clearTimeout(generatingTimerRef.current);
      }
      setAiState("generate");
    } else if (aiState === "revise") {
      setMenuOpen(!menuOpen);
    }
  };

  const handleMenuAction = (action: string) => {
    setMenuOpen(false);
    if (action === "regenerate") {
      setAiState("generating");
    }
    // Other actions could be handled here
  };

  // Sound wave animation component
  const SoundWave = () => (
    <div className="flex items-center gap-[2px] h-4 w-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-[3px] bg-current rounded-full animate-sound-wave"
          style={{
            animationDelay: `${i * 0.15}s`,
            height: "100%",
          }}
        />
      ))}
      <style>{`
        @keyframes sound-wave {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .animate-sound-wave {
          animation: sound-wave 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );

  // Media player button
  const [playerState, setPlayerState] = useState("play");
  const playerStates: ButtonState[] = [
    {
      name: "play",
      text: "Play",
      icon: <PlayIcon className="h-4 w-4" />,
    },
    {
      name: "playing",
      text: "Pause",
      icon: <SoundWave />,
    },
    {
      name: "next",
      text: "Next",
      icon: <MediaForwardIcon className="h-4 w-4" />,
    },
  ];

  const cyclePlayerState = () => {
    const stateOrder = ["play", "playing", "next"];
    const currentIndex = stateOrder.indexOf(playerState);
    const nextIndex = (currentIndex + 1) % stateOrder.length;
    setPlayerState(stateOrder[nextIndex]);
  };

  // Send message button
  const [sendState, setSendState] = useState("idle");
  const sendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sendStates: ButtonState[] = [
    {
      name: "idle",
      text: "Send",
      icon: <PaperPlaneIcon className="h-4 w-4" />,
    },
    {
      name: "sending",
      text: "Sending...",
      icon: <BusyIndicator size="S" active delay={0} />,
      pulsing: pulsingEnabled,
    },
    {
      name: "sent",
      text: "Sent!",
      icon: <AcceptIcon className="h-4 w-4" />,
    },
    {
      name: "error",
      text: "Retry",
      icon: <DeclineIcon className="h-4 w-4" />,
    },
  ];

  // When entering "sending" state, complete after 3-5 seconds with random result
  useEffect(() => {
    if (sendState === "sending") {
      const delay = 3000 + Math.random() * 2000; // 3-5 seconds
      sendingTimerRef.current = setTimeout(() => {
        // Randomly choose sent or error
        const result = Math.random() > 0.5 ? "sent" : "error";
        setSendState(result);
      }, delay);
      return () => {
        if (sendingTimerRef.current) {
          clearTimeout(sendingTimerRef.current);
        }
      };
    }
  }, [sendState]);

  const handleSendClick = () => {
    if (sendState === "idle" || sendState === "error") {
      setSendState("sending");
    } else if (sendState === "sent") {
      setSendState("idle");
    }
  };

  // Icon-only mute button
  const [muteState, setMuteState] = useState("unmuted");
  const muteStates: ButtonState[] = [
    {
      name: "unmuted",
      icon: <SoundIcon className="h-4 w-4" />,
    },
    {
      name: "muted",
      icon: <SoundOffIcon className="h-4 w-4" />,
    },
  ];

  const toggleMute = () => {
    setMuteState((prev) => (prev === "unmuted" ? "muted" : "unmuted"));
  };

  return (
    <div className="space-y-6">
      {/* Transition Selector */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <label className="text-sm font-medium">Animation Transition:</label>
        <Select
          value={transition}
          onChange={(e) => setTransition(e.selectedOption?.value as ButtonStateTransition)}
          className="w-40"
        >
          {transitions.map((t) => (
            <Option key={t} value={t}>
              {t.replace("-", " ")}
            </Option>
          ))}
        </Select>
        <CheckBox
          checked={pulsingEnabled}
          onChange={(e) => setPulsingEnabled(e.checked)}
          text="Pulse on processing"
        />
      </div>

      {/* AI Generate Button */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">AI Generate Button</h3>
        <p className="text-sm text-secondary-foreground">
          Click Generate → auto-completes to Revise after 2s (or click to cancel). Regenerate from menu restarts.
        </p>
        <div className="flex items-center gap-4">
          <div className="relative" ref={menuRef}>
            <Button
              design="PrimaryJoule"
              states={aiStates}
              state={aiState}
              stateTransition={transition}
              onClick={handleAiButtonClick}
              accessibilityAttributes={
                aiState === "revise"
                  ? { expanded: menuOpen, hasPopup: "menu" }
                  : undefined
              }
            />
            {menuOpen && aiState === "revise" && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-md py-1 z-10">
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
                  onClick={() => handleMenuAction("regenerate")}
                >
                  <RefreshIcon className="h-4 w-4" />
                  Regenerate
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
                  onClick={() => handleMenuAction("edit")}
                >
                  <EditIcon className="h-4 w-4" />
                  Edit prompt
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
                  onClick={() => handleMenuAction("copy")}
                >
                  <ShareIcon className="h-4 w-4" />
                  Copy response
                </button>
              </div>
            )}
          </div>
          <span className="text-sm text-secondary-foreground">
            Current state: <strong>{aiState}</strong>
          </span>
        </div>
      </div>

      {/* Media Player Button */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Media Player Button</h3>
        <p className="text-sm text-secondary-foreground">
          Three states: Play → Playing (with sound wave animation) → Next
        </p>
        <div className="flex items-center gap-4">
          <Button
            design="Secondary"
            states={playerStates}
            state={playerState}
            stateTransition={transition}
            onClick={cyclePlayerState}
          />
          <span className="text-sm text-secondary-foreground">
            Current state: <strong>{playerState}</strong>
          </span>
        </div>
      </div>

      {/* Send Message Button */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Send Message Button</h3>
        <p className="text-sm text-secondary-foreground">
          Click Send → waits 3-5s → randomly succeeds or fails. Click Retry to try again.
        </p>
        <div className="flex items-center gap-4">
          <Button
            design={sendState === "error" ? "Secondary" : sendState === "sent" ? "Primary" : "Primary"}
            states={sendStates}
            state={sendState}
            stateTransition={transition}
            onClick={handleSendClick}
          />
          <span className="text-sm text-secondary-foreground">
            Current state: <strong>{sendState}</strong>
          </span>
        </div>
      </div>

      {/* Icon-only Mute Button */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Icon-Only Mute Button</h3>
        <p className="text-sm text-secondary-foreground">
          Two states with icons only (no text)
        </p>
        <div className="flex items-center gap-4">
          <Button
            design="Tertiary"
            states={muteStates}
            state={muteState}
            stateTransition={transition}
            onClick={toggleMute}
            tooltip={muteState === "unmuted" ? "Mute" : "Unmute"}
            accessibleName={muteState === "unmuted" ? "Mute" : "Unmute"}
          />
          <span className="text-sm text-secondary-foreground">
            Current state: <strong>{muteState}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

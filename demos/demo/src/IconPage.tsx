import { IconDesign, IconMode, Button, ButtonDesign, Input, Card } from "@sap-ui/fx-components";
import { useState, ComponentType } from "react";
import { CodeBlock } from "./components/CodeBlock";

// Individual icon component imports
import { EmployeeIcon } from "../../../src/icons/Employee";
import { AddIcon } from "../../../src/icons/Add";
import { DeleteIcon } from "../../../src/icons/Delete";
import { EditIcon } from "../../../src/icons/Edit";
import { SaveIcon } from "../../../src/icons/Save";
import { CancelIcon } from "../../../src/icons/Cancel";
import { AcceptIcon } from "../../../src/icons/Accept";
import { DeclineIcon } from "../../../src/icons/Decline";
import { EmailIcon } from "../../../src/icons/Email";
import { PhoneIcon } from "../../../src/icons/Phone";
import { HomeIcon } from "../../../src/icons/Home";
import { SearchIcon } from "../../../src/icons/Search";
import { FilterIcon } from "../../../src/icons/Filter";
import { SettingsIcon } from "../../../src/icons/Settings";
import { RefreshIcon } from "../../../src/icons/Refresh";
import { DownloadIcon } from "../../../src/icons/Download";
import { UploadIcon } from "../../../src/icons/Upload";
import { AttachmentIcon } from "../../../src/icons/Attachment";
import { CalendarIcon } from "../../../src/icons/Calendar";
import { HistoryIcon } from "../../../src/icons/History";
import { WorldIcon } from "../../../src/icons/World";
import { FlagIcon } from "../../../src/icons/Flag";
import { FavoriteIcon } from "../../../src/icons/Favorite";
import { HeartIcon } from "../../../src/icons/Heart";
import { AddFavoriteIcon } from "../../../src/icons/AddFavorite";
import { NotificationIcon } from "../../../src/icons/Notification";
import { BellIcon } from "../../../src/icons/Bell";
import { LockedIcon } from "../../../src/icons/Locked";
import { UnlockedIcon } from "../../../src/icons/Unlocked";
import { UserSettingsIcon } from "../../../src/icons/UserSettings";
import { MenuIcon } from "../../../src/icons/Menu";
import { OverflowIcon } from "../../../src/icons/Overflow";
import { NavigationDownArrowIcon } from "../../../src/icons/NavigationDownArrow";
import { NavigationUpArrowIcon } from "../../../src/icons/NavigationUpArrow";
import { NavigationLeftArrowIcon } from "../../../src/icons/NavigationLeftArrow";
import { NavigationRightArrowIcon } from "../../../src/icons/NavigationRightArrow";
import { AddDocumentIcon } from "../../../src/icons/AddDocument";
import { CreateIcon } from "../../../src/icons/Create";
import { DocumentIcon } from "../../../src/icons/Document";
import { FolderIcon } from "../../../src/icons/Folder";
import { FolderBlankIcon } from "../../../src/icons/FolderBlank";
import { CopyIcon } from "../../../src/icons/Copy";
import { PasteIcon } from "../../../src/icons/Paste";
import { UndoIcon } from "../../../src/icons/Undo";
import { RedoIcon } from "../../../src/icons/Redo";
import { PrintIcon } from "../../../src/icons/Print";
import { ShareIcon } from "../../../src/icons/Share";
import { HintIcon } from "../../../src/icons/Hint";
import { InformationIcon } from "../../../src/icons/Information";
import { AlertIcon } from "../../../src/icons/Alert";

// Fx Navigation Icons
import { ConversationsIcon as FxConversationsIcon } from "../../../src/icons-fx/Conversations";
import { DiscoverIcon as FxDiscoverIcon } from "../../../src/icons-fx/Discover";
import { ExploreSkillIcon as FxExploreSkillIcon } from "../../../src/icons-fx/ExploreSkill";
import { JobsIcon as FxJobsIcon } from "../../../src/icons-fx/Jobs";
import { JobsMainNavigationIcon as FxJobsMainNavigationIcon } from "../../../src/icons-fx/JobsMainNavigation";
import { SpacesIcon as FxSpacesIcon } from "../../../src/icons-fx/Spaces";
import { VSCodeIcon as FxVSCodeIcon } from "../../../src/icons-fx/VSCode";
import { CodeIcon as FxCodeIcon } from "../../../src/icons-fx/Code";
import { MenuIcon as FxMenuIcon } from "../../../src/icons-fx/Menu";
import { WaveformIcon as FxWaveformIcon } from "../../../src/icons-fx/Waveform";
import { PanelCloseIcon as FxPanelCloseIcon } from "../../../src/icons-fx/PanelClose";
import { PanelOpenIcon as FxPanelOpenIcon } from "../../../src/icons-fx/PanelOpen";
import { CursorIcon as FxCursorIcon } from "../../../src/icons-fx/Cursor";
import { OpenCommandFieldIcon as FxOpenCommandFieldIcon } from "../../../src/icons-fx/OpenCommandField";
import { CloseCommandFieldIcon as FxCloseCommandFieldIcon } from "../../../src/icons-fx/CloseCommandField";
import { MoreIcon as FxMoreIcon } from "../../../src/icons-fx/More";
import { NewConversationIcon as FxNewConversationIcon } from "../../../src/icons-fx/NewConversation";
import {
  JouleIcon as FxJouleIcon,
  JouleWorkLogo as FxJouleWorkLogoIcon,
  ConversationsSelectedIcon as FxConversationsSelectedIcon,
  DiscoverSelectedIcon as FxDiscoverSelectedIcon,
  SpacesSelectedIcon as FxSpacesSelectedIcon,
  JobsMainNavigationSelectedIcon as FxJobsMainNavigationSelectedIcon,
  CodeSelectedIcon as FxCodeSelectedIcon,
} from "../../../src/components/fx/icons";

export function IconPage() {
  const [clickedIcon, setClickedIcon] = useState<string>("");
  const [iconSearch, setIconSearch] = useState<string>("");

  // Popular SAP icons to showcase
  const popularIcons: { name: string; Component: ComponentType<any> }[] = [
    { name: "employee", Component: EmployeeIcon },
    { name: "add", Component: AddIcon },
    { name: "delete", Component: DeleteIcon },
    { name: "edit", Component: EditIcon },
    { name: "save", Component: SaveIcon },
    { name: "cancel", Component: CancelIcon },
    { name: "accept", Component: AcceptIcon },
    { name: "decline", Component: DeclineIcon },
    { name: "email", Component: EmailIcon },
    { name: "phone", Component: PhoneIcon },
    { name: "home", Component: HomeIcon },
    { name: "search", Component: SearchIcon },
    { name: "filter", Component: FilterIcon },
    { name: "settings", Component: SettingsIcon },
    { name: "refresh", Component: RefreshIcon },
    { name: "download", Component: DownloadIcon },
    { name: "upload", Component: UploadIcon },
    { name: "attachment", Component: AttachmentIcon },
    { name: "calendar", Component: CalendarIcon },
    { name: "history", Component: HistoryIcon },
    { name: "world", Component: WorldIcon },
    { name: "flag", Component: FlagIcon },
    { name: "favorite", Component: FavoriteIcon },
    { name: "heart", Component: HeartIcon },
    { name: "add-favorite", Component: AddFavoriteIcon },
    { name: "notification", Component: NotificationIcon },
    { name: "bell", Component: BellIcon },
    { name: "locked", Component: LockedIcon },
    { name: "unlocked", Component: UnlockedIcon },
    { name: "user-settings", Component: UserSettingsIcon },
    { name: "menu", Component: MenuIcon },
    { name: "overflow", Component: OverflowIcon },
    { name: "navigation-down-arrow", Component: NavigationDownArrowIcon },
    { name: "navigation-up-arrow", Component: NavigationUpArrowIcon },
    { name: "navigation-left-arrow", Component: NavigationLeftArrowIcon },
    { name: "navigation-right-arrow", Component: NavigationRightArrowIcon },
    { name: "add-document", Component: AddDocumentIcon },
    { name: "create", Component: CreateIcon },
    { name: "document", Component: DocumentIcon },
    { name: "folder", Component: FolderIcon },
    { name: "folder-blank", Component: FolderBlankIcon },
    { name: "copy", Component: CopyIcon },
    { name: "paste", Component: PasteIcon },
    { name: "undo", Component: UndoIcon },
    { name: "redo", Component: RedoIcon },
    { name: "print", Component: PrintIcon },
    { name: "share", Component: ShareIcon },
  ];

  // Filter icons based on search
  const filteredIcons = popularIcons.filter(({ name }) =>
    name.toLowerCase().includes(iconSearch.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Icon</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { EmployeeIcon, ... } from "@sap-ui/fx-components/icons"'}</code>
      </header>

      {/* Basic Icons */}
      <section id="basic-usage" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic Usage</h2>
        <p className="text-secondary-foreground mb-4">
          Simple icon with default size and various custom sizes
        </p>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Code:</p>
            <CodeBlock language="tsx" code={`<EmployeeIcon className="h-4 w-4" />
<EmployeeIcon className="h-5 w-5" />
<EmployeeIcon className="h-6 w-6" />
<EmployeeIcon className="h-8 w-8" />
<EmployeeIcon className="h-12 w-12" />
<EmployeeIcon className="h-16 w-16" />`} />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Result:</p>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <EmployeeIcon className="h-4 w-4" />
                <span className="text-xs text-secondary-foreground">16px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <EmployeeIcon className="h-5 w-5" />
                <span className="text-xs text-secondary-foreground">20px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <EmployeeIcon className="h-6 w-6" />
                <span className="text-xs text-secondary-foreground">24px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <EmployeeIcon className="h-8 w-8" />
                <span className="text-xs text-secondary-foreground">32px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <EmployeeIcon className="h-12 w-12" />
                <span className="text-xs text-secondary-foreground">48px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <EmployeeIcon className="h-16 w-16" />
                <span className="text-xs text-secondary-foreground">64px</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Colors */}
      <section id="custom-colors-with-tailwind" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Custom Colors with Tailwind</h2>
        <p className="text-secondary-foreground mb-4">
          Use any Tailwind color class to customize icon colors
        </p>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Code:</p>
            <CodeBlock language="tsx" code={`<HeartIcon className="h-8 w-8 text-red-500" />
<FavoriteIcon className="h-8 w-8 text-yellow-500" />
<WorldIcon className="h-8 w-8 text-blue-500" />
<FlagIcon className="h-8 w-8 text-purple-500" />
<EmailIcon className="h-8 w-8 text-pink-500" />`} />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Result:</p>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <HeartIcon className="h-8 w-8 text-red-500" />
                <span className="text-xs text-secondary-foreground">text-red-500</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <FavoriteIcon className="h-8 w-8 text-yellow-500" />
                <span className="text-xs text-secondary-foreground">text-yellow-500</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <WorldIcon className="h-8 w-8 text-blue-500" />
                <span className="text-xs text-secondary-foreground">text-blue-500</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <FlagIcon className="h-8 w-8 text-purple-500" />
                <span className="text-xs text-secondary-foreground">text-purple-500</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <EmailIcon className="h-8 w-8 text-pink-500" />
                <span className="text-xs text-secondary-foreground">text-pink-500</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Basic Icons - Old section converted */}
      <section id="icon-sizes-overview" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Icon Sizes Overview</h2>
        <p className="text-secondary-foreground mb-4">
          Icons with default styling and various sizes
        </p>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex flex-col items-center gap-2">
            <EmployeeIcon className="h-4 w-4" />
            <span className="text-xs text-secondary-foreground">16px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <EmployeeIcon className="h-5 w-5" />
            <span className="text-xs text-secondary-foreground">20px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <EmployeeIcon className="h-6 w-6" />
            <span className="text-xs text-secondary-foreground">24px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <EmployeeIcon className="h-8 w-8" />
            <span className="text-xs text-secondary-foreground">32px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <EmployeeIcon className="h-12 w-12" />
            <span className="text-xs text-secondary-foreground">48px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <EmployeeIcon className="h-16 w-16" />
            <span className="text-xs text-secondary-foreground">64px</span>
          </div>
        </div>
      </section>

      {/* Design Variants */}
      <section id="design-variants" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Design Variants</h2>
        <p className="text-secondary-foreground mb-4">
          Semantic color variants for different contexts
        </p>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Code:</p>
            <CodeBlock language="tsx" code={`<EmployeeIcon design={IconDesign.Default} className="h-8 w-8" />
<AcceptIcon design={IconDesign.Positive} className="h-8 w-8" />
<DeclineIcon design={IconDesign.Negative} className="h-8 w-8" />
<NotificationIcon design={IconDesign.Critical} className="h-8 w-8" />
<InformationIcon design={IconDesign.Information} className="h-8 w-8" />
<HintIcon design={IconDesign.Neutral} className="h-8 w-8" />`} />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Result:</p>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <EmployeeIcon design={IconDesign.Default} className="h-8 w-8" />
                <span className="text-xs text-secondary-foreground">Default</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <AcceptIcon design={IconDesign.Positive} className="h-8 w-8" />
                <span className="text-xs text-secondary-foreground">Positive</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <DeclineIcon design={IconDesign.Negative} className="h-8 w-8" />
                <span className="text-xs text-secondary-foreground">Negative</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <NotificationIcon design={IconDesign.Critical} className="h-8 w-8" />
                <span className="text-xs text-secondary-foreground">Critical</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <InformationIcon design={IconDesign.Information} className="h-8 w-8" />
                <span className="text-xs text-secondary-foreground">Information</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <HintIcon design={IconDesign.Neutral} className="h-8 w-8" />
                <span className="text-xs text-secondary-foreground">Neutral</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Colors with Tailwind */}
      <section id="custom-colors" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Custom Colors</h2>
        <p className="text-secondary-foreground mb-4">
          Use Tailwind classes to customize icon colors
        </p>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex flex-col items-center gap-2">
            <HeartIcon className="h-8 w-8 text-red-500" />
            <span className="text-xs text-secondary-foreground">text-red-500</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <FavoriteIcon className="h-8 w-8 text-yellow-500" />
            <span className="text-xs text-secondary-foreground">text-yellow-500</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <WorldIcon className="h-8 w-8 text-blue-500" />
            <span className="text-xs text-secondary-foreground">text-blue-500</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <FlagIcon className="h-8 w-8 text-purple-500" />
            <span className="text-xs text-secondary-foreground">text-purple-500</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <EmailIcon className="h-8 w-8 text-pink-500" />
            <span className="text-xs text-secondary-foreground">text-pink-500</span>
          </div>
        </div>
      </section>

      {/* Interactive Icons */}
      <section id="interactive-icons" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Interactive Icons</h2>
        <p className="text-secondary-foreground mb-4">
          Clickable icons with hover effects (mode="Interactive")
        </p>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Code:</p>
            <CodeBlock language="tsx" code={`<EditIcon
  mode={IconMode.Interactive}
  accessibleName="Edit"
  showTooltip
  onClick={(detail) => console.log('clicked', detail.isKeyboard)}
  className="h-8 w-8 text-blue-600"
/>`} />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Result (click to test):</p>
            <div className="flex items-center gap-6 flex-wrap">
              <EditIcon
                mode={IconMode.Interactive}
                accessibleName="Edit"
                showTooltip
                onClick={(detail) => setClickedIcon(`edit (keyboard: ${detail.isKeyboard})`)}
                className="h-8 w-8 text-blue-600"
              />
              <DeleteIcon
                mode={IconMode.Interactive}
                accessibleName="Delete"
                showTooltip
                onClick={(detail) => setClickedIcon(`delete (keyboard: ${detail.isKeyboard})`)}
                className="h-8 w-8 text-red-600"
              />
              <SaveIcon
                mode={IconMode.Interactive}
                accessibleName="Save"
                showTooltip
                onClick={(detail) => setClickedIcon(`save (keyboard: ${detail.isKeyboard})`)}
                className="h-8 w-8 text-green-600"
              />
              <SettingsIcon
                mode={IconMode.Interactive}
                accessibleName="Settings"
                showTooltip
                onClick={(detail) => setClickedIcon(`settings (keyboard: ${detail.isKeyboard})`)}
                className="h-8 w-8 text-secondary-foreground"
              />
            </div>
            {clickedIcon && (
              <p className="text-sm p-3 bg-muted rounded-md mt-3">
                Last clicked: <strong>{clickedIcon}</strong>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Icon Gallery */}
      <section id="icon-gallery" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Icon Gallery</h2>
        <p className="text-secondary-foreground mb-4">
          Popular SAP Fiori icons (hover to see name)
        </p>
        <div className="mb-4">
          <Input
            placeholder="Search icons..."
            value={iconSearch}
            onChange={(detail) => setIconSearch(detail.value)}
            icon={<SearchIcon className="h-4 w-4" />}
            className="max-w-md"
          />
        </div>
        {filteredIcons.length > 0 ? (
          <div className="grid grid-cols-8 gap-4">
            {filteredIcons.map(({ name, Component }) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors group"
                title={name}
              >
                <Component className="h-6 w-6" />
                <span className="text-xs text-secondary-foreground opacity-0 group-hover:opacity-100 transition-opacity truncate w-full text-center">
                  {name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-secondary-foreground text-center py-8">
            No icons found matching "{iconSearch}"
          </p>
        )}
      </section>

      {/* Integration Examples */}
      <section id="integration-examples" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Integration Examples</h2>
        <p className="text-secondary-foreground mb-4">
          Icons work great with other shadcn-ui5 components
        </p>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">In Buttons</h3>
            <div className="mb-3">
              <p className="text-sm font-medium mb-2">Code:</p>
              <CodeBlock language="tsx" code={`<Button design={ButtonDesign.Primary} icon={<AddIcon className="h-4 w-4" />}>
  Add Item
</Button>
<Button design={ButtonDesign.Positive} icon={<SaveIcon className="h-4 w-4" />}>
  Save Changes
</Button>
<Button design={ButtonDesign.Negative} icon={<DeleteIcon className="h-4 w-4" />}>
  Delete
</Button>`} />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Result:</p>
              <div className="flex gap-3">
                <Button design={ButtonDesign.Primary} icon={<AddIcon className="h-4 w-4" />}>
                  Add Item
                </Button>
                <Button design={ButtonDesign.Positive} icon={<SaveIcon className="h-4 w-4" />}>
                  Save Changes
                </Button>
                <Button design={ButtonDesign.Negative} icon={<DeleteIcon className="h-4 w-4" />}>
                  Delete
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">In Inputs</h3>
            <div className="mb-3">
              <p className="text-sm font-medium mb-2">Code:</p>
              <CodeBlock language="tsx" code={`<Input
  placeholder="Search..."
  icon={<SearchIcon className="h-4 w-4" />}
/>
<Input
  type="email"
  placeholder="Email address"
  icon={<EmailIcon className="h-4 w-4" />}
/>`} />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Result:</p>
              <div className="flex flex-col gap-3 max-w-md">
                <Input
                  placeholder="Search..."
                  icon={<SearchIcon className="h-4 w-4" />}
                />
                <Input
                  type="email"
                  placeholder="Email address"
                  icon={<EmailIcon className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Icon Name & Registry */}
      <section id="icon-name-registry" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Icon Name & Registry</h2>
        <p className="text-secondary-foreground mb-4">
          Every icon component exposes its original SAP-icons-v5 JSON key as a
          static <code className="text-xs bg-muted px-1.5 py-0.5 rounded">iconName</code> property.
          This makes it easy to build a name-based lookup map at runtime.
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Reading the icon name</h3>
            <CodeBlock language="tsx" code={`import { AcceptIcon } from '@sap-ui/fx-components/icons'

AcceptIcon.iconName // "accept"
AddFilterIcon.iconName // "add-filter"`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Building a name-to-icon map</h3>
            <p className="text-sm text-secondary-foreground mb-2">
              Import the full barrel and iterate to create a registry keyed by
              the original JSON names.
            </p>
            <CodeBlock language="tsx" code={`import * as AllIcons from '@sap-ui/fx-components/icons'

const iconMap = Object.fromEntries(
  Object.values(AllIcons)
    .filter(icon => icon.iconName)
    .map(icon => [icon.iconName, icon])
)

// Look up by original JSON name
const Icon = iconMap['add-filter'] // AddFilterIcon
<Icon className="h-5 w-5" />`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Live example</h3>
            <p className="text-sm text-secondary-foreground mb-2">
              The <code className="text-xs bg-muted px-1.5 py-0.5 rounded">iconName</code> for each icon in the gallery above:
            </p>
            <div className="flex flex-wrap gap-2">
              {popularIcons.slice(0, 12).map(({ name, Component }) => (
                <div key={name} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted rounded-md">
                  <Component className="h-4 w-4" />
                  <code className="text-xs font-mono">{(Component as any).iconName}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section id="accessibility" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Accessibility</h2>
        <p className="text-secondary-foreground mb-4">
          Icons support proper ARIA attributes and keyboard navigation
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Decorative Icons (default)</h3>
            <p className="text-sm text-secondary-foreground mb-2">
              aria-hidden="true" - Screen readers ignore these icons
            </p>
            <EmployeeIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Image Icons</h3>
            <p className="text-sm text-secondary-foreground mb-2">
              role="img" with aria-label - Conveys meaning to screen readers
            </p>
            <AcceptIcon
              mode={IconMode.Image}
              accessibleName="Approved"
              design={IconDesign.Positive}
              className="h-6 w-6"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Interactive Icons</h3>
            <p className="text-sm text-secondary-foreground mb-2">
              role="button" with keyboard support (Space/Enter) and focus ring
            </p>
            <LockedIcon
              mode={IconMode.Interactive}
              accessibleName="Lock item"
              design={IconDesign.Negative}
              onClick={() => alert("Lock clicked")}
              className="h-6 w-6"
            />
          </div>
        </div>
      </section>

      {/* Fx Navigation Icons */}
      <section id="fx-navigation-icons" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Fx Navigation Icons</h2>
        <p className="text-secondary-foreground mb-4">
          Custom icons used in the FxLayout navigation system. Import from <code className="text-xs bg-muted px-1.5 py-0.5 rounded">@sap-ui/fx-components/icons</code>.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Standard Navigation</h3>
            <div className="grid grid-cols-8 gap-4">
              {([
                { name: "fx-conversations", Component: FxConversationsIcon },
                { name: "fx-discover", Component: FxDiscoverIcon },
                { name: "fx-explore-skill", Component: FxExploreSkillIcon },
                { name: "fx-jobs", Component: FxJobsIcon },
                { name: "fx-jobs-main-navigation", Component: FxJobsMainNavigationIcon },
                { name: "fx-spaces", Component: FxSpacesIcon },
                { name: "fx-code", Component: FxCodeIcon },
                { name: "fx-vscode", Component: FxVSCodeIcon },
                { name: "fx-menu", Component: FxMenuIcon },
                { name: "fx-waveform", Component: FxWaveformIcon },
                { name: "fx-panel-close", Component: FxPanelCloseIcon },
                { name: "fx-panel-open", Component: FxPanelOpenIcon },
                { name: "fx-cursor", Component: FxCursorIcon },
                { name: "fx-open-command-field", Component: FxOpenCommandFieldIcon },
                { name: "fx-close-command-field", Component: FxCloseCommandFieldIcon },
                { name: "fx-more", Component: FxMoreIcon },
                { name: "fx-new-conversation", Component: FxNewConversationIcon },
              ] as { name: string; Component: ComponentType<any> }[]).map(({ name, Component }) => (
                <div
                  key={name}
                  className="flex flex-col items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors group"
                  title={name}
                >
                  <Component className="h-5 w-5" />
                  <span className="text-[10px] text-secondary-foreground opacity-0 group-hover:opacity-100 transition-opacity truncate w-full text-center">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Selected State (Gradient)</h3>
            <p className="text-sm text-secondary-foreground mb-3">
              These icons use SVG gradients for the active/selected navigation state.
            </p>
            <div className="grid grid-cols-8 gap-4">
              {([
                { name: "fx-conversations-selected", Component: FxConversationsSelectedIcon },
                { name: "fx-discover-selected", Component: FxDiscoverSelectedIcon },
                { name: "fx-spaces-selected", Component: FxSpacesSelectedIcon },
                { name: "fx-jobs-main-navigation-selected", Component: FxJobsMainNavigationSelectedIcon },
                { name: "fx-code-selected", Component: FxCodeSelectedIcon },
              ] as { name: string; Component: ComponentType<any> }[]).map(({ name, Component }) => (
                <div
                  key={name}
                  className="flex flex-col items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors group"
                  title={name}
                >
                  <Component className="h-5 w-5" />
                  <span className="text-[10px] text-secondary-foreground opacity-0 group-hover:opacity-100 transition-opacity truncate w-full text-center">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Joule Branding</h3>
            <p className="text-sm text-secondary-foreground mb-3">
              Joule icons feature animated gradient transitions on hover.
            </p>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors">
                <FxJouleIcon size={32} />
                <span className="text-[10px] text-secondary-foreground">FxJouleIcon</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors">
                <FxJouleWorkLogoIcon height={36} />
                <span className="text-[10px] text-secondary-foreground">FxJouleWorkLogoIcon</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

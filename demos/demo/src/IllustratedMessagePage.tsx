import { useState } from "react";
import {
  IllustrationDesign,
  Button,
  ButtonDesign,
  Select,
  Option,
  Achievement,
  AddDimensions,
  AddPeopleToCalendar,
  AddingColumns,
  BeforeSearch,
  DragFilesToUpload,
  EmptyPlanningCalendar,
  ErrorScreen,
  FilteringColumns,
  GroupingColumns,
  KeyTask,
  NewMail,
  NoActivities,
  NoChartData,
  NoColumnsSet,
  NoData,
  NoEntries,
  NoFilterResults,
  NoMail,
  NoNotifications,
  NoSavedItems,
  NoSearchResults,
  NoTasks,
  PageNotFound,
  ReceiveAppreciation,
  ResizingColumns,
  SignOut,
  SortingColumns,
  UnableToLoad,
  UnableToLoadImage,
  UnableToUpload,
  UploadToCloud,
  UserHasSignedUp,
} from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

const ILLUSTRATIONS = [
  { name: "Achievement", Component: Achievement },
  { name: "AddDimensions", Component: AddDimensions },
  { name: "AddPeopleToCalendar", Component: AddPeopleToCalendar },
  { name: "AddingColumns", Component: AddingColumns },
  { name: "BeforeSearch", Component: BeforeSearch },
  { name: "DragFilesToUpload", Component: DragFilesToUpload },
  { name: "EmptyPlanningCalendar", Component: EmptyPlanningCalendar },
  { name: "FilteringColumns", Component: FilteringColumns },
  { name: "GroupingColumns", Component: GroupingColumns },
  { name: "KeyTask", Component: KeyTask },
  { name: "NewMail", Component: NewMail },
  { name: "NoActivities", Component: NoActivities },
  { name: "NoChartData", Component: NoChartData },
  { name: "NoColumnsSet", Component: NoColumnsSet },
  { name: "NoData", Component: NoData },
  { name: "NoEntries", Component: NoEntries },
  { name: "NoFilterResults", Component: NoFilterResults },
  { name: "NoMail", Component: NoMail },
  { name: "NoNotifications", Component: NoNotifications },
  { name: "NoSavedItems", Component: NoSavedItems },
  { name: "NoSearchResults", Component: NoSearchResults },
  { name: "NoTasks", Component: NoTasks },
  { name: "PageNotFound", Component: PageNotFound },
  { name: "ReceiveAppreciation", Component: ReceiveAppreciation },
  { name: "ResizingColumns", Component: ResizingColumns },
  { name: "SignOut", Component: SignOut },
  { name: "SortingColumns", Component: SortingColumns },
  { name: "UnableToLoad", Component: UnableToLoad },
  { name: "UnableToLoadImage", Component: UnableToLoadImage },
  { name: "UnableToUpload", Component: UnableToUpload },
  { name: "UploadToCloud", Component: UploadToCloud },
  { name: "UserHasSignedUp", Component: UserHasSignedUp },
] as const;

const SIZES = [
  { design: IllustrationDesign.Large, label: "Large", dims: "320×240", maxWidth: 700 },
  { design: IllustrationDesign.Medium, label: "Medium", dims: "160×160", maxWidth: 500 },
  { design: IllustrationDesign.Small, label: "Small", dims: "128×128", maxWidth: 380 },
  { design: IllustrationDesign.ExtraSmall, label: "ExtraSmall", dims: "45×45", maxWidth: 320 },
] as const;

export function IllustratedMessagePage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { name, Component: SelectedIllus } = ILLUSTRATIONS[selectedIndex];

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">IllustratedMessage</h1>
        <code className="text-sm text-primary/70 font-mono">
          {'import { IllustratedMessage } from "@sap-ui/fx-components"'}
        </code>
      </header>

      {/* Illustration Explorer */}
      <section id="illustration-explorer" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Illustration Explorer</h2>
        <p className="text-secondary-foreground mb-4">
          Browse {ILLUSTRATIONS.length} Fiori illustrations from{" "}
          <code className="bg-muted px-1 rounded">@ui5/webcomponents-fiori</code>.
          Each illustration has 4 detail levels — not just resized.
        </p>

        <div className="mb-6" style={{ maxWidth: 300 }}>
          <Select
            value={name}
            onChange={(e) => {
              const idx = ILLUSTRATIONS.findIndex((i) => i.name === e.selectedOption.value);
              if (idx >= 0) setSelectedIndex(idx);
            }}
          >
            {ILLUSTRATIONS.map((item) => (
              <Option key={item.name} value={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-6">
          {SIZES.map(({ design, label, dims, maxWidth }) => (
            <div key={label}>
              <div className="text-sm font-semibold text-sapphire-text-secondary mb-2">
                {label} <span className="font-normal text-muted-foreground">({dims})</span>
              </div>
              <div
                className="border border-border rounded-md bg-sapphire-background-secondary overflow-hidden"
                style={{ maxWidth }}
              >
                <SelectedIllus
                  key={`${name}-${label}`}
                  design={design}
                  titleText="This is the title"
                  subtitleText="And this is the subtitle text for the illustrated message."
                  decorative
                >
                  <Button design={ButtonDesign.Neutral}>Action</Button>
                </SelectedIllus>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Responsive Auto-sizing */}
      <section id="responsive-auto-sizing" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Responsive Auto-sizing</h2>
        <p className="text-secondary-foreground mb-4">
          With <code>design="Auto"</code> (default), the component reads its
          container width and picks the best size. Drag the bottom-right corner
          to resize.
        </p>
        <div
          className="border-2 border-dashed border-border rounded-md overflow-auto min-h-[100px]"
          style={{ resize: "both", width: "100%", height: 350 }}
        >
          <NoNotifications
            titleText="No new notifications"
            subtitleText="You're all caught up. Check back later for updates."
          >
            <Button design={ButtonDesign.Neutral}>Refresh</Button>
          </NoNotifications>
        </div>
        <p className="text-xs text-secondary-foreground mt-2">
          Breakpoints: &gt;681px Large, &le;681px Medium, &le;360px Small,
          &le;260px ExtraSmall, &le;160px Base
        </p>
      </section>

      {/* API Reference */}
      <section id="api-reference" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Illustration Component Props
            </h3>
            <div className="bg-muted rounded-md p-4 text-sm font-mono overflow-auto">
              <pre>{`interface IllustrationProps {
  design?: IllustrationDesign;       // "Auto" | "Large" | "Medium" | "Small" | "ExtraSmall" | "Base"
  titleText?: string;                // Title string (defaults to i18n metadata)
  subtitleText?: string;             // Subtitle string (defaults to i18n metadata)
  title?: ReactNode;                 // Custom title element
  subtitle?: ReactNode;              // Custom subtitle element
  children?: ReactNode;              // Action buttons
  decorative?: boolean;              // Presentational mode (hides from a11y tree)
  accessibleName?: string;           // ARIA label
  className?: string;
  style?: CSSProperties;
  id?: string;
}`}</pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Usage</h3>
            <div className="bg-muted rounded-md p-4 text-sm font-mono overflow-auto">
              <pre>{`import { BeforeSearch } from "@sap-ui/fx-components";
import { TntSuccess } from "@sap-ui/fx-components";

// Auto-sizing with lazy-loaded SVG (reads container width)
<BeforeSearch
  titleText="Search the table"
  subtitleText="Enter a search term"
/>

// Fixed size
<BeforeSearch
  design="Small"
  titleText="Search"
/>

// With action buttons
<BeforeSearch
  titleText="Search"
  subtitleText="Enter a term"
>
  <Button>Action</Button>
</BeforeSearch>

// Direct SVG access (no IllustratedMessage, static import)
<BeforeSearch.Small className="w-32 h-32" />`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import {
  BeforeSearch, ErrorScreen, EmptyList, TntSuccess,
  Button, IllustrationDesign,
} from "@sap-ui/fx-components";

// Auto-sizing (picks size based on container width)
<BeforeSearch
  titleText="Search the table"
  subtitleText="Enter a search term to find relevant data"
/>

// Fixed size
<EmptyList
  design={IllustrationDesign.Medium}
  titleText="No items yet"
  subtitleText="Add items to get started"
/>

// With action buttons
<ErrorScreen
  titleText="Something went wrong"
  subtitleText="Please try again or contact support."
>
  <Button design="Primary" onClick={() => location.reload()}>
    Refresh
  </Button>
  <Button design="Secondary">Contact Support</Button>
</ErrorScreen>

// TNT illustration set
<TntSuccess
  design={IllustrationDesign.Small}
  titleText="All done!"
  subtitleText="Your task completed successfully."
/>`}
        />
      </section>
    </div>
  );
}

export default IllustratedMessagePage;

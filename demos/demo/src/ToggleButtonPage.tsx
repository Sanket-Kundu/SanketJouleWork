import { useState } from "react";
import { ToggleButton, FavoriteIcon, HeartIcon, BoldTextIcon, ItalicTextIcon, UnderlineTextIcon, StrikethroughIcon, PushpinOnIcon, BookmarkIcon } from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

const designs = ["Secondary", "Tertiary", "SecondaryJoule", "TertiaryJoule", "SecondaryNeutral", "TertiaryNeutral"] as const;

export function ToggleButtonPage() {
  const [favoritePressed, setFavoritePressed] = useState(false);
  const [likePressed, setLikePressed] = useState(false);
  const [pinPressed, setPinPressed] = useState(false);
  const [bookmarkPressed, setBookmarkPressed] = useState(false);

  // Design variants grid state — unpressed row starts false, pressed row starts true
  const [unpressedRow, setUnpressedRow] = useState<Record<string, boolean>>(
    Object.fromEntries(designs.map(d => [d, false]))
  );
  const [pressedRow, setPressedRow] = useState<Record<string, boolean>>(
    Object.fromEntries(designs.map(d => [d, true]))
  );
  const [unpressedRowMd, setUnpressedRowMd] = useState<Record<string, boolean>>(
    Object.fromEntries(designs.map(d => [d, false]))
  );
  const [pressedRowMd, setPressedRowMd] = useState<Record<string, boolean>>(
    Object.fromEntries(designs.map(d => [d, true]))
  );
  const [unpressedRowSm, setUnpressedRowSm] = useState<Record<string, boolean>>(
    Object.fromEntries(designs.map(d => [d, false]))
  );
  const [pressedRowSm, setPressedRowSm] = useState<Record<string, boolean>>(
    Object.fromEntries(designs.map(d => [d, true]))
  );

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">ToggleButton</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { ToggleButton } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Basic */}
      <section id="basic" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic</h2>
        <p className="text-secondary-foreground mb-4">
          Click to toggle between pressed and unpressed states.
        </p>
        <div className="flex flex-wrap gap-4">
          <ToggleButton pressed={favoritePressed} onChange={({ pressed }) => setFavoritePressed(pressed)} icon={<FavoriteIcon className={`h-4 w-4 ${favoritePressed ? "fill-current" : ""}`} />}>Favorite</ToggleButton>
          <ToggleButton design="Tertiary" pressed={likePressed} onChange={({ pressed }) => setLikePressed(pressed)} icon={<HeartIcon className={`h-4 w-4 ${likePressed ? "fill-current" : ""}`} />}>Like</ToggleButton>
          <ToggleButton design="SecondaryNeutral" pressed={pinPressed} onChange={({ pressed }) => setPinPressed(pressed)} icon={<PushpinOnIcon className="h-4 w-4" />}>Pin</ToggleButton>
          <ToggleButton design="SecondaryJoule" pressed={bookmarkPressed} onChange={({ pressed }) => setBookmarkPressed(pressed)} icon={<BookmarkIcon className={`h-4 w-4 ${bookmarkPressed ? "fill-current" : ""}`} />}>Bookmark</ToggleButton>
        </div>
      </section>

      {/* Design Variants */}
      <section id="variants" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Variants</h2>
        <p className="text-secondary-foreground mb-4">
          All button designs supported, each with distinct unpressed and pressed states.
        </p>

        {/* Large */}
        <h3 className="text-sm font-bold mb-2">Large</h3>
        <div className="grid grid-cols-[auto_repeat(6,auto)] gap-x-4 gap-y-2 justify-start items-center justify-items-start mb-6">
          <span></span>
          <span className="text-xs font-medium text-secondary-foreground">Secondary</span>
          <span className="text-xs font-medium text-secondary-foreground">Tertiary</span>
          <span className="text-xs font-medium text-secondary-foreground">Secondary <span className="font-normal">(Joule)</span></span>
          <span className="text-xs font-medium text-secondary-foreground">Tertiary <span className="font-normal">(Joule)</span></span>
          <span className="text-xs font-medium text-secondary-foreground">SecondaryNeutral</span>
          <span className="text-xs font-medium text-secondary-foreground">TertiaryNeutral</span>

          <span className="text-xs text-secondary-foreground">Unpressed</span>
          {designs.map(d => (
            <ToggleButton key={`up-${d}`} design={d} pressed={unpressedRow[d]} onChange={({ pressed }) => setUnpressedRow(prev => ({ ...prev, [d]: pressed }))}>Toggle</ToggleButton>
          ))}

          <span className="text-xs text-secondary-foreground">Pressed (toggled)</span>
          {designs.map(d => (
            <ToggleButton key={`pr-${d}`} design={d} pressed={pressedRow[d]} onChange={({ pressed }) => setPressedRow(prev => ({ ...prev, [d]: pressed }))}>Toggle</ToggleButton>
          ))}

          <span className="text-xs text-secondary-foreground">Disabled</span>
          {designs.map(d => (
            <ToggleButton key={`dis-${d}`} design={d} disabled>Toggle</ToggleButton>
          ))}
        </div>

        {/* Medium */}
        <h3 className="text-sm font-bold mb-2">Medium</h3>
        <div className="grid grid-cols-[auto_repeat(6,auto)] gap-x-4 gap-y-2 justify-start items-center justify-items-start mb-6">
          <span></span>
          <span className="text-xs font-medium text-secondary-foreground">Secondary</span>
          <span className="text-xs font-medium text-secondary-foreground">Tertiary</span>
          <span className="text-xs font-medium text-secondary-foreground">Secondary <span className="font-normal">(Joule)</span></span>
          <span className="text-xs font-medium text-secondary-foreground">Tertiary <span className="font-normal">(Joule)</span></span>
          <span className="text-xs font-medium text-secondary-foreground">SecondaryNeutral</span>
          <span className="text-xs font-medium text-secondary-foreground">TertiaryNeutral</span>

          <span className="text-xs text-secondary-foreground">Unpressed</span>
          {designs.map(d => (
            <ToggleButton key={`up-md-${d}`} size="Medium" design={d} pressed={unpressedRowMd[d]} onChange={({ pressed }) => setUnpressedRowMd(prev => ({ ...prev, [d]: pressed }))}>Toggle</ToggleButton>
          ))}

          <span className="text-xs text-secondary-foreground">Pressed (toggled)</span>
          {designs.map(d => (
            <ToggleButton key={`pr-md-${d}`} size="Medium" design={d} pressed={pressedRowMd[d]} onChange={({ pressed }) => setPressedRowMd(prev => ({ ...prev, [d]: pressed }))}>Toggle</ToggleButton>
          ))}

          <span className="text-xs text-secondary-foreground">Disabled</span>
          {designs.map(d => (
            <ToggleButton key={`dis-md-${d}`} design={d} size="Medium" disabled>Toggle</ToggleButton>
          ))}
        </div>

        {/* Small */}
        <h3 className="text-sm font-bold mb-2">Small</h3>
        <div className="grid grid-cols-[auto_repeat(6,auto)] gap-x-4 gap-y-2 justify-start items-center justify-items-start mb-6">
          <span></span>
          <span className="text-xs font-medium text-secondary-foreground">Secondary</span>
          <span className="text-xs font-medium text-secondary-foreground">Tertiary</span>
          <span className="text-xs font-medium text-secondary-foreground">Secondary <span className="font-normal">(Joule)</span></span>
          <span className="text-xs font-medium text-secondary-foreground">Tertiary <span className="font-normal">(Joule)</span></span>
          <span className="text-xs font-medium text-secondary-foreground">SecondaryNeutral</span>
          <span className="text-xs font-medium text-secondary-foreground">TertiaryNeutral</span>

          <span className="text-xs text-secondary-foreground">Unpressed</span>
          {designs.map(d => (
            <ToggleButton key={`up-sm-${d}`} size="Small" design={d} pressed={unpressedRowSm[d]} onChange={({ pressed }) => setUnpressedRowSm(prev => ({ ...prev, [d]: pressed }))}>Toggle</ToggleButton>
          ))}

          <span className="text-xs text-secondary-foreground">Pressed (toggled)</span>
          {designs.map(d => (
            <ToggleButton key={`pr-sm-${d}`} size="Small" design={d} pressed={pressedRowSm[d]} onChange={({ pressed }) => setPressedRowSm(prev => ({ ...prev, [d]: pressed }))}>Toggle</ToggleButton>
          ))}

          <span className="text-xs text-secondary-foreground">Disabled</span>
          {designs.map(d => (
            <ToggleButton key={`dis-sm-${d}`} design={d} size="Small" disabled>Toggle</ToggleButton>
          ))}
        </div>
      </section>

      {/* Icon Only — all sizes */}
      <section id="icon-only" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Icon Only</h2>
        <p className="text-secondary-foreground mb-4">
          Icon-only toggle buttons in all three sizes and design variants.
        </p>
        <div className="space-y-4">
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              Large (40px)
            </span>
            <div className="flex flex-wrap gap-4">
              {designs.map(d => (
                <ToggleButton key={`ico-lg-${d}`} design={d} icon={<FavoriteIcon className="h-4 w-4" />} tooltip={d} accessibleName={d} />
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              Medium (32px)
            </span>
            <div className="flex flex-wrap gap-4">
              {designs.map(d => (
                <ToggleButton key={`ico-md-${d}`} design={d} size="Medium" icon={<FavoriteIcon className="h-4 w-4" />} tooltip={d} accessibleName={d} />
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              Small (24px)
            </span>
            <div className="flex flex-wrap gap-4">
              {designs.map(d => (
                <ToggleButton key={`ico-sm-${d}`} design={d} size="Small" icon={<FavoriteIcon className="h-3.5 w-3.5" />} tooltip={d} accessibleName={d} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Text Only */}
      <section id="text-only" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Text Only</h2>
        <p className="text-secondary-foreground mb-4">
          Text-only toggle buttons without icons, shown in all three sizes.
        </p>
        <div className="space-y-4">
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              Large (40px)
            </span>
            <div className="flex flex-wrap gap-4">
              {designs.map(d => (
                <ToggleButton key={`txt-lg-${d}`} design={d}>{d}</ToggleButton>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              Medium (32px)
            </span>
            <div className="flex flex-wrap gap-4">
              {designs.map(d => (
                <ToggleButton key={`txt-md-${d}`} design={d} size="Medium">{d}</ToggleButton>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-foreground block mb-2">
              Small (24px)
            </span>
            <div className="flex flex-wrap gap-4">
              {designs.map(d => (
                <ToggleButton key={`txt-sm-${d}`} design={d} size="Small">{d}</ToggleButton>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Text Formatting Toolbar */}
      <section id="text-formatting-toolbar" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Text Formatting Toolbar</h2>
        <p className="text-secondary-foreground mb-4">
          Multiple independent toggle buttons used together as a formatting toolbar.
        </p>
        <FormattingToolbar />
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { ToggleButton, FavoriteIcon, BoldTextIcon } from "@sap-ui/fx-components";

const [pressed, setPressed] = useState(false);

// With icon and text
<ToggleButton
  pressed={pressed}
  onChange={({ pressed }) => setPressed(pressed)}
  icon={<FavoriteIcon className="h-4 w-4" />}
>
  Favorite
</ToggleButton>

// Icon-only
<ToggleButton
  icon={<BoldTextIcon className="h-4 w-4" />}
  tooltip="Bold"
  accessibleName="Toggle bold"
/>

// Design variants
<ToggleButton design="Secondary">Secondary</ToggleButton>
<ToggleButton design="Tertiary">Tertiary</ToggleButton>
<ToggleButton design="SecondaryJoule">SecondaryJoule</ToggleButton>
<ToggleButton design="SecondaryNeutral">SecondaryNeutral</ToggleButton>`}
        />
      </section>
    </div>
  );
}

function FormattingToolbar() {
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [strikethrough, setStrikethrough] = useState(false);

  return (
    <div className="flex gap-1 p-2 border border-border rounded-lg bg-muted/30 w-fit">
      <ToggleButton
        design="Tertiary"
        pressed={bold}
        onChange={({ pressed }) => setBold(pressed)}
        icon={<BoldTextIcon className="h-4 w-4" />}
        tooltip="Bold"
        accessibleName="Toggle bold"
      />
      <ToggleButton
        design="Tertiary"
        pressed={italic}
        onChange={({ pressed }) => setItalic(pressed)}
        icon={<ItalicTextIcon className="h-4 w-4" />}
        tooltip="Italic"
        accessibleName="Toggle italic"
      />
      <ToggleButton
        design="Tertiary"
        pressed={underline}
        onChange={({ pressed }) => setUnderline(pressed)}
        icon={<UnderlineTextIcon className="h-4 w-4" />}
        tooltip="Underline"
        accessibleName="Toggle underline"
      />
      <ToggleButton
        design="Tertiary"
        pressed={strikethrough}
        onChange={({ pressed }) => setStrikethrough(pressed)}
        icon={<StrikethroughIcon className="h-4 w-4" />}
        tooltip="Strikethrough"
        accessibleName="Toggle strikethrough"
      />
    </div>
  );
}

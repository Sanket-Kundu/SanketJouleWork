import { Avatar, NotificationListItem } from "@sap-ui/fx-components";
import { AvatarShape, AvatarSize, AvatarColorScheme } from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";
import { User, Settings, Bell, Package, Star } from "lucide-react";
import { useState } from "react";

export function AvatarPage() {
  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Avatar</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Avatar } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Variant Matrix — Size x Shape x Content Type */}
      <section id="variant-matrix" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-1">Variant Matrix</h2>
        <p className="text-sm text-secondary-foreground mb-6">
          Every combination of size, shape, and content type.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-secondary-foreground pb-2 pr-4 align-bottom" rowSpan={2}>
                  Size
                </th>
                <th className="text-center text-sm font-semibold text-foreground pb-1 px-2 border-b border-border" colSpan={2}>
                  Image
                </th>
                <th className="text-center text-sm font-semibold text-foreground pb-1 px-2 border-b border-border" colSpan={2}>
                  Icon
                </th>
                <th className="text-center text-sm font-semibold text-foreground pb-1 px-2 border-b border-border" colSpan={2}>
                  Initials
                </th>
              </tr>
              <tr>
                {["Circle", "Square", "Circle", "Square", "Circle", "Square"].map((label, i) => (
                  <th key={i} className="text-center text-xs font-normal text-secondary-foreground pb-3 pt-1 px-4">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(["XS", "S", "M", "L", "XL"] as const).map((size, idx) => (
                <tr key={size} className="border-t border-border/50">
                  <td className="py-3 pr-4 text-xs font-medium text-secondary-foreground align-middle">
                    {size}
                  </td>
                  {/* Image — Circle */}
                  <td className="py-3 px-4 text-center align-middle">
                    <div className="inline-block">
                      <Avatar
                        size={size}
                        shape={AvatarShape.Circle}
                        image={`https://i.pravatar.cc/150?img=${idx + 1}`}
                        accessibleName={`Image circle ${size}`}
                      />
                    </div>
                  </td>
                  {/* Image — Square */}
                  <td className="py-3 px-4 text-center align-middle">
                    <div className="inline-block">
                      <Avatar
                        size={size}
                        shape={AvatarShape.Square}
                        image={`https://i.pravatar.cc/150?img=${idx + 6}`}
                        accessibleName={`Image square ${size}`}
                      />
                    </div>
                  </td>
                  {/* Icon — Circle */}
                  <td className="py-3 px-4 text-center align-middle">
                    <div className="inline-block">
                      <Avatar
                        size={size}
                        shape={AvatarShape.Circle}
                        icon={<User />}
                        colorScheme={AvatarColorScheme.Accent1}
                      />
                    </div>
                  </td>
                  {/* Icon — Square */}
                  <td className="py-3 px-4 text-center align-middle">
                    <div className="inline-block">
                      <Avatar
                        size={size}
                        shape={AvatarShape.Square}
                        icon={<Star />}
                        colorScheme={AvatarColorScheme.Accent4}
                      />
                    </div>
                  </td>
                  {/* Initials — Circle */}
                  <td className="py-3 px-4 text-center align-middle">
                    <div className="inline-block">
                      <Avatar
                        size={size}
                        shape={AvatarShape.Circle}
                        initials="JD"
                        colorScheme={AvatarColorScheme.Accent7}
                      />
                    </div>
                  </td>
                  {/* Initials — Square */}
                  <td className="py-3 px-4 text-center align-middle">
                    <div className="inline-block">
                      <Avatar
                        size={size}
                        shape={AvatarShape.Square}
                        initials="AB"
                        colorScheme={AvatarColorScheme.Accent9}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {/* Interactive row — XL only */}
              <tr className="border-t-2 border-border">
                <td className="py-3 pr-4 text-xs font-medium text-secondary-foreground align-middle">
                  XL<br /><span className="text-[10px] text-secondary-foreground/70">Interactive</span>
                </td>
                {/* Image — Circle */}
                <td className="py-3 px-4 text-center align-middle">
                  <div className="inline-block">
                    <Avatar
                      size={AvatarSize.XL}
                      shape={AvatarShape.Circle}
                      image="https://i.pravatar.cc/150?img=11"
                      accessibleName="Interactive image circle"
                      interactive
                      onClick={() => alert("Image Circle clicked")}
                    />
                  </div>
                </td>
                {/* Image — Square */}
                <td className="py-3 px-4 text-center align-middle">
                  <div className="inline-block">
                    <Avatar
                      size={AvatarSize.XL}
                      shape={AvatarShape.Square}
                      image="https://i.pravatar.cc/150?img=12"
                      accessibleName="Interactive image square"
                      interactive
                      onClick={() => alert("Image Square clicked")}
                    />
                  </div>
                </td>
                {/* Icon — Circle */}
                <td className="py-3 px-4 text-center align-middle">
                  <div className="inline-block">
                    <Avatar
                      size={AvatarSize.XL}
                      shape={AvatarShape.Circle}
                      icon={<User />}
                      colorScheme={AvatarColorScheme.Accent1}
                      interactive
                      onClick={() => alert("Icon Circle clicked")}
                    />
                  </div>
                </td>
                {/* Icon — Square */}
                <td className="py-3 px-4 text-center align-middle">
                  <div className="inline-block">
                    <Avatar
                      size={AvatarSize.XL}
                      shape={AvatarShape.Square}
                      icon={<Star />}
                      colorScheme={AvatarColorScheme.Accent4}
                      interactive
                      onClick={() => alert("Icon Square clicked")}
                    />
                  </div>
                </td>
                {/* Initials — Circle */}
                <td className="py-3 px-4 text-center align-middle">
                  <div className="inline-block">
                    <Avatar
                      size={AvatarSize.XL}
                      shape={AvatarShape.Circle}
                      initials="JD"
                      colorScheme={AvatarColorScheme.Accent7}
                      interactive
                      onClick={() => alert("Initials Circle clicked")}
                    />
                  </div>
                </td>
                {/* Initials — Square */}
                <td className="py-3 px-4 text-center align-middle">
                  <div className="inline-block">
                    <Avatar
                      size={AvatarSize.XL}
                      shape={AvatarShape.Square}
                      initials="AB"
                      colorScheme={AvatarColorScheme.Accent9}
                      interactive
                      onClick={() => alert("Initials Square clicked")}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Shapes */}
      <section id="shapes" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">Shapes</h2>
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex flex-col items-center gap-2">
            <Avatar shape={AvatarShape.Circle} initials="JD" />
            <span className="text-xs text-secondary-foreground">Circle</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Avatar shape={AvatarShape.Square} initials="JD" />
            <span className="text-xs text-secondary-foreground">Square</span>
          </div>
        </div>
      </section>

      {/* Sizes */}
      <section id="sizes" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">Sizes</h2>
        <div className="flex flex-wrap gap-6 items-end">
          {(["XS", "S", "M", "L", "XL"] as const).map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Avatar size={size} initials="AB" colorScheme={AvatarColorScheme.Accent2} />
              <span className="text-xs text-secondary-foreground">{size}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Color Schemes */}
      <section id="color-schemes" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">Color Schemes</h2>
        <div className="flex flex-wrap gap-4 items-center">
          {(["Accent1","Accent2","Accent3","Accent4","Accent5","Accent6","Accent7","Accent8","Accent9","Accent10","Placeholder"] as const).map((scheme, i) => (
            <div key={scheme} className="flex flex-col items-center gap-2">
              <Avatar colorScheme={scheme} initials={scheme === "Placeholder" ? "PL" : `A${i + 1}`} />
              <span className="text-xs text-secondary-foreground">{scheme}</span>
            </div>
          ))}
        </div>
      </section>

      {/* With Initials */}
      <section id="with-initials" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">With Initials</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Avatar initials="J" colorScheme={AvatarColorScheme.Accent1} />
          <Avatar initials="JD" colorScheme={AvatarColorScheme.Accent3} />
          <Avatar initials="JDO" colorScheme={AvatarColorScheme.Accent5} />
        </div>
      </section>

      {/* With Icon */}
      <section id="with-icon" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">With Icon</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Avatar icon={<User />} colorScheme={AvatarColorScheme.Accent1} />
          <Avatar icon={<Settings />} colorScheme={AvatarColorScheme.Accent4} shape={AvatarShape.Square} />
          <Avatar icon={<Bell />} colorScheme={AvatarColorScheme.Accent7} size={AvatarSize.L} />
          <div className="flex flex-col items-center gap-1">
            <Avatar colorScheme={AvatarColorScheme.Placeholder} />
            <span className="text-xs text-secondary-foreground">Default (no content)</span>
          </div>
        </div>
      </section>

      {/* className Override */}
      <section id="classname-override" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">className Override</h2>
        <p className="text-sm text-secondary-foreground mb-4">Accent colors can be overridden via <code>className</code>.</p>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-col items-center gap-2">
            <Avatar initials="A6" colorScheme={AvatarColorScheme.Accent6} />
            <span className="text-xs text-secondary-foreground">Accent6 (default)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Avatar initials="OV" colorScheme={AvatarColorScheme.Accent6} className="bg-purple-300 text-purple-900" />
            <span className="text-xs text-secondary-foreground">className override</span>
          </div>
        </div>
      </section>

      {/* With Image */}
      <section id="with-image" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">With Image</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Avatar
            image="https://i.pravatar.cc/150?img=1"
            initials="JD"
            accessibleName="Jane Doe"
            size={AvatarSize.M}
          />
          <Avatar
            image="https://i.pravatar.cc/150?img=2"
            initials="AB"
            accessibleName="Alex Brown"
            size={AvatarSize.L}
          />
          <Avatar
            image="https://i.pravatar.cc/150?img=3"
            initials="CM"
            accessibleName="Chris Miller"
            shape={AvatarShape.Square}
            size={AvatarSize.L}
          />
          <div className="flex flex-col items-center gap-1">
            <Avatar
              image="https://broken-url.example/img.jpg"
              fallbackImage="https://i.pravatar.cc/150?img=5"
              initials="FB"
              accessibleName="Fallback test"
            />
            <span className="text-xs text-secondary-foreground">With fallback</span>
          </div>
        </div>
      </section>

      {/* Interactive */}
      <section id="interactive" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">Interactive</h2>
        <p className="text-sm text-secondary-foreground mb-4">Interactive avatars are focusable and support click/keyboard activation.</p>
        <div className="flex flex-wrap gap-4 items-center">
          <Avatar
            interactive
            initials="JD"
            colorScheme={AvatarColorScheme.Accent1}
            accessibleName="Jane Doe"
            onClick={() => alert("Avatar clicked")}
          />
          <Avatar
            interactive
            image="https://i.pravatar.cc/150?img=2"
            accessibleName="Alex Brown"
            onClick={() => alert("Avatar clicked")}
          />
          <div className="flex flex-col items-center gap-1">
            <Avatar
              interactive
              disabled
              initials="DI"
              colorScheme={AvatarColorScheme.Accent3}
              accessibleName="Disabled avatar"
            />
            <span className="text-xs text-secondary-foreground">Disabled</span>
          </div>
        </div>
      </section>

      {/* Toggled */}
      <section id="toggled" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">Toggled</h2>
        <p className="text-sm text-secondary-foreground mb-4">Click an avatar to toggle it. Toggled avatars show an active border to indicate selection.</p>
        <ToggleAvatarDemo />
      </section>

      {/* With Badge */}
      <section id="with-badge" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">With Badge</h2>
        <p className="text-sm text-secondary-foreground mb-4">Use the <code>badge</code> prop to show a status indicator.</p>
        <div className="flex flex-wrap gap-6 items-center">
          <Avatar
            initials="JD"
            colorScheme={AvatarColorScheme.Accent1}
            size={AvatarSize.L}
            badge={<span className="block w-2.5 h-2.5 rounded-full bg-sapphire-positive border border-background" />}
          />
          <Avatar
            initials="AB"
            colorScheme={AvatarColorScheme.Accent3}
            size={AvatarSize.L}
            badge={<span className="flex items-center h-3 px-[5px] rounded-lg bg-sapphire-negative border border-background text-[8px] font-semibold text-white leading-none">3</span>}
          />
          <Avatar
            image="https://i.pravatar.cc/150?img=3"
            size={AvatarSize.L}
            badge={<span className="block w-3 h-3 rounded-full bg-sapphire-warning border border-background" />}
          />
        </div>
      </section>

      {/* In Notification List Item */}
      <section id="in-notification-list-item" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">In Notification List Item</h2>
        <p className="text-sm text-secondary-foreground mb-4">Avatar used as the leading element in a NotificationListItem.</p>
        <div className="max-w-md">
          <NotificationListItem
            titleText="Notification Title can be two lines"
            footnotes={["Space xyz", "11:13"]}
            showClose
            avatar={
              <Avatar
                size={AvatarSize.XS}
                shape={AvatarShape.Square}
                colorScheme={AvatarColorScheme.Accent6}
                icon={<Package />}
              />
            }
          >
            Description of notification topic
          </NotificationListItem>
        </div>
      </section>

      {/* All variants grid */}
      <section id="all-sizes-x-shapes" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">All Sizes x Shapes</h2>
        <div className="space-y-4">
          {(["Circle", "Square"] as const).map((shape) => (
            <div key={shape}>
              <h3 className="text-sm font-medium text-secondary-foreground mb-3">{shape}</h3>
              <div className="flex flex-wrap gap-4 items-end">
                {(["XS", "S", "M", "L", "XL"] as const).map((size) => (
                  <div key={size} className="flex flex-col items-center gap-1">
                    <Avatar shape={shape} size={size} initials="AB" colorScheme={AvatarColorScheme.Accent5} />
                    <span className="text-xs text-secondary-foreground">{size}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { Avatar, AvatarShape, AvatarSize, AvatarColorScheme } from "@sap-ui/fx-components";

// With initials
<Avatar initials="JD" colorScheme={AvatarColorScheme.Accent1} />

// With image and fallback
<Avatar
  image="https://example.com/avatar.jpg"
  fallbackImage="https://example.com/fallback.jpg"
  initials="JD"
  accessibleName="Jane Doe"
/>

// Sizes
<Avatar size={AvatarSize.XS} initials="XS" />
<Avatar size={AvatarSize.S} initials="S" />
<Avatar size={AvatarSize.M} initials="M" />
<Avatar size={AvatarSize.L} initials="L" />
<Avatar size={AvatarSize.XL} initials="XL" />

// Square shape
<Avatar shape={AvatarShape.Square} initials="SQ" />

// Interactive
<Avatar
  interactive
  initials="JD"
  accessibleName="Jane Doe"
  onClick={() => console.log("clicked")}
/>

// With badge (small dot)
<Avatar
  initials="JD"
  size={AvatarSize.L}
  badge={<span className="block w-2.5 h-2.5 rounded-full bg-sapphire-positive border border-background" />}
/>`}
        />
      </section>
    </div>
  );
}

function ToggleAvatarDemo() {
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setToggled((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex flex-wrap gap-6 items-center">
      <div className="flex flex-col items-center gap-2">
        <Avatar initials="JD" colorScheme={AvatarColorScheme.Accent1} interactive toggled={!!toggled["a"]} onClick={() => toggle("a")} />
        <span className="text-xs text-secondary-foreground">Initials</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar image="https://i.pravatar.cc/150?img=1" interactive toggled={!!toggled["b"]} onClick={() => toggle("b")} />
        <span className="text-xs text-secondary-foreground">Image circle</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar image="https://i.pravatar.cc/150?img=2" size={AvatarSize.L} interactive toggled={!!toggled["c"]} onClick={() => toggle("c")} />
        <span className="text-xs text-secondary-foreground">Image L</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar image="https://i.pravatar.cc/150?img=3" shape={AvatarShape.Square} size={AvatarSize.L} interactive toggled={!!toggled["d"]} onClick={() => toggle("d")} />
        <span className="text-xs text-secondary-foreground">Image square</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar icon={<User />} colorScheme={AvatarColorScheme.Accent4} interactive toggled={!!toggled["e"]} onClick={() => toggle("e")} />
        <span className="text-xs text-secondary-foreground">Icon</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar initials="SQ" colorScheme={AvatarColorScheme.Accent7} shape={AvatarShape.Square} interactive toggled={!!toggled["f"]} onClick={() => toggle("f")} />
        <span className="text-xs text-secondary-foreground">Square</span>
      </div>
    </div>
  );
}

export default AvatarPage;

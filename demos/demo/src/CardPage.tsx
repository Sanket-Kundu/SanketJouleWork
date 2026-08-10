import { useState } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
  Button,
  Input,
  List,
  ListItem,
  ListSeparator,
  Avatar,
  AvatarShape,
  AvatarSize,
  AvatarColorScheme,
  Title,
  TitleLevel,
  TitleWrappingType,
  Label,
  Link,
  Tag,
  RadioButton,
  Table,
  TableHeaderRow,
  TableHeaderCell,
  TableRow,
  TableCell,
  TableSelectionMulti,
  TableToolbar,
  TableRowActionNavigation,
  ToolbarButton,
  ToolbarSpacer,
  ToolbarSeparator,
  ToolbarItem,
  Toolbar,
  SearchField,
  EmployeeIcon,
  OverflowIcon,
  ActionSettingsIcon,
  FavoriteIcon,
  BellIcon,
  DeleteIcon,
  GroupIcon,
  AiIcon,
  MoveIcon,
  SlimArrowRightIcon,
  FilterIcon,
  SapBoxIcon,
  FullScreenIcon,
} from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";


export function CardPage() {
  const [jouleToolbar3, setJouleToolbar3] = useState(false);

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Card</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Card, CardHeader, CardContent } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Basic Card */}
      <section id="basic-card" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic Card</h2>
        <p className="text-secondary-foreground mb-4">
          A simple card with header and content.
        </p>
        <div className="max-w-md">
          <Card
            header={
              <CardHeader
                titleText="Card Title"
                subtitleText="Card subtitle with additional information"
              />
            }
          >
            <CardContent>
              <p className="text-sm text-secondary-foreground">
                This is the main content area of the card. You can place any
                content here - text, images, lists, or other components.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Card with Avatar and Action */}
      <section id="card-with-avatar-and-action" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Card with Avatar and Action</h2>
        <p className="text-secondary-foreground mb-4">
          Cards can include an avatar and action button in the header.
        </p>
        <div className="max-w-md">
          <Card
            header={
              <CardHeader
                titleText="John Doe"
                subtitleText="Software Developer"
                additionalText="Online"
                status="Positive"
                avatar={
                  <Avatar
                    icon={<EmployeeIcon className="w-5 h-5" />}
                    colorScheme={AvatarColorScheme.Accent1}
                  />
                }
                action={
                  <Button
                    design="Tertiary"
                    iconOnly
                    icon={<OverflowIcon className="w-4 h-4" />}
                    tooltip="More options"
                  />
                }
              />
            }
          >
            <CardContent>
              <p className="text-sm text-secondary-foreground">
                Senior developer with 10 years of experience in React and TypeScript.
                Currently working on enterprise applications.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Card with Footer */}
      <section id="card-with-footer" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Card with Footer</h2>
        <p className="text-secondary-foreground mb-4">
          The footer slot (extension beyond UI5) provides action buttons aligned to the right.
        </p>
        <div className="max-w-md">
          <Card
            header={
              <CardHeader
                titleText="Edit Profile"
                subtitleText="Update your personal information"
                avatar={
                  <Avatar
                    icon={<ActionSettingsIcon className="w-5 h-5" />}
                    colorScheme={AvatarColorScheme.Accent5}
                  />
                }
              />
            }
            footer={
              <CardFooter>
                <Toolbar design="Transparent" alignContent="End">
                  <ToolbarItem><Button design="Primary">Save Changes</Button></ToolbarItem>
                  <ToolbarItem><Button design="Tertiary">Cancel</Button></ToolbarItem>
                </Toolbar>
              </CardFooter>
            }
          >
            <CardContent className="space-y-4">
              <Input placeholder="Full Name" defaultValue="John Doe" />
              <Input placeholder="Email" type="Email" defaultValue="john@example.com" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Status Variants */}
      <section id="status-variants" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Status Variants</h2>
        <p className="text-secondary-foreground mb-4">
          The additionalText can display semantic status colors.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            header={
              <CardHeader
                titleText="Service Status"
                subtitleText="API Gateway"
                additionalText="Operational"
                status="Positive"
              />
            }
          >
            <CardContent>
              <p className="text-sm text-secondary-foreground">All systems running normally.</p>
            </CardContent>
          </Card>

          <Card
            header={
              <CardHeader
                titleText="Service Status"
                subtitleText="Database"
                additionalText="Error"
                status="Negative"
              />
            }
          >
            <CardContent>
              <p className="text-sm text-secondary-foreground">Connection failed. Retrying...</p>
            </CardContent>
          </Card>

          <Card
            header={
              <CardHeader
                titleText="Service Status"
                subtitleText="Cache"
                additionalText="Warning"
                status="Critical"
              />
            }
          >
            <CardContent>
              <p className="text-sm text-secondary-foreground">Cache hit rate below threshold.</p>
            </CardContent>
          </Card>

          <Card
            header={
              <CardHeader
                titleText="Service Status"
                subtitleText="Queue"
                additionalText="Info"
                status="Information"
              />
            }
          >
            <CardContent>
              <p className="text-sm text-secondary-foreground">Processing 42 messages.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Complex Card Example */}
      <section id="complex-card" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Complex Card</h2>
        <p className="text-secondary-foreground mb-4">
          A full-featured card combining all elements.
        </p>
        <div className="max-w-lg">
          <Card
            interactive
            onClick={() => {}}
            accessibleName="Product details card"
            header={
              <CardHeader
                titleText="Premium Subscription"
                subtitleText="Annual billing • Auto-renews"
                additionalText="Active"
                status="Positive"
                avatar={
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    PRO
                  </div>
                }
                action={
                  <Button
                    design="Tertiary"
                    iconOnly
                    icon={<OverflowIcon className="w-4 h-4" />}
                    tooltip="Subscription options"
                  />
                }
              />
            }
            footer={
              <CardFooter>
                <Toolbar design="Transparent" alignContent="End">
                  <ToolbarItem><Button design="Primary">Manage Plan</Button></ToolbarItem>
                  <ToolbarItem><Button design="Secondary" icon={<DeleteIcon className="w-4 h-4" />}>Cancel</Button></ToolbarItem>
                </Toolbar>
              </CardFooter>
            }
          >
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-foreground">Next billing date</span>
                  <span className="font-medium">March 15, 2026</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-foreground">Monthly cost</span>
                  <span className="font-medium">$29.99</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-foreground">Team members</span>
                  <span className="font-medium">5 / 10</span>
                </div>
                <div className="pt-2">
                  <div className="text-xs text-secondary-foreground mb-1">Storage used</div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-primary rounded-full" />
                  </div>
                  <div className="text-xs text-secondary-foreground mt-1">75 GB of 100 GB</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Multi-Line Clamping */}
      <section id="multi-line-title-subtitle" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Multi-Line Title & Subtitle</h2>
        <p className="text-secondary-foreground mb-4">
          Title clamps at 3 lines, subtitle clamps at 2 lines (UI5 parity).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            header={
              <CardHeader
                titleText="This is a very long card title that should wrap to multiple lines and clamp at exactly three lines when the content exceeds the available space in the header area"
                subtitleText="This subtitle is also quite long and will wrap to a second line before being clamped so users can see more context about the card"
                additionalText="Active"
                status="Positive"
                avatar={
                  <Avatar
                    icon={<FavoriteIcon className="w-5 h-5" />}
                    colorScheme={AvatarColorScheme.Accent6}
                  />
                }
              />
            }
          >
            <CardContent>
              <p className="text-sm text-secondary-foreground">
                The title above clamps at 3 lines and the subtitle at 2 lines.
              </p>
            </CardContent>
          </Card>

          <Card
            header={
              <CardHeader
                titleText="Short title"
                subtitleText="Short subtitle"
                additionalText="Info"
                status="Information"
              />
            }
          >
            <CardContent>
              <p className="text-sm text-secondary-foreground">
                Compare with short title/subtitle — no clamping needed.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* No-Content Card */}
      <section id="no-content-card-header-only" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">No-Content Card (Header Only)</h2>
        <p className="text-secondary-foreground mb-4">
          When a card has no content children, the content wrapper is omitted entirely.
        </p>
        <div className="max-w-md">
          <Card
            header={
              <CardHeader
                titleText="Header-Only Card"
                subtitleText="No content area below"
                additionalText="Status"
                status="Information"
                avatar={
                  <Avatar
                    icon={<BellIcon className="w-5 h-5" />}
                    colorScheme={AvatarColorScheme.Accent9}
                  />
                }
              />
            }
          />
        </div>
      </section>



      {/* Contact Details Card */}
      <section id="contact-details-card" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Contact Details Card</h2>
        <p className="text-secondary-foreground mb-4">
          Card with avatar and structured contact information.
        </p>
        <div className="max-w-md">
          <Card
            header={
              <CardHeader
                titleText="Donna Maria Moore"
                subtitleText="Senior Sales Executive"
                avatar={
                  <Avatar
                    initials="DM"
                    colorScheme={AvatarColorScheme.Accent4}
                  />
                }
              />
            }
          >
            <CardContent className="space-y-4">
              <Title level={TitleLevel.H4}>Contact details</Title>
              <div className="space-y-3">
                <div className="flex flex-col gap-0.5">
                  <Label showColon>Company Name</Label>
                  <span className="text-sm">Company A</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <Label showColon>Address</Label>
                  <span className="text-sm">481 West Street, Anytown 45066, USA</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <Label showColon>Website</Label>
                  <Link href="https://www.example.com" target="_blank">
                    www.company_a.example.com
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Card with List and Action */}
      <section id="card-with-list-and-action-button" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Card with List and Action Button</h2>
        <p className="text-secondary-foreground mb-4">
          Team space card with a &ldquo;View All&rdquo; action and member list.
        </p>
        <div className="max-w-md">
          <Card
            header={
              <CardHeader
                titleText="Team Space"
                subtitleText="Direct Reports"
                additionalText="3 of 10"
                avatar={
                  <Avatar
                    icon={<GroupIcon className="w-5 h-5" />}
                    colorScheme={AvatarColorScheme.Accent7}
                  />
                }
                action={
                  <Button design="Tertiary">View All</Button>
                }
              />
            }
          >
            <CardContent>
              <List separators={ListSeparator.None}>
                <ListItem
                  text="Alain Chevalier"
                  description="User Researcher"
                  image={
                    <Avatar
                      size={AvatarSize.XS}
                      shape={AvatarShape.Square}
                      initials="AC"
                      colorScheme={AvatarColorScheme.Accent5}
                    />
                  }
                />
                <ListItem
                  text="Monique Legrand"
                  description="Artist"
                  image={
                    <Avatar
                      size={AvatarSize.XS}
                      shape={AvatarShape.Square}
                      initials="ML"
                      colorScheme={AvatarColorScheme.Accent8}
                    />
                  }
                />
                <ListItem
                  text="Isabella Adams"
                  description="UX Specialist"
                  image={
                    <Avatar
                      size={AvatarSize.XS}
                      shape={AvatarShape.Square}
                      initials="IA"
                      colorScheme={AvatarColorScheme.Accent9}
                    />
                  }
                />
              </List>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Joule Design */}
      <section id="joule-design" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Joule Design</h2>
        <p className="text-secondary-foreground mb-4">
          Use <code>design="Joule"</code> for the purple border and glow shadow.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card design="Joule">
            <CardContent className="p-6 flex flex-col gap-4 h-[275px]">
              <Title level={TitleLevel.H4} wrappingType={TitleWrappingType.Normal}>Anomaly Detection in Payments</Title>
              <p className="text-sm text-sapphire-text-tertiary line-clamp-4 flex-1">
                Identify unusual payment patterns and flag potential fraud before transactions are processed.
              </p>
              <div className="mt-auto">
                <Button design="SecondaryJoule" icon={<AiIcon className="h-4 w-4" />}>
                  Joule
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card
            design="Joule"
            interactive
            onClick={() => {}}
            header={
              <CardHeader
                titleText="Predictive Maintenance"
                subtitleText="AI-powered equipment monitoring"
                avatar={
                  <Avatar
                    icon={<AiIcon className="w-5 h-5" />}
                    colorScheme={AvatarColorScheme.Accent10}
                  />
                }
              />
            }
          >
            <CardContent>
              <p className="text-sm text-sapphire-text-tertiary">
                Monitor equipment health in real-time and predict failures before they occur using machine learning models.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Joule Design with Toolbar */}
      <section id="joule-design-with-toolbar" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Joule Design with Toolbar</h2>
        <p className="text-secondary-foreground mb-4">
          Joule cards show the toolbar on click (via <code>interactive</code> + <code>onClick</code> toggling <code>toolbarVisible</code>). The toolbar hides on blur.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <Card
            design="Joule"
            toolbar={
              <>
                <Button design="SecondaryNeutral" size="Medium" iconOnly icon={<DeleteIcon className="h-4 w-4" />} tooltip="Delete" />
                <Button design="SecondaryNeutral" size="Medium" iconOnly icon={<MoveIcon className="h-4 w-4" />} tooltip="Move" />
                <Button design="SecondaryNeutral" size="Medium" iconOnly icon={<FilterIcon className="h-4 w-4" />} tooltip="Section" />
                <Button design="SecondaryNeutral" size="Medium" iconOnly icon={<SlimArrowRightIcon className="h-4 w-4" />} tooltip="Open" />
              </>
            }
          >
            <CardContent className="p-6 flex flex-col gap-4 h-[275px]">
              <Title level={TitleLevel.H4} wrappingType={TitleWrappingType.Normal}>Control Vendor Bank Detail Changes</Title>
              <p className="text-sm text-sapphire-text-tertiary line-clamp-4 flex-1">
                Detect changes to vendor bank details and enforce approval before payments are executed.
              </p>
              <div className="mt-auto">
                <Button design="SecondaryJoule" icon={<AiIcon className="h-4 w-4" />}>
                  Joule
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card
            design="Joule"
            toolbar={
              <>
                <Button design="SecondaryNeutral" size="Medium" iconOnly icon={<DeleteIcon className="h-4 w-4" />} tooltip="Delete" />
                <Button design="SecondaryNeutral" size="Medium" iconOnly icon={<MoveIcon className="h-4 w-4" />} tooltip="Move" />
                <Button design="SecondaryNeutral" size="Medium" iconOnly icon={<FilterIcon className="h-4 w-4" />} tooltip="Section" />
                <Button design="SecondaryNeutral" size="Medium" iconOnly icon={<SlimArrowRightIcon className="h-4 w-4" />} tooltip="Open" />
              </>
            }
            toolbarVisible
          >
            <CardContent className="p-6 flex flex-col gap-4 h-[275px]">
              <Title level={TitleLevel.H4} wrappingType={TitleWrappingType.Normal}>Automate Invoice Matching</Title>
              <p className="text-sm text-sapphire-text-tertiary line-clamp-4 flex-1">
                Automatically match incoming invoices to purchase orders and flag discrepancies for review.
              </p>
              <div className="mt-auto">
                <Button design="SecondaryJoule" icon={<AiIcon className="h-4 w-4" />}>
                  Joule
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card
            design="Joule"
            interactive
            onClick={() => setJouleToolbar3(true)}
            onBlur={() => setJouleToolbar3(false)}
            toolbarVisible={jouleToolbar3}
            header={
              <CardHeader
                titleText="Predictive Maintenance"
                subtitleText="AI-powered equipment monitoring"
                avatar={
                  <Avatar
                    icon={<AiIcon className="w-5 h-5" />}
                    colorScheme={AvatarColorScheme.Accent10}
                  />
                }
              />
            }
            toolbar={
              <>
                <Button design="SecondaryNeutral" size="Medium" iconOnly icon={<DeleteIcon className="h-4 w-4" />} tooltip="Delete" />
                <Button design="SecondaryNeutral" size="Medium" iconOnly icon={<MoveIcon className="h-4 w-4" />} tooltip="Move" />
                <Button design="SecondaryNeutral" size="Medium" iconOnly icon={<SlimArrowRightIcon className="h-4 w-4" />} tooltip="Open" />
              </>
            }
          >
            <CardContent>
              <p className="text-sm text-sapphire-text-tertiary">
                Monitor equipment health in real-time and predict failures before they occur using machine learning models.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Card with Icon (no Avatar) */}
      <section id="card-with-icon-no-avatar" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Card with Icon (no Avatar)</h2>
        <p className="text-secondary-foreground mb-4">
          The <code>avatar</code> prop accepts any <code>ReactNode</code>, not just an Avatar component.
          Here it renders a plain icon with no background.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            header={
              <CardHeader
                titleText="Settings"
                subtitleText="Application preferences"
                avatar={<ActionSettingsIcon className="w-8 h-8 text-secondary-foreground" />}
              />
            }
          >
            <CardContent>
              <p className="text-sm text-secondary-foreground">
                Plain icon — no background circle or Avatar wrapper.
              </p>
            </CardContent>
          </Card>

          <Card
            header={
              <CardHeader
                titleText="Notifications"
                subtitleText="3 unread alerts"
                additionalText="Active"
                status="Positive"
                avatar={<BellIcon className="w-8 h-8 text-sapphire-info" />}
              />
            }
          >
            <CardContent>
              <p className="text-sm text-secondary-foreground">
                Colored icon using a semantic token.
              </p>
            </CardContent>
          </Card>

          <Card
            header={
              <CardHeader
                titleText="Team Members"
                subtitleText="5 people"
                avatar={<GroupIcon className="w-8 h-8 text-sapphire-brand-foreground" />}
              />
            }
          >
            <CardContent>
              <p className="text-sm text-secondary-foreground">
                Another icon variant with accent color.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Card with Radio Buttons and Footer */}
      <section id="card-with-radio-buttons" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Card with Radio Buttons</h2>
        <p className="text-secondary-foreground mb-4">
          A card combining a header, radio-button group, status tag, and footer actions.
        </p>
        <div className="max-w-md">
          <Card
            header={
              <CardHeader
                className="border-b-0"
                titleText="Title"
                subtitleText="Subtitle"
                avatar={
                  <Avatar
                    size={AvatarSize.S}
                    icon={<SapBoxIcon className="w-4 h-4" />}
                    colorScheme={AvatarColorScheme.Accent10}
                    shape={AvatarShape.Square}
                  />
                }
              />
            }
            footer={
              <CardFooter className="border-t-0">
                <Toolbar design="Transparent" alignContent="End">
                  <ToolbarItem><Tag design="Information">Submitted</Tag></ToolbarItem>
                  <ToolbarSpacer />
                  <ToolbarItem><Button design="Secondary">Button</Button></ToolbarItem>
                  <ToolbarItem><Button design="Primary">Button</Button></ToolbarItem>
                </Toolbar>
              </CardFooter>
            }
          >
            <CardContent>
              <div className="flex flex-col gap-2">
                <Label showColon>Title</Label>
                <RadioButton text="Radio button" name="card-radio" defaultChecked />
                <RadioButton text="Radio button" name="card-radio" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Card with Order ID */}
      <section id="card-with-key-value-content" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Card with Key-Value Content</h2>
        <p className="text-secondary-foreground mb-4">
          A compact card displaying a single key-value pair beneath the header.
        </p>
        <div className="max-w-md">
          <Card
            header={
              <CardHeader
                className="border-b-0"
                titleText="Title"
                subtitleText="Subtitle"
                avatar={
                  <Avatar
                    size={AvatarSize.S}
                    icon={<SapBoxIcon className="w-4 h-4" />}
                    colorScheme={AvatarColorScheme.Accent10}
                    shape={AvatarShape.Square}
                  />
                }
              />
            }
          >
            <CardContent>
              <div className="flex flex-col gap-1">
                <Label showColon>Order ID</Label>
                <span className="text-2xl font-semibold text-sapphire-text-primary">13034557</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Card with Table */}
      <section id="card-with-table" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Card with Table</h2>
        <p className="text-secondary-foreground mb-4">
          A card containing a full-featured data table with toolbar, selection, and row navigation.
        </p>
        <div className="max-w-6xl">
          <Card
            header={
              <CardHeader
                className="border-b-0"
                titleText="Title"
                subtitleText="Subtitle"
                avatar={
                  <Avatar
                    size={AvatarSize.S}
                    icon={<SapBoxIcon className="w-4 h-4" />}
                    colorScheme={AvatarColorScheme.Accent10}
                    shape={AvatarShape.Square}
                  />
                }
              />
            }
          >
            <CardContent className="px-4 pb-4 pt-0">
              <Table accessibleName="Sample data table" rowActionCount={1}>
                <TableSelectionMulti />
                <TableToolbar>
                  <Title level={TitleLevel.H4}>Toolbar Title</Title>
                  <SearchField placeholder="Search..." />
                  <ToolbarButton text="Create" />
                  <ToolbarButton text="Delete" />
                  <ToolbarSeparator />
                  <ToolbarButton icon={<FilterIcon className="h-4 w-4" />} tooltip="Filter" />
                  <ToolbarButton icon={<ActionSettingsIcon className="h-4 w-4" />} tooltip="Settings" />
                  <ToolbarButton icon={<GroupIcon className="h-4 w-4" />} tooltip="Group" />
                  <ToolbarButton icon={<OverflowIcon className="h-4 w-4" />} tooltip="More" />
                  <ToolbarSpacer />
                  <ToolbarButton icon={<FullScreenIcon className="h-4 w-4" />} tooltip="Full Screen" />
                </TableToolbar>
                <TableHeaderRow sticky>
                  <TableHeaderCell><span className="font-semibold">Column Header</span></TableHeaderCell>
                  <TableHeaderCell><span className="font-semibold">Column Header</span></TableHeaderCell>
                  <TableHeaderCell><span className="font-semibold">Column Header</span></TableHeaderCell>
                  <TableHeaderCell><span className="font-semibold">Column Header</span></TableHeaderCell>
                  <TableHeaderCell><span className="font-semibold">Column Header</span></TableHeaderCell>
                </TableHeaderRow>
                {Array.from({ length: 9 }, (_, i) => (
                  <TableRow key={`row-${i}`} rowKey={`row-${i}`}>
                    <TableCell><Link href="#">Link</Link></TableCell>
                    <TableCell>Text</TableCell>
                    <TableCell>Text</TableCell>
                    <TableCell>Text</TableCell>
                    <TableCell>Text</TableCell>
                    <TableRowActionNavigation />
                  </TableRow>
                ))}
              </Table>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* API Reference */}
      <section id="api-reference" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Card Props</h3>
            <div className="bg-muted rounded-md p-4 text-sm font-mono overflow-auto">
              <pre>{`interface CardProps {
  children?: ReactNode;     // Card content
  header?: ReactNode;       // CardHeader component
  footer?: ReactNode;       // CardFooter component (extension)
  design?: CardDesign;      // "Default" | "Joule" (default: "Default")
  interactive?: boolean;    // Make entire card clickable
  toolbar?: ReactNode;      // Floating toolbar above card (hover)
  toolbarVisible?: boolean; // Force toolbar always visible
  toolbarClassName?: string;// Override toolbar bar styling
  loading?: boolean;        // Show loading overlay
  loadingDelay?: number;    // Delay before showing loader (default: 1000)
  accessibleName?: string;  // aria-label
  className?: string;       // Additional styles
  onClick?: (detail) => void; // Click handler (when interactive)
}
// Joule design adds purple border and glow on hover/press
// for interactive cards.`}</pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">CardHeader Props</h3>
            <div className="bg-muted rounded-md p-4 text-sm font-mono overflow-auto">
              <pre>{`interface CardHeaderProps {
  titleText?: string;       // Main title (clamps at 3 lines)
  subtitleText?: string;    // Subtitle below title (clamps at 2 lines)
  additionalText?: string;  // Text on same row as title (right-aligned)
  status?: CardHeaderStatus; // Status color for additionalText
  avatar?: ReactNode;       // Left avatar/icon slot
  action?: ReactNode;       // Right action slot
  ariaLevel?: number;       // Heading level (default: 3)
}`}</pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Usage Example</h3>
            <div className="bg-muted rounded-md p-4 text-sm font-mono overflow-auto">
              <pre>{`import { Card, CardHeader, CardFooter, CardContent, Toolbar, ToolbarItem, Button } from '@sap-ui/fx-components';

<Card
  interactive
  onClick={() => console.log('Card clicked')}
  header={
    <CardHeader
      titleText="My Card"
      subtitleText="Description"
    />
  }
  footer={
    <CardFooter>
      <Toolbar design="Transparent" alignContent="End">
        <ToolbarItem><Button design="Tertiary">Cancel</Button></ToolbarItem>
        <ToolbarItem><Button design="Primary">Submit</Button></ToolbarItem>
      </Toolbar>
    </CardFooter>
  }
>
  <CardContent>
    <p>Card body content here...</p>
  </CardContent>
</Card>`}</pre>
            </div>
          </div>
        </div>
      </section>
      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { Card, CardHeader, CardContent, CardFooter, Toolbar, ToolbarItem, Button } from "@sap-ui/fx-components";

<Card
  interactive
  onClick={() => console.log("Card clicked")}
  header={
    <CardHeader
      titleText="Card Title"
      subtitleText="Card subtitle"
      additionalText="Active"
      status="Positive"
      avatar={<Avatar initials="JD" />}
      action={<Button design="Tertiary" iconOnly icon={<OverflowIcon />} />}
    />
  }
  footer={
    <CardFooter>
      <Toolbar design="Transparent" alignContent="End">
        <ToolbarItem><Button design="Tertiary">Cancel</Button></ToolbarItem>
        <ToolbarItem><Button design="Primary">Submit</Button></ToolbarItem>
      </Toolbar>
    </CardFooter>
  }
>
  <CardContent>
    <p>Card body content here.</p>
  </CardContent>
</Card>

// Loading state
<Card loading loadingDelay={500} header={<CardHeader titleText="Loading..." />}>
  <CardContent><p>Content hidden while loading.</p></CardContent>
</Card>`}
        />
      </section>
    </div>
  );
}

export default CardPage;

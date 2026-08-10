import { useState, useRef } from "react";
import {
  // Typography
  Title,
  TitleLevel,
  Text,
  Label,
  Link,
  // Buttons
  Button,
  ButtonDesign,
  SplitButton,
  SegmentedButton,
  SegmentedButtonItem,
  ToggleButton,
  // Form Controls
  Input,
  Textarea,
  Select,
  Option,
  ComboBox,
  ComboBoxItem,
  CheckBox,
  RadioButton,

  DatePicker,
  // Data Display
  Tag,
  TagDesign,
  Avatar,
  AvatarShape,
  AvatarSize,
  AvatarColorScheme,
  // Feedback
  MessageStrip,
  MessageStripDesign,
  BusyIndicator,
  // Containers
  Card,
  CardHeader,
  CardContent,
  Panel,
  TabContainer,
  Tab,
  // Navigation
  Bar,
  Breadcrumbs,
  BreadcrumbsItem,
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarSpacer,
  // Lists
  List,
  ListItem,
  ListSelectionMode,
  // Overlays
  Dialog,
  Popover,
  // Menu
  Menu,
  MenuItem,
  MenuSeparator,
  // Table
  Table,
  TableToolbar,
  TableHeaderRow,
  TableHeaderCell,
  TableRow,
  TableCell,
  TableSelectionSingle,
  TableCellHorizontalAlign,
  ToolbarDesign,
  ToolbarAlign,
  // Illustrations
  IllustrationDesign,
  BeforeSearch,
  NoData,
  ErrorScreen,
} from "@sap-ui/fx-components";
import type { ButtonRef } from "@sap-ui/fx-components";
import {
  Save,
  Download,
  Settings,
  Plus,
  Search,
  Edit,
  Star,
  Bell,
  Mail,
  User,
  Home,
  FileText,
  Heart,
  Bold,
  Italic,
  Underline,
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  BarChart3,
  Briefcase,
  Calendar,
  MapPin,
  Copy,
  Trash2,
  Share2,
  ChevronDown,
  Activity,
  Shield,
  Globe,
  Zap,
  Database,
  Play,
  Eye,
  Paintbrush,
  Code,
  MoreHorizontal,
  ClipboardList,
} from "lucide-react";

export function PreviewPage() {
  const [togglePressed, setTogglePressed] = useState(false);
  const [segmentedValue, setSegmentedValue] = useState("view");
  const [devBarViewMode, setDevBarViewMode] = useState("view");

  const [checkboxTerms, setCheckboxTerms] = useState(false);
  const [checkboxNewsletter, setCheckboxNewsletter] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const popoverBtnRef = useRef<ButtonRef>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [singleSelected, setSingleSelected] = useState<string[]>(["member-2"]);
  const [tableSelected, setTableSelected] = useState("member-2");
  const actionMenuBtnRef = useRef<ButtonRef>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const createMenuBtnRef = useRef<ButtonRef>(null);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Component Gallery</h1>
        <p className="text-sm text-secondary-foreground/70">All components at a glance</p>
      </header>

      {/* ── Buttons ────────────────────────────────────────────────── */}
      <section id="buttons" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Buttons</h2>
        <p className="text-secondary-foreground mb-4">
          Various button designs, split buttons, segmented buttons, and toggle buttons.
        </p>

        <div className="space-y-6">
          {/* Button designs */}
          <div>
            <h3 className="text-sm font-medium text-secondary-foreground mb-3">Standard Designs</h3>
            <div className="flex flex-wrap gap-3">
              <Button design={ButtonDesign.Primary} icon={<Plus className="h-4 w-4" />}>Primary</Button>
              <Button design={ButtonDesign.Secondary} icon={<Save className="h-4 w-4" />}>Secondary</Button>
              <Button design={ButtonDesign.Tertiary}>Tertiary</Button>
              <Button design={ButtonDesign.Neutral} icon={<Settings className="h-4 w-4" />}>Neutral</Button>
              <Button design={ButtonDesign.Secondary} disabled>Disabled</Button>
            </div>
          </div>

          {/* Joule designs */}
          <div>
            <h3 className="text-sm font-medium text-secondary-foreground mb-3">Joule Designs</h3>
            <div className="flex flex-wrap gap-3">
              <Button design={ButtonDesign.PrimaryJoule} icon={<Sparkles className="h-4 w-4" />}>PrimaryJoule</Button>
              <Button design={ButtonDesign.SecondaryJoule} icon={<Sparkles className="h-4 w-4" />}>SecondaryJoule</Button>
              <Button design={ButtonDesign.TertiaryJoule} icon={<Sparkles className="h-4 w-4" />}>TertiaryJoule</Button>
              <Button design={ButtonDesign.PrimaryJoule} icon={<Sparkles className="h-4 w-4" />} iconOnly tooltip="Joule" />
              <Button design={ButtonDesign.SecondaryJoule} disabled>Disabled</Button>
            </div>
          </div>

          {/* With icons */}
          <div>
            <h3 className="text-sm font-medium text-secondary-foreground mb-3">With Icons</h3>
            <div className="flex flex-wrap gap-3">
              <Button design={ButtonDesign.Primary} icon={<Save className="h-4 w-4" />}>Save</Button>
              <Button design={ButtonDesign.Secondary} icon={<Search className="h-4 w-4" />}>Search</Button>
              <Button design={ButtonDesign.Tertiary} icon={<Settings className="h-4 w-4" />} iconOnly tooltip="Settings" />
              <Button design={ButtonDesign.Neutral} icon={<Bell className="h-4 w-4" />} iconOnly tooltip="Notifications" />
            </div>
          </div>

          {/* Buttons with Menus */}
          <div>
            <h3 className="text-sm font-medium text-secondary-foreground mb-3">With Menus</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                ref={createMenuBtnRef}
                design={ButtonDesign.Primary}
                icon={<Plus className="h-4 w-4" />}
                onClick={() => setCreateMenuOpen(true)}
              >
                Create
              </Button>
              <Menu
                open={createMenuOpen}
                opener={createMenuBtnRef.current?.nativeElement ?? null}
                onClose={() => setCreateMenuOpen(false)}
              >
                <MenuItem text="New Document" icon={<FileText className="h-4 w-4" />} />
                <MenuItem text="New Folder" icon={<Home className="h-4 w-4" />} />
                <MenuSeparator />
                <MenuItem text="Import File" icon={<Download className="h-4 w-4" />} />
              </Menu>

              <Button
                ref={actionMenuBtnRef}
                design={ButtonDesign.Secondary}
                icon={<ChevronDown className="h-4 w-4" />}
                onClick={() => setActionMenuOpen(true)}
              >
                Actions
              </Button>
              <Menu
                open={actionMenuOpen}
                opener={actionMenuBtnRef.current?.nativeElement ?? null}
                onClose={() => setActionMenuOpen(false)}
              >
                <MenuItem text="Edit" icon={<Edit className="h-4 w-4" />} />
                <MenuItem text="Copy" icon={<Copy className="h-4 w-4" />} />
                <MenuItem text="Share" icon={<Share2 className="h-4 w-4" />} />
                <MenuSeparator />
                <MenuItem text="Delete" icon={<Trash2 className="h-4 w-4" />} />
              </Menu>
            </div>
          </div>

          {/* SplitButton */}
          <div>
            <h3 className="text-sm font-medium text-secondary-foreground mb-3">Split Button</h3>
            <div className="flex flex-wrap gap-3">
              <SplitButton text="Save" icon={<Save className="h-4 w-4" />} />
              <SplitButton text="Download" icon={<Download className="h-4 w-4" />} />
            </div>
          </div>

          {/* SegmentedButton */}
          <div>
            <h3 className="text-sm font-medium text-secondary-foreground mb-3">Segmented Button</h3>
            <SegmentedButton
              onSelectionChange={(detail) => setSegmentedValue(detail.selectedItem.id)}
            >
              <SegmentedButtonItem
                id="view"
                text="View"
                selected={segmentedValue === "view"}
                icon={<Search className="h-4 w-4" />}
              />
              <SegmentedButtonItem
                id="edit"
                text="Edit"
                selected={segmentedValue === "edit"}
                icon={<Edit className="h-4 w-4" />}
              />
              <SegmentedButtonItem
                id="settings"
                text="Settings"
                selected={segmentedValue === "settings"}
                icon={<Settings className="h-4 w-4" />}
              />
            </SegmentedButton>
          </div>

          {/* ToggleButton */}
          <div>
            <h3 className="text-sm font-medium text-secondary-foreground mb-3">Toggle Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <ToggleButton
                pressed={togglePressed}
                onChange={({ pressed }) => setTogglePressed(pressed)}
                icon={<Star className="h-4 w-4" />}
              >
                Favorite
              </ToggleButton>
              <ToggleButton icon={<Bold className="h-4 w-4" />} iconOnly tooltip="Bold" />
              <ToggleButton icon={<Italic className="h-4 w-4" />} iconOnly tooltip="Italic" />
              <ToggleButton icon={<Underline className="h-4 w-4" />} iconOnly tooltip="Underline" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Cards ──────────────────────────────────────────────────── */}
      <section id="cards" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Cards</h2>
        <p className="text-secondary-foreground mb-4">
          Versatile content containers for profiles, metrics, and summaries.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <Card
            header={
              <CardHeader
                titleText="Elena Rodriguez"
                subtitleText="Senior Product Designer"
                avatar={
                  <Avatar
                    size={AvatarSize.S}
                    colorScheme={AvatarColorScheme.Accent6}
                    initials="ER"
                  />
                }
              />
            }
          >
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-secondary-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Berlin, Germany</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary-foreground">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Design Systems Team</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Joined Mar 2023</span>
                </div>
                <div className="flex gap-4 pt-2 border-t border-border">
                  <div className="text-center">
                    <div className="text-lg font-semibold">142</div>
                    <div className="text-xs text-secondary-foreground">Designs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">38</div>
                    <div className="text-xs text-secondary-foreground">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">4.9</div>
                    <div className="text-xs text-secondary-foreground">Rating</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Card */}
          <Card
            header={
              <CardHeader
                titleText="Monthly Revenue"
                subtitleText="March 2026"
                avatar={
                  <Avatar
                    size={AvatarSize.S}
                    colorScheme={AvatarColorScheme.Accent1}
                    icon={<BarChart3 className="h-4 w-4" />}
                  />
                }
              />
            }
          >
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold">$48,250</div>
                <div className="flex items-center gap-1.5 text-sm">
                  <TrendingUp className="h-4 w-4 text-sapphire-positive" />
                  <span className="text-sapphire-positive font-medium">+12.5%</span>
                  <span className="text-secondary-foreground">vs last month</span>
                </div>
                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-foreground">Subscriptions</span>
                    <span className="font-medium">$32,100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-foreground">One-time</span>
                    <span className="font-medium">$16,150</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Status Card */}
          <Card
            header={
              <CardHeader
                titleText="Website Redesign"
                subtitleText="Due Apr 15, 2026"
                avatar={
                  <Avatar
                    size={AvatarSize.S}
                    colorScheme={AvatarColorScheme.Accent3}
                    icon={<Briefcase className="h-4 w-4" />}
                  />
                }
              />
            }
          >
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Tag design="Information">In Progress</Tag>
                  <span className="text-sm text-secondary-foreground">Sprint 4 of 6</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-foreground">Completion</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "67%" }} />
                  </div>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-border text-sm">
                  <div className="flex items-center gap-2 text-secondary-foreground">
                    <CheckCircle className="h-3.5 w-3.5 text-sapphire-positive" />
                    <span>14 tasks completed</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary-foreground">
                    <Clock className="h-3.5 w-3.5 text-sapphire-warning" />
                    <span>7 tasks remaining</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>5 team members</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Form Controls (realistic) ─────────────────────────────── */}
      <section id="form-controls" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Form Controls</h2>
        <p className="text-secondary-foreground mb-4">
          A realistic profile form showcasing inputs, selects, checkboxes, radios, and date pickers.
        </p>

        <div className="max-w-2xl space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label required>Full Name</Label>
                <Input placeholder="e.g. Alex Johnson" icon={<User className="h-4 w-4 text-muted-foreground" />} />
              </div>
              <div className="space-y-1.5">
                <Label required>Email</Label>
                <Input placeholder="alex@company.com" icon={<Mail className="h-4 w-4" />} />
              </div>
              <div className="space-y-1.5">
                <Label>Date of Birth</Label>
                <DatePicker placeholder="Pick a date..." />
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <ComboBox placeholder="Start typing a city...">
                  <ComboBoxItem text="Berlin" />
                  <ComboBoxItem text="Munich" />
                  <ComboBoxItem text="Paris" />
                  <ComboBoxItem text="London" />
                  <ComboBoxItem text="New York" />
                </ComboBox>
              </div>
            </div>
          </div>

          {/* Role & Department */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Role & Department</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Select>
                  <Option value="engineering">Engineering</Option>
                  <Option value="design">Design</Option>
                  <Option value="product">Product</Option>
                  <Option value="marketing">Marketing</Option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Experience Level</Label>
                <div className="flex flex-col gap-1.5 pt-1">
                  <RadioButton name="level" text="Junior" />
                  <RadioButton name="level" text="Senior" checked />
                  <RadioButton name="level" text="Lead" />
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <Label>Bio</Label>
            <Textarea placeholder="Tell us about yourself..." rows={3} />
          </div>

          {/* Agreement */}
          <div className="space-y-2">
            <CheckBox
              text="I agree to the Terms of Service"
              checked={checkboxTerms}
              onChange={(detail) => setCheckboxTerms(detail.checked)}
            />
            <CheckBox
              text="Subscribe to the weekly newsletter"
              checked={checkboxNewsletter}
              onChange={(detail) => setCheckboxNewsletter(detail.checked)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button design={ButtonDesign.Tertiary}>Cancel</Button>
            <Button design={ButtonDesign.Primary} icon={<Save className="h-4 w-4" />}>Save Profile</Button>
          </div>
        </div>
      </section>

      {/* ── Data: Lists & Tables ───────────────────────────────────── */}
      <section id="data-lists-tables" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Data: Lists & Tables</h2>
        <p className="text-secondary-foreground mb-4">
          Lists for simple collections, tables for structured data with sorting and status.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-secondary-foreground">List with Selection</h3>
            <List
              headerText="Team Members"
              selectionMode={ListSelectionMode.SingleStart}
              selectedKeys={singleSelected}
              onSelectionChange={(detail) => setSingleSelected(detail.selectedKeys || [])}
            >
              <ListItem itemKey="member-1" icon={<User className="h-4 w-4 text-muted-foreground" />} description="Product Manager" additionalText="Active">
                Alice Johnson
              </ListItem>
              <ListItem itemKey="member-2" icon={<User className="h-4 w-4 text-muted-foreground" />} description="Senior Developer" additionalText="Available">
                Bob Smith
              </ListItem>
              <ListItem itemKey="member-3" icon={<User className="h-4 w-4 text-muted-foreground" />} description="UX Designer" additionalText="Busy">
                Carol Williams
              </ListItem>
              <ListItem itemKey="member-4" icon={<User className="h-4 w-4 text-muted-foreground" />} description="QA Engineer" additionalText="Available">
                David Brown
              </ListItem>
            </List>
            <p className="text-xs text-secondary-foreground">
              Selected: {singleSelected.length > 0 ? singleSelected.join(", ") : "None"}
            </p>
          </div>

          {/* Table */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-secondary-foreground">Table with Selection</h3>
            <Table accessibleName="Team Members Table" overflowMode="Scroll">
              <TableToolbar>
                <Title level={TitleLevel.H4}>Team Members</Title>
              </TableToolbar>
              <TableSelectionSingle
                selected={tableSelected}
                onChange={(detail) => {
                  const keys = [...detail.selectedKeys];
                  setTableSelected(keys[0] ?? "");
                }}
              />
              <TableHeaderRow>
                <TableHeaderCell width="auto" />
                <TableHeaderCell sortIndicator="Ascending">Employee</TableHeaderCell>
                <TableHeaderCell>Role</TableHeaderCell>
                <TableHeaderCell horizontalAlign={TableCellHorizontalAlign.End}>Status</TableHeaderCell>
              </TableHeaderRow>
              <TableRow rowKey="member-1">
                <TableCell><User className="h-4 w-4 text-muted-foreground" /></TableCell>
                <TableCell rowHeader><Link>Alice Johnson</Link></TableCell>
                <TableCell>Product Manager</TableCell>
                <TableCell horizontalAlign={TableCellHorizontalAlign.End}><Tag design={TagDesign.Active}>Active</Tag></TableCell>
              </TableRow>
              <TableRow rowKey="member-2">
                <TableCell><User className="h-4 w-4 text-muted-foreground" /></TableCell>
                <TableCell rowHeader><Link>Bob Smith</Link></TableCell>
                <TableCell>Senior Developer</TableCell>
                <TableCell horizontalAlign={TableCellHorizontalAlign.End}><Tag design={TagDesign.Positive}>Available</Tag></TableCell>
              </TableRow>
              <TableRow rowKey="member-3">
                <TableCell><User className="h-4 w-4 text-muted-foreground" /></TableCell>
                <TableCell rowHeader><Link>Carol Williams</Link></TableCell>
                <TableCell>UX Designer</TableCell>
                <TableCell horizontalAlign={TableCellHorizontalAlign.End}><Tag design={TagDesign.Critical}>Busy</Tag></TableCell>
              </TableRow>
              <TableRow rowKey="member-4">
                <TableCell><User className="h-4 w-4 text-muted-foreground" /></TableCell>
                <TableCell rowHeader><Link>David Brown</Link></TableCell>
                <TableCell>QA Engineer</TableCell>
                <TableCell horizontalAlign={TableCellHorizontalAlign.End}><Tag design={TagDesign.Positive}>Available</Tag></TableCell>
              </TableRow>
            </Table>
            <p className="text-xs text-secondary-foreground">
              Selected: {tableSelected || "None"}
            </p>
          </div>
        </div>
      </section>

      {/* ── Illustrations ──────────────────────────────────────────── */}
      <section id="illustrated-messages" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Illustrated Messages</h2>
        <p className="text-secondary-foreground mb-4">
          Empty states and contextual illustrations with auto-sizing and multiple design sets.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border rounded-md p-2">
            <div className="text-xs font-medium text-secondary-foreground mb-1 text-center">BeforeSearch</div>
            <div className="h-[220px]">
              <BeforeSearch
                design={IllustrationDesign.Medium}
                titleText="Search the table"
                subtitleText="Enter a search term to find data"
              />
            </div>
          </div>
          <div className="border border-border rounded-md p-2">
            <div className="text-xs font-medium text-secondary-foreground mb-1 text-center">NoData</div>
            <div className="h-[220px]">
              <NoData
                design={IllustrationDesign.Medium}
                titleText="No data available"
                subtitleText="There is nothing to display yet"
              />
            </div>
          </div>
          <div className="border border-border rounded-md p-2">
            <div className="text-xs font-medium text-secondary-foreground mb-1 text-center">ErrorScreen</div>
            <div className="h-[220px]">
              <ErrorScreen
                design={IllustrationDesign.Medium}
                titleText="Something went wrong"
                subtitleText="Please try again later"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Data Display ───────────────────────────────────────────── */}
      <section id="data-display" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Data Display</h2>
        <p className="text-secondary-foreground mb-4">Statuss, avatars, and icons.</p>

        <div className="space-y-6">
          {/* Statuss */}
          <div>
            <h3 className="text-sm font-medium text-secondary-foreground mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              <Tag design="Positive">Approved</Tag>
              <Tag design="Information">Pending</Tag>
              <Tag design="Critical">Warning</Tag>
              <Tag design="Negative">Rejected</Tag>
              <Tag design="Active">Active</Tag>
              <Tag design="Draft">Draft</Tag>
              <Tag design="Paused">Paused</Tag>
            </div>
          </div>

          {/* Avatars */}
          <div>
            <h3 className="text-sm font-medium text-secondary-foreground mb-3">Avatars</h3>
            <div className="flex flex-wrap items-end gap-3">
              <Avatar size={AvatarSize.XS} colorScheme={AvatarColorScheme.Accent1} initials="XS" />
              <Avatar size={AvatarSize.S} colorScheme={AvatarColorScheme.Accent2} initials="SM" />
              <Avatar size={AvatarSize.M} colorScheme={AvatarColorScheme.Accent3} initials="MD" />
              <Avatar size={AvatarSize.L} colorScheme={AvatarColorScheme.Accent5} initials="LG" />
              <Avatar size={AvatarSize.XL} colorScheme={AvatarColorScheme.Accent7} initials="XL" />
              <Avatar size={AvatarSize.M} shape={AvatarShape.Square} colorScheme={AvatarColorScheme.Accent9} initials="SQ" />
              <Avatar size={AvatarSize.M} colorScheme={AvatarColorScheme.Accent4} icon={<User className="h-5 w-5" />} />
            </div>
          </div>

          {/* Icons */}
          <div>
            <h3 className="text-sm font-medium text-secondary-foreground mb-3">Icons (Lucide)</h3>
            <div className="flex flex-wrap gap-4 text-secondary-foreground">
              <Home className="h-5 w-5" />
              <Search className="h-5 w-5" />
              <Settings className="h-5 w-5" />
              <Bell className="h-5 w-5" />
              <Mail className="h-5 w-5" />
              <Star className="h-5 w-5" />
              <Heart className="h-5 w-5" />
              <FileText className="h-5 w-5" />
              <Edit className="h-5 w-5" />
              <Download className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Feedback ───────────────────────────────────────────────── */}
      <section id="feedback" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Feedback</h2>
        <p className="text-secondary-foreground mb-4">
          Message strips and busy indicators.
        </p>

        <div className="space-y-4 max-w-3xl">
          <MessageStrip design={MessageStripDesign.Information}>
            This is an informational message.
          </MessageStrip>
          <MessageStrip design={MessageStripDesign.Positive}>
            Your changes have been saved successfully.
          </MessageStrip>
          <MessageStrip design={MessageStripDesign.Warning}>
            Please review your entries before submitting.
          </MessageStrip>
          <MessageStrip design={MessageStripDesign.Negative}>
            An error occurred while processing your request.
          </MessageStrip>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-secondary-foreground mb-3">Busy Indicators</h3>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <BusyIndicator active delay={0} size="S" />
              <p className="text-xs text-secondary-foreground mt-2">Small</p>
            </div>
            <div className="text-center">
              <BusyIndicator active delay={0} size="M" />
              <p className="text-xs text-secondary-foreground mt-2">Medium</p>
            </div>
            <div className="text-center">
              <BusyIndicator active delay={0} size="L" />
              <p className="text-xs text-secondary-foreground mt-2">Large</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Typography ─────────────────────────────────────────────── */}
      <section id="typography" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Typography</h2>
        <div className="space-y-3">
          <Title level={TitleLevel.H1}>Title H1</Title>
          <Title level={TitleLevel.H2}>Title H2</Title>
          <Title level={TitleLevel.H3}>Title H3</Title>
          <Title level={TitleLevel.H4}>Title H4</Title>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Text>Regular text</Text>
            <Label>Label</Label>
            <Label required>Required Label</Label>
            <Link href="#">Standalone Link</Link>
          </div>
        </div>
      </section>

      {/* ── Navigation ─────────────────────────────────────────────── */}
      <section id="navigation" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Navigation</h2>
        <p className="text-secondary-foreground mb-4">Breadcrumbs and toolbars for page-level navigation and actions.</p>

        <div className="space-y-6">
          {/* Breadcrumbs in a realistic page header */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-muted/40 px-4 py-3 border-b border-border">
              <Breadcrumbs>
                <BreadcrumbsItem href="#">Dashboard</BreadcrumbsItem>
                <BreadcrumbsItem href="#">Projects</BreadcrumbsItem>
                <BreadcrumbsItem href="#">Website Redesign</BreadcrumbsItem>
                <BreadcrumbsItem>Settings</BreadcrumbsItem>
              </Breadcrumbs>
            </div>
            <div className="px-4 py-4 flex items-center justify-between">
              <div>
                <Title level={TitleLevel.H4}>Project Settings</Title>
                <Text className="text-sm text-secondary-foreground">Manage configuration for this project</Text>
              </div>
              <div className="flex gap-2">
                <Button design={ButtonDesign.Tertiary} icon={<Share2 className="h-4 w-4" />} iconOnly tooltip="Share" />
                <Button design={ButtonDesign.Primary} icon={<Save className="h-4 w-4" />}>Save Changes</Button>
              </div>
            </div>
          </div>

          {/* Application Toolbar Bars */}
          <div>
            <h3 className="text-sm font-medium text-secondary-foreground mb-3">Application Toolbar Bars</h3>
            <div className="space-y-3">
              {/* Bar 1: Load Optimization Solution */}
              <div className="border border-border rounded-lg overflow-hidden">
                <Bar
                  startContent={
                    <div className="flex items-center gap-2">
                      <Avatar size={AvatarSize.XS} shape={AvatarShape.Square} colorScheme={AvatarColorScheme.Accent1} initials="LO" />
                      <button type="button" className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap">
                        LoadOpt
                        <ChevronDown className="h-3.5 w-3.5 text-secondary-foreground shrink-0" />
                      </button>
                      <Tag design="None">R.1.1</Tag>
                    </div>
                  }
                  endContent={
                    <div className="flex items-center gap-1">
                      <SplitButton text="Open" icon={<ClipboardList className="h-4 w-4" />} />
                      <Button design={ButtonDesign.Primary} icon={<Play className="h-4 w-4" />}>Run</Button>
                      <Button design={ButtonDesign.Tertiary} icon={<MoreHorizontal className="h-4 w-4" />} iconOnly tooltip="More actions" />
                      <Button design={ButtonDesign.Tertiary} icon={<ClipboardList className="h-4 w-4" />} iconOnly tooltip="Task list" />
                    </div>
                  }
                />
              </div>

              {/* Bar 2: Development / Requirements Development */}
              <div className="border border-border rounded-lg overflow-hidden">
                <Bar
                  startContent={
                    <div className="flex items-center gap-2">
                      <Avatar size={AvatarSize.XS} shape={AvatarShape.Square} colorScheme={AvatarColorScheme.Accent1} initials="RD" />
                      <Text className="font-medium whitespace-nowrap">Development</Text>
                    </div>
                  }
                  endContent={
                    <div className="flex items-center gap-1">
                      <Button design={ButtonDesign.Primary} icon={<Play className="h-4 w-4" />}>Build</Button>
                      <Button design={ButtonDesign.Tertiary} icon={<Share2 className="h-4 w-4" />} iconOnly tooltip="Share" />
                      <Button design={ButtonDesign.Tertiary} icon={<MoreHorizontal className="h-4 w-4" />} iconOnly tooltip="More actions" />
                      <Button design={ButtonDesign.Tertiary} icon={<ClipboardList className="h-4 w-4" />} iconOnly tooltip="Task list" />
                    </div>
                  }
                >
                  <SegmentedButton
                    onSelectionChange={(detail) => setDevBarViewMode(detail.selectedItem.id)}
                  >
                    <SegmentedButtonItem id="view" text="View" selected={devBarViewMode === "view"} />
                    <SegmentedButtonItem id="code" text="Code" selected={devBarViewMode === "code"} />
                  </SegmentedButton>
                </Bar>
              </div>
            </div>
          </div>

          {/* Toolbar as a realistic action bar */}
          <div>
            <h3 className="text-sm font-medium text-secondary-foreground mb-3">Action Toolbar</h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <Toolbar>
                <ToolbarButton text="New Item" icon={<Plus className="h-4 w-4" />} />
                <ToolbarButton text="Edit" icon={<Edit className="h-4 w-4" />} />
                <ToolbarButton text="Duplicate" icon={<Copy className="h-4 w-4" />} />
                <ToolbarSeparator />
                <ToolbarButton text="Export" icon={<Download className="h-4 w-4" />} />
                <ToolbarButton text="Share" icon={<Share2 className="h-4 w-4" />} />
                <ToolbarSpacer />
                <ToolbarButton text="Delete" icon={<Trash2 className="h-4 w-4" />} />
                <ToolbarButton text="Settings" icon={<Settings className="h-4 w-4" />} />
              </Toolbar>
            </div>
          </div>
        </div>
      </section>

      {/* ── Containers ─────────────────────────────────────────────── */}
      <section id="containers" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Containers</h2>
        <p className="text-secondary-foreground mb-4">Panels and tabs for organizing content into collapsible or tabbed layouts.</p>

        <div className="space-y-6">
          {/* Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Panel headerText="System Status">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-sapphire-positive" />
                    <span>API Server</span>
                  </div>
                  <Tag design="Positive">Healthy</Tag>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-sapphire-positive" />
                    <span>Database</span>
                  </div>
                  <Tag design="Positive">Connected</Tag>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-sapphire-warning" />
                    <span>CDN</span>
                  </div>
                  <Tag design="Critical">Degraded</Tag>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-sapphire-positive" />
                    <span>Auth Service</span>
                  </div>
                  <Tag design="Positive">Healthy</Tag>
                </div>
              </div>
            </Panel>
            <Panel headerText="Quick Stats">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Zap className="h-5 w-5 mx-auto mb-1 text-sapphire-warning" />
                  <div className="text-xl font-bold">99.8%</div>
                  <div className="text-xs text-secondary-foreground">Uptime</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Activity className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <div className="text-xl font-bold">42ms</div>
                  <div className="text-xs text-secondary-foreground">Avg Latency</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Users className="h-5 w-5 mx-auto mb-1 text-sapphire-positive" />
                  <div className="text-xl font-bold">1,284</div>
                  <div className="text-xs text-secondary-foreground">Active Users</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Database className="h-5 w-5 mx-auto mb-1 text-secondary-foreground" />
                  <div className="text-xl font-bold">3.2TB</div>
                  <div className="text-xs text-secondary-foreground">Storage Used</div>
                </div>
              </div>
            </Panel>
          </div>

          {/* Tabs with real content */}
          <div>
            <TabContainer>
              <Tab id="tab-overview" text="Overview" icon={<Home className="h-4 w-4" />}>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar size={AvatarSize.S} colorScheme={AvatarColorScheme.Accent1} icon={<Globe className="h-4 w-4" />} />
                    <div>
                      <div className="text-sm font-medium">Production Environment</div>
                      <div className="text-xs text-secondary-foreground">Last deployed 2 hours ago</div>
                    </div>
                    <Tag design="Positive" className="ml-auto">Live</Tag>
                  </div>
                  <MessageStrip design={MessageStripDesign.Information}>
                    Next scheduled maintenance: April 5, 2026 at 02:00 UTC
                  </MessageStrip>
                </div>
              </Tab>
              <Tab id="tab-activity" text="Activity" icon={<Activity className="h-4 w-4" />}>
                <div className="p-4">
                  <List>
                    <ListItem icon={<Zap className="h-4 w-4" />} description="v2.4.1 deployed to production" additionalText="2h ago">
                      Deployment completed
                    </ListItem>
                    <ListItem icon={<Shield className="h-4 w-4" />} description="SSL certificate renewed" additionalText="5h ago">
                      Security update
                    </ListItem>
                    <ListItem icon={<Database className="h-4 w-4" />} description="Automated backup finished" additionalText="8h ago">
                      Database backup
                    </ListItem>
                  </List>
                </div>
              </Tab>
              <Tab id="tab-settings" text="Settings" icon={<Settings className="h-4 w-4" />}>
                <div className="p-4 space-y-3 max-w-md">
                  <div className="flex items-center justify-between text-sm">
                    <span>Auto-scaling</span>
                    <Tag design="Information">Enabled</Tag>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Region</span>
                    <span className="text-secondary-foreground">eu-central-1</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Instance Type</span>
                    <span className="text-secondary-foreground">m5.xlarge</span>
                  </div>
                </div>
              </Tab>
            </TabContainer>
          </div>
        </div>
      </section>

      {/* ── Overlays ───────────────────────────────────────────────── */}
      <section id="overlays" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Overlays</h2>
        <p className="text-secondary-foreground mb-4">Dialog and popover components.</p>

        <div className="flex flex-wrap gap-3">
          <Button
            design={ButtonDesign.Secondary}
            onClick={() => setDialogOpen(true)}
          >
            Open Dialog
          </Button>

          <Button
            ref={popoverBtnRef}
            design={ButtonDesign.Secondary}
            onClick={() => setPopoverOpen((o) => !o)}
          >
            Open Popover
          </Button>
        </div>

        {/* Dialog */}
        <Dialog
          open={dialogOpen}
          headerText="Sample Dialog"
          onOpenChange={(open) => { if (!open) setDialogOpen(false); }}
          footer={
            <div className="flex justify-end gap-2">
              <Button design={ButtonDesign.Tertiary} onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button design={ButtonDesign.Primary} onClick={() => setDialogOpen(false)}>
                Confirm
              </Button>
            </div>
          }
        >
          <p className="text-sm text-secondary-foreground">
            This is a dialog with header, content, and footer buttons.
            Dialogs are used for critical information or required user actions.
          </p>
        </Dialog>

        {/* Popover */}
        <Popover
          open={popoverOpen}
          opener={popoverBtnRef}
          onClose={() => setPopoverOpen(false)}
          headerText="Popover Title"
        >
          <div className="p-4">
            <p className="text-sm text-secondary-foreground">
              Popovers display contextual information next to a trigger element.
            </p>
          </div>
        </Popover>
      </section>
    </div>
  );
}

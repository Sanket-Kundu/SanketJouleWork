import { useState } from "react";
import {
  FxLayout,
  FxPaneHeader,
  FxPaneHeaderAction,
  FxPromptInput,
  FxUserMenu,
  FxUserMenuItem,
  MenuItem,
} from "@sap-ui/fx-components";
import type { FxUserMenuAccountData } from "@sap-ui/fx-components";
import {
  MessageSquare,
  Folder,
  Settings,
  Users,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  Star,
  Archive,
  FileText,
  Image,
  Sparkles,
} from "lucide-react";
import { CodeBlock } from "./components/CodeBlock";

// Sample conversation data
const CONVERSATIONS = [
  { id: "1", title: "Project planning discussion", preview: "Let's discuss the timeline...", time: "2m ago", unread: true },
  { id: "2", title: "Code review feedback", preview: "The implementation looks good...", time: "1h ago", unread: false },
  { id: "3", title: "Design system updates", preview: "We've made progress on the...", time: "3h ago", unread: false },
  { id: "4", title: "API integration help", preview: "Can you help me with the...", time: "Yesterday", unread: false },
  { id: "5", title: "Performance optimization", preview: "I noticed some bottlenecks...", time: "2d ago", unread: false },
];

// Sample messages
const MESSAGES = [
  { id: "1", role: "user", content: "Can you help me understand how to use the FxLayout component?" },
  { id: "2", role: "assistant", content: "Of course! FxLayout is a three-pane resizable layout component with integrated navigation. It provides:\n\n1. **Side navigation** with collapsible items\n2. **Three resizable panes** (start, center, end)\n3. **Responsive behavior** based on viewport\n4. **User menu and notifications** integration\n5. **AI prompt input** positioning\n\nWould you like me to show you some example code?" },
  { id: "3", role: "user", content: "Yes, please show me how to set up the navigation items." },
  { id: "4", role: "assistant", content: "Here's how you can configure navigation items:\n\n```tsx\nconst navItems = [\n  { \n    name: \"conversations\", \n    icon: <MessageSquare />, \n    text: \"Conversations\",\n    badge: \"3\"\n  },\n  { \n    name: \"spaces\", \n    icon: <Folder />, \n    text: \"Spaces\" \n  },\n];\n```\n\nEach nav item can have:\n- `name`: Unique identifier\n- `icon`: Icon element\n- `text`: Display text\n- `badge`: Optional badge count" },
];

export function FxLayoutPage() {
  const [mode, setMode] = useState("conversations");
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1");
  const [startTitle, setStartTitle] = useState("Conversations");
  const [accounts, setAccounts] = useState<FxUserMenuAccountData[]>([
    {
      id: "1",
      titleText: "John Miller",
      subtitleText: "john.miller@example.com",
      description: "Senior Developer",
      avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
      selected: true,
    },
    {
      id: "2",
      titleText: "Jane Smith",
      subtitleText: "jane.smith@corp.example.com",
      description: "Product Manager",
      avatarInitials: "JS",
      avatarColorScheme: "Accent2",
    },
  ]);

  // Navigation items configuration
  const navItems = [
    {
      name: "conversations",
      icon: <MessageSquare className="h-5 w-5" />,
      text: "Conversations",
      badge: "3"
    },
    {
      name: "spaces",
      icon: <Folder className="h-5 w-5" />,
      text: "Spaces"
    },
    {
      name: "team",
      icon: <Users className="h-5 w-5" />,
      text: "Team"
    },
    {
      name: "settings",
      icon: <Settings className="h-5 w-5" />,
      text: "Settings",
    },
  ];

  const handleModeChange = ({ mode: newMode }: { mode: string }) => {
    setMode(newMode);
    // Update start pane title based on mode
    const item = navItems.find(i => i.name === newMode);
    if (item) {
      setStartTitle(item.text);
    }
  };

  const handleSubmit = ({ value }: { value: string }) => {
    console.log("Message submitted:", value);
  };

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">FxLayout</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { FxLayout } from "@sap-ui/fx-components"'}</code>
      </header>
    <div className="h-[800px] border border-border rounded-lg overflow-hidden">
      <FxLayout
        mode={mode}
        navItems={navItems}
        onModeChange={handleModeChange}
        notificationsBadge="5"
        onNotificationsClick={() => console.log("Notifications clicked")}
        // Start pane header
        startHeader={
          <FxPaneHeader
            pane="start"
            title={startTitle}
            titleEditable
            onTitleEditAccept={({ value }) => setStartTitle(value)}
          >
            <FxPaneHeaderAction
              icon={<Plus className="h-4 w-4" />}
              text="New"
              onClick={() => console.log("New clicked")}
            />
            <FxPaneHeaderAction
              icon={<Search className="h-4 w-4" />}
              text="Search"
              onClick={() => console.log("Search clicked")}
            />
            <FxPaneHeaderAction
              icon={<Filter className="h-4 w-4" />}
              text="Filter"
              onClick={() => console.log("Filter clicked")}
            />
          </FxPaneHeader>
        }
        // Start pane content - conversation list
        startContent={
          <div className="p-2 space-y-1">
            {CONVERSATIONS.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedConversation === conv.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-accent"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm truncate ${conv.unread ? "font-semibold" : ""}`}>
                        {conv.title}
                      </span>
                      {conv.unread && (
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-secondary-foreground truncate mt-0.5">
                      {conv.preview}
                    </p>
                  </div>
                  <span className="text-xs text-secondary-foreground shrink-0">
                    {conv.time}
                  </span>
                </div>
              </button>
            ))}
          </div>
        }
        // Center pane header
        centerHeader={
          <FxPaneHeader
            title={selectedConversation ? CONVERSATIONS.find(c => c.id === selectedConversation)?.title || "Chat" : "Select a conversation"}
            showTitleArrow
            onTitleArrowClick={(el) => console.log("Title arrow clicked", el)}
          >
            <FxPaneHeaderAction
              icon={<RefreshCw className="h-4 w-4" />}
              text="Refresh"
              onClick={() => console.log("Refresh clicked")}
            />
            <FxPaneHeaderAction
              icon={<Star className="h-4 w-4" />}
              text="Star"
              onClick={() => console.log("Star clicked")}
            />
            <FxPaneHeaderAction
              icon={<Archive className="h-4 w-4" />}
              text="Archive"
              onClick={() => console.log("Archive clicked")}
            />
          </FxPaneHeader>
        }
        // Center pane content - chat messages
        centerContent={
          <div className="p-4 space-y-4 pb-24">
            {MESSAGES.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        }
        // AI prompt input
        input={
          <FxPromptInput
            placeholder="Ask me anything..."
            onSubmit={handleSubmit}
            disclaimerMessage="AI responses may be inaccurate. Please verify important information."
            actions={
              <>
                <MenuItem
                  icon={<FileText className="h-4 w-4" />}
                  text="Upload document"
                  onClick={() => console.log("Upload document")}
                />
                <MenuItem
                  icon={<Image className="h-4 w-4" />}
                  text="Upload image"
                  onClick={() => console.log("Upload image")}
                />
                <MenuItem
                  icon={<Sparkles className="h-4 w-4" />}
                  text="Use template"
                  onClick={() => console.log("Use template")}
                />
              </>
            }
          />
        }
        // End pane header
        endHeader={
          <FxPaneHeader
            pane="end"
            title="Details"
          >
            <FxPaneHeaderAction
              icon={<Edit className="h-4 w-4" />}
              text="Edit"
              onClick={() => console.log("Edit clicked")}
            />
            <FxPaneHeaderAction
              icon={<Trash2 className="h-4 w-4" />}
              text="Delete"
              onClick={() => console.log("Delete clicked")}
            />
          </FxPaneHeader>
        }
        // End pane content - details panel
        endContent={
          <div className="p-4 space-y-4">
            <section>
              <h3 className="text-sm font-medium text-secondary-foreground mb-2">Conversation Info</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-foreground">Created</span>
                  <span>Mar 23, 2026</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-foreground">Messages</span>
                  <span>4</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-foreground">Model</span>
                  <span>Claude 3.5</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-medium text-secondary-foreground mb-2">Participants</h3>
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                  JD
                </div>
                <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-medium">
                  AI
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-medium text-secondary-foreground mb-2">Tags</h3>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                  Development
                </span>
                <span className="px-2 py-0.5 text-xs bg-orange-500/10 text-orange-600 rounded-full">
                  UI Components
                </span>
              </div>
            </section>
          </div>
        }
        // User menu (slot-based - FxLayout controls open/close/dialog mode)
        userMenu={
          <FxUserMenu
            accounts={accounts}
            showManageAccount
            showOtherAccounts
            onSignOutClick={() => {
              console.log("Sign out clicked");
            }}
            onManageAccountClick={() => console.log("Manage Account clicked")}
            onChangeAccount={(detail) => {
              console.log("Account switch:", detail.prevSelectedAccount.titleText, "→", detail.selectedAccount.titleText);
              setAccounts(prev =>
                prev.map(a => ({ ...a, selected: a.id === detail.selectedAccount.id }))
              );
            }}
          >
            <FxUserMenuItem
              icon={<Settings className="h-4 w-4" />}
              text="Settings"
              onClick={() => console.log("Settings clicked")}
            />
          </FxUserMenu>
        }
      />
    </div>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import {
  FxLayout, FxPaneHeader, FxPaneHeaderAction, FxPromptInput,
} from "@sap-ui/fx-components";
import { MessageSquare, Folder, Settings, Plus } from "lucide-react";

const [mode, setMode] = useState("conversations");

const navItems = [
  { name: "conversations", icon: <MessageSquare />, text: "Chats", badge: "3" },
  { name: "spaces", icon: <Folder />, text: "Spaces" },
  { name: "settings", icon: <Settings />, text: "Settings" },
];

<FxLayout
  mode={mode}
  navItems={navItems}
  onModeChange={({ mode }) => setMode(mode)}
  startHeader={
    <FxPaneHeader title="Conversations" titleEditable>
      <FxPaneHeaderAction icon={<Plus />} text="New" />
    </FxPaneHeader>
  }
  startContent={<div>Start pane content</div>}
  centerHeader={<FxPaneHeader title="Chat" />}
  centerContent={<div>Center pane content</div>}
  endHeader={<FxPaneHeader title="Details" />}
  endContent={<div>End pane content</div>}
  input={
    <FxPromptInput
      placeholder="Ask me anything..."
      onSubmit={({ value }) => console.log(value)}
    />
  }
/>`}
        />
      </section>

      {/* hideNotifications */}
      <section id="hide-notifications" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-1">hideNotifications</h2>
        <p className="text-sm text-secondary-foreground mb-4">
          Set <code className="font-mono">hideNotifications</code> to remove the bell icon from the sidebar entirely.
          Useful when the host application manages notifications outside the layout (e.g. via a custom top bar).
        </p>
        <CodeBlock
          language="tsx"
          code={`// Default – notifications bell is shown
<FxLayout navItems={navItems} mode={mode} />

// Hide the notifications bell entirely
<FxLayout
  navItems={navItems}
  mode={mode}
  hideNotifications
/>`}
        />
      </section>

      {/* navLogo */}
      <section id="nav-logo" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-1">navLogo</h2>
        <p className="text-sm text-secondary-foreground mb-4">
          Replace the default Joule branding with a custom logo via <code className="font-mono">navLogo</code>.
          Provide a <code className="font-mono">collapsed</code> node (shown when the sidebar is icon-only) and/or
          an <code className="font-mono">expanded</code> node (shown when the sidebar is wide). Omit either key to
          keep the Joule default for that state.
        </p>
        <CodeBlock
          language="tsx"
          code={`import { MyIcon, MyWordmark } from "./brand";

// Replace both collapsed and expanded logos
<FxLayout
  navItems={navItems}
  mode={mode}
  navLogo={{
    collapsed: <MyIcon height={32} />,
    expanded: <MyWordmark height={32} />,
  }}
/>

// Replace only the expanded logo (keep default gem icon when collapsed)
<FxLayout
  navItems={navItems}
  mode={mode}
  navLogo={{ expanded: <MyWordmark height={32} /> }}
/>`}
        />
      </section>
    </div>
  );
}

export default FxLayoutPage;

import { useMemo, useCallback, useRef, useEffect, useState } from 'react';

// Build version - updated on each build
const BUILD_VERSION = __BUILD_TIME__;

import {
  FxLayout,
  FxPaneHeader,
  FxPaneHeaderAction,
  FxPaneHeaderSegmentedAction,
  FxPaneHeaderSegmentedOption,
  FxPaneHeaderSplitAction,
  FxPaneHeaderSplitOption,
  FxPromptInput,
  FxUserMenu,
  FxUserMenuItem,
  Input,
  Breadcrumbs,
  BreadcrumbsItem,
  Popover,
  List,
  ListItem,
  Menu,
  MenuItem,
  ConversationsIcon,
  ConversationsSelectedIcon,
  DiscoverIcon,
  DiscoverSelectedIcon,
  SpacesIcon,
  SpacesSelectedIcon,
  JobsMainNavigationIcon,
  JobsMainNavigationSelectedIcon,
  CodeIcon,
  CodeSelectedIcon,
  JouleIcon,
} from '@sap-ui/fx-components';
import type { InputRef, FxNavItemConfig, FxRelationItem, FxUserMenuAccountData, FxUserMenuItemClickDetail, FxUserMenuChangeAccountDetail, FxPromptInputContextItem } from '@sap-ui/fx-components';
import {
  Search,
  Plus,
  Pencil,
  Download,
  Trash2,
  TrendingUp,
  Eye,
  Code,
  TestTube,
  Rocket,
  ExternalLink,
  Terminal,
  Globe,
  Settings,
  Bot,
  HelpCircle,
  LayoutGrid,
  Microscope,
  Paperclip,
  AtSign,
  MessageSquare,
  Users,
  AlertTriangle,
  Lightbulb,
  Building2,
  List as ListIcon,
  ArrowUpDown,
  ArrowUpAZ,
  ArrowDownAZ,
} from 'lucide-react';
import { useAppState } from './hooks';
import { conversations, discoverData, spaces, jobs, projects, getRelationsForItem } from './data';
import type { NavSection, Conversation, Space, Job, Project } from './types';

// Import page components
import { ConversationsList } from './components/ConversationsList';
import { ConversationDetail } from './components/ConversationDetail';
import { DiscoverHome } from './components/DiscoverHome';
import { SpacesList } from './components/SpacesList';
import { SpaceDetail } from './components/SpaceDetail';
import { JobsList } from './components/JobsList';
import { JobDetail } from './components/JobDetail';
import { ProjectsList } from './components/ProjectsList';
import { ProjectDetail } from './components/ProjectDetail';
import { ChatPane } from './components/ChatPane';
import { SettingsNav, settingsSections } from './components/SettingsNav';
import { SettingsContent } from './components/SettingsContent';
import { AINoticeDialog } from './components/AINoticeDialog';
import { DevelopmentStepper } from './components/DevelopmentStepper';
import { NotificationsPanel } from './components/NotificationsPanel';

export function App() {
  const {
    currentSection,
    selectedItemId,
    isHomePage,
    searchVisible,
    searchQuery,
    endPaneContent,
    hideStart,
    hideEnd,
    priorityPane,
    jobDrilldown,
    settingsState,
    switchSection,
    selectItem,
    goHome,
    createConversation,
    toggleSearch,
    setSearchQuery,
    setEndPaneContent,
    openEndPane,
    handleLayoutChange,
    enterJobDrilldown,
    enterJobDrilldownLevel2,
    exitJobDrilldown,
    enterSpaceDrilldown,
    enterSpaceDrilldownLevel2,
    exitSpaceDrilldown,
    spaceDrilldown,
    goToCreate,
    enterSettings,
    selectSettingsSection,
    setSettingsSearchQuery,
  } = useAppState();

  // Navigation items configuration
  // Matches fx-components index.html nav item attributes
  const navItems = useMemo<FxNavItemConfig[]>(
    () => [
      {
        name: 'conversations',
        text: 'Conversations',
        icon: <ConversationsIcon className="h-5 w-5" />,
        selectedIcon: <ConversationsSelectedIcon className="h-5 w-5" />,
        createActionTooltip: 'New Chat',
        utilityEndPane: true, // End pane shows details/sources, not Joule chat
      },
      {
        name: 'discover',
        text: 'Discover',
        icon: <DiscoverIcon className="h-5 w-5" />,
        selectedIcon: <DiscoverSelectedIcon className="h-5 w-5" />,
        noStartPane: true,
        noCreateAction: true,
      },
      {
        name: 'spaces',
        text: 'Spaces',
        icon: <SpacesIcon className="h-5 w-5" />,
        selectedIcon: <SpacesSelectedIcon className="h-5 w-5" />,
        createActionTooltip: 'New Space',
      },
      {
        name: 'jobs',
        text: 'Jobs',
        icon: <JobsMainNavigationIcon className="h-5 w-5" />,
        selectedIcon: <JobsMainNavigationSelectedIcon className="h-5 w-5" />,
      },
      {
        name: 'develop',
        text: 'Develop',
        icon: <CodeIcon className="h-5 w-5" />,
        selectedIcon: <CodeSelectedIcon className="h-5 w-5" />,
      },
    ],
    []
  );

  // Get the current nav item config (for allowStart/allowEnd checks in headers)
  const currentNavItem = useMemo(
    () => navItems.find((item) => item.name === currentSection),
    [navItems, currentSection]
  );

  // Determine if panes are allowed based on section config
  const startPaneAllowed = !currentNavItem?.noStartPane;

  // Get selected item data based on current section
  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    switch (currentSection) {
      case 'conversations':
        return conversations.find((c) => c.id === selectedItemId) as Conversation | undefined;
      case 'spaces':
        return spaces.find((s) => s.id === selectedItemId) as Space | undefined;
      case 'jobs':
        return jobs.find((j) => j.id === selectedItemId) as Job | undefined;
      case 'develop':
        return projects.find((p) => p.id === selectedItemId) as Project | undefined;
      default:
        return null;
    }
  }, [currentSection, selectedItemId]);

  // Get relations for the selected item
  const relations = useMemo(() => {
    if (!selectedItemId) return [];
    return getRelationsForItem(selectedItemId);
  }, [selectedItemId]);

  // Mode change handler - go to create screen for the new section
  const handleModeChange = useCallback(
    ({ mode }: { mode: string }) => {
      // goToCreate handles both switching sections and showing create screen
      goToCreate(mode as NavSection);
    },
    [goToCreate]
  );

  // Add button clicked (nav item + button, end pane + button, etc.)
  // When mode is provided (from nav item +), go to that section's create screen
  // When mode is not provided (from other + buttons), use current section
  const handleAddClick = useCallback((detail?: { mode: string }) => {
    if (detail?.mode) {
      goToCreate(detail.mode as NavSection);
    } else {
      goToCreate();
    }
  }, [goToCreate]);

  // Visibility change handler from FxLayout - respond to internal toggle requests
  // Note: When toggle button is clicked, hideEnd/priorityPane are already set by onLayoutChange.
  // This handler only needs to set the content type - do NOT override priority here.
  const handleVisibilityChange = useCallback(
    ({ pane, visible }: { pane: 'start' | 'center' | 'end'; visible: boolean }) => {
      if (pane === 'end') {
        if (visible) {
          // Set content type only - don't override priority (toggle already set it correctly)
          if (currentSection === 'conversations') {
            setEndPaneContent({ type: 'sources' });
          } else {
            setEndPaneContent({ type: 'chat' });
          }
        } else {
          // Pane is being hidden - clear content
          setEndPaneContent({ type: null });
        }
      }
      // Start pane visibility is handled internally by FxLayout
    },
    [currentSection]
  );

  // Handle prompt submission
  const handlePromptSubmit = useCallback(({ value }: { value: string }) => {
    console.log('Prompt submitted:', value);

    // If on conversations home page, create a new conversation
    if (currentSection === 'conversations' && isHomePage) {
      // In a real app, this would create a new conversation
      // For demo, we select the first conversation to simulate it
      if (conversations.length > 0) {
        createConversation(conversations[0].id);
      }
      return;
    }

    // For spaces/jobs/develop create screens, just select the first item (don't open end pane)
    if (!selectedItemId && ['spaces', 'jobs', 'develop'].includes(currentSection)) {
      // Select the first item to simulate creating one
      const items = currentSection === 'spaces' ? spaces : currentSection === 'jobs' ? jobs : projects;
      if (items.length > 0) {
        selectItem(items[0].id);
      }
      return;
    }

    // For spaces/jobs/develop with a selected item, open the chat pane (if not already open)
    if (selectedItemId && ['spaces', 'jobs', 'develop'].includes(currentSection)) {
      if (hideEnd) {
        openEndPane('chat', selectedItemId);
      }
      // If end pane is already open, do nothing (message would be sent to AI in real app)
      return;
    }

    // In a real app, this would send the message to an AI backend
  }, [currentSection, isHomePage, selectedItemId, createConversation, selectItem, openEndPane]);

  // Start pane content
  // conversations: shows list whenever start pane is visible
  // spaces/jobs/develop: always show list
  // settings: show settings navigation
  const renderStartContent = () => {
    // Settings mode - show settings navigation
    if (currentSection === 'settings') {
      return (
        <SettingsNav
          selectedId={settingsState.selectedSectionId}
          onSelect={(id, highlightRowIndex) => selectSettingsSection(id, highlightRowIndex)}
          onResetClick={() => console.log('Reset settings clicked')}
          searchQuery={settingsState.searchQuery}
          onSearchChange={setSettingsSearchQuery}
          buildVersion={BUILD_VERSION}
        />
      );
    }

    // Filter items by search query if present
    const filterByQuery = <T extends { name: string; description?: string }>(items: T[]) => {
      if (!searchQuery) return items;
      const query = searchQuery.toLowerCase();
      return items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query))
      );
    };

    // Sort items by name
    const sortByName = <T extends { name: string }>(items: T[]): T[] => {
      return [...items].sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    };

    switch (currentSection) {
      case 'conversations':
        // Always show the list when start pane is visible (list is the start pane content)
        return <ConversationsList conversations={sortByName(filterByQuery(conversations))} selectedId={selectedItemId} onSelect={selectItem} />;
      case 'spaces':
        return <SpacesList spaces={sortByName(filterByQuery(spaces))} selectedId={selectedItemId} onSelect={selectItem} />;
      case 'jobs':
        return <JobsList jobs={filterByQuery(jobs)} selectedId={selectedItemId} onSelect={selectItem} />;
      case 'develop':
        return <ProjectsList projects={filterByQuery(projects)} selectedId={selectedItemId} onSelect={selectItem} />;
      default:
        return null;
    }
  };

  // Center pane content
  // conversations: home page = "New Conversation" with Joule logo; selected = conversation detail
  // discover: discover home content
  // spaces/jobs/develop: selected item detail, or "Create new" empty state
  // settings: settings content for selected section
  const renderCenterContent = () => {
    // Settings mode - show settings content
    if (currentSection === 'settings') {
      return (
        <SettingsContent
          sectionId={settingsState.selectedSectionId}
          highlightRowIndex={settingsState.highlightRowIndex}
          largeScreenLayoutEnabled={largeScreenLayout}
          onLargeScreenLayoutChange={setLargeScreenLayout}
        />
      );
    }

    if (currentSection === 'conversations') {
      if (isHomePage) {
        // Clean landing page like the design
        return (
          <div className="flex flex-col items-center justify-center h-full px-7 relative">
            <div className="flex flex-col items-center max-w-2xl w-full">
              {/* Icon */}
              <div className="mb-6">
                <JouleIcon size={64} />
              </div>

              {/* Title */}
              <h1 className="text-[40px] font-normal leading-[48px] text-foreground mb-3 text-center">
                Start a new conversation
              </h1>

              {/* Subtitle */}
              <p className="text-center mb-8 text-xl leading-8" style={{ color: '#6B707E' }}>
                Ask Joule anything and get intelligent answers powered by your enterprise data.
              </p>

              {/* Input - using the FxPromptInput */}
              <div className="w-full mb-8">
                {renderPromptInput("Ask Joule anything...")}
              </div>
            </div>

            {/* Disclaimer - centered at bottom */}
            <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-sapphire-text-tertiary">
              Joule uses AI, verify results.
            </p>
          </div>
        );
      }
      if (selectedItem) {
        return <ConversationDetail conversation={selectedItem as Conversation} onBack={goHome} onOpenSources={(sourceCount) => openEndPane('sources', selectedItemId!, undefined, sourceCount)} />;
      }
    }

    if (currentSection === 'discover') {
      return <DiscoverHome data={discoverData} />;
    }

    if (currentSection === 'spaces') {
      if (selectedItem) {
        return (
          <SpaceDetail
            space={selectedItem as Space}
            relations={relations}
            drilldown={spaceDrilldown}
            onDrilldown={enterSpaceDrilldown}
            onDrilldownLevel2={enterSpaceDrilldownLevel2}
          />
        );
      }
      // Create new space view
      return (
        <div className="flex flex-col items-center justify-center h-full px-8 relative">
          <div className="flex flex-col items-center max-w-2xl w-full">
            {/* Icon */}
            <div className="mb-6">
              <SpacesIcon className="w-16 h-16 text-purple-500" />
            </div>

            {/* Title */}
            <h1 className="text-[40px] font-normal leading-[48px] text-foreground mb-3 text-center">
              Create a new Space
            </h1>

            {/* Subtitle */}
            <p className="text-center mb-8 text-xl leading-8" style={{ color: '#6B707E' }}>
              Describe what you want to accomplish and Joule will help you build it.
            </p>

            {/* Input - using the FxPromptInput */}
            <div className="w-full mb-8">
              {renderPromptInput("Describe your space...")}
            </div>
          </div>

          {/* Disclaimer - centered at bottom */}
          <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-sapphire-text-tertiary">
            Joule uses AI, verify results.
          </p>
        </div>
      );
    }

    if (currentSection === 'jobs') {
      if (selectedItem) {
        return (
          <JobDetail
            job={selectedItem as Job}
            relations={relations}
            drilldown={jobDrilldown}
            onDrilldown={enterJobDrilldown}
            onDrilldownLevel2={enterJobDrilldownLevel2}
          />
        );
      }
      // Create new job view
      return (
        <div className="flex flex-col items-center justify-center h-full px-8 relative">
          <div className="flex flex-col items-center max-w-2xl w-full">
            {/* Icon */}
            <div className="mb-6">
              <JobsMainNavigationIcon className="w-16 h-16 text-purple-500" />
            </div>

            {/* Title */}
            <h1 className="text-[40px] font-normal leading-[48px] text-foreground mb-3 text-center">
              Create a new Job
            </h1>

            {/* Subtitle */}
            <p className="text-center mb-8 text-xl leading-8" style={{ color: '#6B707E' }}>
              Describe the task you want to automate and Joule will set it up.
            </p>

            {/* Input - using the FxPromptInput */}
            <div className="w-full mb-8">
              {renderPromptInput("Describe your job...")}
            </div>
          </div>

          {/* Disclaimer - centered at bottom */}
          <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-sapphire-text-tertiary">
            Joule uses AI, verify results.
          </p>
        </div>
      );
    }

    if (currentSection === 'develop') {
      if (selectedItem) {
        return <ProjectDetail project={selectedItem as Project} />;
      }
      // Create new project view
      return (
        <div className="flex flex-col items-center justify-center h-full px-8 relative">
          <div className="flex flex-col items-center max-w-2xl w-full">
            {/* Icon */}
            <div className="mb-6">
              <CodeIcon className="w-16 h-16 text-purple-500" />
            </div>

            {/* Title */}
            <h1 className="text-[40px] font-normal leading-[48px] text-foreground mb-3 text-center">
              Create a new Project
            </h1>

            {/* Subtitle */}
            <p className="text-center mb-8 text-xl leading-8" style={{ color: '#6B707E' }}>
              Describe your application and Joule will scaffold it using SAP Build Code.
            </p>

            {/* Input - using the FxPromptInput */}
            <div className="w-full mb-8">
              {renderPromptInput("Describe your project...")}
            </div>
          </div>

          {/* Disclaimer - centered at bottom */}
          <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-sapphire-text-tertiary">
            Joule uses AI, verify results.
          </p>
        </div>
      );
    }

    return null;
  };

  // Sample source data for generating random sources
  const sampleSources = [
    { title: '2827482634.md', desc: 'Company-specific document' },
    { title: 'Knowledge Article KB0012345', desc: 'Support documentation' },
    { title: 'SAP Help Portal', desc: 'Official SAP documentation' },
    { title: 'Q4 Sales Report 2025.pdf', desc: 'Internal quarterly report' },
    { title: 'Customer Success Playbook', desc: 'Best practices guide' },
    { title: 'Product Roadmap 2026', desc: 'Strategic planning document' },
    { title: 'KB0098765 - Troubleshooting Guide', desc: 'Technical support article' },
    { title: 'Integration Architecture.docx', desc: 'Technical documentation' },
    { title: 'API Reference v2.3', desc: 'Developer documentation' },
    { title: 'Training Materials - Advanced', desc: 'Learning resource' },
  ];

  // End pane content
  // conversations: "Sources" pane with document references
  // spaces/jobs: "Joule" chat pane
  const renderEndContent = () => {
    if (endPaneContent.type === 'sources') {
      // Use the sourceCount passed when opening the pane, or default to 3
      const count = endPaneContent.sourceCount ?? 3;
      const sources = sampleSources.slice(0, Math.min(count, sampleSources.length));

      return (
        <div className="py-4 space-y-4">
          <div className="space-y-3">
            {sources.map((source, index) => (
              <div key={index} className="border border-sapphire-border rounded-lg p-3">
                <a href="#" className="text-sm text-blue-600 hover:underline">[{index + 1}] {source.title}</a>
                <p className="text-xs text-sapphire-text-tertiary mt-1">{source.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (endPaneContent.type === 'chat') {
      return <ChatPane itemId={endPaneContent.itemId} initialMessage={endPaneContent.initialMessage} />;
    }
    return null;
  };

  // State for custom item names (overrides the default item.name)
  const [customNames, setCustomNames] = useState<Record<string, string>>({});

  // Get the display title for the current item (custom name or original)
  const getItemDisplayName = useCallback((itemId: string | null, originalName: string): string => {
    if (!itemId) return originalName;
    return customNames[itemId] ?? originalName;
  }, [customNames]);

  // Compute title for center header
  const centerTitle = useMemo(() => {
    // Settings mode - show section title
    if (currentSection === 'settings') {
      const section = settingsSections.find(s => s.id === settingsState.selectedSectionId);
      return section?.title || 'Settings';
    }
    // Handle job drilldown - show deepest level title
    if (currentSection === 'jobs' && jobDrilldown) {
      if (jobDrilldown.level2) {
        return jobDrilldown.level2.title;
      }
      if (jobDrilldown.level1) {
        return jobDrilldown.level1.title;
      }
    }
    // Handle space drilldown - show deepest level title
    if (currentSection === 'spaces' && spaceDrilldown) {
      if (spaceDrilldown.level2) {
        return spaceDrilldown.level2.title;
      }
      if (spaceDrilldown.level1) {
        return spaceDrilldown.level1.title;
      }
    }
    if (currentSection === 'conversations') {
      if (isHomePage) return 'New Conversation';
      if (selectedItem && 'name' in selectedItem) {
        return getItemDisplayName(selectedItemId, selectedItem.name);
      }
      return 'Conversations';
    }
    if (selectedItem && 'name' in selectedItem) {
      return getItemDisplayName(selectedItemId, selectedItem.name);
    }
    if (currentSection === 'discover') return 'Discover';
    if (currentSection === 'spaces') return 'New Space';
    if (currentSection === 'jobs') return 'New Job';
    if (currentSection === 'develop') return 'New Project';
    return '';
  }, [selectedItem, currentSection, isHomePage, jobDrilldown, spaceDrilldown, selectedItemId, getItemDisplayName, settingsState.selectedSectionId]);

  // Compute breadcrumbs for center header (used in job/space drilldown)
  // Each level of drilldown adds one breadcrumb item
  const centerBreadcrumbs = useMemo(() => {
    // Job drilldown breadcrumbs
    if (currentSection === 'jobs' && jobDrilldown && selectedItem) {
      const job = selectedItem as Job;
      const items: React.ReactNode[] = [];

      // Level 1 drilldown: show job name as breadcrumb
      if (jobDrilldown.level1) {
        items.push(<BreadcrumbsItem key="job">{job.name}</BreadcrumbsItem>);
      }

      // Level 2 drilldown: also show level 1 title
      if (jobDrilldown.level2 && jobDrilldown.level1) {
        items.push(<BreadcrumbsItem key="level1">{jobDrilldown.level1.title}</BreadcrumbsItem>);
      }

      if (items.length > 0) {
        return (
          <Breadcrumbs design="NoCurrentPage" onItemClick={exitJobDrilldown}>
            {items}
          </Breadcrumbs>
        );
      }
    }

    // Space drilldown breadcrumbs
    if (currentSection === 'spaces' && spaceDrilldown && selectedItem) {
      const space = selectedItem as Space;
      const items: React.ReactNode[] = [];

      // Level 1 drilldown: show space name as breadcrumb
      if (spaceDrilldown.level1) {
        items.push(<BreadcrumbsItem key="space">{space.name}</BreadcrumbsItem>);
      }

      // Level 2 drilldown: also show level 1 title
      if (spaceDrilldown.level2 && spaceDrilldown.level1) {
        items.push(<BreadcrumbsItem key="level1">{spaceDrilldown.level1.title}</BreadcrumbsItem>);
      }

      if (items.length > 0) {
        return (
          <Breadcrumbs design="NoCurrentPage" onItemClick={exitSpaceDrilldown}>
            {items}
          </Breadcrumbs>
        );
      }
    }

    return undefined;
  }, [currentSection, jobDrilldown, spaceDrilldown, selectedItem, exitJobDrilldown, exitSpaceDrilldown]);

  // Compute title for start header based on section
  const startTitle = useMemo(() => {
    switch (currentSection) {
      case 'conversations': return 'Conversations';
      case 'spaces': return 'Spaces';
      case 'jobs': return 'Jobs';
      case 'develop': return 'Projects';
      case 'settings': return 'Settings';
      default: return '';
    }
  }, [currentSection]);

  // Get the "New" button text based on section
  const newButtonText = useMemo(() => {
    switch (currentSection) {
      case 'conversations': return 'New Chat';
      case 'spaces': return 'New Space';
      case 'jobs': return 'New Job';
      case 'develop': return 'New Project';
      default: return 'New';
    }
  }, [currentSection]);

  // Get search placeholder based on section
  const searchPlaceholder = useMemo(() => {
    switch (currentSection) {
      case 'conversations': return 'Search conversations...';
      case 'spaces': return 'Search spaces...';
      case 'jobs': return 'Search jobs...';
      case 'develop': return 'Search projects...';
      default: return 'Search...';
    }
  }, [currentSection]);

  // State for segmented button in develop mode
  const [developViewMode, setDevelopViewMode] = useState('view');

  // State for title edit mode - controlled by header
  const [titleEditMode, setTitleEditMode] = useState(false);

  // Handler for Rename button click - enters edit mode
  const handleRenameClick = useCallback(() => {
    setTitleEditMode(true);
  }, []);

  // Handler for title rename accept - saves the new name
  const handleTitleRename = useCallback((detail: { value: string; previousValue: string }) => {
    if (selectedItemId && detail.value !== detail.previousValue) {
      setCustomNames(prev => ({
        ...prev,
        [selectedItemId]: detail.value,
      }));
    }
    setTitleEditMode(false);
  }, [selectedItemId]);

  // Handler for title rename cancel
  const handleTitleRenameCancel = useCallback(() => {
    setTitleEditMode(false);
  }, []);

  // Handler for title edit mode change (double-click to edit)
  const handleTitleEditModeChange = useCallback((detail: { editMode: boolean }) => {
    setTitleEditMode(detail.editMode);
  }, []);

  // Handler for export action
  const handleExport = useCallback(() => {
    console.log('Export clicked');
  }, []);

  // Handler for delete action
  const handleDelete = useCallback(() => {
    console.log('Delete clicked');
  }, []);

  // Handler for insights popover
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [insightsOpener, setInsightsOpener] = useState<HTMLElement | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<{ icon: React.ReactNode; text: string } | null>(null);

  const insightOptions = [
    { id: 'trend', icon: <TrendingUp className="h-4 w-4" />, text: 'Revenue Trend', detail: '+12% this quarter' },
    { id: 'customer', icon: <Users className="h-4 w-4" />, text: 'Customer Health', detail: '2 at-risk accounts' },
    { id: 'warning', icon: <AlertTriangle className="h-4 w-4" />, text: 'Anomaly Detected', detail: 'Unusual spike in orders' },
    { id: 'lightbulb', icon: <Lightbulb className="h-4 w-4" />, text: 'Recommendation', detail: 'Optimize inventory levels' },
    { id: 'competitor', icon: <Building2 className="h-4 w-4" />, text: 'Market Insight', detail: 'Competitor price change' },
  ];

  // Sort menu state
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortMenuOpener, setSortMenuOpener] = useState<HTMLElement | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handler for deploy action
  const handleDeploy = useCallback(() => {
    console.log('Deploy clicked');
  }, []);

  // Handler for open split button
  const handleOpenInIDE = useCallback(() => {
    console.log('Open in IDE clicked');
  }, []);

  const handleOpenOption = useCallback((detail: { optionId: string }) => {
    console.log('Open option selected:', detail.optionId);
  }, []);

  // Handler for title arrow click (develop mode) - opens project switcher dropdown
  const handleTitleArrowClick = useCallback((arrowRef: HTMLElement) => {
    setTitleDropdownOpener(arrowRef);
    setTitleDropdownOpen(true);
  }, []);

  // Handler for selecting a project from the title dropdown
  const handleTitleDropdownSelect = useCallback((projectId: string) => {
    selectItem(projectId);
    setTitleDropdownOpen(false);
  }, [selectItem]);

  // Handler for relation click - navigate to the related item
  const handleRelationClick = useCallback((relation: FxRelationItem) => {
    if (relation.type === 'conversation') {
      // For conversations, open the chat pane with the conversation content
      openEndPane('chat', relation.id);
    } else {
      // For spaces/jobs, navigate to the section and select the item
      const sectionMap: Record<string, NavSection> = {
        space: 'spaces',
        job: 'jobs',
      };
      const targetSection = sectionMap[relation.type];
      if (targetSection) {
        switchSection(targetSection);
        selectItem(relation.id);
      }
    }
  }, [switchSection, selectItem, openEndPane]);

  // Ref for search input to auto-focus when shown
  const searchInputRef = useRef<InputRef>(null);

  // State for title dropdown popover (develop section)
  const [titleDropdownOpen, setTitleDropdownOpen] = useState(false);
  const [titleDropdownOpener, setTitleDropdownOpener] = useState<HTMLElement | null>(null);

  // State for large screen layout (increases 3-pane threshold for big monitors)
  const [largeScreenLayout, setLargeScreenLayout] = useState(false);

  // State for AI Notice dialog (temporarily triggered by notifications button for testing)
  const [aiNoticeOpen, setAiNoticeOpen] = useState(false);

  // State for notifications panel
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsOpener, setNotificationsOpener] = useState<HTMLElement | null>(null);

  // Auto-focus search input when it becomes visible
  useEffect(() => {
    if (searchVisible) {
      // Small delay to ensure the input is mounted
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [searchVisible]);

  // Search subheader animation state
  const [searchAnimating, setSearchAnimating] = useState(false);
  const [searchExiting, setSearchExiting] = useState(false);
  const prevSearchVisibleRef = useRef(searchVisible);

  // Handle search visibility changes with animation
  useEffect(() => {
    if (searchVisible && !prevSearchVisibleRef.current) {
      // Entering: show immediately with enter animation
      setSearchAnimating(true);
      setSearchExiting(false);
    } else if (!searchVisible && prevSearchVisibleRef.current) {
      // Exiting: trigger exit animation, hide after it completes
      setSearchExiting(true);
    }
    prevSearchVisibleRef.current = searchVisible;
  }, [searchVisible]);

  // Handle animation end for exit
  const handleSearchAnimationEnd = useCallback(() => {
    if (searchExiting) {
      setSearchAnimating(false);
      setSearchExiting(false);
    }
  }, [searchExiting]);

  // Show subheader when visible OR animating out
  const showSearchSubheader = searchVisible || searchAnimating;

  // Search subheader for start pane - shown when searchVisible is true
  // Uses Input component with showClearIcon to match fx-components ui5-input behavior
  // The clear icon clears the search value, the search button toggles search visibility
  const searchSubheader = showSearchSubheader ? (
    <div
      style={{
        animation: searchExiting
          ? 'subheader-exit 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          : 'subheader-enter 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onAnimationEnd={handleSearchAnimationEnd}
    >
      <Input
        ref={searchInputRef}
        value={searchQuery}
        onInput={setSearchQuery}
        placeholder={searchPlaceholder}
        showClearIcon
      />
    </div>
  ) : undefined;

  // Start pane header - ALWAYS present when start pane is allowed
  // The pane itself may be hidden (hideStart=true), but the header is always there for when it's shown
  // Settings mode has a different header (no actions, no subheader - search is inside the nav)
  const startHeader = startPaneAllowed || currentSection === 'settings' ? (
    currentSection === 'settings' ? (
      <FxPaneHeader title={startTitle} pane="start" />
    ) : (
      <FxPaneHeader
        title={startTitle}
        pane="start"
        subheader={searchSubheader}
      >
        <FxPaneHeaderAction
          icon={<Search className="h-4 w-4" />}
          text="Search"
          design="SecondaryNeutral"
          onClick={toggleSearch}
        />
        <FxPaneHeaderAction
          icon={sortDirection === 'asc' ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowUpAZ className="h-4 w-4" />}
          text={sortDirection === 'asc' ? "Sort A-Z" : "Sort Z-A"}
          design="SecondaryNeutral"
          onClick={(_e, ref) => {
            setSortMenuOpener(ref);
            setSortMenuOpen(true);
          }}
        />
        <FxPaneHeaderAction
          icon={<Plus className="h-4 w-4" />}
          text={newButtonText}
          design="Secondary"
          showText
          onClick={handleAddClick}
        />
      </FxPaneHeader>
    )
  ) : undefined;

  // Check if current section uses utility end pane (not Joule chat)
  const isUtilityEndPane = currentNavItem?.utilityEndPane ?? false;

  // Determine if we're in create mode (no item selected in spaces/jobs/develop)
  // In create mode, we suppress the end pane toggle since chat doesn't make sense until item is created
  const isCreateMode = !selectedItemId && ['spaces', 'jobs', 'develop'].includes(currentSection);

  // Determine if we should show back button (for job or space drilldown)
  const showBack =
    (currentSection === 'jobs' && jobDrilldown !== null && (jobDrilldown.level1 !== undefined || jobDrilldown.level2 !== undefined)) ||
    (currentSection === 'spaces' && spaceDrilldown !== null && (spaceDrilldown.level1 !== undefined || spaceDrilldown.level2 !== undefined));

  // Handle back button click - exit appropriate drilldown
  const handleBackClick = useCallback(() => {
    if (currentSection === 'jobs') {
      exitJobDrilldown();
    } else if (currentSection === 'spaces') {
      exitSpaceDrilldown();
    }
  }, [currentSection, exitJobDrilldown, exitSpaceDrilldown]);

  // Center pane header
  // showBack is only used for drilldown scenarios (e.g., jobs drilldown into sub-items)
  // In conversations, the toggle-start button handles "back to list" navigation
  // Actions vary by section:
  // - Conversations: Rename, Share, Export, Delete (when item selected)
  // - Spaces: Rename, Insights toggle (when item selected)
  // - Jobs: Rename, Delete (when item selected)
  // - Develop: Rename, Segmented (View/Edit/Test), Deploy, Open split button, showTitleArrow (when item selected)
  const renderCenterHeaderActions = () => {
    // No actions on home/create screens
    if (!selectedItemId) return null;

    switch (currentSection) {
      case 'conversations':
        return (
          <>
            <FxPaneHeaderAction
              icon={<Pencil className="h-4 w-4" />}
              text="Rename"
              onClick={handleRenameClick}
              priority="alwaysOverflow"
            />
            <FxPaneHeaderAction
              icon={<Download className="h-4 w-4" />}
              text="Export"
              onClick={handleExport}
              priority="alwaysOverflow"
            />
            <FxPaneHeaderAction
              icon={<Trash2 className="h-4 w-4" />}
              text="Delete"
              onClick={handleDelete}
              priority="alwaysOverflow"
            />
          </>
        );

      case 'spaces':
        return (
          <>
            <FxPaneHeaderAction
              icon={<Pencil className="h-4 w-4" />}
              text="Rename"
              onClick={handleRenameClick}
              priority="alwaysOverflow"
            />
            <FxPaneHeaderAction
              icon={selectedInsight?.icon || <ListIcon className="h-4 w-4" />}
              text={selectedInsight?.text || "Insights"}
              design="SecondaryNeutral"
              showText
              priority="high"
              onClick={(_e, ref) => {
                setInsightsOpener(ref);
                setInsightsOpen(true);
              }}
            />
          </>
        );

      case 'jobs':
        return (
          <>
            <FxPaneHeaderAction
              icon={<Pencil className="h-4 w-4" />}
              text="Rename"
              onClick={handleRenameClick}
              priority="alwaysOverflow"
            />
            <FxPaneHeaderAction
              icon={<Trash2 className="h-4 w-4" />}
              text="Delete"
              onClick={handleDelete}
              priority="alwaysOverflow"
            />
          </>
        );

      case 'develop':
        return (
          <>
            <FxPaneHeaderAction
              icon={<Pencil className="h-4 w-4" />}
              text="Rename"
              onClick={handleRenameClick}
              priority="alwaysOverflow"
            />
            <FxPaneHeaderSegmentedAction
              selectedId={developViewMode}
              onSelectionChange={(detail: { selectedId: string }) => setDevelopViewMode(detail.selectedId)}
              priority="high"
              centered
            >
              <FxPaneHeaderSegmentedOption id="view" icon={<Eye className="h-4 w-4" />} text="View" />
              <FxPaneHeaderSegmentedOption id="edit" icon={<Code className="h-4 w-4" />} text="Edit" />
              <FxPaneHeaderSegmentedOption id="test" icon={<TestTube className="h-4 w-4" />} text="Test" />
            </FxPaneHeaderSegmentedAction>
            <FxPaneHeaderAction
              icon={<Rocket className="h-4 w-4" />}
              text="Deploy"
              onClick={handleDeploy}
              design="Secondary"
              showText
              priority="high"
            />
            <FxPaneHeaderSplitAction
              icon={<ExternalLink className="h-4 w-4" />}
              text="Open"
              showText
              onClick={handleOpenInIDE}
              onOptionSelect={handleOpenOption}
            >
              <FxPaneHeaderSplitOption id="vscode" icon={<Terminal className="h-4 w-4" />} text="Open in VS Code" />
              <FxPaneHeaderSplitOption id="bas" icon={<Globe className="h-4 w-4" />} text="Open in BAS" />
            </FxPaneHeaderSplitAction>
          </>
        );

      default:
        return null;
    }
  };

  // Reset title edit mode when selected item changes
  useEffect(() => {
    setTitleEditMode(false);
  }, [selectedItemId]);

  // Title is editable when an item is selected (not on create/home screens)
  const isTitleEditable = !!selectedItemId && !isHomePage && currentSection !== 'discover';

  // Subheader for develop section - shows development workflow stepper
  const developSubheader = currentSection === 'develop' && selectedItemId ? <DevelopmentStepper /> : undefined;

  const centerHeader = (
    <FxPaneHeader
      pane="center"
      title={centerTitle}
      showBack={showBack}
      onBackClick={handleBackClick}
      breadcrumbs={centerBreadcrumbs}
      subheader={developSubheader}
      related={relations}
      onRelationClick={handleRelationClick}
      // Title is editable for all sections with selected item (not create screens)
      titleEditable={isTitleEditable}
      titleEditMode={titleEditMode}
      onTitleEditAccept={handleTitleRename}
      onTitleEditCancel={handleTitleRenameCancel}
      onTitleEditModeChange={handleTitleEditModeChange}
      // Show title arrow for develop mode
      showTitleArrow={currentSection === 'develop' && !!selectedItemId}
      onTitleArrowClick={handleTitleArrowClick}
    >
      {renderCenterHeaderActions()}
    </FxPaneHeader>
  );

  // Compute title for end header based on section and content type
  const endTitle = useMemo(() => {
    // For conversations mode, show "Sources"
    // For other modes, show "Joule" (AI chat)
    if (currentSection === 'conversations') {
      return 'Sources';
    }
    return 'Joule';
  }, [currentSection]);

  // End pane header - ALWAYS present (the pane itself may be hidden via hideEnd/suppressEnd)
  // Close button uses toggleEndPane from layout context (internal layout interaction)
  const endHeader = (
    <FxPaneHeader
      pane="end"
      title={endTitle}
      showAddButton
      addButtonTooltip="New Chat"
      onAddClick={handleAddClick}
    />
  );

  // Show layout input except on create screens (which have their own embedded input)
  const showLayoutInput = useMemo(() => {
    // Hide on conversations home page - it has embedded input
    if (currentSection === 'conversations' && isHomePage) {
      return false;
    }
    // Hide on create screens (spaces/jobs/develop with no selection) - they have embedded input
    if (isCreateMode) {
      return false;
    }
    // Show everywhere else (including settings)
    return true;
  }, [isCreateMode, currentSection, isHomePage]);

  // Demo context items for prompt input
  const [promptContextItems, setPromptContextItems] = useState<FxPromptInputContextItem[]>([
    { id: 'space1', icon: <SpacesIcon />, label: 'Space' },
  ]);

  const handleContextItemRemove = useCallback((detail: { item: FxPromptInputContextItem }) => {
    setPromptContextItems(prev => prev.filter(item => item.id !== detail.item.id));
  }, []);

  // Prompt input actions menu
  const promptInputActions = (
    <>
      <MenuItem icon={<LayoutGrid className="h-4 w-4" />} text="Create Space" />
      <MenuItem icon={<Bot className="h-4 w-4" />} text="Agent Mode" />
      <MenuItem icon={<Microscope className="h-4 w-4" />} text="Deep Research" />
      <MenuItem icon={<Search className="h-4 w-4" />} text="Search" />
      <MenuItem icon={<Paperclip className="h-4 w-4" />} text="Add Attachment" />
    </>
  );

  // Prompt input with full configuration - reusable for layout and create screens
  const renderPromptInput = (placeholder: string, showDisclaimer = false) => (
    <FxPromptInput
      placeholder={placeholder}
      contextItems={promptContextItems}
      onContextItemRemove={handleContextItemRemove}
      onSubmit={handlePromptSubmit}
      actions={promptInputActions}
      disclaimerMessage={showDisclaimer ? "Joule uses AI, verify results." : undefined}
    />
  );

  // Layout prompt input (hidden on create screens and settings)
  const promptInput = showLayoutInput ? renderPromptInput("Ask Joule anything...", true) : undefined;

  // User Menu accounts (matching fx demo data)
  const [userMenuAccounts, setUserMenuAccounts] = useState<FxUserMenuAccountData[]>([
    {
      id: '1',
      avatarSrc: `${import.meta.env.BASE_URL}img/woman_avatar_5.png`,
      avatarInitials: 'MP',
      titleText: 'Maria Jose Perreira',
      subtitleText: 'maria.jose.perreira@sap.com',
      description: 'Delivery Manager',
      additionalInfo: 'Primary Employment',
      selected: true,
    },
    {
      id: '2',
      avatarSrc: `${import.meta.env.BASE_URL}img/man_avatar_1.png`,
      avatarInitials: 'JS',
      titleText: 'John Smith',
      subtitleText: 'john.smith@sap.com',
      description: 'Software Developer',
      additionalInfo: 'Secondary Employment',
    },
    {
      id: '3',
      avatarInitials: 'AJ',
      titleText: 'Anna Johnson',
      subtitleText: 'anna.johnson@sap.com',
      description: 'Product Manager',
      additionalInfo: 'Contractor',
    },
  ]);

  const handleUserMenuChangeAccount = useCallback((detail: FxUserMenuChangeAccountDetail) => {
    setUserMenuAccounts(prev =>
      prev.map(a => ({
        ...a,
        selected: a.id === detail.selectedAccount.id,
      }))
    );
  }, []);

  const handleUserMenuItemClick = useCallback((detail: FxUserMenuItemClickDetail) => {
    if (detail.text === 'Settings') {
      enterSettings();
    } else if (detail.text === 'AI Notice') {
      setAiNoticeOpen(true);
    }
  }, [enterSettings]);

  // User menu element (FxLayout controls open/close/dialog mode)
  const userMenu = useMemo(() => (
    <FxUserMenu
      accounts={userMenuAccounts}
      showOtherAccounts
      showManageAccount={false}
      avatarInteractive={false}
      onItemClick={handleUserMenuItemClick}
      onChangeAccount={handleUserMenuChangeAccount}
      onSignOutClick={() => { console.log('Sign out clicked'); }}
    >
      <FxUserMenuItem text="Settings" icon={<Settings className="h-4 w-4" />} />
      <FxUserMenuItem text="AI Notice" icon={
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M5.96732 6.89715C6.25521 6.03428 7.49457 6.03433 7.78251 6.89715C8.79639 9.8735 10.1233 11.1991 13.1023 12.2121C13.966 12.5122 13.966 13.7506 13.1023 14.0383C10.1233 15.0512 8.79638 16.3769 7.78251 19.3532C7.49444 20.2157 6.25531 20.2158 5.96732 19.3532C4.95344 16.3768 3.62656 15.0512 0.647497 14.0383C-0.215861 13.738 -0.215803 12.4999 0.647497 12.2121C3.62655 11.1991 4.95344 9.87348 5.96732 6.89715ZM15.7561 0.355398C15.9187 -0.118502 16.581 -0.11843 16.7437 0.355398C17.2937 1.97769 18.0191 2.70182 19.6441 3.25091C20.1188 3.41326 20.1189 4.08715 19.6441 4.24944C18.0191 4.79853 17.2937 5.52265 16.7437 7.14495C16.5809 7.61846 15.9188 7.61853 15.7561 7.14495C15.2061 5.52265 14.4807 4.79853 12.8557 4.24944C12.3814 4.087 12.3814 3.41341 12.8557 3.25091C14.4807 2.70182 15.2061 1.97769 15.7561 0.355398Z"/>
        </svg>
      } />
      <FxUserMenuItem text="Help" icon={<HelpCircle className="h-4 w-4" />} />
    </FxUserMenu>
  ), [userMenuAccounts, handleUserMenuItemClick, handleUserMenuChangeAccount]);

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <FxLayout
        mode={currentSection === 'settings' ? 'settings' : currentSection}
        navItems={navItems}
        threePaneMinWidth={largeScreenLayout ? 1920 : undefined}
        onModeChange={handleModeChange}
        onVisibilityChange={handleVisibilityChange}
        onLayoutChange={handleLayoutChange}
        onAddClick={handleAddClick}
        notificationsBadge={3}
        notificationsLocked={notificationsOpen}
        onNotificationsClick={(opener) => {
          if (notificationsOpen) {
            setNotificationsOpen(false);
          } else {
            setNotificationsOpener(opener);
            setNotificationsOpen(true);
          }
        }}
        userMenu={userMenu}
        hideStart={hideStart}
        hideEnd={hideEnd}
        priorityPane={priorityPane}
        suppressEnd={isCreateMode}
        startHeader={startHeader}
        centerHeader={centerHeader}
        endHeader={endHeader}
        startContent={renderStartContent()}
        centerContent={renderCenterContent()}
        endContent={renderEndContent()}
        input={promptInput}
      />

      {/* AI Notice Dialog (temporarily triggered by notifications button for testing) */}
      <AINoticeDialog open={aiNoticeOpen} onClose={() => setAiNoticeOpen(false)} />

      {/* Notifications Panel */}
      <NotificationsPanel
        open={notificationsOpen}
        opener={notificationsOpener}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Title Dropdown Popover for develop section - project switcher */}
      <Popover
        open={titleDropdownOpen}
        opener={titleDropdownOpener}
        onClose={() => setTitleDropdownOpen(false)}
        placement="Bottom"
        hideArrow
      >
        <List
          items={projects}
          getItemKey={(p) => p.id}
          separators="None"
          onItemClick={({ item }) => {
            const key = (item as HTMLElement).dataset.itemKey;
            if (key) handleTitleDropdownSelect(key);
          }}
          renderItem={(project) => (
            <ListItem
              itemKey={project.id}
              text={project.name}
              selected={selectedItemId === project.id}
            />
          )}
        />
      </Popover>

      {/* Insights Popover */}
      <Popover
        open={insightsOpen}
        opener={insightsOpener}
        onClose={() => setInsightsOpen(false)}
        placement="Bottom"
        horizontalAlign="Start"
        hideArrow
        offset={16}
        headerText="AI Insights"
      >
        <List separators="None">
          {insightOptions.map(opt => (
            <ListItem
              key={opt.id}
              icon={opt.icon}
              text={opt.text}
              additionalText={opt.detail}
              onClick={() => {
                setSelectedInsight({ icon: opt.icon, text: opt.text });
                setInsightsOpen(false);
              }}
            />
          ))}
        </List>
      </Popover>

      {/* Sort Menu */}
      <Menu
        open={sortMenuOpen}
        opener={sortMenuOpener}
        onClose={() => setSortMenuOpen(false)}
      >
        <MenuItem
          icon={<ArrowDownAZ className="h-4 w-4" />}
          text="Sort A-Z"
          onClick={() => {
            setSortDirection('asc');
            setSortMenuOpen(false);
          }}
        />
        <MenuItem
          icon={<ArrowUpAZ className="h-4 w-4" />}
          text="Sort Z-A"
          onClick={() => {
            setSortDirection('desc');
            setSortMenuOpen(false);
          }}
        />
      </Menu>
    </div>
  );
}

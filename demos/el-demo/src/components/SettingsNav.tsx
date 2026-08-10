import { useMemo, useState } from 'react';
import {
  Palette,
  Globe,
  Bell,
  Lock,
  Accessibility,
  RotateCcw,
  Search,
} from 'lucide-react';
import { List, ListItemCustom, ConversationsIcon, SpacesIcon, JobsMainNavigationIcon, DiscoverIcon, CodeIcon, Dialog, Button, Label, Input } from '@sap-ui/fx-components';

// Settings section definitions
export interface SettingsSection {
  id: string;
  icon: React.ReactNode;
  title: string;
}

// Settings row definition for search
export interface SettingsRowDef {
  label: string;
  description: string;
}

// All settings rows by section (for search)
export const settingsRowsBySection: Record<string, SettingsRowDef[]> = {
  appearance: [
    { label: 'Compact Mode', description: 'Use smaller controls and spacing' },
  ],
  language: [
    { label: 'Language', description: 'Select the display language' },
    { label: 'Time Zone', description: 'Select your time zone' },
    { label: 'Date Format', description: 'Select your preferred date format' },
  ],
  notifications: [
    { label: 'Email Notifications', description: 'Receive email notifications for important events' },
    { label: 'Push Notifications', description: 'Receive browser push notifications' },
    { label: 'Sound', description: 'Play a sound when notifications arrive' },
  ],
  security: [
    { label: 'Two-Factor Authentication', description: 'Require a second verification step when signing in' },
    { label: 'Activity Logging', description: 'Keep a log of your activity for auditing' },
    { label: 'Session Timeout', description: 'Automatically sign out after inactivity' },
  ],
  accessibility: [
    { label: 'High Contrast Mode', description: 'Increase contrast for better visibility' },
    { label: 'Screen Reader Support', description: 'Optimize for assistive technologies' },
    { label: 'Reduce Motion', description: 'Minimize animations and transitions' },
  ],
  conversations: [
    { label: 'Auto-save Conversations', description: 'Automatically save conversations as you chat' },
    { label: 'Show Timestamps', description: 'Display message timestamps in conversations' },
    { label: 'Default Model', description: 'Choose the AI model for new conversations' },
  ],
  spaces: [
    { label: 'Default View', description: 'How to display spaces in the list' },
    { label: 'Show Shared Spaces', description: 'Include spaces shared with you by others' },
    { label: 'Auto-refresh Data', description: 'Automatically refresh space data periodically' },
  ],
  jobs: [
    { label: 'Job Notifications', description: 'Get notified when jobs complete or fail' },
    { label: 'Default Sort', description: 'How to sort jobs in the list' },
    { label: 'Show Completed Jobs', description: 'Include completed jobs in the list' },
  ],
  discover: [
    { label: 'Personalized Recommendations', description: 'Show content tailored to your interests' },
    { label: 'Content Categories', description: 'Types of content to show in Discover' },
    { label: 'Show Featured Content', description: 'Display curated featured items' },
  ],
  develop: [
    { label: 'Enable Dev Mode', description: 'Shows developer-only features (e.g., the dev tab)' },
    { label: 'Show Console Logs', description: 'Display debug logs in browser console' },
    { label: 'API Environment', description: 'Select the backend environment' },
  ],
};

export const settingsSections: SettingsSection[] = [
  { id: 'appearance', icon: <Palette className="h-4 w-4" />, title: 'Theme' },
  { id: 'language', icon: <Globe className="h-4 w-4" />, title: 'Language & Region' },
  { id: 'notifications', icon: <Bell className="h-4 w-4" />, title: 'Notifications' },
  { id: 'security', icon: <Lock className="h-4 w-4" />, title: 'Privacy & Security' },
  { id: 'accessibility', icon: <Accessibility className="h-4 w-4" />, title: 'Accessibility' },
  { id: 'conversations', icon: <ConversationsIcon className="h-4 w-4" />, title: 'Conversations' },
  { id: 'spaces', icon: <SpacesIcon className="h-4 w-4" />, title: 'Spaces' },
  { id: 'jobs', icon: <JobsMainNavigationIcon className="h-4 w-4" />, title: 'Jobs' },
  { id: 'discover', icon: <DiscoverIcon className="h-4 w-4" />, title: 'Discovery' },
  { id: 'develop', icon: <CodeIcon className="h-4 w-4" />, title: 'Develop' },
];

// Search result types
interface SearchResultRow {
  index: number;
  label: string;
}

interface SearchResult {
  sectionId: string;
  icon: React.ReactNode;
  title: string;
  sectionMatches: boolean;
  rows: SearchResultRow[];
}

// Highlight matched text in a string
function highlightMatch(text: string, query: string): React.ReactNode {
  const lowerText = text.toLowerCase();
  const idx = lowerText.indexOf(query.toLowerCase());
  if (idx === -1) return text;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);

  return (
    <>
      {before}
      <strong className="text-primary">{match}</strong>
      {after}
    </>
  );
}

interface SettingsNavProps {
  selectedId: string;
  onSelect: (id: string, highlightRowIndex?: number) => void;
  onResetClick: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  buildVersion?: string;
}

export function SettingsNav({ selectedId, onSelect, onResetClick, searchQuery, onSearchChange, buildVersion }: SettingsNavProps) {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // Compute search results when there's a query
  const searchResults = useMemo<SearchResult[]>(() => {
    if (!searchQuery || searchQuery.trim() === '') return [];

    const query = searchQuery.toLowerCase().trim();
    const results: SearchResult[] = [];

    settingsSections.forEach((section) => {
      const sectionTitle = section.title.toLowerCase();
      const sectionMatches = sectionTitle.includes(query);
      const matchingRows: SearchResultRow[] = [];

      // Check rows in this section - only search labels, not descriptions
      const rows = settingsRowsBySection[section.id] || [];
      rows.forEach((row, index) => {
        if (row.label.toLowerCase().includes(query)) {
          matchingRows.push({ index, label: row.label });
        }
      });

      // Include section if title matches OR has matching rows
      if (sectionMatches || matchingRows.length > 0) {
        results.push({
          sectionId: section.id,
          icon: section.icon,
          title: section.title,
          sectionMatches,
          rows: matchingRows,
        });
      }
    });

    return results;
  }, [searchQuery]);

  const isSearching = searchQuery && searchQuery.trim() !== '';

  const handleResetClick = () => {
    setResetDialogOpen(true);
  };

  const handleResetConfirm = () => {
    setResetDialogOpen(false);
    onResetClick();
  };

  const handleResetCancel = () => {
    setResetDialogOpen(false);
  };

  // Search input component
  const searchInput = (
    <div className="px-4 pr-6 pt-4 pb-6">
      <Input
        value={searchQuery || ''}
        onInput={(value) => onSearchChange?.(value)}
        placeholder="Search …"
        showClearIcon
        icon={<Search className="h-4 w-4" />}
        className="w-full"
      />
    </div>
  );

  // Reset confirmation dialog
  const resetDialog = (
    <Dialog
      open={resetDialogOpen}
      headerText="Reset Settings"
      onOpenChange={(open) => setResetDialogOpen(open)}
      footer={
        <div className="flex justify-end gap-2">
          <Button design="Tertiary" onClick={handleResetCancel}>
            Cancel
          </Button>
          <Button design="Primary" onClick={handleResetConfirm}>
            Reset
          </Button>
        </div>
      }
    >
      <Label>Are you sure you want to reset all settings to their default values?</Label>
    </Dialog>
  );

  // Render search results using List component
  if (isSearching) {
    if (searchResults.length === 0) {
      return (
        <div className="flex flex-col h-full overflow-hidden">
          {searchInput}
          <div className="flex-1 px-3">
            <div className="p-4 text-center text-muted-foreground text-sm">
              No results found
            </div>
          </div>
          {resetDialog}
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full overflow-hidden">
        {searchInput}
        <div className="flex-1 px-2">
          <List
            separators="None"
            className="bg-transparent"
            onItemClick={({ item }) => {
              const el = item as HTMLElement;
              const key = el.dataset.itemKey || '';
              // Parse the key: "section:sectionId" or "row:sectionId:rowIndex"
              const parts = key.split(':');
              if (parts[0] === 'section' && parts[1]) {
                onSelect(parts[1]);
              } else if (parts[0] === 'row' && parts[1] && parts[2]) {
                onSelect(parts[1], parseInt(parts[2], 10));
              }
            }}
          >
            {searchResults.flatMap((result) => [
              // Section header item
              <ListItemCustom
                key={`section:${result.sectionId}`}
                itemKey={`section:${result.sectionId}`}
                className="hover:bg-accent/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">{result.icon}</span>
                  <span className="font-medium">
                    {highlightMatch(result.title, searchQuery!)}
                  </span>
                </div>
              </ListItemCustom>,
              // Matching rows as sub-items
              ...result.rows.map((row) => (
                <ListItemCustom
                  key={`row:${result.sectionId}:${row.index}`}
                  itemKey={`row:${result.sectionId}:${row.index}`}
                  className="hover:bg-accent/50"
                >
                  <div className="pl-7 text-muted-foreground text-[0.8125rem]">
                    {highlightMatch(row.label, searchQuery!)}
                  </div>
                </ListItemCustom>
              )),
            ])}
          </List>
        </div>
        {resetDialog}
      </div>
    );
  }

  // Normal navigation (no search) using plain divs to avoid List selected-state overrides
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {searchInput}
      {/* Main navigation list - scrollable */}
      <div className="flex-1 overflow-y-auto px-4 pr-6 pt-4 min-h-0">
        <div className="flex flex-col">
          {settingsSections.map((section) => {
            const isSelected = selectedId === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSelect(section.id)}
                className={`flex items-center gap-4 h-12 px-4 text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isSelected
                    ? 'bg-sapphire-brand-selected-background rounded-lg font-semibold text-primary'
                    : 'bg-transparent hover:bg-accent/50 rounded-full text-foreground'
                }`}
              >
                <span className={isSelected ? 'text-primary' : 'text-muted-foreground'}>{section.icon}</span>
                <span className="flex-1 text-left truncate">{section.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset button pinned at bottom */}
      <div className="px-4 pr-6 pb-5">
        <button
          type="button"
          onClick={handleResetClick}
          className="flex items-center gap-4 h-12 px-4 text-sm cursor-pointer bg-transparent hover:bg-accent/50 rounded-full w-full text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Reset Settings</span>
        </button>
      </div>

      {resetDialog}
    </div>
  );
}

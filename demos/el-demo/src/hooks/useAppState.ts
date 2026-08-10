import { useState, useCallback, useMemo } from 'react';
import type { NavSection, LayoutState, SectionLayoutState } from '@/types';

type PriorityPane = 'Start' | 'Center' | 'End';

// Job drilldown state type - supports multi-level drilldown
export interface JobDrilldown {
  // Level 1: drilldown from job to something (e.g., a run or section)
  level1?: {
    id: string;
    title: string;
    type: 'run' | 'section';
  };
  // Level 2: drilldown from level 1 to something deeper
  level2?: {
    id: string;
    title: string;
    type: string;
  };
}

// Space drilldown state type - supports multi-level drilldown
export interface SpaceDrilldown {
  // Level 1: drilldown from space to something (e.g., a widget or section)
  level1?: {
    id: string;
    title: string;
    type: 'widget' | 'section';
  };
  // Level 2: drilldown from level 1 to something deeper
  level2?: {
    id: string;
    title: string;
    type: string;
  };
}

// Settings state type
export interface SettingsState {
  selectedSectionId: string;
  searchQuery: string;
  highlightRowIndex?: number;
}

const initialLayoutState: LayoutState = {
  conversations: { visited: false, layout: 'center', selectedItemId: null },
  discover: { visited: false, layout: 'center', selectedItemId: null },
  spaces: { visited: false, layout: 'left+center', selectedItemId: null },
  jobs: { visited: false, layout: 'left+center', selectedItemId: null },
  develop: { visited: false, layout: 'left+center', selectedItemId: null },
};

export function useAppState() {
  const [currentSection, setCurrentSection] = useState<NavSection>('conversations');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isHomePage, setIsHomePage] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutState, setLayoutState] = useState<LayoutState>(initialLayoutState);
  const [endPaneContent, setEndPaneContent] = useState<{ type: 'chat' | 'sources' | null; itemId?: string; initialMessage?: string; sourceCount?: number }>({ type: null });

  // Layout properties (matching reference implementation)
  const [hideStart, setHideStart] = useState(true);
  const [hideEnd, setHideEnd] = useState(true);
  const [priorityPane, setPriorityPane] = useState<PriorityPane>('Center');

  // Track if left pane has ever been shown (after initial load, preserve layout across sections)
  const [hasShownStartPane, setHasShownStartPane] = useState(false);

  // Job drilldown state - for drilling into job sections
  const [jobDrilldown, setJobDrilldown] = useState<JobDrilldown | null>(null);

  // Space drilldown state - for drilling into space widgets
  const [spaceDrilldown, setSpaceDrilldown] = useState<SpaceDrilldown | null>(null);

  // Settings state
  const [settingsState, setSettingsState] = useState<SettingsState>({
    selectedSectionId: 'appearance',
    searchQuery: '',
    highlightRowIndex: undefined,
  });

  // Track the previous section before entering settings (to restore when leaving)
  const [previousSection, setPreviousSection] = useState<NavSection>('conversations');

  const currentLayoutState = useMemo<SectionLayoutState>(
    () => layoutState[currentSection as keyof LayoutState] || initialLayoutState.conversations,
    [layoutState, currentSection]
  );

  const switchSection = useCallback((section: NavSection) => {
    // Save current layout state including visibility
    setLayoutState((prev) => ({
      ...prev,
      [currentSection]: {
        ...prev[currentSection as keyof LayoutState],
        visited: true,
        selectedItemId,
        hideStart,
        hideEnd,
      },
    }));

    setCurrentSection(section);

    // Restore previous state for new section or use defaults
    const sectionState = layoutState[section as keyof LayoutState];
    if (sectionState?.visited) {
      setSelectedItemId(sectionState.selectedItemId);
      setIsHomePage(false);
      // Once start pane has been shown, preserve it across all sections
      if (!hasShownStartPane) {
        setHideStart(sectionState.hideStart ?? (section === 'conversations' || section === 'discover'));
      }
      // Otherwise keep current hideStart value (don't change it)
      setHideEnd(sectionState.hideEnd ?? true);
    } else {
      setSelectedItemId(null);

      // Set initial layout for each section type
      if (section === 'conversations') {
        // First time conversations: center only (home page), but only if start pane was never shown
        setIsHomePage(true);
        if (!hasShownStartPane) {
          setHideStart(true);
        }
        setHideEnd(true);
      } else if (section === 'discover') {
        // First time discover: center only, but only if start pane was never shown
        setIsHomePage(true);
        if (!hasShownStartPane) {
          setHideStart(true);
        }
        setHideEnd(true);
      } else if (section === 'spaces' || section === 'jobs' || section === 'develop') {
        // First time: left + center (create view)
        setIsHomePage(false);
        setHideStart(false);
        setHasShownStartPane(true); // Mark that start pane has been shown
        setHideEnd(true);
      } else {
        // Settings: center only
        setIsHomePage(false);
        setHideStart(true);
        setHideEnd(true);
      }
    }

    // Reset priority, search and end pane state when switching sections
    setPriorityPane('Center');
    setSearchVisible(false);
    setSearchQuery('');
    setEndPaneContent({ type: null });
    setJobDrilldown(null); // Reset job drilldown when switching sections
    setSpaceDrilldown(null); // Reset space drilldown when switching sections
  }, [currentSection, selectedItemId, layoutState, hideStart, hideEnd, hasShownStartPane]);

  // Select an item from the list - focus center pane
  const selectItem = useCallback((itemId: string | null) => {
    setSelectedItemId(itemId);
    setIsHomePage(false);

    // When selecting from list, always set priority to Center so center pane is shown
    // This matches the reference: layout.priorityPane = 'Center' on list selection
    if (currentSection === 'conversations') {
      if (hideStart) {
        // Show list when selecting from conversations
        setHideStart(false);
      }
    }
    // Always focus center when selecting an item
    setPriorityPane('Center');
  }, [currentSection, hideStart]);

  const goHome = useCallback(() => {
    setSelectedItemId(null);
    setIsHomePage(true);
    // Going home in conversations: hide start, show only center
    if (currentSection === 'conversations') {
      setHideStart(true);
      setHideEnd(true);
    }
    setPriorityPane('Center');
  }, [currentSection]);

  // Create new conversation from home page prompt
  const createConversation = useCallback((firstConversationId: string) => {
    // Exit home page mode
    setIsHomePage(false);
    // Show start pane with list
    setHideStart(false);
    setHasShownStartPane(true); // Mark that start pane has been shown
    setHideEnd(true);
    // Select the conversation
    setSelectedItemId(firstConversationId);
    setPriorityPane('Center');
  }, []);

  const toggleSearch = useCallback(() => {
    setSearchVisible((prev) => !prev);
    if (searchVisible) {
      setSearchQuery('');
    }
  }, [searchVisible]);

  // Open end pane with content - set priority to End if space is constrained
  const openEndPane = useCallback((type: 'chat' | 'sources', itemId?: string, initialMessage?: string, sourceCount?: number) => {
    setEndPaneContent({ type, itemId, initialMessage, sourceCount });
    setHideEnd(false);
    // Set End priority so the end pane shows even when space is constrained
    setPriorityPane('End');
  }, []);

  const closeEndPane = useCallback(() => {
    setEndPaneContent({ type: null });
    setHideEnd(true);
    setPriorityPane('Center');
  }, []);

  // Handle layout changes from FxLayout (toggle buttons, auto-reset)
  const handleLayoutChange = useCallback((change: { priorityPane?: PriorityPane; hideStart?: boolean; hideEnd?: boolean }) => {
    if (change.priorityPane !== undefined) {
      setPriorityPane(change.priorityPane);
    }
    if (change.hideStart !== undefined) {
      setHideStart(change.hideStart);
      // Mark that start pane has been shown (user manually toggled it on)
      if (!change.hideStart) {
        setHasShownStartPane(true);
      }
    }
    if (change.hideEnd !== undefined) {
      setHideEnd(change.hideEnd);
      // Sync end pane content state
      if (change.hideEnd) {
        setEndPaneContent({ type: null });
      }
    }
  }, []);

  // Enter job drilldown level 1 (from job to run or section)
  const enterJobDrilldown = useCallback((drilldown: { id: string; title: string; type: 'run' | 'section' }) => {
    setJobDrilldown({ level1: drilldown });
  }, []);

  // Enter job drilldown level 2 (from run to deeper detail)
  const enterJobDrilldownLevel2 = useCallback((drilldown: { id: string; title: string; type: string }) => {
    setJobDrilldown(prev => prev ? { ...prev, level2: drilldown } : null);
  }, []);

  // Exit job drilldown - go back one level, or clear if at level 1
  const exitJobDrilldown = useCallback(() => {
    setJobDrilldown(prev => {
      if (!prev) return null;
      if (prev.level2) {
        // At level 2, go back to level 1
        return { level1: prev.level1 };
      }
      // At level 1, exit drilldown entirely
      return null;
    });
  }, []);

  // Enter space drilldown level 1 (from space to widget or section)
  const enterSpaceDrilldown = useCallback((drilldown: { id: string; title: string; type: 'widget' | 'section' }) => {
    setSpaceDrilldown({ level1: drilldown });
  }, []);

  // Enter space drilldown level 2 (from widget to deeper detail)
  const enterSpaceDrilldownLevel2 = useCallback((drilldown: { id: string; title: string; type: string }) => {
    setSpaceDrilldown(prev => prev ? { ...prev, level2: drilldown } : null);
  }, []);

  // Exit space drilldown - go back one level, or clear if at level 1
  const exitSpaceDrilldown = useCallback(() => {
    setSpaceDrilldown(prev => {
      if (!prev) return null;
      if (prev.level2) {
        // At level 2, go back to level 1
        return { level1: prev.level1 };
      }
      // At level 1, exit drilldown entirely
      return null;
    });
  }, []);

  // Go to create screen for a section (triggered by + buttons, nav item click when no selection)
  const goToCreate = useCallback((section?: NavSection) => {
    const targetSection = section || currentSection;

    // If switching to a different section, update current section first
    if (section && section !== currentSection) {
      // Save current layout state
      setLayoutState((prev) => ({
        ...prev,
        [currentSection]: {
          ...prev[currentSection as keyof LayoutState],
          visited: true,
          selectedItemId,
          hideStart,
          hideEnd,
        },
      }));
      setCurrentSection(targetSection);
    }

    // Clear selection and reset to create screen
    setSelectedItemId(null);
    setJobDrilldown(null);
    setSpaceDrilldown(null);
    setSearchVisible(false);
    setSearchQuery('');
    setEndPaneContent({ type: null });

    if (targetSection === 'conversations') {
      // Conversations: show home page with centered prompt
      setIsHomePage(true);
      // Only hide start if it has never been shown
      if (!hasShownStartPane) {
        setHideStart(true);
      }
      setHideEnd(true);
    } else if (targetSection === 'discover') {
      // Discover: just show home
      setIsHomePage(true);
      // Only hide start if it has never been shown
      if (!hasShownStartPane) {
        setHideStart(true);
      }
      setHideEnd(true);
    } else {
      // Spaces/Jobs/Develop: show list + create view
      setIsHomePage(false);
      setHideStart(false);
      setHasShownStartPane(true); // Mark that start pane has been shown
      setHideEnd(true);
    }

    setPriorityPane('Center');
  }, [currentSection, selectedItemId, hideStart, hideEnd, hasShownStartPane]);

  // Enter settings mode
  const enterSettings = useCallback(() => {
    // Save current section to restore later
    if (currentSection !== 'settings') {
      setPreviousSection(currentSection);
    }

    // Reset settings state
    setSettingsState({
      selectedSectionId: 'appearance',
      searchQuery: '',
      highlightRowIndex: undefined,
    });

    setCurrentSection('settings');
    setIsHomePage(false);
    setSelectedItemId(null);
    setHideStart(false); // Show settings nav in start pane
    setHasShownStartPane(true); // Mark that start pane has been shown
    setHideEnd(true);
    setPriorityPane('Center');
    setSearchVisible(false);
    setSearchQuery('');
    setEndPaneContent({ type: null });
    setJobDrilldown(null);
    setSpaceDrilldown(null);
  }, [currentSection]);

  // Exit settings mode - return to previous section
  const exitSettings = useCallback(() => {
    switchSection(previousSection);
  }, [previousSection, switchSection]);

  // Select a settings section - also set priority to Center for small screen navigation
  const selectSettingsSection = useCallback((sectionId: string, highlightRowIndex?: number) => {
    setSettingsState(prev => ({
      ...prev,
      selectedSectionId: sectionId,
      highlightRowIndex,
    }));
    setPriorityPane('Center');
  }, []);

  // Update settings search query - also clear highlight when search changes
  const setSettingsSearchQuery = useCallback((query: string) => {
    setSettingsState(prev => ({
      ...prev,
      searchQuery: query,
      highlightRowIndex: undefined,
    }));
  }, []);

  // Clear settings highlight
  const clearSettingsHighlight = useCallback(() => {
    setSettingsState(prev => ({
      ...prev,
      highlightRowIndex: undefined,
    }));
  }, []);

  return {
    // State
    currentSection,
    selectedItemId,
    isHomePage,
    searchVisible,
    searchQuery,
    currentLayoutState,
    endPaneContent,
    hideStart,
    hideEnd,
    priorityPane,
    jobDrilldown,
    spaceDrilldown,
    settingsState,

    // Actions
    switchSection,
    selectItem,
    goHome,
    createConversation,
    toggleSearch,
    setSearchQuery,
    setEndPaneContent, // For toggle-initiated visibility changes (don't override priority)
    openEndPane,
    closeEndPane,
    handleLayoutChange,
    enterJobDrilldown,
    enterJobDrilldownLevel2,
    exitJobDrilldown,
    enterSpaceDrilldown,
    enterSpaceDrilldownLevel2,
    exitSpaceDrilldown,
    goToCreate,
    enterSettings,
    exitSettings,
    selectSettingsSection,
    setSettingsSearchQuery,
    clearSettingsHighlight,
  };
}

export type AppStateReturn = ReturnType<typeof useAppState>;

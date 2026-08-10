// =============================================================================
// Core Types
// =============================================================================

export type NavSection = 'conversations' | 'discover' | 'spaces' | 'jobs' | 'develop' | 'settings';

export interface AppState {
  currentSection: NavSection;
  selectedItemId: string | null;
  isHomePage: boolean;
  searchVisible: boolean;
  searchQuery: string;
}

// =============================================================================
// Conversation Types
// =============================================================================

export interface ConversationCard {
  title: string;
  subtitle: string;
  icon: string;
  items: string[];
}

export interface ConversationContent {
  title: string;
  description: string;
  cards: ConversationCard[];
}

export interface Conversation {
  id: string;
  name: string;
  timestamp: string;
  content: ConversationContent;
  pinned?: boolean;
  expired?: boolean;
  hasSettings?: boolean;
}

// =============================================================================
// Discover Types
// =============================================================================

export interface DiscoverTask {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconType: 'warning' | 'info' | 'neutral' | 'error' | 'success';
  time: string;
}

export interface DiscoverCollaborator {
  id: string;
  name: string;
  avatar?: string;
  initials?: string;
  icon?: string;
  activity: string;
  time: string;
}

export interface DiscoverAgent {
  id: string;
  name: string;
  status: string;
  progress: number;
}

export interface DiscoverTraining {
  label: string;
  title: string;
  duration: string;
  type: string;
}

export interface DiscoverContinueWork {
  id: string;
  title: string;
  icon: string;
  subtitle: string;
}

export interface DiscoverKPI {
  id: string;
  title: string;
  value: string;
  unit: string;
  trend: 'up' | 'down';
  trendValue: string;
  good: boolean;
}

export interface DiscoverTrip {
  id: string;
  title: string;
  route: string;
  dates: string;
  status: string;
  statusType: 'info' | 'success' | 'warning' | 'error';
  image: string;
}

export interface DiscoverAlert {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'warning' | 'info' | 'error';
}

export interface DiscoverExpense {
  id: string;
  title: string;
  date: string;
  location: string;
  amount: string;
  hasReceipt?: boolean;
}

export interface DiscoverLeave {
  rollover: number;
  accrual: number;
  total: number;
  personal: number;
}

export interface DiscoverEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  location: string;
}

export interface DiscoverForecast {
  title: string;
  subtitle: string;
  detail: string;
  change: string;
  changeNote: string;
}

export interface DiscoverCareer {
  title: string;
  description: string;
  image: string;
}

export interface DiscoverData {
  greeting: string;
  tasks: DiscoverTask[];
  collaborators: DiscoverCollaborator[];
  agents: DiscoverAgent[];
  training: DiscoverTraining;
  continueWork: DiscoverContinueWork[];
  kpis: DiscoverKPI[];
  trips: DiscoverTrip[];
  alerts: DiscoverAlert[];
  expenses: DiscoverExpense[];
  leave: DiscoverLeave;
  events: DiscoverEvent[];
  forecast: DiscoverForecast;
  career: DiscoverCareer;
}

// =============================================================================
// Space Types
// =============================================================================

export interface SpaceWidget {
  id: string;
  name: string;
  type: 'chart' | 'table' | 'kpi' | 'list';
  status: 'active' | 'loading' | 'error' | 'paused';
  lastUpdated: string;
  description?: string;
}

export interface Space {
  id: string;
  name: string;
  icon: string;
  timestamp: string;
  desc: string;
  uiType: string;
  badge?: string;
  badgeType?: 'info' | 'warning' | 'error' | 'success';
  statusDot?: 'success' | 'warning' | 'error' | 'info';
  rightIcon?: string;
  widgets?: SpaceWidget[];
}

// =============================================================================
// Job Types
// =============================================================================

export type JobStatus = 'ongoing' | 'input' | 'completed' | 'paused' | 'error';

export interface JobCollaborator {
  initials: string;
  isAgent?: boolean;
}

export interface JobCard {
  title: string;
  subtitle: string;
  icon: string;
  items: string[];
}

export interface JobContent {
  title: string;
  description: string;
  cards: JobCard[];
}

export interface JobRun {
  id: string;
  name: string;
  status: JobStatus;
  startedAt: string;
  duration: string;
  output?: string;
}

export interface Job {
  id: string;
  name: string;
  task: string;
  status: JobStatus;
  statusLabel: string;
  progress: number;
  timeRemaining: string;
  collaborators: JobCollaborator[];
  agentIcon: string;
  hasViewUI: boolean;
  content: JobContent;
  runs?: JobRun[];
}

// =============================================================================
// Develop Types
// =============================================================================

export type ProjectStatus = 'deployed' | 'building' | 'testing' | 'error';

export interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  framework: string;
  lastModified: string;
  branch: string;
  status: ProjectStatus;
  icon: string;
}

// =============================================================================
// Relations Types
// =============================================================================

export type RelationType = 'conversation' | 'space' | 'job';

export interface Relation {
  type: RelationType;
  id: string;
  name: string;
}

export interface RelationMapEntry {
  type: RelationType;
  id: string;
}

// =============================================================================
// Layout State Types
// =============================================================================

export type LayoutMode = 'center' | 'left+center' | 'all' | 'center+right';

export interface SectionLayoutState {
  visited: boolean;
  layout: LayoutMode;
  selectedItemId: string | null;
  hideStart?: boolean;
  hideEnd?: boolean;
}

export interface LayoutState {
  conversations: SectionLayoutState;
  discover: SectionLayoutState;
  spaces: SectionLayoutState;
  jobs: SectionLayoutState;
  develop: SectionLayoutState;
}

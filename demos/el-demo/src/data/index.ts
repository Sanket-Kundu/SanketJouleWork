import type {
  Conversation,
  DiscoverData,
  Space,
  Job,
  Project,
  RelationMapEntry,
} from '@/types';

// =============================================================================
// Conversations Data
// =============================================================================

export const conversations: Conversation[] = [
  {
    id: 'conv1',
    name: 'Analyze Q4 sales performance across all regions',
    timestamp: '2 hours ago',
    content: {
      title: 'Q4 Sales Performance Analysis',
      description: 'AI-assisted analysis of Q4 2025 sales data across all regions.',
      cards: [
        { title: 'Key Insights', subtitle: '3 findings', icon: 'lightbulb', items: ['Revenue up 23% YoY', 'DACH region top performer', 'New product line exceeded targets'] },
        { title: 'Action Items', subtitle: '2 pending', icon: 'task', items: ['Review pricing strategy', 'Schedule team meeting'] },
        { title: 'Related Data', subtitle: 'Quick access', icon: 'database', items: ['Q4 Sales Report', 'Regional Breakdown', 'Product Mix Analysis'] },
      ],
    },
  },
  {
    id: 'conv2',
    name: 'What does our customer feedback tell us about product satisfaction?',
    timestamp: '5 hours ago',
    content: {
      title: 'Customer Feedback Review',
      description: 'Analysis of customer satisfaction surveys from January 2026.',
      cards: [
        { title: 'Satisfaction Score', subtitle: 'Overall rating', icon: 'favorite', items: ['NPS: 72 (+5 from last quarter)', '94% would recommend', 'Support rated 4.8/5'] },
        { title: 'Top Requests', subtitle: 'Feature requests', icon: 'request', items: ['Mobile app improvements', 'Faster report generation', 'More integrations'] },
      ],
    },
  },
  {
    id: 'conv3',
    name: 'Help me plan the 2026 budget allocations',
    timestamp: 'Yesterday',
    content: {
      title: 'Budget Planning 2026',
      description: 'Draft budget allocations for fiscal year 2026.',
      cards: [
        { title: 'Proposed Budget', subtitle: 'By department', icon: 'wallet', items: ['Engineering: €2.4M (+15%)', 'Sales: €1.8M (+10%)', 'Marketing: €900K (+5%)'] },
      ],
    },
  },
  {
    id: 'conv4',
    name: 'Plan our Q2 product roadmap priorities and feature releases',
    timestamp: 'Yesterday',
    content: {
      title: 'Product Roadmap Discussion',
      description: 'Strategic planning for Q2 2026 product releases.',
      cards: [
        { title: 'Planned Features', subtitle: '5 items', icon: 'list', items: ['Enhanced analytics dashboard', 'Mobile app redesign', 'API v2 launch'] },
      ],
    },
  },
  {
    id: 'conv5',
    name: 'Review team performance for last quarter',
    timestamp: 'Mar 20',
    content: {
      title: 'Team Performance Review',
      description: 'Analysis of team performance metrics for Q4 2025.',
      cards: [
        { title: 'Highlights', subtitle: 'Key achievements', icon: 'competitor', items: ['Sprint velocity up 15%', 'Customer tickets down 20%', 'NPS improved to 4.6'] },
      ],
    },
  },
  {
    id: 'conv6',
    name: 'Summarize recent market research findings',
    timestamp: 'Mar 18',
    content: {
      title: 'Market Research Summary',
      description: 'Comprehensive market analysis and competitive landscape.',
      cards: [
        { title: 'Market Trends', subtitle: '4 insights', icon: 'trend-up', items: ['AI adoption accelerating', 'Cloud-first strategies dominant', 'Sustainability focus growing'] },
      ],
    },
  },
  {
    id: 'conv7',
    name: 'Compare shipping costs across carriers',
    timestamp: 'Mar 15',
    content: {
      title: 'Shipping Cost Comparison',
      description: 'Analysis of shipping rates and delivery times.',
      cards: [
        { title: 'Carriers', subtitle: '3 compared', icon: 'shipping-status', items: ['DHL: €12.50 avg', 'FedEx: €14.20 avg', 'UPS: €13.80 avg'] },
      ],
    },
  },
  {
    id: 'conv8',
    name: 'Draft email to Hamburg Tech about renewal',
    timestamp: 'Mar 10',
    content: {
      title: 'Hamburg Tech Renewal Email',
      description: 'Draft communication for contract renewal discussion.',
      cards: [
        { title: 'Key Points', subtitle: 'To include', icon: 'email', items: ['15% volume discount', 'Extended support hours', 'New product access'] },
      ],
    },
  },
  {
    id: 'conv9',
    name: 'What are the best practices for cloud migration?',
    timestamp: 'Mar 8',
    content: {
      title: 'Cloud Migration Best Practices',
      description: 'Discussion on cloud migration strategies and considerations.',
      cards: [
        { title: 'Key Areas', subtitle: '4 topics', icon: 'cloud', items: ['Assessment phase', 'Security planning', 'Data migration', 'Testing strategy'] },
      ],
    },
  },
  {
    id: 'conv10',
    name: 'Prepare presentation for board meeting',
    timestamp: 'Mar 7',
    content: {
      title: 'Board Meeting Presentation',
      description: 'Executive summary presentation for Q1 board meeting.',
      cards: [
        { title: 'Slides', subtitle: '12 total', icon: 'presentation', items: ['Financial overview', 'Strategic initiatives', 'Risk assessment'] },
      ],
    },
  },
  {
    id: 'conv11',
    name: 'Analyze competitor pricing strategies',
    timestamp: 'Mar 5',
    content: {
      title: 'Competitor Pricing Analysis',
      description: 'Comprehensive review of competitor pricing models.',
      cards: [
        { title: 'Competitors', subtitle: '5 analyzed', icon: 'competitor', items: ['Company A: Premium tier', 'Company B: Volume discounts', 'Company C: Subscription model'] },
      ],
    },
  },
  {
    id: 'conv12',
    name: 'Create onboarding documentation for new hires',
    timestamp: 'Mar 3',
    content: {
      title: 'Onboarding Documentation',
      description: 'New employee onboarding guides and checklists.',
      cards: [
        { title: 'Documents', subtitle: '8 created', icon: 'document', items: ['Welcome guide', 'IT setup checklist', 'Benefits overview'] },
      ],
    },
  },
  {
    id: 'conv13',
    name: 'Review security audit findings',
    timestamp: 'Mar 1',
    content: {
      title: 'Security Audit Review',
      description: 'Analysis of Q4 security audit results and action items.',
      cards: [
        { title: 'Findings', subtitle: '3 critical', icon: 'locked', items: ['Access control gaps', 'Encryption updates needed', 'Compliance improvements'] },
      ],
    },
  },
  {
    id: 'conv14',
    name: 'Plan team building event for April',
    timestamp: 'Feb 28',
    content: {
      title: 'Team Building Event Planning',
      description: 'Organizing Q2 team building activities.',
      cards: [
        { title: 'Options', subtitle: '3 venues', icon: 'group', items: ['Escape room experience', 'Cooking class', 'Outdoor adventure'] },
      ],
    },
  },
  {
    id: 'conv15',
    name: 'Optimize database query performance',
    timestamp: 'Feb 25',
    content: {
      title: 'Database Optimization',
      description: 'Performance tuning for slow database queries.',
      cards: [
        { title: 'Improvements', subtitle: 'Before/After', icon: 'database', items: ['Query time: 5s → 0.3s', 'Index optimization', 'Cache implementation'] },
      ],
    },
  },
  {
    id: 'conv16',
    name: 'Design new customer loyalty program',
    timestamp: 'Feb 22',
    content: {
      title: 'Loyalty Program Design',
      description: 'New tiered loyalty program structure and benefits.',
      cards: [
        { title: 'Tiers', subtitle: '4 levels', icon: 'favorite', items: ['Bronze: 5% discount', 'Silver: 10% + free shipping', 'Gold: 15% + priority support'] },
      ],
    },
  },
  {
    id: 'conv17',
    name: 'Evaluate new CRM platform options',
    timestamp: 'Feb 20',
    content: {
      title: 'CRM Platform Evaluation',
      description: 'Comparison of CRM solutions for potential migration.',
      cards: [
        { title: 'Platforms', subtitle: '4 evaluated', icon: 'crm-sales', items: ['Salesforce', 'SAP Sales Cloud', 'Microsoft Dynamics', 'HubSpot'] },
      ],
    },
  },
  {
    id: 'conv18',
    name: 'Write technical specifications for API v2',
    timestamp: 'Feb 18',
    content: {
      title: 'API v2 Technical Specs',
      description: 'Detailed technical specifications for new API version.',
      cards: [
        { title: 'Endpoints', subtitle: '15 new', icon: 'developer-settings', items: ['Authentication overhaul', 'Rate limiting', 'Webhook support'] },
      ],
    },
  },
  {
    id: 'conv19',
    name: 'Forecast hiring needs for next quarter',
    timestamp: 'Feb 15',
    content: {
      title: 'Q2 Hiring Forecast',
      description: 'Projected hiring needs based on growth plans.',
      cards: [
        { title: 'Positions', subtitle: '8 open', icon: 'add-employee', items: ['3 Engineers', '2 Sales reps', '2 Support specialists', '1 PM'] },
      ],
    },
  },
  {
    id: 'conv20',
    name: 'Summarize key takeaways from industry conference',
    timestamp: 'Feb 12',
    content: {
      title: 'Conference Summary',
      description: 'Key insights from Tech Summit 2026 conference.',
      cards: [
        { title: 'Takeaways', subtitle: '5 key points', icon: 'education', items: ['AI integration trends', 'Sustainability focus', 'Remote work evolution'] },
      ],
    },
  },
];

// =============================================================================
// Discover Data
// =============================================================================

export const discoverData: DiscoverData = {
  greeting: "Hey Maria, let's kick off today!",
  tasks: [
    { id: 'task1', title: 'Review Q4 Budget Proposal', subtitle: 'Finance Team', icon: 'warning', iconType: 'warning', time: '2h overdue' },
    { id: 'task2', title: 'Approve Travel Request', subtitle: 'John Smith', icon: 'document', iconType: 'info', time: 'Due today' },
    { id: 'task3', title: 'Complete Compliance Training', subtitle: 'HR Required', icon: 'education', iconType: 'warning', time: 'Due tomorrow' },
    { id: 'task4', title: 'Submit Timesheet', subtitle: 'Week 8', icon: 'time-entry-request', iconType: 'neutral', time: 'Due Friday' },
  ],
  collaborators: [
    { id: 'collab1', name: 'Thomas Müller', initials: 'TM', activity: 'Shared "Q1 Forecast" with you', time: '10m ago' },
    { id: 'collab2', name: 'Sarah Chen', initials: 'SC', activity: 'Commented on your report', time: '1h ago' },
    { id: 'collab3', name: 'James Wilson', initials: 'JW', activity: 'Requested your review', time: '3h ago' },
    { id: 'collab4', name: 'Analytics Bot', icon: 'bot', activity: 'Generated weekly insights', time: 'Today' },
  ],
  agents: [
    { id: 'agent1', name: 'Data Sync Agent', status: 'Syncing customer records...', progress: 67 },
    { id: 'agent2', name: 'Report Generator', status: 'Creating monthly summary', progress: 45 },
    { id: 'agent3', name: 'Email Classifier', status: 'Processing inbox', progress: 89 },
  ],
  training: {
    label: 'Recommended Training',
    title: 'Advanced Negotiation Strategies',
    duration: '45 min',
    type: 'Interactive Course',
  },
  continueWork: [
    { id: 'cw1', title: 'Q4 Sales Analysis', icon: 'business-objects-experience', subtitle: 'Last edited 2h ago' },
    { id: 'cw2', title: 'Customer Segments', icon: 'customer', subtitle: 'Last edited yesterday' },
    { id: 'cw3', title: 'Pipeline Forecast', icon: 'trend-up', subtitle: 'Last edited 2 days ago' },
    { id: 'cw4', title: 'Team Performance', icon: 'group', subtitle: 'Last edited last week' },
  ],
  kpis: [
    { id: 'kpi1', title: 'Average Time to Process Invoices', value: '3.5', unit: 'mins', trend: 'down', trendValue: '-12%', good: true },
    { id: 'kpi2', title: 'Open Purchase Orders', value: '47', unit: '', trend: 'up', trendValue: '+8', good: false },
    { id: 'kpi3', title: 'Customer Satisfaction', value: '94.2', unit: '%', trend: 'up', trendValue: '+2.1%', good: true },
  ],
  trips: [
    { id: 'trip1', title: 'London Trip', route: 'Seattle (SEA) - London (LHR)', dates: 'Mar 12 - Mar 16, 2026', status: 'Awaiting Approval', statusType: 'info', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=200&fit=crop' },
    { id: 'trip2', title: 'New York Trip', route: 'Seattle (SEA) - New York (JFK)', dates: 'Mar 18 - Mar 23, 2026', status: 'Confirmed', statusType: 'success', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=200&fit=crop' },
  ],
  alerts: [
    { id: 'alert1', title: 'Sales quotation is about to expire', message: 'The validity of this sales quotation ends in 20 days, and 0% of this net value has been referenced by sales orders.', time: '1 hour ago', type: 'warning' },
    { id: 'alert2', title: 'Contract renewal due soon', message: 'Customer contract #CT-2024-789 expires in 30 days. Contact Hamburg Tech GmbH to discuss renewal terms.', time: '3 hours ago', type: 'info' },
  ],
  expenses: [
    { id: 'exp1', title: 'Business Meals - Meetings', date: 'Mar 6, 2026', location: 'Cactus - Seattle, WA', amount: '$60.00' },
    { id: 'exp2', title: 'Taxi', date: 'Mar 5, 2026', location: 'Cactus - Seattle, WA', amount: '$23.45' },
    { id: 'exp3', title: 'Cellular Phone', date: 'Mar 5, 2026', location: 'Cactus - Seattle, WA', amount: '$325.23', hasReceipt: true },
    { id: 'exp4', title: 'Business Meals - Meetings', date: 'Mar 4, 2026', location: 'Tavern Hall - Bellevue, WA', amount: '$80.00' },
  ],
  leave: {
    rollover: 26,
    accrual: 6,
    total: 18,
    personal: 5,
  },
  events: [
    { id: 'ev1', date: 'Mar 10', time: '8:00 AM', title: 'Design Session', location: 'APJ/EMEA' },
    { id: 'ev2', date: 'Mar 11', time: '12:00 PM', title: 'Working with ADHD', location: 'APJ/EMEA' },
    { id: 'ev3', date: 'Mar 12', time: '2:00 PM', title: 'Team Retrospective', location: 'APJ/EMEA' },
  ],
  forecast: {
    title: 'Q4 Forecast',
    subtitle: 'Controlling Team just updated the Q4 forecast',
    detail: '4 new comments in "Operating Costs"',
    change: '+3.8%',
    changeNote: '+3.8% vs previous estimate',
  },
  career: {
    title: 'Performance Management & Career Development',
    description: 'SAP is transforming not just in technology, but in how we operate, serve customers, and deliver value.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop',
  },
};

// =============================================================================
// Spaces Data
// =============================================================================

export const spaces: Space[] = [
  {
    id: 'space-wf1',
    name: 'Rajesh Kumar',
    icon: 'employee',
    timestamp: 'Updated 12 minutes ago',
    desc: 'Promotion Approval · Stalled 6 days · VP on leave · Payroll deadline 52h',
    uiType: 'workflow-approvals',
    badge: '!',
    badgeType: 'error',
    widgets: [],
  },
  {
    id: 'space-wf2',
    name: 'Mya Cooper',
    icon: 'employee',
    timestamp: 'Updated 2 hours ago',
    desc: 'Promotion Approval · Stalled 5 days · VP Sales OOO · Counter-offer risk',
    uiType: 'workflow-approvals',
    widgets: [],
  },
  {
    id: 'space-wf3',
    name: 'Ahmed Rashid',
    icon: 'employee',
    timestamp: 'Updated 45 minutes ago',
    desc: 'Offer Letter · Pending 4 days · Candidate deadline tomorrow',
    uiType: 'workflow-approvals',
    widgets: [],
  },
  {
    id: 'space-wf4',
    name: 'Kenji Tanaka',
    icon: 'employee',
    timestamp: 'Updated 1 hour ago',
    desc: 'Transfer · Dual VP sign-off · One unresponsive · Monday start',
    uiType: 'workflow-approvals',
    widgets: [],
  },
  {
    id: 'space-wf5',
    name: 'David Park',
    icon: 'employee',
    timestamp: 'Updated 3 hours ago',
    desc: 'Comp Change · Stalled 4 days · Committee queue · Retention risk',
    uiType: 'workflow-approvals',
    widgets: [],
  },
  {
    id: 'space1',
    name: 'My Insights',
    icon: 'business-objects-experience',
    timestamp: 'Updated 2h ago',
    desc: '3 new recommendations available',
    uiType: 'insights',
    badge: '3',
    badgeType: 'info',
    rightIcon: 'ai',
    widgets: [
      { id: 'w1-1', name: 'Revenue Trend', type: 'chart', status: 'active', lastUpdated: '2 hours ago', description: 'Monthly revenue analysis' },
      { id: 'w1-2', name: 'Top Products', type: 'table', status: 'active', lastUpdated: '2 hours ago', description: 'Best selling products this quarter' },
      { id: 'w1-3', name: 'Growth KPI', type: 'kpi', status: 'active', lastUpdated: '1 hour ago', description: 'Year-over-year growth metrics' },
    ],
  },
  {
    id: 'space2',
    name: 'Team Performance',
    icon: 'group',
    timestamp: 'Live',
    desc: 'Sprint 12 · 94% complete',
    uiType: 'team',
    statusDot: 'success',
    rightIcon: 'activity-2',
    widgets: [
      { id: 'w2-1', name: 'Sprint Burndown', type: 'chart', status: 'active', lastUpdated: 'Live', description: 'Current sprint progress' },
      { id: 'w2-2', name: 'Team Velocity', type: 'kpi', status: 'active', lastUpdated: '1 hour ago', description: 'Average story points per sprint' },
      { id: 'w2-3', name: 'Open Issues', type: 'list', status: 'loading', lastUpdated: 'Refreshing...', description: 'Unresolved blockers' },
    ],
  },
  {
    id: 'space3',
    name: 'Sales Pipeline',
    icon: 'sales-order-item',
    timestamp: 'Action needed',
    desc: '€1.2M pipeline · 3 deals closing soon',
    uiType: 'pipeline',
    badge: '3',
    badgeType: 'warning',
    rightIcon: 'warning',
    widgets: [
      { id: 'w3-1', name: 'Pipeline Funnel', type: 'chart', status: 'active', lastUpdated: '30 min ago', description: 'Deal stages overview' },
      { id: 'w3-2', name: 'Closing This Month', type: 'table', status: 'active', lastUpdated: '30 min ago', description: 'Deals expected to close' },
      { id: 'w3-3', name: 'Win Rate', type: 'kpi', status: 'active', lastUpdated: '1 hour ago', description: 'Conversion rate by stage' },
      { id: 'w3-4', name: 'At-Risk Deals', type: 'list', status: 'error', lastUpdated: 'Data sync failed', description: 'Deals needing attention' },
    ],
  },
  {
    id: 'space4',
    name: 'Customer Health',
    icon: 'customer',
    timestamp: 'Updated today',
    desc: '2 at-risk accounts need attention',
    uiType: 'customer',
    badge: '2',
    badgeType: 'error',
    rightIcon: 'alert',
    widgets: [
      { id: 'w4-1', name: 'Health Scores', type: 'chart', status: 'active', lastUpdated: 'Today', description: 'Customer satisfaction trends' },
      { id: 'w4-2', name: 'At-Risk Accounts', type: 'table', status: 'active', lastUpdated: 'Today', description: 'Accounts below threshold' },
    ],
  },
  {
    id: 'space5',
    name: 'Regional Dashboard',
    icon: 'world',
    timestamp: 'Q1 2026',
    desc: 'EMEA +18% YoY · All regions on track',
    uiType: 'regional',
    statusDot: 'success',
    widgets: [
      { id: 'w5-1', name: 'Regional Performance', type: 'chart', status: 'active', lastUpdated: 'Q1 2026', description: 'Revenue by region' },
      { id: 'w5-2', name: 'YoY Comparison', type: 'kpi', status: 'active', lastUpdated: 'Q1 2026', description: 'Growth vs last year' },
      { id: 'w5-3', name: 'Top Markets', type: 'table', status: 'active', lastUpdated: 'Q1 2026', description: 'Best performing regions' },
    ],
  },
  {
    id: 'space6',
    name: 'Inventory Control',
    icon: 'inventory',
    timestamp: 'Auto-synced',
    desc: '5 items below reorder threshold',
    uiType: 'inventory',
    badge: '5',
    badgeType: 'warning',
    rightIcon: 'shipping-status',
    widgets: [
      { id: 'w6-1', name: 'Stock Levels', type: 'chart', status: 'active', lastUpdated: 'Auto-synced', description: 'Current inventory status' },
      { id: 'w6-2', name: 'Low Stock Items', type: 'list', status: 'active', lastUpdated: 'Auto-synced', description: 'Items below reorder point' },
      { id: 'w6-3', name: 'Reorder Queue', type: 'table', status: 'paused', lastUpdated: 'Pending approval', description: 'Suggested purchase orders' },
    ],
  },
];

// =============================================================================
// Jobs Data
// =============================================================================

export const jobs: Job[] = [
  {
    id: 'job1',
    name: 'Q1 Financial Report Generation',
    task: 'Analyzing revenue streams and preparing executive summary...',
    status: 'ongoing',
    statusLabel: 'Ongoing',
    progress: 67,
    timeRemaining: '~12 min left',
    collaborators: [{ initials: 'MJ' }],
    agentIcon: 'bot',
    hasViewUI: true,
    content: {
      title: 'Q1 Financial Report Generation',
      description: 'AI agent generating comprehensive Q1 financial reports with trend analysis.',
      cards: [
        { title: 'Progress', subtitle: 'Current step', icon: 'process', items: ['Data collection: Complete', 'Analysis: In progress', 'Report generation: Pending'] },
      ],
    },
    runs: [
      { id: 'run1-1', name: 'Run #15 - Current', status: 'ongoing', startedAt: '10 min ago', duration: '10m' },
      { id: 'run1-2', name: 'Run #14', status: 'completed', startedAt: '2 hours ago', duration: '18m', output: 'Generated 45-page report' },
      { id: 'run1-3', name: 'Run #13', status: 'completed', startedAt: 'Yesterday', duration: '22m', output: 'Generated preliminary analysis' },
    ],
  },
  {
    id: 'job2',
    name: 'Contract Analysis - Hamburg Tech',
    task: 'Reviewing contract terms and identifying key clauses requiring attention...',
    status: 'input',
    statusLabel: 'Input Required',
    progress: 45,
    timeRemaining: 'Waiting for input',
    collaborators: [{ initials: 'TM' }, { initials: 'SC' }],
    agentIcon: 'bot',
    hasViewUI: true,
    content: {
      title: 'Contract Analysis - Hamburg Tech',
      description: 'AI-powered contract review requiring human approval on key terms.',
      cards: [
        { title: 'Pending Actions', subtitle: '2 items', icon: 'action', items: ['Review liability clause', 'Approve payment terms'] },
      ],
    },
    runs: [
      { id: 'run2-1', name: 'Run #8 - Current', status: 'input', startedAt: '1 hour ago', duration: '45m' },
      { id: 'run2-2', name: 'Run #7', status: 'completed', startedAt: 'Yesterday', duration: '32m', output: 'Analyzed 12 contract sections' },
    ],
  },
  {
    id: 'job3',
    name: 'Customer Churn Prediction Model',
    task: 'Training model on historical data and generating risk scores...',
    status: 'ongoing',
    statusLabel: 'Ongoing',
    progress: 89,
    timeRemaining: '~3 min left',
    collaborators: [{ initials: 'AI', isAgent: true }],
    agentIcon: 'bot',
    hasViewUI: false,
    content: {
      title: 'Customer Churn Prediction Model',
      description: 'Machine learning model analyzing customer behavior patterns.',
      cards: [
        { title: 'Model Stats', subtitle: 'Current run', icon: 'machine', items: ['Accuracy: 94.2%', 'Records analyzed: 45,230', 'At-risk customers: 127'] },
      ],
    },
    runs: [
      { id: 'run3-1', name: 'Run #42 - Current', status: 'ongoing', startedAt: '25 min ago', duration: '25m' },
      { id: 'run3-2', name: 'Run #41', status: 'completed', startedAt: '3 hours ago', duration: '28m', output: 'Accuracy: 93.8%' },
      { id: 'run3-3', name: 'Run #40', status: 'error', startedAt: '6 hours ago', duration: '15m', output: 'Error: Out of memory' },
      { id: 'run3-4', name: 'Run #39', status: 'completed', startedAt: 'Yesterday', duration: '30m', output: 'Accuracy: 92.1%' },
    ],
  },
  {
    id: 'job4',
    name: 'Supplier Negotiation Assistant',
    task: 'Completed analysis of 3 supplier proposals with recommendations',
    status: 'completed',
    statusLabel: 'Completed',
    progress: 100,
    timeRemaining: 'Done 2h ago',
    collaborators: [{ initials: 'JW' }],
    agentIcon: 'bot',
    hasViewUI: true,
    content: {
      title: 'Supplier Negotiation Assistant',
      description: 'AI-assisted supplier proposal analysis and negotiation recommendations.',
      cards: [
        { title: 'Results', subtitle: 'Summary', icon: 'compare', items: ['Best offer: Supplier A (-12% cost)', 'Savings potential: €45,600', 'Risk assessment: Low'] },
      ],
    },
    runs: [
      { id: 'run4-1', name: 'Run #5', status: 'completed', startedAt: '2 hours ago', duration: '45m', output: 'Best offer: Supplier A' },
      { id: 'run4-2', name: 'Run #4', status: 'completed', startedAt: 'Yesterday', duration: '52m', output: 'Analysis of 3 proposals' },
    ],
  },
  {
    id: 'job5',
    name: 'Market Research Deep Dive',
    task: 'Paused - waiting for additional data sources to be configured',
    status: 'paused',
    statusLabel: 'Paused',
    progress: 23,
    timeRemaining: 'Paused',
    collaborators: [{ initials: 'SC' }, { initials: 'MJ' }],
    agentIcon: 'bot',
    hasViewUI: false,
    content: {
      title: 'Market Research Deep Dive',
      description: 'Comprehensive market analysis requiring additional data sources.',
      cards: [
        { title: 'Status', subtitle: 'Blocked', icon: 'warning', items: ['Missing: Competitor API access', 'Missing: Industry reports 2025', 'Action: Contact IT for setup'] },
      ],
    },
    runs: [
      { id: 'run5-1', name: 'Run #3 - Paused', status: 'paused', startedAt: '1 day ago', duration: '2h 15m' },
      { id: 'run5-2', name: 'Run #2', status: 'error', startedAt: '3 days ago', duration: '45m', output: 'Missing API credentials' },
    ],
  },
  {
    id: 'job6',
    name: 'Invoice Processing Automation',
    task: 'Error: Unable to connect to SAP system - retrying...',
    status: 'error',
    statusLabel: 'Error',
    progress: 15,
    timeRemaining: 'Retry in 5 min',
    collaborators: [{ initials: 'AI', isAgent: true }],
    agentIcon: 'bot',
    hasViewUI: false,
    content: {
      title: 'Invoice Processing Automation',
      description: 'Automated invoice extraction and posting to SAP.',
      cards: [
        { title: 'Error Details', subtitle: 'Connection failed', icon: 'error', items: ['Error: TIMEOUT_EXCEEDED', 'Last successful: 3h ago', 'Retries: 2/5'] },
      ],
    },
    runs: [
      { id: 'run6-1', name: 'Run #28 - Error', status: 'error', startedAt: '5 min ago', duration: '3m', output: 'TIMEOUT_EXCEEDED' },
      { id: 'run6-2', name: 'Run #27', status: 'error', startedAt: '15 min ago', duration: '2m', output: 'CONNECTION_REFUSED' },
      { id: 'run6-3', name: 'Run #26', status: 'completed', startedAt: '3 hours ago', duration: '12m', output: 'Processed 47 invoices' },
    ],
  },
];

// =============================================================================
// Projects (Develop) Data
// =============================================================================

export const projects: Project[] = [
  {
    id: 'dev1',
    name: 'customer-portal',
    description: 'SAP BTP application for customer self-service portal',
    language: 'TypeScript',
    framework: 'SAPUI5',
    lastModified: '2 hours ago',
    branch: 'main',
    status: 'deployed',
    icon: 'business-objects-experience',
  },
  {
    id: 'dev2',
    name: 'inventory-service',
    description: 'CAP service for inventory management',
    language: 'JavaScript',
    framework: 'CAP',
    lastModified: '1 day ago',
    branch: 'feature/stock-alerts',
    status: 'building',
    icon: 'inventory',
  },
  {
    id: 'dev3',
    name: 'analytics-dashboard',
    description: 'Real-time analytics dashboard with SAC integration',
    language: 'TypeScript',
    framework: 'React',
    lastModified: '3 days ago',
    branch: 'main',
    status: 'deployed',
    icon: 'business-objects-experience',
  },
  {
    id: 'dev4',
    name: 'workflow-automation',
    description: 'SAP Build Process Automation workflows',
    language: 'BPMN',
    framework: 'SAP Build',
    lastModified: '1 week ago',
    branch: 'main',
    status: 'deployed',
    icon: 'process',
  },
  {
    id: 'dev5',
    name: 'mobile-approvals',
    description: 'Mobile app for purchase order approvals',
    language: 'TypeScript',
    framework: 'SAP Mobile',
    lastModified: '2 weeks ago',
    branch: 'develop',
    status: 'testing',
    icon: 'iphone',
  },
  {
    id: 'dev6',
    name: 'integration-flows',
    description: 'SAP Integration Suite iFlows for S/4HANA',
    language: 'Groovy',
    framework: 'SAP CPI',
    lastModified: '3 weeks ago',
    branch: 'main',
    status: 'deployed',
    icon: 'connected',
  },
];

// =============================================================================
// Relations Map (Bidirectional)
// =============================================================================

export const relationMap: Record<string, RelationMapEntry[]> = {
  // Space relations
  space1: [
    { type: 'job', id: 'job2' },
    { type: 'conversation', id: 'conv1' },
  ],
  space2: [
    { type: 'job', id: 'job1' },
    { type: 'job', id: 'job3' },
    { type: 'conversation', id: 'conv3' },
  ],
  space3: [
    { type: 'conversation', id: 'conv1' },
    { type: 'conversation', id: 'conv5' },
  ],
  // Job relations
  job1: [
    { type: 'space', id: 'space2' },
    { type: 'conversation', id: 'conv3' },
  ],
  job3: [
    { type: 'space', id: 'space1' },
    { type: 'space', id: 'space2' },
  ],
  job5: [
    { type: 'conversation', id: 'conv5' },
  ],
  // Conversation relations
  conv1: [
    { type: 'space', id: 'space1' },
    { type: 'space', id: 'space3' },
    { type: 'job', id: 'job2' },
  ],
  conv3: [
    { type: 'space', id: 'space2' },
    { type: 'job', id: 'job1' },
  ],
  conv5: [
    { type: 'space', id: 'space3' },
    { type: 'job', id: 'job5' },
  ],
};

// Build bidirectional relations
function buildBidirectionalRelations() {
  const additions: { targetId: string; relation: RelationMapEntry }[] = [];

  Object.entries(relationMap).forEach(([sourceId, relations]) => {
    relations.forEach((rel) => {
      const sourceType = sourceId.startsWith('space')
        ? 'space'
        : sourceId.startsWith('job')
        ? 'job'
        : 'conversation';

      if (!relationMap[rel.id]) {
        relationMap[rel.id] = [];
      }

      const reverseExists = relationMap[rel.id].some((r) => r.id === sourceId);
      if (!reverseExists) {
        additions.push({ targetId: rel.id, relation: { type: sourceType as RelationMapEntry['type'], id: sourceId } });
      }
    });
  });

  additions.forEach(({ targetId, relation }) => {
    relationMap[targetId].push(relation);
  });
}

buildBidirectionalRelations();

// =============================================================================
// Helper Functions
// =============================================================================

export function getRelationsForItem(itemId: string) {
  const relations = relationMap[itemId] || [];

  return relations.map((rel, index) => {
    const sourceData =
      rel.type === 'conversation'
        ? conversations
        : rel.type === 'space'
        ? spaces
        : jobs;
    const item = sourceData?.find((i) => i.id === rel.id);
    return {
      type: rel.type,
      id: rel.id,
      name: item?.name || rel.id,
      selected: index === relations.length - 1,
    };
  });
}

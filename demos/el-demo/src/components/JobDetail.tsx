import { Card, CardHeader, CardContent, Tag, Button, Avatar } from '@sap-ui/fx-components';
import { Bot, Play, Pause, RefreshCw, Link2, MessageSquare, Folder, Sparkles, Download, Share2, Eye, Clock, CheckCircle, AlertCircle, XCircle, PauseCircle } from 'lucide-react';
import type { Job, JobRun, Relation } from '@/types';

// Drilldown state type - matches hooks/useAppState.ts
export interface JobDrilldown {
  level1?: {
    id: string;
    title: string;
    type: 'run' | 'section';
  };
  level2?: {
    id: string;
    title: string;
    type: string;
  };
}

interface JobDetailProps {
  job: Job;
  relations: Relation[];
  drilldown?: JobDrilldown | null;
  onDrilldown?: (drilldown: { id: string; title: string; type: 'run' | 'section' }) => void;
  onDrilldownLevel2?: (drilldown: { id: string; title: string; type: string }) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  process: <RefreshCw className="h-5 w-5" />,
  action: <Play className="h-5 w-5" />,
  machine: <Bot className="h-5 w-5" />,
  compare: <Sparkles className="h-5 w-5" />,
};

// Get status icon for job runs
const getStatusIcon = (status: JobRun['status']) => {
  switch (status) {
    case 'ongoing':
      return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'error':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'paused':
      return <PauseCircle className="h-4 w-4 text-orange-500" />;
    case 'input':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

export function JobDetail({ job, relations, drilldown, onDrilldown, onDrilldownLevel2 }: JobDetailProps) {
  const getProgressColor = () => {
    switch (job.status) {
      case 'ongoing': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'paused': return 'bg-orange-500';
      case 'error': return 'bg-red-500';
      case 'input': return 'bg-yellow-500';
      default: return 'bg-muted-foreground';
    }
  };

  // Handle run click for drilldown level 1
  const handleRunClick = (run: JobRun) => {
    onDrilldown?.({ id: run.id, title: run.name, type: 'run' });
  };

  // Handle section click for drilldown level 1
  const handleSectionClick = (title: string, section: string) => {
    onDrilldown?.({ id: section, title, type: 'section' });
  };

  // Handle drilldown into level 2 from a run
  const handleLevel2Click = (title: string, type: string) => {
    onDrilldownLevel2?.({ id: `${drilldown?.level1?.id}-${type}`, title, type });
  };

  // Get the current run being viewed in level 1
  const getCurrentRun = (): JobRun | undefined => {
    if (drilldown?.level1?.type !== 'run') return undefined;
    return job.runs?.find(r => r.id === drilldown.level1?.id);
  };

  // Render level 2 drilldown view
  if (drilldown?.level2) {
    const currentRun = getCurrentRun();
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="h-5 w-5 text-muted-foreground" />
          <span className="text-lg font-semibold">{drilldown.level2.title}</span>
        </div>

        <Card>
          <CardHeader titleText="Detail View" />
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Viewing "{drilldown.level2.title}" from {currentRun?.name || drilldown.level1?.title}.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Run ID</span>
                <span className="font-mono">{drilldown.level1?.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">View Type</span>
                <span>{drilldown.level2.type}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Job</span>
                <span>{job.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader titleText="Actions" />
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button icon={<RefreshCw className="h-4 w-4" />}>Refresh</Button>
              <Button icon={<Download className="h-4 w-4" />}>Export</Button>
              <Button icon={<Share2 className="h-4 w-4" />}>Share</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render level 1 run drilldown view
  if (drilldown?.level1?.type === 'run') {
    const currentRun = getCurrentRun();
    if (!currentRun) {
      return <div className="p-6">Run not found</div>;
    }

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          {getStatusIcon(currentRun.status)}
          <span className="text-lg font-semibold">{currentRun.name}</span>
          <Tag design={currentRun.status === 'completed' ? 'Positive' : currentRun.status === 'error' ? 'Negative' : 'Information'}>
            {currentRun.status}
          </Tag>
        </div>

        <Card>
          <CardHeader titleText="Run Details" />
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Started</span>
                <span>{currentRun.startedAt}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Duration</span>
                <span>{currentRun.duration}</span>
              </div>
              {currentRun.output && (
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Output</span>
                  <span>{currentRun.output}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Clickable cards for level 2 drilldown */}
        <div
          className="cursor-pointer hover:shadow-md transition-shadow rounded-lg"
          onClick={() => handleLevel2Click('Logs', 'logs')}
        >
          <Card>
            <CardHeader titleText="Logs" additionalText="View execution logs" />
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Click to view detailed execution logs for this run.
              </p>
            </CardContent>
          </Card>
        </div>

        <div
          className="cursor-pointer hover:shadow-md transition-shadow rounded-lg"
          onClick={() => handleLevel2Click('Metrics', 'metrics')}
        >
          <Card>
            <CardHeader titleText="Metrics" additionalText="Performance data" />
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Click to view performance metrics and statistics.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader titleText="Actions" />
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {currentRun.status === 'ongoing' && (
                <Button design="Secondary" icon={<Pause className="h-4 w-4" />}>Stop Run</Button>
              )}
              {currentRun.status === 'error' && (
                <Button design="Primary" icon={<RefreshCw className="h-4 w-4" />}>Retry</Button>
              )}
              <Button icon={<Download className="h-4 w-4" />}>Export Logs</Button>
              <Button icon={<Share2 className="h-4 w-4" />}>Share</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render level 1 section drilldown view
  if (drilldown?.level1?.type === 'section') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="h-5 w-5 text-muted-foreground" />
          <span className="text-lg font-semibold">{drilldown.level1.title}</span>
        </div>

        <Card>
          <CardHeader titleText="Detailed Information" />
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This is a detailed view of "{drilldown.level1.title}" for the job "{job.name}".
            </p>
            <ul className="space-y-2 text-sm">
              <li>• Job ID: {job.id}</li>
              <li>• Status: {job.statusLabel}</li>
              <li>• Progress: {job.progress}%</li>
              <li>• Task: {job.task}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader titleText="Actions" />
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button icon={<RefreshCw className="h-4 w-4" />}>Refresh Data</Button>
              <Button icon={<Download className="h-4 w-4" />}>Export</Button>
              <Button icon={<Share2 className="h-4 w-4" />}>Share</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader titleText="Recent Activity" />
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span>Viewed {drilldown.level1.title}</span>
                <span className="text-muted-foreground ml-auto">Just now</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                <span>Data refreshed</span>
                <span className="text-muted-foreground ml-auto">5 min ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Play className="h-4 w-4 text-muted-foreground" />
                <span>Section accessed</span>
                <span className="text-muted-foreground ml-auto">1 hour ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Normal job detail view
  return (
    <div className="p-6 space-y-6">
      {/* Metrics Row - Clickable for drilldown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="p-4 rounded-lg bg-muted/50 text-center cursor-pointer hover:bg-muted transition-colors"
          onClick={() => handleSectionClick('Progress', 'job-metric-progress')}
        >
          <div className="text-2xl font-bold">{job.progress}%</div>
          <div className="text-sm text-muted-foreground">Progress</div>
        </div>
        <div
          className="p-4 rounded-lg bg-muted/50 text-center cursor-pointer hover:bg-muted transition-colors"
          onClick={() => handleSectionClick('Time Remaining', 'job-metric-time')}
        >
          <div className="text-2xl font-bold">{job.timeRemaining || '~12m'}</div>
          <div className="text-sm text-muted-foreground">Remaining</div>
        </div>
        <div
          className="p-4 rounded-lg bg-muted/50 text-center cursor-pointer hover:bg-muted transition-colors"
          onClick={() => handleSectionClick('Sections', 'job-metric-sections')}
        >
          <div className="text-2xl font-bold">3/5</div>
          <div className="text-sm text-muted-foreground">Sections</div>
        </div>
        <div
          className="p-4 rounded-lg bg-muted/50 text-center cursor-pointer hover:bg-muted transition-colors"
          onClick={() => handleSectionClick('Data Points', 'job-metric-data')}
        >
          <div className="text-2xl font-bold">142</div>
          <div className="text-sm text-muted-foreground">Data Points</div>
        </div>
      </div>

      {/* Job Runs - Clickable for drilldown level 1 */}
      {job.runs && job.runs.length > 0 && (
        <Card>
          <CardHeader titleText="Recent Runs" additionalText={`${job.runs.length} runs`} />
          <CardContent className="p-0">
            <div className="divide-y">
              {job.runs.map((run) => (
                <div
                  key={run.id}
                  className="p-3 flex items-center gap-3 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleRunClick(run)}
                >
                  {getStatusIcon(run.status)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{run.name}</p>
                    <p className="text-xs text-muted-foreground">Started {run.startedAt} · {run.duration}</p>
                  </div>
                  {run.output && (
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">{run.output}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Card - Clickable */}
      <div
        className="cursor-pointer hover:shadow-md transition-shadow rounded-lg"
        onClick={() => handleSectionClick('Job Progress', 'job-progress-section')}
      >
        <Card>
        <CardHeader
          titleText="Progress"
          additionalText={job.timeRemaining}
        />
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{job.progress}%</span>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                {job.status === 'ongoing' && (
                  <Button design="Secondary" icon={<Pause className="h-4 w-4" />}>
                    Pause
                  </Button>
                )}
                {job.status === 'paused' && (
                  <Button design="Primary" icon={<Play className="h-4 w-4" />}>
                    Resume
                  </Button>
                )}
                {job.status === 'error' && (
                  <Button design="Primary" icon={<RefreshCw className="h-4 w-4" />}>
                    Retry
                  </Button>
                )}
              </div>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getProgressColor()}`}
                style={{ width: `${job.progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Details Cards - Clickable */}
      {job.content.cards.map((card, index) => (
        <div
          key={index}
          className="cursor-pointer hover:shadow-md transition-shadow rounded-lg"
          onClick={() => handleSectionClick(card.title, `job-section-${index}`)}
        >
          <Card>
          <CardHeader
            titleText={card.title}
            subtitleText={card.subtitle}
            avatar={
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {iconMap[card.icon] || <Sparkles className="h-5 w-5" />}
              </div>
            }
          />
          <CardContent>
            <ul className="space-y-2">
              {card.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        </div>
      ))}

      {/* Collaborators */}
      {job.collaborators.length > 0 && (
        <Card>
          <CardHeader titleText="Collaborators" />
          <CardContent>
            <div className="flex items-center gap-2">
              {job.collaborators.map((collab, i) => (
                <Avatar
                  key={i}
                  size="S"
                  initials={collab.initials}
                  colorScheme={collab.isAgent ? 'Accent6' : 'Accent1'}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related Items */}
      {relations.length > 0 && (
        <Card>
          <CardHeader
            titleText="Related Items"
            avatar={<Link2 className="h-4 w-4" />}
          />
          <CardContent className="p-0 divide-y">
            {relations.map((relation) => (
              <div
                key={relation.id}
                className="p-3 flex items-center gap-3 hover:bg-muted/50 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-muted">
                  {relation.type === 'conversation' ? (
                    <MessageSquare className="h-4 w-4" />
                  ) : relation.type === 'space' ? (
                    <Folder className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{relation.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{relation.type}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { List, ListItemCustom, cn } from '@sap-ui/fx-components';
import { Bot, Play, Pause, AlertCircle, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import type { Job } from '@/types';

interface JobsListProps {
  jobs: Job[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function JobsList({ jobs, selectedId, onSelect }: JobsListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ongoing': return <Play className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'paused': return <Pause className="h-4 w-4 text-orange-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'input': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-orange-600 bg-orange-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'input': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'paused': return 'bg-orange-500';
      case 'error': return 'bg-red-500';
      case 'input': return 'bg-yellow-500';
      default: return 'bg-muted-foreground';
    }
  };

  return (
    <List
      items={jobs}
      getItemKey={(job) => job.id}
      separators="None"
      className="py-2 px-2"
      onItemClick={({ item }) => {
        const key = (item as HTMLElement).dataset.itemKey;
        if (key) onSelect(key);
      }}
      renderItem={(job) => (
        <ListItemCustom
          itemKey={job.id}
          selected={selectedId === job.id}
          className={cn(
            "px-3 py-3",
            selectedId === job.id && "border-l-2 border-l-primary"
          )}
        >
          <div className="flex flex-col gap-2">
            {/* Top Row */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted shrink-0">
                <Bot className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-medium truncate block">{job.name}</span>
                <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 text-xs rounded-full", getStatusColor(job.status))}>
                  {getStatusIcon(job.status)}
                  {job.statusLabel}
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>

            {/* Task Description */}
            <p className="text-sm text-muted-foreground truncate pl-12">{job.task}</p>

            {/* Progress Bar */}
            <div className="pl-12 pr-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>{job.progress}%</span>
                <span>{job.timeRemaining}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", getProgressColor(job.status))}
                  style={{ width: `${job.progress}%` }}
                />
              </div>
            </div>

            {/* Collaborators */}
            {job.collaborators.length > 0 && (
              <div className="flex items-center gap-1 pl-12">
                {job.collaborators.map((collab, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                      collab.isAgent ? "bg-primary/10 text-primary" : "bg-muted"
                    )}
                  >
                    {collab.initials}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ListItemCustom>
      )}
    />
  );
}

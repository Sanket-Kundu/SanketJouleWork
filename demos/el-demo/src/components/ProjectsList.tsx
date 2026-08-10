import { List, ListItemCustom, cn } from '@sap-ui/fx-components';
import { Code, GitBranch, CheckCircle, AlertCircle, Loader2, ChevronRight } from 'lucide-react';
import type { Project } from '@/types';

interface ProjectsListProps {
  projects: Project[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ProjectsList({ projects, selectedId, onSelect }: ProjectsListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'building': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'testing': return <Loader2 className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'text-green-600 bg-green-100';
      case 'building': return 'text-blue-600 bg-blue-100';
      case 'testing': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getLanguageColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'typescript': return 'bg-blue-500';
      case 'javascript': return 'bg-yellow-500';
      case 'groovy': return 'bg-purple-500';
      case 'bpmn': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <List
      items={projects}
      getItemKey={(project) => project.id}
      separators="None"
      className="py-2 px-2"
      onItemClick={({ item }) => {
        const key = (item as HTMLElement).dataset.itemKey;
        if (key) onSelect(key);
      }}
      renderItem={(project) => (
        <ListItemCustom
          itemKey={project.id}
          selected={selectedId === project.id}
          className={cn(
            "px-3 py-3",
            selectedId === project.id && "border-l-2 border-l-primary"
          )}
        >
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="p-2 rounded-lg bg-muted shrink-0">
              <Code className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{project.name}</span>
                <span className={cn("w-2 h-2 rounded-full", getLanguageColor(project.language))} />
              </div>
              <p className="text-sm text-muted-foreground truncate">{project.description}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 text-xs rounded-full", getStatusColor(project.status))}>
                  {getStatusIcon(project.status)}
                  {project.status}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <GitBranch className="h-3 w-3" />
                  {project.branch}
                </span>
              </div>
            </div>

            {/* Arrow */}
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </div>
        </ListItemCustom>
      )}
    />
  );
}

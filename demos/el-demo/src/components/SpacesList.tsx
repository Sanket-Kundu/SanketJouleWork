import { List, ListItemCustom, cn } from '@sap-ui/fx-components';
import { Folder, AlertCircle, ChevronRight, Bot, Sparkles } from 'lucide-react';
import type { Space } from '@/types';

interface SpacesListProps {
  spaces: Space[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SpacesList({ spaces, selectedId, onSelect }: SpacesListProps) {
  const getBadgeColor = (type?: string) => {
    switch (type) {
      case 'error': return 'bg-red-100 text-red-700';
      case 'warning': return 'bg-orange-100 text-orange-700';
      case 'success': return 'bg-green-100 text-green-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getStatusDotColor = (status?: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-orange-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const getRightIcon = (icon?: string) => {
    switch (icon) {
      case 'ai': return <Sparkles className="h-4 w-4" />;
      case 'activity-2': return <Bot className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'alert': return <AlertCircle className="h-4 w-4" />;
      default: return <ChevronRight className="h-4 w-4" />;
    }
  };

  return (
    <List
      items={spaces}
      getItemKey={(space) => space.id}
      separators="None"
      className="py-2 px-2"
      onItemClick={({ item }) => {
        const key = (item as HTMLElement).dataset.itemKey;
        if (key) onSelect(key);
      }}
      renderItem={(space) => (
        <ListItemCustom
          itemKey={space.id}
          selected={selectedId === space.id}
          className={cn(
            "px-3 py-3",
            selectedId === space.id && "border-l-2 border-l-primary"
          )}
        >
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="p-2 rounded-lg bg-muted shrink-0">
              <Folder className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{space.name}</span>
                {space.statusDot && (
                  <span className={cn("w-2 h-2 rounded-full", getStatusDotColor(space.statusDot))} />
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{space.desc}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{space.timestamp}</span>
                {space.badge && (
                  <span className={cn("px-1.5 py-0.5 text-xs rounded-full", getBadgeColor(space.badgeType))}>
                    {space.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Right Icon */}
            <div className="text-muted-foreground shrink-0">
              {getRightIcon(space.rightIcon)}
            </div>
          </div>
        </ListItemCustom>
      )}
    />
  );
}

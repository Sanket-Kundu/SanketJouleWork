import { List, ListItemCustom, Avatar, cn } from '@sap-ui/fx-components';
import { Folder, AlertCircle, ChevronRight, Bot, Sparkles, MoreHorizontal } from 'lucide-react';
import type { Space } from '@/types';

interface SpacesListProps {
  spaces: Space[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function PersonCard({ space, selected, onSelect }: { space: Space; selected: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'rounded-[8px] p-[16px] flex flex-col gap-[12px] cursor-pointer transition-colors mx-2 my-[2px]',
        selected
          ? 'bg-[#fdfeff] border border-[#7c879c]'
          : 'border border-[#e6e7ea] hover:border-[#b0b9cc] bg-white'
      )}
    >
      {/* Name row */}
      <div className="flex items-center gap-[12px]">
        <Avatar
          size="S"
          shape="Square"
          initials={getInitials(space.name)}
          colorScheme={selected ? 'Accent5' : 'Accent6'}
        />
        <div className="flex-1 min-w-0">
          <div
            className="text-[14px] font-semibold leading-[20px] truncate"
            style={{ color: selected ? 'var(--text-accent, #0057d2)' : 'var(--text-primary, #0b0c0f)' }}
          >
            {space.name}
          </div>
          <div className="text-[12px] leading-[16px]" style={{ color: 'var(--text-tertiary, #636d83)' }}>
            {space.timestamp}
          </div>
        </div>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-[4px] rounded-[4px] text-[#636d83] hover:bg-[#f5f6f7] shrink-0"
        >
          <MoreHorizontal className="h-[16px] w-[16px]" />
        </button>
      </div>

      {/* Description */}
      <p
        className="text-[14px] leading-[20px]"
        style={{ color: 'var(--text-secondary, #353c4a)' }}
      >
        {space.desc}
      </p>
    </div>
  );
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
    <div className="py-2">
      {spaces.map((space) => {
        if (space.uiType === 'workflow-approvals') {
          return (
            <PersonCard
              key={space.id}
              space={space}
              selected={selectedId === space.id}
              onSelect={() => onSelect(space.id)}
            />
          );
        }

        return (
          <List
            key={space.id}
            items={[space]}
            getItemKey={(s) => s.id}
            separators="None"
            className="px-2"
            onItemClick={({ item }) => {
              const key = (item as HTMLElement).dataset.itemKey;
              if (key) onSelect(key);
            }}
            renderItem={(s) => (
              <ListItemCustom
                itemKey={s.id}
                selected={selectedId === s.id}
                className={cn('px-3 py-3', selectedId === s.id && 'border-l-2 border-l-primary')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted shrink-0">
                    <Folder className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{s.name}</span>
                      {s.statusDot && (
                        <span className={cn('w-2 h-2 rounded-full', getStatusDotColor(s.statusDot))} />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{s.desc}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{s.timestamp}</span>
                      {s.badge && (
                        <span className={cn('px-1.5 py-0.5 text-xs rounded-full', getBadgeColor(s.badgeType))}>
                          {s.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-muted-foreground shrink-0">
                    {getRightIcon(s.rightIcon)}
                  </div>
                </div>
              </ListItemCustom>
            )}
          />
        );
      })}
    </div>
  );
}

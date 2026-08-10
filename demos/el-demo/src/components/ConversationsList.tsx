import { useMemo } from 'react';
import { List, ConversationListItem, ConversationGroupListItem, Button, JobsIcon, MoreIcon } from '@sap-ui/fx-components';
import { MessageSquare } from 'lucide-react';
import type { Conversation } from '@/types';

interface ConversationsListProps {
  conversations: Conversation[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
}

function groupByTimestamp(conversations: Conversation[]) {
  const today: Conversation[] = [];
  const yesterday: Conversation[] = [];
  const previous: Conversation[] = [];

  for (const conv of conversations) {
    const ts = conv.timestamp.toLowerCase();
    if (ts.includes('ago')) {
      today.push(conv);
    } else if (ts === 'yesterday') {
      yesterday.push(conv);
    } else {
      previous.push(conv);
    }
  }

  const groups: { label: string; items: Conversation[] }[] = [];
  if (today.length) groups.push({ label: 'Today', items: today });
  if (yesterday.length) groups.push({ label: 'Yesterday', items: yesterday });
  if (previous.length) groups.push({ label: 'Previous', items: previous });
  return groups;
}

export function ConversationsList({ conversations, selectedId, onSelect }: ConversationsListProps) {
  const groups = useMemo(() => groupByTimestamp(conversations), [conversations]);

  return (
    <List
      separators="None"
      className="flex-1 px-2"
      onItemClick={({ item }) => {
        const key = (item as HTMLElement).dataset.itemKey;
        if (key) onSelect(key);
      }}
    >
      {groups.map((group) => (
        <ConversationGroupListItem key={group.label} headerText={group.label}>
          {group.items.map((conversation, index) => (
            <ConversationListItem
              key={conversation.id}
              itemKey={conversation.id}
              content={
                <span className="flex items-center gap-2 min-w-0">
                  <MessageSquare className="h-4 w-4 shrink-0 text-sapphire-icon-muted" />
                  <span className="truncate">{conversation.name}</span>
                </span>
              }
              selected={selectedId === conversation.id}
              actions={
                index === 0 ? (
                  <>
                    <Button
                      design="SecondaryNeutral"
                      size="Medium"
                      iconOnly
                      icon={<JobsIcon className="h-4 w-4" />}
                      className="action-fixed"
                      onClick={(e) => e.originalEvent.stopPropagation()}
                    />
                    <Button
                      design="SecondaryNeutral"
                      size="Medium"
                      iconOnly
                      icon={<MoreIcon className="h-4 w-4" />}
                      onClick={(e) => e.originalEvent.stopPropagation()}
                    />
                  </>
                ) : (
                  <Button
                    design="SecondaryNeutral"
                    size="Medium"
                    iconOnly
                    icon={<MoreIcon className="h-4 w-4" />}
                    onClick={(e) => e.originalEvent.stopPropagation()}
                  />
                )
              }
            />
          ))}
        </ConversationGroupListItem>
      ))}
    </List>
  );
}

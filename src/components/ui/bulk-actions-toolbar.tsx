import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BulkAction {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  onClick: (selectedIds: string[]) => void;
  disabled?: boolean;
  loading?: boolean;
}

interface BulkActionsToolbarProps {
  selectedCount: number;
  totalCount: number;
  onClearSelection: () => void;
  actions: BulkAction[];
  selectedIds: string[];
  resourceName: string; // e.g., "class", "student", "assignment"
  className?: string;
}

export function BulkActionsToolbar({
  selectedCount,
  totalCount,
  onClearSelection,
  actions,
  selectedIds,
  resourceName,
  className,
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        'mb-4 flex items-center justify-between rounded-lg border bg-muted/50 p-3 transition-all duration-200 animate-in slide-in-from-top-2',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="font-medium">
          {selectedCount} of {totalCount} {resourceName}
          {selectedCount !== 1 ? 's' : ''} selected
        </Badge>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-7 px-2 text-muted-foreground hover:text-foreground"
        >
          <X className="mr-1 h-3 w-3" />
          Clear
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Separator orientation="vertical" className="h-6" />

        {actions.map((action, index) => {
          const IconComponent = action.icon;

          return (
            <Button
              key={action.id}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={() => action.onClick(selectedIds)}
              disabled={action.disabled || action.loading}
              className={cn(
                'h-8',
                action.variant === 'destructive' && 'hover:bg-destructive/90',
              )}
            >
              {action.loading ? (
                <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : IconComponent ? (
                <IconComponent className="mr-2 h-3 w-3" />
              ) : null}
              {action.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

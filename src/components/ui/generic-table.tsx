import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Generic types for any resource
export interface BaseResource {
  id: string;
  [key: string]: any;
}

export interface TableColumn<T = any> {
  accessorKey: string;
  label: string;
  sortable?: boolean;
  accessor?: (item: T) => any;
  render?: (value: any, item: T) => React.ReactNode;
  width?: number;
}

export interface ActionItem<T = any> {
  label: string;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive';
  separator?: boolean;
}

interface CreateColumnsOptions<T extends BaseResource> {
  columns: TableColumn<T>[];
  actions?: ActionItem<T>[];
  resourceName?: string;
  enableSelection?: boolean;
}

export function createTableColumns<T extends BaseResource>({
  columns,
  actions = [],
  resourceName = 'item',
  enableSelection = true,
}: CreateColumnsOptions<T>): ColumnDef<T>[] {
  const tableColumns: ColumnDef<T>[] = [];

  // Add selection column if enabled
  if (enableSelection) {
    tableColumns.push({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    });
  }

  // Add data columns
  columns.forEach((column) => {
    const columnDef: ColumnDef<T> = {
      accessorKey: column.accessorKey,
      header:
        column.sortable !== false
          ? ({ column: tableColumn }) => (
              <Button
                variant="ghost"
                onClick={() =>
                  tableColumn.toggleSorting(tableColumn.getIsSorted() === 'asc')
                }
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                {column.label}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          : column.label,
      cell: ({ row }) => {
        const value = column.accessor
          ? column.accessor(row.original)
          : row.getValue(column.accessorKey);

        if (column.render) {
          return column.render(value, row.original);
        }

        return <div className="truncate">{value}</div>;
      },
      ...(column.width && { size: column.width }),
    };

    tableColumns.push(columnDef);
  });

  // Add actions column if actions are provided
  if (actions.length > 0) {
    tableColumns.push({
      id: 'actions',
      enableHiding: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const resource = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="font-medium">
                Actions
              </DropdownMenuLabel>

              {/* Default copy ID action */}
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(resource.id);
                  // You might want to add a toast here
                }}
                className="text-sm"
              >
                Copy {resourceName} ID
              </DropdownMenuItem>

              {actions.length > 0 && <DropdownMenuSeparator />}

              {actions.map((action, index) => (
                <div key={index}>
                  <DropdownMenuItem
                    onClick={() => action.onClick(resource)}
                    className={`text-sm ${
                      action.variant === 'destructive'
                        ? 'text-destructive focus:bg-destructive/10 focus:text-destructive'
                        : ''
                    }`}
                  >
                    {action.label}
                  </DropdownMenuItem>
                  {action.separator && index < actions.length - 1 && (
                    <DropdownMenuSeparator />
                  )}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });
  }

  return tableColumns;
}

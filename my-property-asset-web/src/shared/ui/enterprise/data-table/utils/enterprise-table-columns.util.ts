import type {
  EnterpriseTableColumnDef,
  EnterpriseTableColumnPriority,
} from '../models/enterprise-table.models';

export function reorderColumns(
  columns: readonly EnterpriseTableColumnDef[],
  fromIndex: number,
  toIndex: number,
): EnterpriseTableColumnDef[] {
  const next = [...columns];
  const [moved] = next.splice(fromIndex, 1);
  if (!moved) {
    return [...columns];
  }
  next.splice(toIndex, 0, moved);
  return next;
}

export function toggleColumnVisibility(
  columns: readonly EnterpriseTableColumnDef[],
  columnId: string,
  visible: boolean,
): EnterpriseTableColumnDef[] {
  return columns.map((column) => (column.id === columnId ? { ...column, visible } : column));
}

export function visibleColumns(columns: readonly EnterpriseTableColumnDef[]): EnterpriseTableColumnDef[] {
  return columns.filter((column) => column.visible !== false);
}

const PRIORITY_ORDER: EnterpriseTableColumnPriority[] = [
  'always',
  'desktop',
  'laptop',
  'tablet',
  'mobile',
];

export function columnsForBreakpoint(
  columns: readonly EnterpriseTableColumnDef[],
  breakpoint: EnterpriseTableColumnPriority,
): EnterpriseTableColumnDef[] {
  const maxIndex = PRIORITY_ORDER.indexOf(breakpoint);
  return visibleColumns(columns).filter((column) => {
    const priority = column.priority ?? 'desktop';
    return PRIORITY_ORDER.indexOf(priority) <= maxIndex;
  });
}

export function isColumnVisible(columns: readonly EnterpriseTableColumnDef[], columnId: string): boolean {
  return columns.find((column) => column.id === columnId)?.visible !== false;
}

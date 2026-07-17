import type {
  EnterpriseTableColumnDef,
  EnterpriseTablePaginationState,
  EnterpriseTableQuickFilter,
  EnterpriseTableSavedSearch,
} from '@shared/ui';

export function mapQuickFilters<T extends string>(
  options: readonly { id: T; label: string }[],
  selected: T,
): EnterpriseTableQuickFilter[] {
  return options.map((option) => ({
    id: option.id,
    label: option.label,
    active: selected === option.id,
  }));
}

export function mapSavedViews(
  views: readonly { id: string; name: string }[],
  selectedId: string,
): EnterpriseTableSavedSearch[] {
  return views.map((view) => ({
    id: view.id,
    label: view.name,
    active: view.id === selectedId,
  }));
}

export function mapTableColumns(
  columns: readonly { id: string; label: string; sortable?: boolean }[],
  visibleIds: readonly string[],
): EnterpriseTableColumnDef[] {
  return columns.map((column) => ({
    id: column.id,
    field: column.id,
    header: column.label,
    sortable: column.sortable,
    visible: visibleIds.includes(column.id),
  }));
}

export function visibleColumnIds(defs: readonly EnterpriseTableColumnDef[]): string[] {
  return defs.filter((column) => column.visible !== false).map((column) => column.id);
}

export function syncVisibleColumns(
  current: readonly string[],
  next: readonly string[],
  toggle: (columnId: string) => void,
): void {
  for (const id of current) {
    if (!next.includes(id)) {
      toggle(id);
    }
  }
  for (const id of next) {
    if (!current.includes(id)) {
      toggle(id);
    }
  }
}

export function tablePagination(
  page: number,
  pageSize: number,
  total: number,
): EnterpriseTablePaginationState {
  return {
    page,
    pageSize,
    totalRecords: total,
    first: Math.max(0, (page - 1) * pageSize),
  };
}

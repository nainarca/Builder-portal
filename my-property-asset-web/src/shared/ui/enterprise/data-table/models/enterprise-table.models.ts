import type { TableDensity, TableSortState } from '../../../models/data-display.model';

export type { TableDensity, TableSortState };

export type EnterpriseTableViewMode = 'table' | 'card';
export type EnterpriseTableEmptyVariant =
  | 'no-data'
  | 'no-search-results'
  | 'no-filter-results'
  | 'permission-denied'
  | 'error'
  | 'archived';

/**
 * Per-entity view-mode policy (UI-REBIRTH §6 / §11 / §20 #4).
 * Visual portfolio entities may offer table⇄card; directory entities stay table-only.
 */
export type EnterpriseTableViewModePolicy = 'portfolio' | 'directory';

export type EnterpriseTableLifecycleState =
  | 'idle'
  | 'loading'
  | 'refreshing'
  | 'error'
  | 'permission-denied';

/** Secondary toolbar actions demoted into overflow (UI-REBIRTH §4 / §6 — one primary action). */
export interface EnterpriseTableSecondaryAction {
  readonly id: string;
  readonly label: string;
  readonly icon?: string;
  readonly disabled?: boolean;
}

export type EnterpriseTableExportFormat = 'csv' | 'excel' | 'pdf' | 'print';

export type EnterpriseTableColumnPriority = 'always' | 'desktop' | 'laptop' | 'tablet' | 'mobile';

export interface EnterpriseTableColumnDef {
  readonly id: string;
  readonly field: string;
  readonly header: string;
  readonly sortable?: boolean;
  readonly visible?: boolean;
  readonly frozen?: boolean;
  readonly resizable?: boolean;
  readonly reorderable?: boolean;
  readonly width?: string;
  readonly minWidth?: string;
  readonly priority?: EnterpriseTableColumnPriority;
  readonly searchable?: boolean;
}

export interface EnterpriseTableFilterChip {
  readonly id: string;
  readonly label: string;
  readonly value?: string;
  readonly removable?: boolean;
}

export interface EnterpriseTableQuickFilter {
  readonly id: string;
  readonly label: string;
  readonly active?: boolean;
}

export interface EnterpriseTableFilterOption {
  readonly label: string;
  readonly value: string;
}

export interface EnterpriseTableAdvancedFilterField {
  readonly id: string;
  readonly label: string;
  readonly type: 'text' | 'select' | 'multi-select' | 'date' | 'date-range' | 'status';
  readonly options?: readonly EnterpriseTableFilterOption[];
  readonly placeholder?: string;
}

export interface EnterpriseTableRowAction {
  readonly id: string;
  readonly label: string;
  readonly icon?: string;
  readonly severity?: 'primary' | 'secondary' | 'danger';
  readonly visible?: boolean;
  readonly disabled?: boolean;
}

export interface EnterpriseTableBulkAction {
  readonly id: string;
  readonly label: string;
  readonly icon?: string;
  readonly severity?: 'primary' | 'secondary' | 'danger';
  readonly disabled?: boolean;
}

export interface EnterpriseTableExportOption {
  readonly format: EnterpriseTableExportFormat;
  readonly label: string;
  readonly enabled?: boolean;
}

export interface EnterpriseTablePaginationState {
  readonly page: number;
  readonly pageSize: number;
  readonly totalRecords: number;
  readonly first: number;
}

export interface EnterpriseTableSelectionSummary {
  readonly selectedCount: number;
  readonly totalCount: number;
  readonly allSelected?: boolean;
}

/** Placeholder contract for saved searches — host persists; framework renders UI only. */
export interface EnterpriseTableSavedSearch {
  readonly id: string;
  readonly label: string;
  readonly active?: boolean;
}

export interface EnterpriseTableVirtualScrollConfig {
  readonly enabled: boolean;
  readonly itemSize?: number;
  readonly scrollHeight?: string;
}

export interface EnterpriseTableResponsiveConfig {
  readonly enableHorizontalScroll?: boolean;
  readonly stickyHeader?: boolean;
  readonly stickyFirstColumn?: boolean;
}

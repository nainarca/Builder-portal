export type TableDensity = 'comfortable' | 'compact';
export type SortDirection = 'asc' | 'desc' | null;

export interface TableSortState {
  field: string | null;
  direction: SortDirection;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  totalRecords: number;
}

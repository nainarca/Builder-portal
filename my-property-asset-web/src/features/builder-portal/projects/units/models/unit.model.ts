export type UnitStatus = 'available' | 'reserved' | 'sold' | 'blocked';

export type UnitConstructionStage =
  | 'not-started'
  | 'foundation'
  | 'structure'
  | 'finishing'
  | 'ready-for-handover'
  | 'handed-over';

export type UnitTypeCategory = 'apartment' | 'villa' | 'studio' | 'penthouse' | 'commercial' | 'retail';

export interface Tower {
  readonly id: string;
  readonly projectId: string;
  readonly name: string;
  readonly totalFloors: number;
}

export interface UnitMilestone {
  readonly id: string;
  readonly label: string;
  readonly date: string;
  readonly status: 'completed' | 'in-progress' | 'upcoming';
  readonly description?: string;
}

export interface UnitSummaryPlaceholders {
  readonly ownerAssigned: boolean;
  readonly documentsCount: number;
  readonly handoverStatus: 'not-started' | 'in-progress' | 'completed';
  readonly openSnags: number;
  readonly upcomingAppointments: number;
}

export interface Unit {
  readonly id: string;
  readonly projectId: string;
  readonly towerId: string;
  readonly towerName: string;
  readonly floorNumber: number;
  readonly unitNumber: string;
  readonly code: string;
  readonly unitType: UnitTypeCategory;
  readonly configuration: string;
  readonly areaSqft: number;
  readonly status: UnitStatus;
  readonly constructionStage: UnitConstructionStage;
  readonly progress: number;
  readonly milestones: readonly UnitMilestone[];
  readonly summary: UnitSummaryPlaceholders;
  readonly archived: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface UnitFormModel {
  towerId: string;
  floorNumber: number;
  unitNumber: string;
  code: string;
  unitType: UnitTypeCategory;
  configuration: string;
  areaSqft: number;
  status: UnitStatus;
  constructionStage: UnitConstructionStage;
  progress: number;
}

export interface UnitTableColumn {
  readonly id: string;
  readonly label: string;
  readonly sortable: boolean;
  readonly defaultVisible: boolean;
}

export interface UnitSavedView {
  readonly id: string;
  readonly name: string;
  readonly statusFilter: UnitStatus | 'all';
  readonly stageFilter: UnitConstructionStage | 'all';
  readonly isDefault?: boolean;
}

export interface UnitListQuery {
  readonly projectId: string;
  readonly search: string;
  readonly statusFilter: UnitStatus | 'all';
  readonly stageFilter: UnitConstructionStage | 'all';
  readonly typeFilter: UnitTypeCategory | 'all';
  readonly towerFilter: string;
  readonly floorFilter: number | 'all';
  readonly includeArchived: boolean;
  readonly sortField: string;
  readonly sortDirection: 'asc' | 'desc';
  readonly page: number;
  readonly pageSize: number;
}

export interface UnitListResult {
  readonly items: readonly Unit[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export type UnitBulkAction = 'archive' | 'restore' | 'export';

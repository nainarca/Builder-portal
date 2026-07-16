/** P9 Building domain — aligned with Batch 4 `builder_buildings`. */

export type BuildingStatus = 'planning' | 'construction' | 'completed' | 'archived';

export interface Building {
  readonly id: string;
  readonly projectId: string;
  readonly organizationId: string;
  readonly name: string;
  readonly code: string;
  readonly towerName?: string;
  readonly blockName?: string;
  readonly displayOrder: number;
  readonly floorsCount: number;
  readonly unitsCount: number;
  readonly status: BuildingStatus;
  readonly description?: string;
  readonly imageUrl?: string;
  readonly addressLine?: string;
  readonly archived: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface BuildingFormModel {
  name: string;
  code: string;
  towerName: string;
  blockName: string;
  displayOrder: number;
  floorsCount: number;
  unitsCount: number;
  status: BuildingStatus;
  description: string;
  imageUrl: string;
  addressLine: string;
}

export interface BuildingListQuery {
  readonly projectId: string;
  readonly search: string;
  readonly statusFilter: BuildingStatus | 'all';
  readonly includeArchived: boolean;
  readonly sortField: string;
  readonly sortDirection: 'asc' | 'desc';
  readonly page: number;
  readonly pageSize: number;
}

export interface BuildingListResult {
  readonly items: readonly Building[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export interface BuildingDashboardStats {
  readonly total: number;
  readonly byStatus: Readonly<Record<BuildingStatus, number>>;
  readonly recent: readonly Building[];
}

export type BuildingMode = 'required' | 'optional' | 'unsupported';

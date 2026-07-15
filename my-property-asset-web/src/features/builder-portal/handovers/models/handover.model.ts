export type HandoverStageId =
  | 'initiated'
  | 'document-verification'
  | 'inspection'
  | 'snag-resolution'
  | 'appointment'
  | 'digital-signature'
  | 'owner-acceptance'
  | 'completion';

export type HandoverStageStatusValue = 'completed' | 'in-progress' | 'upcoming' | 'delayed';
export type HandoverOverallStatus = 'pending' | 'in-progress' | 'completed' | 'delayed';
export type HandoverActivityTone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface HandoverStageDefinition {
  readonly id: HandoverStageId;
  readonly label: string;
  readonly description: string;
  readonly order: number;
}

export interface HandoverStageStatus {
  readonly stageId: HandoverStageId;
  readonly status: HandoverStageStatusValue;
  readonly completedAt?: string;
}

export interface HandoverActivityItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly timestamp: string;
  readonly icon: string;
  readonly tone?: HandoverActivityTone;
}

export interface Handover {
  readonly id: string;
  readonly projectId: string;
  readonly projectName: string;
  readonly unitId: string;
  readonly unitNumber: string;
  readonly towerName: string;
  readonly ownerId: string;
  readonly ownerName: string;
  readonly overallStatus: HandoverOverallStatus;
  readonly overallProgress: number;
  readonly targetCompletionDate?: string;
  readonly stages: readonly HandoverStageStatus[];
  readonly activity: readonly HandoverActivityItem[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface HandoverTableColumn {
  readonly id: string;
  readonly label: string;
  readonly sortable: boolean;
  readonly defaultVisible: boolean;
}

export interface HandoverSavedView {
  readonly id: string;
  readonly name: string;
  readonly statusFilter: HandoverOverallStatus | 'all';
  readonly isDefault?: boolean;
}

export interface HandoverListQuery {
  readonly search: string;
  readonly statusFilter: HandoverOverallStatus | 'all';
  readonly projectFilter: string;
  readonly unitFilter: string;
  readonly sortField: string;
  readonly sortDirection: 'asc' | 'desc';
  readonly page: number;
  readonly pageSize: number;
}

export interface HandoverListResult {
  readonly items: readonly Handover[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export type HandoverViewMode = 'card' | 'table';

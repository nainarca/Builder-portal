import { ProjectStatus } from '../../models/dashboard.model';

export type ConstructionStage =
  | 'land-acquisition'
  | 'foundation'
  | 'structure'
  | 'finishing'
  | 'handover'
  | 'completed';

export type ProjectHealth = 'on-track' | 'at-risk' | 'delayed';

export interface ProjectLocation {
  readonly addressLine: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly country: string;
}

export interface ProjectMilestone {
  readonly id: string;
  readonly label: string;
  readonly date: string;
  readonly status: 'completed' | 'in-progress' | 'upcoming';
  readonly description?: string;
}

export interface ProjectSummaryCounts {
  readonly unitsTotal: number;
  readonly unitsSold: number;
  readonly ownersCount: number;
  readonly documentsCount: number;
  readonly pendingHandovers: number;
  readonly openSnags: number;
  readonly upcomingAppointments: number;
}

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly description?: string;
  readonly organizationId: string;
  readonly organizationName: string;
  readonly status: ProjectStatus;
  readonly constructionStage: ConstructionStage;
  readonly health: ProjectHealth;
  readonly progress: number;
  readonly location: ProjectLocation;
  readonly startDate: string;
  readonly targetCompletionDate: string;
  readonly actualCompletionDate?: string;
  readonly milestones: readonly ProjectMilestone[];
  readonly summary: ProjectSummaryCounts;
  readonly thumbnailUrl?: string;
  readonly archived: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ProjectFormModel {
  name: string;
  code: string;
  description: string;
  status: ProjectStatus;
  constructionStage: ConstructionStage;
  health: ProjectHealth;
  progress: number;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  startDate: string;
  targetCompletionDate: string;
}

export interface ProjectTableColumn {
  readonly id: string;
  readonly label: string;
  readonly sortable: boolean;
  readonly defaultVisible: boolean;
}

export interface ProjectSavedView {
  readonly id: string;
  readonly name: string;
  readonly statusFilter: ProjectStatus | 'all';
  readonly healthFilter: ProjectHealth | 'all';
  readonly isDefault?: boolean;
}

export interface ProjectListQuery {
  readonly search: string;
  readonly statusFilter: ProjectStatus | 'all';
  readonly stageFilter: ConstructionStage | 'all';
  readonly healthFilter: ProjectHealth | 'all';
  readonly cityFilter: string;
  readonly includeArchived: boolean;
  readonly sortField: string;
  readonly sortDirection: 'asc' | 'desc';
  readonly page: number;
  readonly pageSize: number;
}

export interface ProjectListResult {
  readonly items: readonly Project[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export type ProjectBulkAction = 'archive' | 'restore' | 'export';

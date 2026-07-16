/** P8/P9.1 Builder Project domain types — aligned with `builder_projects`. */

export type ProjectType =
  | 'apartment'
  | 'villa'
  | 'residential-plot'
  | 'commercial'
  | 'mixed-development'
  | 'farm-land';

/** DB snake_case codes for project_type */
export type ProjectTypeDb =
  | 'apartment'
  | 'villa'
  | 'residential_plot'
  | 'commercial'
  | 'mixed_development'
  | 'farm_land';

/** P9.1 — drives Builder Portal navigation (Buildings vs Units). */
export type ProjectHierarchy = 'building-based' | 'direct-units';

/** DB snake_case codes for project_hierarchy */
export type ProjectHierarchyDb = 'building_based' | 'direct_units';

export type ProjectStatus =
  | 'upcoming'
  | 'planning'
  | 'construction'
  | 'completed'
  | 'archived';

export interface ProjectLocation {
  readonly addressLine: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly latitude?: number | null;
  readonly longitude?: number | null;
}

/** Optional summary placeholders — Units/Owners/Documents are out of P8 scope. */
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
  readonly projectType: ProjectType;
  /** P9.1 — BUILDING_BASED | DIRECT_UNITS */
  readonly hierarchy: ProjectHierarchy;
  readonly status: ProjectStatus;
  readonly location: ProjectLocation;
  readonly launchDate?: string;
  readonly expectedCompletionDate?: string;
  readonly bannerUrl?: string;
  readonly logoUrl?: string;
  readonly thumbnailUrl?: string;
  readonly summary: ProjectSummaryCounts;
  readonly archived: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ProjectFormModel {
  name: string;
  code: string;
  description: string;
  projectType: ProjectType;
  hierarchy: ProjectHierarchy;
  status: ProjectStatus;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  launchDate: string;
  expectedCompletionDate: string;
  bannerUrl: string;
  logoUrl: string;
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
  readonly typeFilter: ProjectType | 'all';
  readonly isDefault?: boolean;
}

export interface ProjectListQuery {
  readonly search: string;
  readonly statusFilter: ProjectStatus | 'all';
  readonly typeFilter: ProjectType | 'all';
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

/** Legacy display helpers retained for unused shared components. */
export type ProjectHealth = 'on-track' | 'at-risk' | 'delayed';

export interface ProjectMilestone {
  readonly id: string;
  readonly label: string;
  readonly date: string;
  readonly status: 'completed' | 'in-progress' | 'upcoming';
  readonly description?: string;
}

export interface ProjectDashboardStats {
  readonly total: number;
  readonly byStatus: Readonly<Record<ProjectStatus, number>>;
  readonly recent: readonly Project[];
}

export function projectTypeToDb(type: ProjectType): ProjectTypeDb {
  const map: Record<ProjectType, ProjectTypeDb> = {
    apartment: 'apartment',
    villa: 'villa',
    'residential-plot': 'residential_plot',
    commercial: 'commercial',
    'mixed-development': 'mixed_development',
    'farm-land': 'farm_land',
  };
  return map[type];
}

export function projectTypeFromDb(value: string): ProjectType {
  const map: Record<string, ProjectType> = {
    apartment: 'apartment',
    villa: 'villa',
    residential_plot: 'residential-plot',
    'residential-plot': 'residential-plot',
    commercial: 'commercial',
    mixed_development: 'mixed-development',
    'mixed-development': 'mixed-development',
    farm_land: 'farm-land',
    'farm-land': 'farm-land',
  };
  return map[value] ?? 'apartment';
}

export function projectHierarchyToDb(hierarchy: ProjectHierarchy): ProjectHierarchyDb {
  return hierarchy === 'direct-units' ? 'direct_units' : 'building_based';
}

export function projectHierarchyFromDb(value: string): ProjectHierarchy {
  if (value === 'direct_units' || value === 'direct-units') {
    return 'direct-units';
  }
  return 'building-based';
}

export function emptyProjectSummary(): ProjectSummaryCounts {
  return {
    unitsTotal: 0,
    unitsSold: 0,
    ownersCount: 0,
    documentsCount: 0,
    pendingHandovers: 0,
    openSnags: 0,
    upcomingAppointments: 0,
  };
}

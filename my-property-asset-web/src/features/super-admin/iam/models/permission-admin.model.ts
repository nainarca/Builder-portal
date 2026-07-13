import { PermissionLevel, PlatformRole, ResourceId } from '@core/rbac/models/permission.model';

export interface PermissionCategory {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly resources: readonly ResourceId[];
}

export interface PermissionGroup {
  readonly id: string;
  readonly label: string;
  readonly categoryId: string;
  readonly resources: readonly ResourceId[];
}

export interface PermissionMatrixRow {
  readonly resource: ResourceId;
  readonly resourceLabel: string;
  readonly category: string;
  readonly categoryId: string;
  readonly levels: Readonly<Partial<Record<PlatformRole, PermissionLevel>>>;
}

export interface PermissionComparisonResult {
  readonly resource: ResourceId;
  readonly resourceLabel: string;
  readonly roleA: PlatformRole;
  readonly roleB: PlatformRole;
  readonly levelA: PermissionLevel;
  readonly levelB: PermissionLevel;
  readonly differs: boolean;
}

export interface PermissionPreviewItem {
  readonly key: string;
  readonly resource: string;
  readonly level: PermissionLevel;
  readonly label: string;
  readonly granted: boolean;
}

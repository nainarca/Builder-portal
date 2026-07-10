import { PermissionLevel, PermissionRequirement, ResourceId } from '../models/permission.model';
import { PERMISSION_LEVEL_RANK } from '../constants/rbac.constants';

export function parsePermissionKey(key: string): PermissionRequirement | null {
  const separatorIndex = key.lastIndexOf(':');
  if (separatorIndex <= 0) {
    return null;
  }

  const resource = key.slice(0, separatorIndex);
  const level = key.slice(separatorIndex + 1) as PermissionLevel;

  if (!(level in PERMISSION_LEVEL_RANK)) {
    return null;
  }

  return { resource, level };
}

export function formatPermissionKey(resource: ResourceId | string, level: PermissionLevel): string {
  return `${resource}:${level}`;
}

export function satisfiesPermissionLevel(
  actual: PermissionLevel | undefined,
  required: PermissionLevel,
): boolean {
  if (!actual || actual === 'none') {
    return required === 'none';
  }

  if (actual === 'delegated') {
    return PERMISSION_LEVEL_RANK[required] <= PERMISSION_LEVEL_RANK['read'];
  }

  return PERMISSION_LEVEL_RANK[actual] >= PERMISSION_LEVEL_RANK[required];
}

export function normalizeRole(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  return value.trim().toLowerCase().replace(/_/g, '-');
}

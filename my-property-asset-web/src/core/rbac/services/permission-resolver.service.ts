import { Injectable, inject } from '@angular/core';

import { PermissionLevel, PermissionSet, PlatformRole, ResourceId } from '../models/permission.model';
import { PERMISSION_MATRIX, ROLE_PORTAL_ACCESS } from '../registry/permission-matrix.registry';
import { formatPermissionKey } from '../utils/permission.utils';

@Injectable({ providedIn: 'root' })
export class PermissionCacheService {
  private cacheKey: string | null = null;
  private cachedPermissions: PermissionSet = {};

  get(key: string, factory: () => PermissionSet): PermissionSet {
    if (this.cacheKey === key) {
      return this.cachedPermissions;
    }

    this.cacheKey = key;
    this.cachedPermissions = factory();
    return this.cachedPermissions;
  }

  invalidate(): void {
    this.cacheKey = null;
    this.cachedPermissions = {};
  }
}

@Injectable({ providedIn: 'root' })
export class PermissionResolverService {
  private readonly cache = inject(PermissionCacheService);

  invalidate(): void {
    this.cache.invalidate();
  }

  resolvePermissionSet(input: {
    role: PlatformRole;
    supportAccessOrganizationId?: string | null;
    organizationId?: string | null;
  }): PermissionSet {
    const cacheKey = `${input.role}:${input.supportAccessOrganizationId ?? 'none'}:${input.organizationId ?? 'none'}`;
    return this.cache.get(cacheKey, () => this.buildPermissionSet(input));
  }

  private buildPermissionSet(input: {
    role: PlatformRole;
    supportAccessOrganizationId?: string | null;
  }): PermissionSet {
    const permissions: Record<string, PermissionLevel> = {};

    (Object.keys(PERMISSION_MATRIX) as ResourceId[]).forEach((resource) => {
      const level = PERMISSION_MATRIX[resource][input.role] ?? 'none';

      if (level === 'delegated' && input.supportAccessOrganizationId) {
        permissions[resource] = 'read';
        return;
      }

      permissions[resource] = level;
      permissions[formatPermissionKey(resource, level)] = level;
    });

    const portalPermissions = ROLE_PORTAL_ACCESS[input.role] ?? [];
    portalPermissions.forEach((portalPermission) => {
      permissions[portalPermission] = 'full';
    });

    return permissions;
  }
}

import { Injectable, computed } from '@angular/core';

import { PermissionLevel, PlatformRole } from '@core/rbac/models/permission.model';
import { PERMISSION_MATRIX, ROLE_PORTAL_ACCESS, ROLE_REGISTRY } from '@core/rbac/registry/permission-matrix.registry';

import { PERMISSION_CATEGORIES, RESOURCE_LABELS, ROLE_DESCRIPTIONS, ROLE_USER_COUNTS } from '../config/iam.config';
import { MOCK_USERS } from '../config/iam.config';
import {
  RoleAdminRecord,
  RoleAssignmentRecord,
  RoleListQuery,
  RoleListResult,
  RolePermissionEntry,
} from '../models/role-admin.model';
import {
  PermissionCategory,
  PermissionComparisonResult,
  PermissionMatrixRow,
} from '../models/permission-admin.model';

@Injectable({ providedIn: 'root' })
export class RoleAdminStoreService {
  private readonly roles = computed(() => this.buildRoles());

  getAll(): readonly RoleAdminRecord[] {
    return this.roles();
  }

  getById(id: PlatformRole): RoleAdminRecord | undefined {
    return this.roles().find((r) => r.id === id);
  }

  query(params: RoleListQuery): RoleListResult {
    let items = [...this.roles()];

    if (params.search.trim()) {
      const term = params.search.trim().toLowerCase();
      items = items.filter((r) => r.label.toLowerCase().includes(term) || r.id.includes(term) || r.description.toLowerCase().includes(term));
    }

    if (params.scopeFilter !== 'all') {
      items = items.filter((r) => r.scope === params.scopeFilter);
    }

    items.sort((a, b) => {
      const av = a[params.sortField as keyof RoleAdminRecord];
      const bv = b[params.sortField as keyof RoleAdminRecord];
      const m = params.sortDirection === 'asc' ? 1 : -1;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * m;
      return String(av ?? '').localeCompare(String(bv ?? '')) * m;
    });

    const total = items.length;
    const start = (params.page - 1) * params.pageSize;
    return { items: items.slice(start, start + params.pageSize), total, page: params.page, pageSize: params.pageSize };
  }

  getAssignments(roleId: PlatformRole): readonly RoleAssignmentRecord[] {
    return MOCK_USERS
      .filter((u) => u.primaryRole === roleId)
      .map((u) => ({
        id: `ra-${u.id}`,
        roleId,
        userId: u.id,
        userName: u.displayName,
        userEmail: u.email,
        organizationId: u.organizationId,
        organizationName: u.organizationName,
        assignedAt: u.createdAt,
        assignedBy: 'System',
      }));
  }

  getPermissions(roleId: PlatformRole): readonly RolePermissionEntry[] {
    const entries: RolePermissionEntry[] = [];
    for (const category of PERMISSION_CATEGORIES) {
      for (const resource of category.resources) {
        const level = (PERMISSION_MATRIX[resource]?.[roleId] ?? 'none') as PermissionLevel;
        if (level === 'none') continue;
        entries.push({
          resource,
          resourceLabel: RESOURCE_LABELS[resource] ?? resource,
          category: category.label,
          level,
        });
      }
    }
    return entries;
  }

  private buildRoles(): RoleAdminRecord[] {
    return (Object.keys(ROLE_REGISTRY) as PlatformRole[]).map((id) => {
      const meta = ROLE_REGISTRY[id];
      const portals = ROLE_PORTAL_ACCESS[id] ?? [];
      const permissions = this.getPermissions(id);
      return {
        id,
        label: meta.label,
        scope: meta.scope as 'platform' | 'organization',
        description: ROLE_DESCRIPTIONS[id] ?? `${meta.label} platform role.`,
        isSystem: true,
        userCount: ROLE_USER_COUNTS[id] ?? 0,
        permissionCount: permissions.length,
        portals,
      };
    });
  }
}

@Injectable({ providedIn: 'root' })
export class PermissionMatrixService {
  readonly categories = computed(() => PERMISSION_CATEGORIES);
  readonly roles = computed(() => (Object.keys(ROLE_REGISTRY) as PlatformRole[]).filter((r) => r !== 'public-visitor'));

  getMatrixRows(categoryFilter?: string): readonly PermissionMatrixRow[] {
    const categories = categoryFilter
      ? PERMISSION_CATEGORIES.filter((c) => c.id === categoryFilter)
      : PERMISSION_CATEGORIES;

    const rows: PermissionMatrixRow[] = [];
    for (const category of categories) {
      for (const resource of category.resources) {
        rows.push({
          resource,
          resourceLabel: RESOURCE_LABELS[resource] ?? resource,
          category: category.label,
          categoryId: category.id,
          levels: PERMISSION_MATRIX[resource] ?? {},
        });
      }
    }
    return rows;
  }

  compareRoles(roleA: PlatformRole, roleB: PlatformRole): readonly PermissionComparisonResult[] {
    const results: PermissionComparisonResult[] = [];
    for (const category of PERMISSION_CATEGORIES) {
      for (const resource of category.resources) {
        const levelA = (PERMISSION_MATRIX[resource]?.[roleA] ?? 'none') as PermissionLevel;
        const levelB = (PERMISSION_MATRIX[resource]?.[roleB] ?? 'none') as PermissionLevel;
        results.push({
          resource,
          resourceLabel: RESOURCE_LABELS[resource] ?? resource,
          roleA,
          roleB,
          levelA,
          levelB,
          differs: levelA !== levelB,
        });
      }
    }
    return results;
  }

  getCategories(): readonly PermissionCategory[] {
    return PERMISSION_CATEGORIES;
  }
}

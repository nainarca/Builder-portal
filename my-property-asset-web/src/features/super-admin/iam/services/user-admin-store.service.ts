import { Injectable, computed, signal } from '@angular/core';

import { PermissionLevel, PlatformRole } from '@core/rbac/models/permission.model';
import { PERMISSION_MATRIX } from '@core/rbac/registry/permission-matrix.registry';

import {
  MOCK_USER_ACTIVITIES,
  MOCK_USER_AUDITS,
  MOCK_USER_STATUS_HISTORY,
  MOCK_USERS,
  PERMISSION_CATEGORIES,
  RESOURCE_LABELS,
} from '../config/iam.config';
import {
  UserActivityRecord,
  UserAdminRecord,
  UserAdminStatus,
  UserAuditRecord,
  UserFormModel,
  UserListQuery,
  UserListResult,
  UserPermissionSummaryItem,
  UserSecuritySummary,
  UserStatusHistoryRecord,
} from '../models/user-admin.model';

@Injectable({ providedIn: 'root' })
export class UserAdminStoreService {
  private readonly usersSignal = signal<UserAdminRecord[]>([...MOCK_USERS]);

  readonly users = this.usersSignal.asReadonly();
  readonly totalCount = computed(() => this.usersSignal().length);

  getById(id: string): UserAdminRecord | undefined {
    return this.usersSignal().find((u) => u.id === id);
  }

  query(params: UserListQuery): UserListResult {
    let items = [...this.usersSignal()];

    if (params.search.trim()) {
      const term = params.search.trim().toLowerCase();
      items = items.filter(
        (u) =>
          u.displayName.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          u.organizationName?.toLowerCase().includes(term) ||
          u.builderName?.toLowerCase().includes(term),
      );
    }

    if (params.statusFilter !== 'all') {
      items = items.filter((u) => u.status === params.statusFilter);
    }

    if (params.roleFilter !== 'all') {
      items = items.filter((u) => u.primaryRole === params.roleFilter);
    }

    if (params.organizationFilter) {
      items = items.filter((u) => u.organizationName === params.organizationFilter);
    }

    items.sort((a, b) => this.compare(a, b, params.sortField, params.sortDirection));

    const total = items.length;
    const start = (params.page - 1) * params.pageSize;
    return { items: items.slice(start, start + params.pageSize), total, page: params.page, pageSize: params.pageSize };
  }

  create(model: UserFormModel): UserAdminRecord {
    const now = new Date().toISOString();
    const record: UserAdminRecord = {
      id: `usr-${crypto.randomUUID().slice(0, 8)}`,
      email: model.email.trim(),
      displayName: model.displayName.trim() || `${model.firstName} ${model.lastName}`.trim(),
      firstName: model.firstName.trim() || undefined,
      lastName: model.lastName.trim() || undefined,
      status: model.status,
      primaryRole: model.primaryRole,
      memberships: [],
      organizationId: model.organizationId || undefined,
      builderId: model.builderId || undefined,
      mfaEnabled: model.mfaEnabled,
      emailVerified: false,
      sessionCount: 0,
      permissionCount: this.countPermissions(model.primaryRole),
      invitationStatus: model.status === 'pending' ? 'pending' : 'none',
      createdAt: now,
      updatedAt: now,
    };
    this.usersSignal.update((list) => [record, ...list]);
    return record;
  }

  update(id: string, model: UserFormModel): UserAdminRecord | undefined {
    const existing = this.getById(id);
    if (!existing) return undefined;

    const updated: UserAdminRecord = {
      ...existing,
      email: model.email.trim(),
      displayName: model.displayName.trim() || `${model.firstName} ${model.lastName}`.trim(),
      firstName: model.firstName.trim() || undefined,
      lastName: model.lastName.trim() || undefined,
      status: model.status,
      primaryRole: model.primaryRole,
      organizationId: model.organizationId || undefined,
      builderId: model.builderId || undefined,
      mfaEnabled: model.mfaEnabled,
      permissionCount: this.countPermissions(model.primaryRole),
      updatedAt: new Date().toISOString(),
    };

    this.usersSignal.update((list) => list.map((u) => (u.id === id ? updated : u)));
    return updated;
  }

  setStatus(id: string, status: UserAdminStatus): UserAdminRecord | undefined {
    const existing = this.getById(id);
    if (!existing) return undefined;
    const updated = { ...existing, status, updatedAt: new Date().toISOString() };
    this.usersSignal.update((list) => list.map((u) => (u.id === id ? updated : u)));
    return updated;
  }

  bulkSetStatus(ids: readonly string[], status: UserAdminStatus): number {
    let count = 0;
    this.usersSignal.update((list) =>
      list.map((u) => {
        if (!ids.includes(u.id)) return u;
        count += 1;
        return { ...u, status, updatedAt: new Date().toISOString() };
      }),
    );
    return count;
  }

  getActivities(userId: string): readonly UserActivityRecord[] {
    return MOCK_USER_ACTIVITIES.filter((a) => a.userId === userId);
  }

  getStatusHistory(userId: string): readonly UserStatusHistoryRecord[] {
    return MOCK_USER_STATUS_HISTORY.filter((h) => h.userId === userId);
  }

  getAudits(userId: string): readonly UserAuditRecord[] {
    return MOCK_USER_AUDITS.filter((a) => a.userId === userId);
  }

  getSecuritySummary(user: UserAdminRecord): UserSecuritySummary {
    return {
      mfaEnabled: user.mfaEnabled,
      emailVerified: user.emailVerified,
      lastLoginAt: user.lastLoginAt,
      lastActiveAt: user.lastActiveAt,
      sessionCount: user.sessionCount,
      activeSessions: user.sessionCount > 0 ? 1 : 0,
      failedLoginAttempts: 0,
      passwordChangedAt: '2025-12-01T00:00:00Z',
    };
  }

  getPermissionSummary(role: PlatformRole): readonly UserPermissionSummaryItem[] {
    const items: UserPermissionSummaryItem[] = [];
    for (const category of PERMISSION_CATEGORIES) {
      for (const resource of category.resources) {
        const level = (PERMISSION_MATRIX[resource]?.[role] ?? 'none') as PermissionLevel;
        if (level === 'none') continue;
        items.push({
          resource,
          label: RESOURCE_LABELS[resource] ?? resource,
          level,
          category: category.label,
        });
      }
    }
    return items;
  }

  getOrganizations(): readonly string[] {
    return [...new Set(this.usersSignal().map((u) => u.organizationName).filter(Boolean) as string[])].sort();
  }

  toFormModel(user: UserAdminRecord): UserFormModel {
    return {
      email: user.email,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      displayName: user.displayName,
      status: user.status,
      primaryRole: user.primaryRole,
      organizationId: user.organizationId ?? '',
      builderId: user.builderId ?? '',
      mfaEnabled: user.mfaEnabled,
    };
  }

  emptyFormModel(): UserFormModel {
    return {
      email: '',
      firstName: '',
      lastName: '',
      displayName: '',
      status: 'pending',
      primaryRole: 'builder-org-member',
      organizationId: '',
      builderId: '',
      mfaEnabled: false,
    };
  }

  private countPermissions(role: PlatformRole): number {
    return Object.values(PERMISSION_MATRIX).filter((row) => row[role] && row[role] !== 'none').length;
  }

  private compare(a: UserAdminRecord, b: UserAdminRecord, field: string, direction: 'asc' | 'desc'): number {
    const av = a[field as keyof UserAdminRecord];
    const bv = b[field as keyof UserAdminRecord];
    const m = direction === 'asc' ? 1 : -1;
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * m;
    return String(av ?? '').localeCompare(String(bv ?? '')) * m;
  }
}

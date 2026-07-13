import { Injectable, computed, signal } from '@angular/core';

import {
  MOCK_ORGANIZATION_ACTIVITIES,
  MOCK_ORGANIZATION_AUDITS,
  MOCK_ORGANIZATION_MEMBERS,
  MOCK_ORGANIZATION_STATUS_HISTORY,
  MOCK_ORGANIZATIONS,
} from '../config/organizations.config';
import {
  OrganizationActivityRecord,
  OrganizationAdminRecord,
  OrganizationAdminStatus,
  OrganizationAuditRecord,
  OrganizationFormModel,
  OrganizationListQuery,
  OrganizationListResult,
  OrganizationMemberRecord,
  OrganizationStatusHistoryRecord,
} from '../models/organization-admin.model';

@Injectable({ providedIn: 'root' })
export class OrganizationAdminStoreService {
  private readonly organizationsSignal = signal<OrganizationAdminRecord[]>([...MOCK_ORGANIZATIONS]);

  readonly organizations = this.organizationsSignal.asReadonly();
  readonly totalCount = computed(() => this.organizationsSignal().length);

  getById(id: string): OrganizationAdminRecord | undefined {
    return this.organizationsSignal().find((org) => org.id === id);
  }

  query(params: OrganizationListQuery): OrganizationListResult {
    let items = [...this.organizationsSignal()];

    if (params.search.trim()) {
      const term = params.search.trim().toLowerCase();
      items = items.filter(
        (org) =>
          org.name.toLowerCase().includes(term) ||
          org.slug?.toLowerCase().includes(term) ||
          org.contactEmail?.toLowerCase().includes(term) ||
          org.region?.toLowerCase().includes(term),
      );
    }

    if (params.statusFilter !== 'all') {
      items = items.filter((org) => org.status === params.statusFilter);
    }

    if (params.typeFilter !== 'all') {
      items = items.filter((org) => org.type === params.typeFilter);
    }

    if (params.regionFilter) {
      items = items.filter((org) => org.region === params.regionFilter);
    }

    if (params.planFilter) {
      items = items.filter((org) => org.plan === params.planFilter);
    }

    items.sort((a, b) => this.compare(a, b, params.sortField, params.sortDirection));

    const total = items.length;
    const start = (params.page - 1) * params.pageSize;
    const paged = items.slice(start, start + params.pageSize);

    return { items: paged, total, page: params.page, pageSize: params.pageSize };
  }

  create(model: OrganizationFormModel): OrganizationAdminRecord {
    const now = new Date().toISOString();
    const record: OrganizationAdminRecord = {
      id: `org-${crypto.randomUUID().slice(0, 8)}`,
      name: model.name.trim(),
      shortName: model.shortName.trim() || undefined,
      type: model.type,
      status: model.status,
      primaryColor: model.primaryColor || '#1B4D89',
      contactName: model.contactName.trim() || undefined,
      contactEmail: model.contactEmail.trim() || undefined,
      region: model.region.trim() || undefined,
      plan: model.plan.trim() || undefined,
      slug: model.slug.trim() || this.slugify(model.name),
      description: model.description.trim() || undefined,
      memberCount: 1,
      projectCount: 0,
      subscriptionTier: model.plan || 'Growth',
      subscriptionStatus: model.status === 'pending' ? 'trial' : 'active',
      whiteLabelEnabled: model.whiteLabelEnabled,
      supportAccessEnabled: model.supportAccessEnabled,
      createdAt: now,
      updatedAt: now,
    };

    this.organizationsSignal.update((orgs) => [record, ...orgs]);
    return record;
  }

  update(id: string, model: OrganizationFormModel): OrganizationAdminRecord | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }

    const updated: OrganizationAdminRecord = {
      ...existing,
      name: model.name.trim(),
      shortName: model.shortName.trim() || undefined,
      type: model.type,
      status: model.status,
      primaryColor: model.primaryColor || existing.primaryColor,
      contactName: model.contactName.trim() || undefined,
      contactEmail: model.contactEmail.trim() || undefined,
      region: model.region.trim() || undefined,
      plan: model.plan.trim() || undefined,
      slug: model.slug.trim() || existing.slug,
      description: model.description.trim() || undefined,
      whiteLabelEnabled: model.whiteLabelEnabled,
      supportAccessEnabled: model.supportAccessEnabled,
      updatedAt: new Date().toISOString(),
    };

    this.organizationsSignal.update((orgs) =>
      orgs.map((org) => (org.id === id ? updated : org)),
    );
    return updated;
  }

  setStatus(id: string, status: OrganizationAdminStatus): OrganizationAdminRecord | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }

    const updated = { ...existing, status, updatedAt: new Date().toISOString() };
    this.organizationsSignal.update((orgs) =>
      orgs.map((org) => (org.id === id ? updated : org)),
    );
    return updated;
  }

  bulkSetStatus(ids: readonly string[], status: OrganizationAdminStatus): number {
    let count = 0;
    this.organizationsSignal.update((orgs) =>
      orgs.map((org) => {
        if (!ids.includes(org.id)) {
          return org;
        }
        count += 1;
        return { ...org, status, updatedAt: new Date().toISOString() };
      }),
    );
    return count;
  }

  getMembers(organizationId: string): readonly OrganizationMemberRecord[] {
    return MOCK_ORGANIZATION_MEMBERS.filter((m) => m.organizationId === organizationId);
  }

  getActivities(organizationId: string): readonly OrganizationActivityRecord[] {
    return MOCK_ORGANIZATION_ACTIVITIES.filter((a) => a.organizationId === organizationId);
  }

  getStatusHistory(organizationId: string): readonly OrganizationStatusHistoryRecord[] {
    return MOCK_ORGANIZATION_STATUS_HISTORY.filter((h) => h.organizationId === organizationId);
  }

  getAudits(organizationId: string): readonly OrganizationAuditRecord[] {
    return MOCK_ORGANIZATION_AUDITS.filter((a) => a.organizationId === organizationId);
  }

  getRegions(): readonly string[] {
    return [...new Set(this.organizationsSignal().map((o) => o.region).filter(Boolean) as string[])].sort();
  }

  getPlans(): readonly string[] {
    return [...new Set(this.organizationsSignal().map((o) => o.plan).filter(Boolean) as string[])].sort();
  }

  toFormModel(org: OrganizationAdminRecord): OrganizationFormModel {
    return {
      name: org.name,
      shortName: org.shortName ?? '',
      type: org.type,
      status: org.status,
      contactName: org.contactName ?? '',
      contactEmail: org.contactEmail ?? '',
      region: org.region ?? '',
      plan: org.plan ?? '',
      slug: org.slug ?? '',
      description: org.description ?? '',
      primaryColor: org.primaryColor ?? '#1B4D89',
      whiteLabelEnabled: org.whiteLabelEnabled,
      supportAccessEnabled: org.supportAccessEnabled,
    };
  }

  emptyFormModel(): OrganizationFormModel {
    return {
      name: '',
      shortName: '',
      type: 'builder',
      status: 'pending',
      contactName: '',
      contactEmail: '',
      region: '',
      plan: 'Growth',
      slug: '',
      description: '',
      primaryColor: '#1B4D89',
      whiteLabelEnabled: false,
      supportAccessEnabled: false,
    };
  }

  private compare(
    a: OrganizationAdminRecord,
    b: OrganizationAdminRecord,
    field: string,
    direction: 'asc' | 'desc',
  ): number {
    const av = a[field as keyof OrganizationAdminRecord];
    const bv = b[field as keyof OrganizationAdminRecord];
    const multiplier = direction === 'asc' ? 1 : -1;

    if (typeof av === 'number' && typeof bv === 'number') {
      return (av - bv) * multiplier;
    }

    return String(av ?? '').localeCompare(String(bv ?? '')) * multiplier;
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}

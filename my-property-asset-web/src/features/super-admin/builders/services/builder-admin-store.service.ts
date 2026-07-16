import { Injectable, computed, signal } from '@angular/core';

import {
  MOCK_BUILDER_ACTIVITIES,
  MOCK_BUILDER_AUDITS,
  MOCK_BUILDER_CONTACTS,
  MOCK_BUILDER_STATUS_HISTORY,
  MOCK_BUILDERS,
} from '../config/builders.config';
import {
  BuilderActivityRecord,
  BuilderAdminRecord,
  BuilderAdminStatus,
  BuilderAuditRecord,
  BuilderContactRecord,
  BuilderFormModel,
  BuilderListQuery,
  BuilderListResult,
  BuilderStatusHistoryRecord,
} from '../models/builder-admin.model';

@Injectable({ providedIn: 'root' })
export class BuilderAdminStoreService {
  private readonly buildersSignal = signal<BuilderAdminRecord[]>([...MOCK_BUILDERS]);

  readonly builders = this.buildersSignal.asReadonly();
  readonly totalCount = computed(() => this.buildersSignal().length);

  getById(id: string): BuilderAdminRecord | undefined {
    return this.buildersSignal().find((b) => b.id === id);
  }

  query(params: BuilderListQuery): BuilderListResult {
    let items = [...this.buildersSignal()];

    if (params.search.trim()) {
      const term = params.search.trim().toLowerCase();
      items = items.filter(
        (b) =>
          b.companyName.toLowerCase().includes(term) ||
          b.tradingName?.toLowerCase().includes(term) ||
          b.primaryContactEmail.toLowerCase().includes(term) ||
          b.organizationName?.toLowerCase().includes(term) ||
          b.region?.toLowerCase().includes(term),
      );
    }

    if (params.statusFilter !== 'all') {
      items = items.filter((b) => b.status === params.statusFilter);
    }

    if (params.regionFilter) {
      items = items.filter((b) => b.region === params.regionFilter);
    }

    if (params.planFilter) {
      items = items.filter((b) => b.plan === params.planFilter);
    }

    items.sort((a, b) => this.compare(a, b, params.sortField, params.sortDirection));

    const total = items.length;
    const start = (params.page - 1) * params.pageSize;
    return { items: items.slice(start, start + params.pageSize), total, page: params.page, pageSize: params.pageSize };
  }

  create(model: BuilderFormModel): BuilderAdminRecord {
    const now = new Date().toISOString();
    const record: BuilderAdminRecord = {
      id: `bld-${crypto.randomUUID().slice(0, 8)}`,
      companyName: model.companyName.trim(),
      tradingName: model.tradingName.trim() || undefined,
      status: model.status,
      primaryColor: model.primaryColor || '#1B4D89',
      secondaryColor: model.secondaryColor || '#3B82F6',
      registrationNumber: model.registrationNumber.trim() || undefined,
      registeredAt: model.registeredAt || undefined,
      primaryContactName: model.primaryContactName.trim(),
      primaryContactEmail: model.primaryContactEmail.trim(),
      primaryContactPhone: model.primaryContactPhone.trim() || undefined,
      address: {
        street: model.street.trim(),
        city: model.city.trim(),
        state: model.state.trim(),
        postalCode: model.postalCode.trim(),
        country: model.country.trim(),
      },
      organizationId: model.organizationId || undefined,
      organizationName: undefined,
      region: model.region.trim() || undefined,
      plan: model.plan.trim() || undefined,
      projectCount: 0,
      unitCount: 0,
      ownerCount: 0,
      contactCount: 1,
      documentCount: 0,
      invitationCount: 0,
      whiteLabelEnabled: model.whiteLabelEnabled,
      createdAt: now,
      updatedAt: now,
    };

    this.buildersSignal.update((list) => [record, ...list]);
    return record;
  }

  deactivate(id: string): BuilderAdminRecord | undefined {
    return this.setStatus(id, 'inactive');
  }

  inviteBuilderOwner(id: string): { invitationId: string; token: string } | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }

    const invitationId = `inv-${crypto.randomUUID().slice(0, 8)}`;
    const token = crypto.randomUUID().replace(/-/g, '');
    this.buildersSignal.update((list) =>
      list.map((b) =>
        b.id === id
          ? {
              ...b,
              invitationCount: (b.invitationCount ?? 0) + 1,
              status: b.status === 'archived' ? b.status : 'pending',
              updatedAt: new Date().toISOString(),
            }
          : b,
      ),
    );
    return { invitationId, token };
  }

  resendOwnerInvitation(id: string): { invitationId: string; token: string } | undefined {
    return this.inviteBuilderOwner(id);
  }

  update(id: string, model: BuilderFormModel): BuilderAdminRecord | undefined {
    const existing = this.getById(id);
    if (!existing) return undefined;

    const updated: BuilderAdminRecord = {
      ...existing,
      companyName: model.companyName.trim(),
      tradingName: model.tradingName.trim() || undefined,
      status: model.status,
      primaryColor: model.primaryColor,
      secondaryColor: model.secondaryColor,
      registrationNumber: model.registrationNumber.trim() || undefined,
      registeredAt: model.registeredAt || undefined,
      primaryContactName: model.primaryContactName.trim(),
      primaryContactEmail: model.primaryContactEmail.trim(),
      primaryContactPhone: model.primaryContactPhone.trim() || undefined,
      address: {
        street: model.street.trim(),
        city: model.city.trim(),
        state: model.state.trim(),
        postalCode: model.postalCode.trim(),
        country: model.country.trim(),
      },
      organizationId: model.organizationId || undefined,
      region: model.region.trim() || undefined,
      plan: model.plan.trim() || undefined,
      whiteLabelEnabled: model.whiteLabelEnabled,
      updatedAt: new Date().toISOString(),
    };

    this.buildersSignal.update((list) => list.map((b) => (b.id === id ? updated : b)));
    return updated;
  }

  setStatus(id: string, status: BuilderAdminStatus): BuilderAdminRecord | undefined {
    const existing = this.getById(id);
    if (!existing) return undefined;
    const updated = { ...existing, status, updatedAt: new Date().toISOString() };
    this.buildersSignal.update((list) => list.map((b) => (b.id === id ? updated : b)));
    return updated;
  }

  bulkSetStatus(ids: readonly string[], status: BuilderAdminStatus): number {
    let count = 0;
    this.buildersSignal.update((list) =>
      list.map((b) => {
        if (!ids.includes(b.id)) return b;
        count += 1;
        return { ...b, status, updatedAt: new Date().toISOString() };
      }),
    );
    return count;
  }

  getContacts(builderId: string): readonly BuilderContactRecord[] {
    return MOCK_BUILDER_CONTACTS.filter((c) => c.builderId === builderId);
  }

  getActivities(builderId: string): readonly BuilderActivityRecord[] {
    return MOCK_BUILDER_ACTIVITIES.filter((a) => a.builderId === builderId);
  }

  getStatusHistory(builderId: string): readonly BuilderStatusHistoryRecord[] {
    return MOCK_BUILDER_STATUS_HISTORY.filter((h) => h.builderId === builderId);
  }

  getAudits(builderId: string): readonly BuilderAuditRecord[] {
    return MOCK_BUILDER_AUDITS.filter((a) => a.builderId === builderId);
  }

  getRegions(): readonly string[] {
    return [...new Set(this.buildersSignal().map((b) => b.region).filter(Boolean) as string[])].sort();
  }

  getPlans(): readonly string[] {
    return [...new Set(this.buildersSignal().map((b) => b.plan).filter(Boolean) as string[])].sort();
  }

  toFormModel(builder: BuilderAdminRecord): BuilderFormModel {
    return {
      companyName: builder.companyName,
      tradingName: builder.tradingName ?? '',
      status: builder.status,
      registrationNumber: builder.registrationNumber ?? '',
      registeredAt: builder.registeredAt ?? '',
      primaryContactName: builder.primaryContactName,
      primaryContactEmail: builder.primaryContactEmail,
      primaryContactPhone: builder.primaryContactPhone ?? '',
      street: builder.address.street,
      city: builder.address.city,
      state: builder.address.state,
      postalCode: builder.address.postalCode,
      country: builder.address.country,
      organizationId: builder.organizationId ?? '',
      region: builder.region ?? '',
      plan: builder.plan ?? '',
      primaryColor: builder.primaryColor ?? '#1B4D89',
      secondaryColor: builder.secondaryColor ?? '#3B82F6',
      whiteLabelEnabled: builder.whiteLabelEnabled,
    };
  }

  emptyFormModel(): BuilderFormModel {
    return {
      companyName: '',
      tradingName: '',
      status: 'pending',
      registrationNumber: '',
      registeredAt: '',
      primaryContactName: '',
      primaryContactEmail: '',
      primaryContactPhone: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      organizationId: '',
      region: '',
      plan: 'Growth',
      primaryColor: '#1B4D89',
      secondaryColor: '#3B82F6',
      whiteLabelEnabled: false,
    };
  }

  private compare(a: BuilderAdminRecord, b: BuilderAdminRecord, field: string, direction: 'asc' | 'desc'): number {
    const av = a[field as keyof BuilderAdminRecord];
    const bv = b[field as keyof BuilderAdminRecord];
    const m = direction === 'asc' ? 1 : -1;
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * m;
    return String(av ?? '').localeCompare(String(bv ?? '')) * m;
  }
}

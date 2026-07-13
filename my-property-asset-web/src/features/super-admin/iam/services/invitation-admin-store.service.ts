import { Injectable, signal } from '@angular/core';

import { PlatformRole } from '@core/rbac/models/permission.model';

import { MOCK_INVITATIONS, MOCK_INVITATION_TIMELINE } from '../config/iam.config';
import {
  InvitationAdminRecord,
  InvitationFormModel,
  InvitationListQuery,
  InvitationListResult,
  InvitationStatus,
  InvitationTimelineEvent,
} from '../models/invitation-admin.model';

@Injectable({ providedIn: 'root' })
export class InvitationAdminStoreService {
  private readonly invitationsSignal = signal<InvitationAdminRecord[]>([...MOCK_INVITATIONS]);

  readonly invitations = this.invitationsSignal.asReadonly();

  getById(id: string): InvitationAdminRecord | undefined {
    return this.invitationsSignal().find((i) => i.id === id);
  }

  query(params: InvitationListQuery): InvitationListResult {
    let items = [...this.invitationsSignal()];

    if (params.search.trim()) {
      const term = params.search.trim().toLowerCase();
      items = items.filter(
        (i) =>
          i.email.toLowerCase().includes(term) ||
          i.name?.toLowerCase().includes(term) ||
          i.organizationName?.toLowerCase().includes(term),
      );
    }

    if (params.statusFilter !== 'all') {
      items = items.filter((i) => i.status === params.statusFilter);
    }

    if (params.roleFilter !== 'all') {
      items = items.filter((i) => i.role === params.roleFilter);
    }

    items.sort((a, b) => {
      const av = a[params.sortField as keyof InvitationAdminRecord];
      const bv = b[params.sortField as keyof InvitationAdminRecord];
      const m = params.sortDirection === 'asc' ? 1 : -1;
      return String(av ?? '').localeCompare(String(bv ?? '')) * m;
    });

    const total = items.length;
    const start = (params.page - 1) * params.pageSize;
    return { items: items.slice(start, start + params.pageSize), total, page: params.page, pageSize: params.pageSize };
  }

  create(model: InvitationFormModel): InvitationAdminRecord {
    const now = new Date().toISOString();
    const expires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const record: InvitationAdminRecord = {
      id: `inv-${crypto.randomUUID().slice(0, 8)}`,
      email: model.email.trim(),
      name: model.name.trim() || undefined,
      role: model.role,
      organizationId: model.organizationId || undefined,
      invitedBy: 'Current Admin',
      invitedByEmail: 'admin@mypropertyasset.com',
      status: 'pending',
      sentAt: now,
      expiresAt: expires,
      resendCount: 0,
    };
    this.invitationsSignal.update((list) => [record, ...list]);
    return record;
  }

  resend(id: string): InvitationAdminRecord | undefined {
    const existing = this.getById(id);
    if (!existing || existing.status !== 'pending') return undefined;
    const updated = { ...existing, resendCount: existing.resendCount + 1, sentAt: new Date().toISOString() };
    this.invitationsSignal.update((list) => list.map((i) => (i.id === id ? updated : i)));
    return updated;
  }

  cancel(id: string): InvitationAdminRecord | undefined {
    const existing = this.getById(id);
    if (!existing || existing.status !== 'pending') return undefined;
    const updated = { ...existing, status: 'cancelled' as InvitationStatus, cancelledAt: new Date().toISOString() };
    this.invitationsSignal.update((list) => list.map((i) => (i.id === id ? updated : i)));
    return updated;
  }

  bulkResend(ids: readonly string[]): number {
    let count = 0;
    for (const id of ids) {
      if (this.resend(id)) count += 1;
    }
    return count;
  }

  bulkCancel(ids: readonly string[]): number {
    let count = 0;
    for (const id of ids) {
      if (this.cancel(id)) count += 1;
    }
    return count;
  }

  getTimeline(invitationId: string): readonly InvitationTimelineEvent[] {
    return MOCK_INVITATION_TIMELINE.filter((e) => e.invitationId === invitationId);
  }

  emptyFormModel(): InvitationFormModel {
    return { email: '', name: '', role: 'builder-org-member' as PlatformRole, organizationId: '', message: '' };
  }
}

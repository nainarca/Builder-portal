import { Injectable } from '@angular/core';

import {
  MOCK_COMMUNICATION_AUDIT,
  MOCK_COMMUNICATIONS,
} from '../config/communications.config';
import {
  BuilderCommunication,
  CommunicationAuditEvent,
  CommunicationFormModel,
  CommunicationListQuery,
  CommunicationListResult,
} from '../models/communication.model';
import { CommunicationRepository } from './communication.repository';

@Injectable({ providedIn: 'root' })
export class InMemoryCommunicationRepository extends CommunicationRepository {
  private readonly campaigns = new Map<string, BuilderCommunication>(
    MOCK_COMMUNICATIONS.map((item) => [item.id, item]),
  );
  private readonly auditEvents: CommunicationAuditEvent[] = [...MOCK_COMMUNICATION_AUDIT];

  list(organizationId: string, query: CommunicationListQuery): CommunicationListResult {
    let items = [...this.campaigns.values()].filter((item) => item.organizationId === organizationId);

    if (query.search.trim()) {
      const term = query.search.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.shortDescription.toLowerCase().includes(term),
      );
    }
    if (query.communicationType !== 'all') {
      items = items.filter((item) => item.communicationType === query.communicationType);
    }
    if (query.status !== 'all') {
      items = items.filter((item) => item.status === query.status);
    }
    if (query.priority !== 'all') {
      items = items.filter((item) => item.priority === query.priority);
    }
    if (query.projectId) {
      items = items.filter((item) => item.audienceConfig.projectId === query.projectId);
    }
    if (query.publishDateFrom) {
      const from = new Date(query.publishDateFrom).getTime();
      items = items.filter((item) => {
        const published = item.publishedAt ?? item.publishAt;
        return published ? new Date(published).getTime() >= from : false;
      });
    }
    if (query.publishDateTo) {
      const to = new Date(query.publishDateTo).getTime();
      items = items.filter((item) => {
        const published = item.publishedAt ?? item.publishAt;
        return published ? new Date(published).getTime() <= to : false;
      });
    }

    items.sort((a, b) => this.compare(a, b, query.sortField, query.sortDirection));
    const total = items.length;
    const start = (query.page - 1) * query.pageSize;
    return {
      items: items.slice(start, start + query.pageSize),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  getById(id: string): BuilderCommunication | undefined {
    return this.campaigns.get(id);
  }

  create(
    organizationId: string,
    model: CommunicationFormModel,
    actorLabel: string,
  ): BuilderCommunication {
    const now = new Date().toISOString();
    const id = `comm-${crypto.randomUUID().slice(0, 8)}`;
    const record = this.toRecord(id, organizationId, model, 'draft', actorLabel, now);
    this.campaigns.set(id, record);
    this.appendAudit(id, organizationId, 'created', actorLabel, 'Communication draft created');
    return record;
  }

  update(
    id: string,
    model: CommunicationFormModel,
    actorLabel: string,
  ): BuilderCommunication | undefined {
    const existing = this.campaigns.get(id);
    if (!existing || existing.status === 'archived' || existing.disabledByPlatform) {
      return undefined;
    }
    const updated = this.toRecord(
      id,
      existing.organizationId,
      model,
      existing.status,
      actorLabel,
      new Date().toISOString(),
      existing,
    );
    this.campaigns.set(id, updated);
    this.appendAudit(id, existing.organizationId, 'updated', actorLabel);
    return updated;
  }

  publish(id: string, actorLabel: string, publishAt?: string): BuilderCommunication | undefined {
    const existing = this.campaigns.get(id);
    if (!existing || existing.disabledByPlatform) {
      return undefined;
    }
    const now = publishAt ?? new Date().toISOString();
    const updated: BuilderCommunication = {
      ...existing,
      status: 'published',
      publishAt: now,
      publishedAt: now,
      startAt: existing.startAt || now,
      deliveryStatus: 'delivered',
      updatedAt: new Date().toISOString(),
      publishedBy: actorLabel,
      updatedBy: actorLabel,
    };
    this.campaigns.set(id, updated);
    this.appendAudit(id, existing.organizationId, 'published', actorLabel, 'Published to owners');
    return updated;
  }

  schedule(id: string, actorLabel: string, publishAt: string): BuilderCommunication | undefined {
    const existing = this.campaigns.get(id);
    if (!existing || existing.disabledByPlatform) {
      return undefined;
    }
    const updated: BuilderCommunication = {
      ...existing,
      status: 'scheduled',
      publishAt,
      deliveryStatus: 'prepared',
      updatedAt: new Date().toISOString(),
      updatedBy: actorLabel,
    };
    this.campaigns.set(id, updated);
    this.appendAudit(id, existing.organizationId, 'scheduled', actorLabel, `Scheduled for ${publishAt}`);
    return updated;
  }

  archive(id: string, actorLabel: string): BuilderCommunication | undefined {
    return this.setStatus(id, 'archived', actorLabel, 'archived', 'Communication archived');
  }

  cancel(id: string, actorLabel: string): BuilderCommunication | undefined {
    return this.setStatus(id, 'cancelled', actorLabel, 'cancelled', 'Communication cancelled');
  }

  disable(id: string, actorLabel: string): BuilderCommunication | undefined {
    const existing = this.campaigns.get(id);
    if (!existing) {
      return undefined;
    }
    const updated: BuilderCommunication = {
      ...existing,
      disabledByPlatform: true,
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: actorLabel,
    };
    this.campaigns.set(id, updated);
    this.appendAudit(id, existing.organizationId, 'disabled', actorLabel, 'Disabled by platform admin');
    return updated;
  }

  softDelete(id: string, actorLabel: string): BuilderCommunication | undefined {
    const existing = this.campaigns.get(id);
    if (!existing) {
      return undefined;
    }
    this.campaigns.delete(id);
    this.appendAudit(id, existing.organizationId, 'deleted', actorLabel, 'Soft deleted');
    return existing;
  }

  setRecipientCount(id: string, count: number): void {
    const existing = this.campaigns.get(id);
    if (!existing) {
      return;
    }
    this.campaigns.set(id, { ...existing, recipientCount: count });
  }

  listAudit(campaignId: string): readonly CommunicationAuditEvent[] {
    return this.auditEvents
      .filter((event) => event.campaignId === campaignId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  listAll(organizationId?: string): readonly BuilderCommunication[] {
    const items = [...this.campaigns.values()];
    return organizationId ? items.filter((item) => item.organizationId === organizationId) : items;
  }

  private setStatus(
    id: string,
    status: BuilderCommunication['status'],
    actorLabel: string,
    action: CommunicationAuditEvent['action'],
    detail: string,
  ): BuilderCommunication | undefined {
    const existing = this.campaigns.get(id);
    if (!existing) {
      return undefined;
    }
    const now = new Date().toISOString();
    const updated: BuilderCommunication = {
      ...existing,
      status,
      updatedAt: now,
      updatedBy: actorLabel,
      archivedAt: status === 'archived' ? now : existing.archivedAt,
      cancelledAt: status === 'cancelled' ? now : existing.cancelledAt,
    };
    this.campaigns.set(id, updated);
    this.appendAudit(id, existing.organizationId, action, actorLabel, detail);
    return updated;
  }

  private toRecord(
    id: string,
    organizationId: string,
    model: CommunicationFormModel,
    status: BuilderCommunication['status'],
    actorLabel: string,
    now: string,
    existing?: BuilderCommunication,
  ): BuilderCommunication {
    return {
      id,
      organizationId,
      communicationType: model.communicationType,
      title: model.title.trim(),
      shortDescription: model.shortDescription.trim(),
      detailedContent: model.detailedContent.trim(),
      bannerImageUrl: model.bannerImageUrl.trim() || undefined,
      attachmentUrl: model.attachmentUrl.trim() || undefined,
      cta: {
        label: model.ctaLabel.trim() || undefined,
        externalUrl: model.ctaExternalUrl.trim() || undefined,
        internalRoute: model.ctaInternalRoute.trim() || undefined,
      },
      priority: model.priority,
      audienceType: model.audienceType,
      audienceConfig: { ...model.audienceConfig },
      status,
      publishAt: model.publishAt || existing?.publishAt,
      startAt: model.startAt || existing?.startAt,
      expiresAt: model.expiresAt || undefined,
      recipientCount: existing?.recipientCount ?? 0,
      deliveryStatus: existing?.deliveryStatus ?? 'prepared',
      moderated: existing?.moderated ?? false,
      disabledByPlatform: existing?.disabledByPlatform ?? false,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      publishedAt: existing?.publishedAt,
      archivedAt: existing?.archivedAt,
      cancelledAt: existing?.cancelledAt,
      createdBy: existing?.createdBy ?? actorLabel,
      updatedBy: actorLabel,
      publishedBy: existing?.publishedBy,
    };
  }

  private appendAudit(
    campaignId: string,
    organizationId: string,
    action: CommunicationAuditEvent['action'],
    actorLabel: string,
    detail?: string,
  ): void {
    this.auditEvents.unshift({
      id: `audit-${crypto.randomUUID().slice(0, 8)}`,
      campaignId,
      organizationId,
      action,
      actorLabel,
      detail,
      createdAt: new Date().toISOString(),
    });
  }

  private compare(
    a: BuilderCommunication,
    b: BuilderCommunication,
    field: string,
    direction: 'asc' | 'desc',
  ): number {
    const factor = direction === 'asc' ? 1 : -1;
    switch (field) {
      case 'title':
        return a.title.localeCompare(b.title) * factor;
      case 'priority': {
        const order = { low: 1, normal: 2, high: 3, critical: 4 };
        return (order[a.priority] - order[b.priority]) * factor;
      }
      case 'publishedAt':
        return (
          (new Date(a.publishedAt ?? a.createdAt).getTime() -
            new Date(b.publishedAt ?? b.createdAt).getTime()) *
          factor
        );
      default:
        return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * factor;
    }
  }
}

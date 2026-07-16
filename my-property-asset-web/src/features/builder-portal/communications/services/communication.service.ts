import { Injectable, computed, inject, signal } from '@angular/core';

import { CurrentOrganizationService } from '@core/organization-context';
import { CurrentUserService } from '@core/auth';
import {
  BuilderCommunication,
  CommunicationFormModel,
  CommunicationListQuery,
} from '../models/communication.model';
import { CommunicationRepository } from '../repositories/communication.repository';
import { CommunicationAudienceService } from './communication-audience.service';
import { CommunicationDeliveryService } from './communication-delivery.service';
import { PlanEnforcementService } from '../../subscription/services/plan-enforcement.service';

@Injectable({ providedIn: 'root' })
export class CommunicationService {
  private readonly repository = inject(CommunicationRepository);
  private readonly audience = inject(CommunicationAudienceService);
  private readonly delivery = inject(CommunicationDeliveryService);
  private readonly currentOrganization = inject(CurrentOrganizationService);
  private readonly currentUser = inject(CurrentUserService);
  private readonly enforcement = inject(PlanEnforcementService);

  private readonly querySignal = signal<CommunicationListQuery>({
    search: '',
    communicationType: 'all',
    status: 'all',
    priority: 'all',
    projectId: '',
    publishDateFrom: '',
    publishDateTo: '',
    sortField: 'updatedAt',
    sortDirection: 'desc',
    page: 1,
    pageSize: 10,
  });

  readonly query = this.querySignal.asReadonly();

  readonly listResult = computed(() => {
    const organizationId = this.currentOrganization.organizationId() ?? 'org-builder-demo';
    return this.repository.list(organizationId, this.querySignal());
  });

  getById(id: string): BuilderCommunication | undefined {
    return this.repository.getById(id);
  }

  setQuery(patch: Partial<CommunicationListQuery>): void {
    this.querySignal.update((current) => ({ ...current, ...patch }));
  }

  create(model: CommunicationFormModel): BuilderCommunication {
    const organizationId = this.currentOrganization.organizationId() ?? 'org-builder-demo';
    const created = this.repository.create(organizationId, model, this.actorLabel());
    this.syncRecipientCount(created.id, model);
    return created;
  }

  update(id: string, model: CommunicationFormModel): BuilderCommunication | undefined {
    const updated = this.repository.update(id, model, this.actorLabel());
    if (updated) {
      this.syncRecipientCount(id, model);
    }
    return updated;
  }

  saveDraft(model: CommunicationFormModel, id?: string): BuilderCommunication {
    return id ? this.update(id, model) ?? this.create(model) : this.create(model);
  }

  publishNow(id: string): BuilderCommunication | undefined {
    const check = this.enforcement.check('send_communication');
    if (!check.allowed) {
      throw new Error(check.reason ?? 'Plan limit reached for communications.');
    }
    const communication = this.repository.getById(id);
    if (!communication) {
      return undefined;
    }
    const recipients = this.audience.resolveRecipients(
      communication.audienceType,
      communication.audienceConfig,
    );
    this.repository.setRecipientCount(id, recipients.length);
    const published = this.repository.publish(id, this.actorLabel());
    if (published) {
      this.delivery.prepareDeliveries(published, recipients);
    }
    return published;
  }

  schedule(id: string, publishAt: string): BuilderCommunication | undefined {
    const communication = this.repository.getById(id);
    if (!communication) {
      return undefined;
    }
    const recipients = this.audience.resolveRecipients(
      communication.audienceType,
      communication.audienceConfig,
    );
    this.repository.setRecipientCount(id, recipients.length);
    return this.repository.schedule(id, this.actorLabel(), publishAt);
  }

  archive(id: string): BuilderCommunication | undefined {
    return this.repository.archive(id, this.actorLabel());
  }

  cancel(id: string): BuilderCommunication | undefined {
    return this.repository.cancel(id, this.actorLabel());
  }

  disable(id: string): BuilderCommunication | undefined {
    return this.repository.disable(id, this.actorLabel());
  }

  previewRecipients(model: CommunicationFormModel) {
    return this.audience.resolveRecipients(model.audienceType, model.audienceConfig);
  }

  listAudit(id: string) {
    return this.repository.listAudit(id);
  }

  toFormModel(communication: BuilderCommunication): CommunicationFormModel {
    return {
      communicationType: communication.communicationType,
      title: communication.title,
      shortDescription: communication.shortDescription,
      detailedContent: communication.detailedContent,
      bannerImageUrl: communication.bannerImageUrl ?? '',
      attachmentUrl: communication.attachmentUrl ?? '',
      ctaLabel: communication.cta.label ?? '',
      ctaExternalUrl: communication.cta.externalUrl ?? '',
      ctaInternalRoute: communication.cta.internalRoute ?? '',
      priority: communication.priority,
      audienceType: communication.audienceType,
      audienceConfig: { ...communication.audienceConfig },
      publishAt: communication.publishAt ?? '',
      startAt: communication.startAt ?? '',
      expiresAt: communication.expiresAt ?? '',
    };
  }

  listAllForAdmin(organizationId?: string): readonly BuilderCommunication[] {
    return this.repository.listAll(organizationId);
  }

  private syncRecipientCount(id: string, model: CommunicationFormModel): void {
    const recipients = this.audience.resolveRecipients(model.audienceType, model.audienceConfig);
    this.repository.setRecipientCount(id, recipients.length);
  }

  private actorLabel(): string {
    const user = this.currentUser.user();
    return user?.email ?? 'Builder User';
  }
}

import { Injectable, computed, inject } from '@angular/core';

import { CurrentOrganizationService } from '@core/organization-context';
import { CommunicationRepository } from '../repositories/communication.repository';
import { CommunicationDashboardSummary } from '../models/communication.model';

@Injectable({ providedIn: 'root' })
export class CommunicationDashboardService {
  private readonly repository = inject(CommunicationRepository);
  private readonly currentOrganization = inject(CurrentOrganizationService);

  readonly summary = computed<CommunicationDashboardSummary>(() => {
    const organizationId = this.currentOrganization.organizationId() ?? 'org-builder-demo';
    const items = this.repository.listAll(organizationId);
    return {
      draftCount: items.filter((item) => item.status === 'draft').length,
      publishedCount: items.filter((item) => item.status === 'published').length,
      scheduledCount: items.filter((item) => item.status === 'scheduled').length,
      expiredCount: items.filter((item) => item.status === 'expired').length,
      totalRecipients: items.reduce((sum, item) => sum + item.recipientCount, 0),
      deliveryPreparedCount: items.filter((item) => item.deliveryStatus === 'prepared').length,
    };
  });
}

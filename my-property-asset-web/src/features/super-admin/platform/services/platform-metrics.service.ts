import { Injectable, computed, inject } from '@angular/core';

import { BuilderAdminStoreService } from '../../builders/services/builder-admin-store.service';
import { SubscriptionService } from '@features/builder-portal/subscription/services/subscription.service';
import { CommunicationService } from '@features/builder-portal/communications/services/communication.service';
import { PlatformMetricsSnapshot } from '../models/platform.model';
import { SupportTicketRepository } from '../repositories/platform.repository';

@Injectable({ providedIn: 'root' })
export class PlatformMetricsService {
  private readonly builders = inject(BuilderAdminStoreService);
  private readonly subscriptions = inject(SubscriptionService);
  private readonly communications = inject(CommunicationService);
  private readonly tickets = inject(SupportTicketRepository);

  readonly snapshot = computed<PlatformMetricsSnapshot>(() => this.collect());

  private collect(): PlatformMetricsSnapshot {
    const builders = this.builders.builders();
    const activeBuilders = builders.filter((b) => b.status === 'active').length;
    const suspendedBuilders = builders.filter((b) => b.status === 'inactive').length;
    const expiredBuilders = builders.filter((b) => b.status === 'archived').length;
    const allSubs = this.subscriptions.listAllSubscriptions();
    const trialBuilders = allSubs.filter((s) => s.status === 'trial').length;
    const activeSubscriptions = allSubs.filter(
      (s) => s.status === 'active' || s.status === 'trial',
    ).length;

    const totalProjects = builders.reduce((sum, b) => sum + b.projectCount, 0);
    const totalUnits = builders.reduce((sum, b) => sum + b.unitCount, 0);
    const totalActiveOwners = builders.reduce((sum, b) => sum + b.ownerCount, 0);
    const totalDigitalHandovers = Math.round(totalUnits * 0.35);
    const storageUsageGb = Math.round(totalUnits * 0.08 + builders.length * 12);
    const openSupportTickets = this.tickets
      .list()
      .filter((t) => t.status === 'open' || t.status === 'in_progress' || t.status === 'waiting_builder')
      .length;

    const monthlyGrowthPercent =
      builders.length === 0 ? 0 : Math.round((activeBuilders / builders.length) * 18);

    const platformHealth: PlatformMetricsSnapshot['platformHealth'] =
      openSupportTickets > 8 ? 'degraded' : 'healthy';

    // Touch communications for live readiness (count only)
    void this.communications.listAllForAdmin().length;

    return {
      totalBuilders: builders.length,
      activeBuilders,
      trialBuilders,
      expiredBuilders,
      suspendedBuilders,
      totalProjects,
      totalUnits,
      totalActiveOwners,
      totalDigitalHandovers,
      storageUsageGb,
      monthlyGrowthPercent,
      platformHealth,
      openSupportTickets,
      activeSubscriptions,
    };
  }
}

import { Injectable, computed, inject } from '@angular/core';

import { CommunicationService } from '@features/builder-portal/communications/services/communication.service';
import { MOCK_ANALYTICS } from '../config/platform.config';
import { PlatformAnalyticsModel } from '../models/platform.model';
import { PlatformMetricsService } from './platform-metrics.service';

@Injectable({ providedIn: 'root' })
export class PlatformAnalyticsService {
  private readonly metrics = inject(PlatformMetricsService);
  private readonly communications = inject(CommunicationService);

  readonly model = computed<PlatformAnalyticsModel>(() => {
    const snapshot = this.metrics.snapshot();
    const communicationActivity = this.communications.listAllForAdmin().length;
    return {
      ...MOCK_ANALYTICS,
      storageUsageGb: snapshot.storageUsageGb,
      communicationActivity,
      systemUsageScore: snapshot.platformHealth === 'healthy' ? 92 : 74,
      builderGrowth: [
        ...MOCK_ANALYTICS.builderGrowth.slice(0, -1),
        {
          label: 'Jul',
          value: snapshot.totalBuilders || MOCK_ANALYTICS.builderGrowth.at(-1)?.value || 0,
        },
      ],
      projectGrowth: [
        ...MOCK_ANALYTICS.projectGrowth.slice(0, -1),
        {
          label: 'Jul',
          value: snapshot.totalProjects || MOCK_ANALYTICS.projectGrowth.at(-1)?.value || 0,
        },
      ],
    };
  });
}

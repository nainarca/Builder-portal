import { TestBed } from '@angular/core/testing';

import { CommunicationService } from '@features/builder-portal/communications/services/communication.service';
import { MOCK_ANALYTICS } from '../config/platform.config';
import { PlatformAnalyticsService } from './platform-analytics.service';
import { PlatformMetricsService } from './platform-metrics.service';

describe('PlatformAnalyticsService (P16)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlatformAnalyticsService,
        {
          provide: PlatformMetricsService,
          useValue: {
            snapshot: () => ({
              totalBuilders: 10,
              totalProjects: 55,
              storageUsageGb: 120,
              platformHealth: 'healthy',
            }),
          },
        },
        {
          provide: CommunicationService,
          useValue: { listAllForAdmin: () => [{}, {}, {}] },
        },
      ],
    });
  });

  it('merges live metrics into analytics model', () => {
    const service = TestBed.inject(PlatformAnalyticsService);
    const model = service.model();
    expect(model.communicationActivity).toBe(3);
    expect(model.storageUsageGb).toBe(120);
    expect(model.builderGrowth.at(-1)?.value).toBe(10);
    expect(model.subscriptionRevenuePlaceholder.length).toBe(
      MOCK_ANALYTICS.subscriptionRevenuePlaceholder.length,
    );
  });
});

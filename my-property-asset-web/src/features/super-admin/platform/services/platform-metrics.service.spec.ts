import { TestBed } from '@angular/core/testing';

import { BuilderAdminStoreService } from '../../builders/services/builder-admin-store.service';
import { SubscriptionService } from '@features/builder-portal/subscription/services/subscription.service';
import { CommunicationService } from '@features/builder-portal/communications/services/communication.service';
import {
  InMemoryPlatformAuditRepository,
  InMemorySupportTicketRepository,
} from '../repositories/in-memory-platform.repository';
import { SupportTicketRepository } from '../repositories/platform.repository';
import { PlatformMetricsService } from './platform-metrics.service';

describe('PlatformMetricsService (P16)', () => {
  let service: PlatformMetricsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlatformMetricsService,
        InMemorySupportTicketRepository,
        { provide: SupportTicketRepository, useExisting: InMemorySupportTicketRepository },
        {
          provide: BuilderAdminStoreService,
          useValue: {
            builders: () => [
              {
                id: 'b1',
                status: 'active',
                projectCount: 3,
                unitCount: 40,
                ownerCount: 20,
              },
              {
                id: 'b2',
                status: 'inactive',
                projectCount: 1,
                unitCount: 10,
                ownerCount: 5,
              },
            ],
          },
        },
        {
          provide: SubscriptionService,
          useValue: {
            listAllSubscriptions: () => [
              { status: 'trial' },
              { status: 'active' },
            ],
          },
        },
        {
          provide: CommunicationService,
          useValue: { listAllForAdmin: () => [{ id: 'c1' }] },
        },
      ],
    });
    service = TestBed.inject(PlatformMetricsService);
  });

  it('aggregates builder and subscription metrics', () => {
    const snapshot = service.snapshot();
    expect(snapshot.totalBuilders).toBe(2);
    expect(snapshot.activeBuilders).toBe(1);
    expect(snapshot.suspendedBuilders).toBe(1);
    expect(snapshot.trialBuilders).toBe(1);
    expect(snapshot.totalProjects).toBe(4);
    expect(snapshot.totalUnits).toBe(50);
    expect(snapshot.platformHealth).toBeTruthy();
  });
});

describe('PlatformAuditRepository (P16)', () => {
  it('appends immutable audit events', () => {
    const repo = new InMemoryPlatformAuditRepository();
    const before = repo.list().length;
    const event = repo.append({
      actorLabel: 'tester',
      category: 'system',
      action: 'smoke',
      summary: 'Smoke audit event',
    });
    expect(event.id).toContain('aud-');
    expect(repo.list().length).toBe(before + 1);
  });
});

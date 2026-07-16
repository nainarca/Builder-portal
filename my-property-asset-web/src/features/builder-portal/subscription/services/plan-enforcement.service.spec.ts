import { TestBed } from '@angular/core/testing';

import { CurrentOrganizationService } from '@core/organization-context';
import { InMemorySubscriptionRepository } from '../repositories/in-memory-subscription.repository';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { PlanEnforcementService } from './plan-enforcement.service';
import { ProjectStoreService } from '../../projects/services/project-store.service';
import { UnitStoreService } from '../../projects/units/services/unit-store.service';
import { OwnerStoreService } from '../../owners/services/owner-store.service';
import { InMemoryBuilderBuildingRepository } from '../../projects/buildings/repositories/in-memory-builder-building.repository';

describe('PlanEnforcementService (P15)', () => {
  let service: PlanEnforcementService;
  let repository: InMemorySubscriptionRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlanEnforcementService,
        InMemorySubscriptionRepository,
        { provide: SubscriptionRepository, useExisting: InMemorySubscriptionRepository },
        {
          provide: CurrentOrganizationService,
          useValue: { organizationId: () => 'org-builder-demo' },
        },
        {
          provide: ProjectStoreService,
          useValue: { projects: () => Array.from({ length: 30 }, (_, i) => ({ id: `p${i}`, archived: false })) },
        },
        {
          provide: UnitStoreService,
          useValue: { units: () => [{ id: 'u1', archived: false }] },
        },
        {
          provide: OwnerStoreService,
          useValue: { owners: () => [{ id: 'o1', archived: false }] },
        },
        {
          provide: InMemoryBuilderBuildingRepository,
          useValue: { getAll: () => [{ id: 'b1', archived: false }] },
        },
      ],
    });
    service = TestBed.inject(PlanEnforcementService);
    repository = TestBed.inject(InMemorySubscriptionRepository);
  });

  it('blocks create_project when project limit is exceeded', () => {
    repository.assignPlan('org-builder-demo', 'plan-starter', 'active');
    const result = service.check('create_project');
    expect(result.allowed).toBeFalse();
    expect(result.upgradeRequired).toBeTrue();
    expect(result.reason).toContain('Projects limit reached');
  });

  it('allows create_unit when under limit', () => {
    repository.assignPlan('org-builder-demo', 'plan-professional', 'active');
    const result = service.check('create_unit');
    expect(result.allowed).toBeTrue();
  });

  it('blocks actions when subscription is suspended', () => {
    repository.assignPlan('org-builder-demo', 'plan-professional', 'active');
    repository.suspend('org-builder-demo');
    const result = service.check('upload_document');
    expect(result.allowed).toBeFalse();
    expect(result.reason).toContain('suspended');
  });
});

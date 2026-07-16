import { TestBed } from '@angular/core/testing';

import { CurrentOrganizationService } from '@core/organization-context';
import { InMemorySubscriptionRepository } from '../repositories/in-memory-subscription.repository';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { ManualPaymentGatewayProvider, PaymentGatewayProvider } from '../providers/payment-gateway.provider';
import { SubscriptionService } from './subscription.service';
import { PlanEnforcementService } from './plan-enforcement.service';

describe('SubscriptionService (P15)', () => {
  let service: SubscriptionService;
  let repository: InMemorySubscriptionRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SubscriptionService,
        InMemorySubscriptionRepository,
        { provide: SubscriptionRepository, useExisting: InMemorySubscriptionRepository },
        { provide: PaymentGatewayProvider, useClass: ManualPaymentGatewayProvider },
        {
          provide: CurrentOrganizationService,
          useValue: { organizationId: () => 'org-builder-demo' },
        },
        {
          provide: PlanEnforcementService,
          useValue: {
            usage: () => ({
              projects: 2,
              buildings: 3,
              units: 10,
              owners: 8,
              staff: 4,
              storageGb: 5,
              monthlyNotifications: 12,
            }),
            remainingLimits: () => ({ projects: 23, units: 1990, whiteLabel: true }),
          },
        },
      ],
    });
    service = TestBed.inject(SubscriptionService);
    repository = TestBed.inject(InMemorySubscriptionRepository);
  });

  it('lists public plans including Free Trial through Enterprise', () => {
    const codes = service.listPublicPlans().map((plan) => plan.code);
    expect(codes).toContain('free_trial');
    expect(codes).toContain('starter');
    expect(codes).toContain('professional');
    expect(codes).toContain('enterprise');
  });

  it('upgrades active organization subscription', () => {
    const upgraded = service.upgrade('plan-enterprise');
    expect(upgraded?.planCode).toBe('enterprise');
    expect(upgraded?.status).toBe('active');
  });

  it('renews and generates an invoice', () => {
    const before = service.listInvoices().length;
    const renewed = service.renew();
    expect(renewed?.status).toBe('active');
    expect(service.listInvoices().length).toBeGreaterThan(before);
  });

  it('suspends and reactivates via repository', () => {
    expect(repository.suspend('org-builder-demo')?.status).toBe('suspended');
    expect(repository.reactivate('org-builder-demo')?.status).toBe('active');
  });

  it('creates payment intent through gateway abstraction', async () => {
    const result = await service.beginRenewalCheckout();
    expect(result.intentId).toBeTruthy();
    expect(result.message).toContain('Manual payment');
  });
});

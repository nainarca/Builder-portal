import { TestBed } from '@angular/core/testing';

import { InMemorySubscriptionRepository } from '../repositories/in-memory-subscription.repository';
import { SubscriptionRepository } from '../repositories/subscription.repository';

describe('InMemorySubscriptionRepository (P15)', () => {
  let repository: InMemorySubscriptionRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InMemorySubscriptionRepository,
        { provide: SubscriptionRepository, useExisting: InMemorySubscriptionRepository },
      ],
    });
    repository = TestBed.inject(InMemorySubscriptionRepository);
  });

  it('seeds Free Trial, Starter, Professional, Enterprise, and Custom plans', () => {
    const codes = repository.listPlans(true).map((plan) => plan.code);
    expect(codes).toEqual(
      jasmine.arrayContaining(['free_trial', 'starter', 'professional', 'enterprise', 'custom']),
    );
  });

  it('enforces one active subscription per organization', () => {
    repository.assignPlan('org-x', 'plan-starter', 'active');
    repository.assignPlan('org-x', 'plan-professional', 'active');
    const active = repository.listSubscriptions('org-x').filter(
      (item) => item.status === 'trial' || item.status === 'active' || item.status === 'pending_payment',
    );
    expect(active.length).toBe(1);
    expect(active[0]?.planCode).toBe('professional');
  });

  it('extends trial window', () => {
    repository.assignPlan('org-y', 'plan-free-trial', 'trial', 7);
    const extended = repository.extendTrial('org-y', 5);
    expect(extended?.status).toBe('trial');
    expect(extended?.trialEndsAt).toBeTruthy();
  });

  it('generates invoice numbers', () => {
    repository.assignPlan('org-z', 'plan-starter', 'active');
    const invoice = repository.generateInvoice('org-z');
    expect(invoice?.invoiceNumber).toMatch(/^INV-/);
    expect(invoice?.status).toBe('open');
  });
});

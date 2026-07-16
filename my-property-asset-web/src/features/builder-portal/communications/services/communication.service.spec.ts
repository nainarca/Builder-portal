import { TestBed } from '@angular/core/testing';

import { CurrentOrganizationService } from '@core/organization-context';
import { CurrentUserService } from '@core/auth';
import { DEFAULT_COMMUNICATION_FORM } from '../config/communications.config';
import { CommunicationRepository } from '../repositories/communication.repository';
import { InMemoryCommunicationRepository } from '../repositories/in-memory-communication.repository';
import { CommunicationAudienceService } from '../services/communication-audience.service';
import { CommunicationDeliveryService } from '../services/communication-delivery.service';
import { CommunicationService } from '../services/communication.service';

describe('CommunicationService (P14)', () => {
  let service: CommunicationService;
  let audience: jasmine.SpyObj<CommunicationAudienceService>;

  beforeEach(() => {
    audience = jasmine.createSpyObj('CommunicationAudienceService', ['resolveRecipients']);
    audience.resolveRecipients.and.returnValue([
      { ownerId: 'owner-001', ownerName: 'Priya Sharma', assignmentId: 'a1', unitId: 'u1', projectId: 'proj-001' },
    ]);

    TestBed.configureTestingModule({
      providers: [
        CommunicationService,
        CommunicationDeliveryService,
        InMemoryCommunicationRepository,
        { provide: CommunicationRepository, useExisting: InMemoryCommunicationRepository },
        { provide: CommunicationAudienceService, useValue: audience },
        {
          provide: CurrentOrganizationService,
          useValue: { organizationId: () => 'org-builder-demo' },
        },
        {
          provide: CurrentUserService,
          useValue: { user: () => ({ email: 'tester@example.com' }) },
        },
      ],
    });
    service = TestBed.inject(CommunicationService);
  });

  it('resolves recipients for all owners audience', () => {
    const recipients = service.previewRecipients({
      ...DEFAULT_COMMUNICATION_FORM,
      audienceType: 'all_owners',
    });
    expect(recipients.length).toBeGreaterThan(0);
  });

  it('publishes communication and records recipient count', () => {
    const created = service.create({
      ...DEFAULT_COMMUNICATION_FORM,
      title: 'Payment reminder',
      shortDescription: 'Please complete payment',
      audienceType: 'all_owners',
    });
    const published = service.publishNow(created.id);
    expect(published?.status).toBe('published');
    expect(published?.recipientCount).toBeGreaterThan(0);
  });
});

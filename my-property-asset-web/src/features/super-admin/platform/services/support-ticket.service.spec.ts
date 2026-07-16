import { TestBed } from '@angular/core/testing';

import { InMemorySupportTicketRepository } from '../repositories/in-memory-platform.repository';
import { PlatformAuditRepository, SupportTicketRepository } from '../repositories/platform.repository';
import { InMemoryPlatformAuditRepository } from '../repositories/in-memory-platform.repository';
import { SupportTicketService } from './support-ticket.service';

describe('SupportTicketService (P16)', () => {
  let service: SupportTicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SupportTicketService,
        InMemorySupportTicketRepository,
        InMemoryPlatformAuditRepository,
        { provide: SupportTicketRepository, useExisting: InMemorySupportTicketRepository },
        { provide: PlatformAuditRepository, useExisting: InMemoryPlatformAuditRepository },
      ],
    });
    service = TestBed.inject(SupportTicketService);
  });

  it('creates and resolves tickets', () => {
    const ticket = service.create({
      builderCompanyName: 'Test Builder',
      subject: 'Help',
      description: 'Need assistance',
      priority: 'normal',
    });
    expect(ticket.status).toBe('open');
    const resolved = service.updateStatus(ticket.id, 'resolved');
    expect(resolved?.status).toBe('resolved');
    expect(resolved?.resolvedAt).toBeTruthy();
  });
});

import { Injectable, computed, inject, signal } from '@angular/core';

import {
  SupportTicket,
  SupportTicketDraft,
  SupportTicketStatus,
} from '../models/platform.model';
import { SupportTicketRepository } from '../repositories/platform.repository';
import { PlatformAuditService } from './platform-audit.service';

@Injectable({ providedIn: 'root' })
export class SupportTicketService {
  private readonly repository = inject(SupportTicketRepository);
  private readonly audit = inject(PlatformAuditService);
  private readonly version = signal(0);

  readonly tickets = computed(() => {
    this.version();
    return this.repository.list();
  });

  readonly openCount = computed(
    () =>
      this.tickets().filter(
        (ticket) =>
          ticket.status === 'open' ||
          ticket.status === 'in_progress' ||
          ticket.status === 'waiting_builder',
      ).length,
  );

  create(draft: SupportTicketDraft): SupportTicket {
    const ticket = this.repository.create(draft);
    this.audit.record('support', 'ticket_created', `Support ticket created: ${ticket.subject}`, {
      organizationId: ticket.organizationId,
      entityType: 'support_ticket',
      entityId: ticket.id,
    });
    this.bump();
    return ticket;
  }

  updateStatus(id: string, status: SupportTicketStatus): SupportTicket | undefined {
    const updated = this.repository.updateStatus(id, status);
    if (updated) {
      this.audit.record('support', 'ticket_status', `Ticket ${id} → ${status}`, {
        organizationId: updated.organizationId,
        entityType: 'support_ticket',
        entityId: id,
      });
      this.bump();
    }
    return updated;
  }

  updateNotes(id: string, notes: string): SupportTicket | undefined {
    const updated = this.repository.updateNotes(id, notes);
    if (updated) this.bump();
    return updated;
  }

  assign(id: string, assignee: string): SupportTicket | undefined {
    const updated = this.repository.assign(id, assignee);
    if (updated) this.bump();
    return updated;
  }

  private bump(): void {
    this.version.update((value) => value + 1);
  }
}

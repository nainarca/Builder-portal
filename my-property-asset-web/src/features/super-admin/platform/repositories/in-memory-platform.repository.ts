import { Injectable } from '@angular/core';

import { MOCK_AUDIT_EVENTS, MOCK_SUPPORT_TICKETS } from '../config/platform.config';
import {
  PlatformAuditEvent,
  SupportTicket,
  SupportTicketDraft,
  SupportTicketStatus,
} from '../models/platform.model';
import { PlatformAuditRepository, SupportTicketRepository } from './platform.repository';

@Injectable({ providedIn: 'root' })
export class InMemoryPlatformAuditRepository extends PlatformAuditRepository {
  private events = [...MOCK_AUDIT_EVENTS];

  list(limit = 100): readonly PlatformAuditEvent[] {
    return this.events
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }

  append(event: Omit<PlatformAuditEvent, 'id' | 'createdAt'>): PlatformAuditEvent {
    const record: PlatformAuditEvent = {
      ...event,
      id: `aud-${crypto.randomUUID().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
    };
    this.events = [record, ...this.events];
    return record;
  }
}

@Injectable({ providedIn: 'root' })
export class InMemorySupportTicketRepository extends SupportTicketRepository {
  private tickets = [...MOCK_SUPPORT_TICKETS];

  list(): readonly SupportTicket[] {
    return this.tickets
      .slice()
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  getById(id: string): SupportTicket | undefined {
    return this.tickets.find((ticket) => ticket.id === id);
  }

  create(draft: SupportTicketDraft): SupportTicket {
    const now = new Date().toISOString();
    const ticket: SupportTicket = {
      id: `tkt-${crypto.randomUUID().slice(0, 8)}`,
      organizationId: draft.organizationId,
      builderCompanyName: draft.builderCompanyName.trim(),
      subject: draft.subject.trim(),
      description: draft.description.trim(),
      status: 'open',
      priority: draft.priority,
      contactEmail: draft.contactEmail?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };
    this.tickets = [ticket, ...this.tickets];
    return ticket;
  }

  updateStatus(id: string, status: SupportTicketStatus): SupportTicket | undefined {
    const existing = this.getById(id);
    if (!existing) return undefined;
    const updated: SupportTicket = {
      ...existing,
      status,
      updatedAt: new Date().toISOString(),
      resolvedAt: status === 'resolved' || status === 'closed' ? new Date().toISOString() : existing.resolvedAt,
    };
    this.tickets = this.tickets.map((ticket) => (ticket.id === id ? updated : ticket));
    return updated;
  }

  updateNotes(id: string, notes: string): SupportTicket | undefined {
    const existing = this.getById(id);
    if (!existing) return undefined;
    const updated: SupportTicket = {
      ...existing,
      internalNotes: notes,
      updatedAt: new Date().toISOString(),
    };
    this.tickets = this.tickets.map((ticket) => (ticket.id === id ? updated : ticket));
    return updated;
  }

  assign(id: string, assignee: string): SupportTicket | undefined {
    const existing = this.getById(id);
    if (!existing) return undefined;
    const updated: SupportTicket = {
      ...existing,
      assignedTo: assignee,
      status: existing.status === 'open' ? 'in_progress' : existing.status,
      updatedAt: new Date().toISOString(),
    };
    this.tickets = this.tickets.map((ticket) => (ticket.id === id ? updated : ticket));
    return updated;
  }
}

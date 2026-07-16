import {
  PlatformAuditEvent,
  SupportTicket,
  SupportTicketDraft,
  SupportTicketStatus,
} from '../models/platform.model';

export abstract class PlatformAuditRepository {
  abstract list(limit?: number): readonly PlatformAuditEvent[];
  abstract append(event: Omit<PlatformAuditEvent, 'id' | 'createdAt'>): PlatformAuditEvent;
}

export abstract class SupportTicketRepository {
  abstract list(): readonly SupportTicket[];
  abstract getById(id: string): SupportTicket | undefined;
  abstract create(draft: SupportTicketDraft): SupportTicket;
  abstract updateStatus(id: string, status: SupportTicketStatus): SupportTicket | undefined;
  abstract updateNotes(id: string, notes: string): SupportTicket | undefined;
  abstract assign(id: string, assignee: string): SupportTicket | undefined;
}

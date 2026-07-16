import { Injectable, inject } from '@angular/core';

import { OwnerAssignment, OwnerActivityItem } from '../../owners/models/owner.model';
import { OwnerStoreService } from '../../owners/services/owner-store.service';
import { HandoverInvitationSummary } from '../models/owner-invitation.model';
import { HandoverStoreService } from './handover-store.service';

@Injectable({ providedIn: 'root' })
export class HandoverInvitationService {
  private readonly handovers = inject(HandoverStoreService);
  private readonly owners = inject(OwnerStoreService);

  getSummary(handoverId: string): HandoverInvitationSummary | undefined {
    const assignment = this.getAssignment(handoverId);
    if (!assignment) {
      return undefined;
    }

    const invitation = assignment.invitation;
    return {
      assignmentId: assignment.id,
      ownerId: assignment.ownerId,
      ownerName: assignment.ownerName,
      status: invitation.status === 'not-sent' ? 'not-generated' : invitation.status,
      sentAt: invitation.sentAt,
      expiresAt: invitation.expiresAt,
      acceptedAt: invitation.acceptedAt,
      cancelledAt: invitation.cancelledAt,
      resendCount: invitation.resendCount,
      remindersSent: invitation.remindersSent,
    };
  }

  getHistory(handoverId: string): readonly OwnerActivityItem[] {
    const assignment = this.getAssignment(handoverId);
    if (!assignment) {
      return [];
    }
    return assignment.activity.filter(
      (item) =>
        item.title.toLowerCase().includes('invitation') ||
        item.title.toLowerCase().includes('assigned'),
    );
  }

  generate(handoverId: string): void {
    const assignment = this.getAssignment(handoverId);
    if (!assignment) {
      return;
    }
    this.owners.generateInvitation(assignment.id);
  }

  resend(handoverId: string): void {
    const assignment = this.getAssignment(handoverId);
    if (!assignment) {
      return;
    }
    this.owners.resendInvitation(assignment.id);
  }

  cancel(handoverId: string): void {
    const assignment = this.getAssignment(handoverId);
    if (!assignment) {
      return;
    }
    this.owners.cancelInvitation(assignment.id);
  }

  accept(handoverId: string): void {
    const assignment = this.getAssignment(handoverId);
    if (!assignment) {
      return;
    }
    this.owners.acceptInvitation(assignment.id);
  }

  private getAssignment(handoverId: string): OwnerAssignment | undefined {
    const handover = this.handovers.getById(handoverId);
    return handover ? this.owners.getAssignmentByUnitId(handover.unitId) : undefined;
  }
}

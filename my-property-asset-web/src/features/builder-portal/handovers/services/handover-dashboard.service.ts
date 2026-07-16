import { Injectable, inject } from '@angular/core';

import { HandoverStoreService } from './handover-store.service';
import { HandoverInvitationService } from './handover-invitation.service';
import { OwnerActivationService } from './owner-activation.service';
import { HandoverChecklistService } from './handover-checklist.service';

@Injectable({ providedIn: 'root' })
export class HandoverDashboardService {
  private readonly handovers = inject(HandoverStoreService);
  private readonly invitations = inject(HandoverInvitationService);
  private readonly activation = inject(OwnerActivationService);
  private readonly checklist = inject(HandoverChecklistService);

  stats(): {
    total: number;
    invitationsPending: number;
    invitationsAccepted: number;
    activationReady: number;
    activated: number;
  } {
    const handovers = this.handovers.handovers();
    let invitationsPending = 0;
    let invitationsAccepted = 0;
    let activationReady = 0;
    let activated = 0;

    for (const handover of handovers) {
      const invitation = this.invitations.getSummary(handover.id);
      const readiness = this.activation.getReadiness(handover.id);
      if (invitation?.status === 'pending' || invitation?.status === 'resent') {
        invitationsPending += 1;
      }
      if (invitation?.status === 'accepted') {
        invitationsAccepted += 1;
      }
      if (readiness.ready) {
        activationReady += 1;
      }
      if (readiness.activated) {
        activated += 1;
      }
    }

    return {
      total: handovers.length,
      invitationsPending,
      invitationsAccepted,
      activationReady,
      activated,
    };
  }

  checklistReadyCount(): number {
    return this.handovers.handovers().filter((handover) => this.checklist.isComplete(handover.id)).length;
  }
}

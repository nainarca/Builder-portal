import { Injectable, inject, signal } from '@angular/core';

import { OwnerStoreService } from '../../owners/services/owner-store.service';
import { PropertyActivationLink } from '../models/handover-timeline.model';
import { HandoverStoreService } from './handover-store.service';
import { HandoverChecklistService } from './handover-checklist.service';
import { HandoverInvitationService } from './handover-invitation.service';

@Injectable({ providedIn: 'root' })
export class OwnerActivationService {
  private readonly handovers = inject(HandoverStoreService);
  private readonly owners = inject(OwnerStoreService);
  private readonly checklist = inject(HandoverChecklistService);
  private readonly invitations = inject(HandoverInvitationService);

  private readonly propertyLinks = signal<Record<string, PropertyActivationLink>>({});

  getPropertyLink(handoverId: string): PropertyActivationLink | undefined {
    return this.propertyLinks()[handoverId];
  }

  getReadiness(handoverId: string): {
    ownerAssigned: boolean;
    checklistComplete: boolean;
    invitationAccepted: boolean;
    activated: boolean;
    ready: boolean;
  } {
    const handover = this.handovers.getById(handoverId);
    const assignment = handover ? this.owners.getAssignmentByUnitId(handover.unitId) : undefined;
    const owner = assignment ? this.owners.getById(assignment.ownerId) : undefined;
    const invitation = this.invitations.getSummary(handoverId);
    const checklistComplete = this.checklist.isComplete(handoverId);
    const activated = owner?.activationStatus === 'activated' || !!this.getPropertyLink(handoverId);
    const invitationAccepted = invitation?.status === 'accepted';

    return {
      ownerAssigned: !!assignment,
      checklistComplete,
      invitationAccepted,
      activated,
      ready: !!assignment && checklistComplete && invitationAccepted && !activated,
    };
  }

  activate(handoverId: string): PropertyActivationLink | undefined {
    const handover = this.handovers.getById(handoverId);
    if (!handover) {
      return undefined;
    }

    const assignment = this.owners.getAssignmentByUnitId(handover.unitId);
    if (!assignment) {
      return undefined;
    }

    const existing = this.getPropertyLink(handoverId);
    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const link: PropertyActivationLink = {
      handoverId,
      unitId: handover.unitId,
      ownerId: assignment.ownerId,
      propertyId: `prop-${handover.unitId}`,
      activatedAt: now,
    };

    this.propertyLinks.update((state) => ({ ...state, [handoverId]: link }));
    this.owners.markActivated(assignment.ownerId);
    return link;
  }
}

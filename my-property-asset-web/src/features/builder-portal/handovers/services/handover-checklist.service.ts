import { Injectable, inject } from '@angular/core';

import { CompletionStoreService } from '../completion/services/completion-store.service';
import { HANDOVER_CHECKLIST_TEMPLATE } from '../config/handover-checklist-template.config';
import { HandoverChecklistItem } from '../models/handover-checklist.model';
import { HandoverDocumentService } from './handover-document.service';
import { HandoverInvitationService } from './handover-invitation.service';
import { HandoverStoreService } from './handover-store.service';
import { OwnerStoreService } from '../../owners/services/owner-store.service';

@Injectable({ providedIn: 'root' })
export class HandoverChecklistService {
  private readonly handovers = inject(HandoverStoreService);
  private readonly owners = inject(OwnerStoreService);
  private readonly documents = inject(HandoverDocumentService);
  private readonly invitations = inject(HandoverInvitationService);
  private readonly completions = inject(CompletionStoreService);

  items(handoverId: string): readonly HandoverChecklistItem[] {
    const handover = this.handovers.getById(handoverId);
    if (!handover) {
      return [];
    }

    const assignment = this.owners.getAssignmentByUnitId(handover.unitId);
    const owner = assignment ? this.owners.getById(assignment.ownerId) : undefined;
    const invitation = this.invitations.getSummary(handoverId);
    const completion = this.completions.getByHandoverId(handoverId);
    const keysDone = completion ? completion.keysAssets.every((item) => item.handedOver) : false;
    const docsReady = this.documents.requiredReady(handoverId);

    return HANDOVER_CHECKLIST_TEMPLATE.map((item) => {
      switch (item.id) {
        case 'registration-completed':
          return { ...item, status: docsReady ? 'completed' : 'pending', detail: 'Driven by required legal package verification.' };
        case 'payment-completed':
          return { ...item, status: docsReady ? 'completed' : 'pending', detail: 'Uses approved handover package as a mock payment-ready gate.' };
        case 'keys-handed-over':
          return { ...item, status: keysDone ? 'completed' : 'pending' };
        case 'documents-uploaded':
          return { ...item, status: docsReady ? 'completed' : 'blocked' };
        case 'owner-assigned':
          return { ...item, status: assignment ? 'completed' : 'blocked' };
        case 'invitation-sent':
          return {
            ...item,
            status:
              invitation && ['pending', 'accepted', 'resent'].includes(invitation.status)
                ? 'completed'
                : 'pending',
          };
        case 'invitation-accepted':
          return { ...item, status: invitation?.status === 'accepted' ? 'completed' : 'pending' };
        case 'property-activated':
          return { ...item, status: owner?.activationStatus === 'activated' ? 'completed' : 'pending' };
        default:
          return { ...item, status: 'pending' };
      }
    });
  }

  isComplete(handoverId: string): boolean {
    const items = this.items(handoverId).filter((item) => item.mandatory);
    return items.length > 0 && items.every((item) => item.status === 'completed');
  }
}

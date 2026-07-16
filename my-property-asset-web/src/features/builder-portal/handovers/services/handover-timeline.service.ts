import { Injectable, inject } from '@angular/core';

import { DocumentStoreService } from '../../documents/services/document-store.service';
import { OwnerStoreService } from '../../owners/services/owner-store.service';
import { ApprovalStoreService } from '../approval/services/approval-store.service';
import { CompletionStoreService } from '../completion/services/completion-store.service';
import { HandoverActivityItem } from '../models/handover.model';
import { HandoverAuditSummary } from '../models/handover-timeline.model';
import { HandoverStoreService } from './handover-store.service';
import { OwnerActivationService } from './owner-activation.service';

@Injectable({ providedIn: 'root' })
export class HandoverTimelineService {
  private readonly handovers = inject(HandoverStoreService);
  private readonly approvals = inject(ApprovalStoreService);
  private readonly completions = inject(CompletionStoreService);
  private readonly owners = inject(OwnerStoreService);
  private readonly documents = inject(DocumentStoreService);
  private readonly activation = inject(OwnerActivationService);

  getAuditSummary(handoverId: string): HandoverAuditSummary | undefined {
    const handover = this.handovers.getById(handoverId);
    if (!handover) {
      return undefined;
    }

    const assignment = this.owners.getAssignmentByUnitId(handover.unitId);
    const approval = this.approvals.getByHandoverId(handoverId);
    const completion = this.completions.getByHandoverId(handoverId);
    const documents = this.documents.getByUnitId(handover.unitId);
    const propertyLink = this.activation.getPropertyLink(handoverId);

    const propertyActivity: HandoverActivityItem[] = propertyLink
      ? [
          {
            id: `activation-${handoverId}`,
            title: 'Property activated',
            description: `Property ${propertyLink.propertyId} linked for the owner workspace.`,
            timestamp: propertyLink.activatedAt,
            icon: 'pi pi-mobile',
            tone: 'success',
          },
        ]
      : [];

    const documentActivity = documents.flatMap((doc) =>
      doc.activity.map((item) => ({
        ...item,
        id: `${doc.id}-${item.id}`,
        title: `${item.title} — ${doc.name}`,
      })),
    );

    const items = [
      ...handover.activity,
      ...(assignment?.activity ?? []),
      ...documentActivity,
      ...(approval?.activity ?? []),
      ...(completion?.activity ?? []),
      ...propertyActivity,
    ].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    return { items, propertyLink };
  }
}

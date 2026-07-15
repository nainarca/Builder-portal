import { Injectable, inject } from '@angular/core';

import { DocumentStoreService } from '../../../documents/services/document-store.service';
import { OwnerStoreService } from '../../../owners/services/owner-store.service';
import { HandoverStoreService } from '../../services/handover-store.service';
import { HandoverStageStatusValue } from '../../models/handover.model';
import { HandoverReadiness, Inspection, ReadinessTriState } from '../models/inspection.model';
import { InspectionStoreService } from './inspection-store.service';

@Injectable({ providedIn: 'root' })
export class ReadinessService {
  private readonly handoverStore = inject(HandoverStoreService);
  private readonly documentStore = inject(DocumentStoreService);
  private readonly ownerStore = inject(OwnerStoreService);
  private readonly inspectionStore = inject(InspectionStoreService);

  getReadiness(handoverId: string): HandoverReadiness | undefined {
    const handover = this.handoverStore.getById(handoverId);
    if (!handover) {
      return undefined;
    }

    const unitDocuments = this.documentStore.getByUnitId(handover.unitId);
    const documentsReady = unitDocuments.length > 0 && unitDocuments.every((d) => d.approvalStatus === 'approved');
    const ownerAssigned = !!this.ownerStore.getAssignmentByUnitId(handover.unitId);

    const inspections = this.inspectionStore.getByHandoverId(handoverId);
    const checklistStatus = this.deriveChecklistStatus(inspections);

    const inspectionStageStatus = handover.stages.find((s) => s.stageId === 'inspection')?.status ?? 'upcoming';
    const inspectionStatus = this.mapStageToReadiness(inspectionStageStatus);

    const overallReadiness =
      documentsReady && ownerAssigned && checklistStatus === 'complete' && inspectionStatus === 'complete'
        ? 'ready'
        : inspectionStatus === 'blocked'
          ? 'not-ready'
          : 'partially-ready';

    const goNoGo = overallReadiness === 'ready' ? 'go' : inspectionStatus === 'blocked' ? 'no-go' : 'pending';

    return { handoverId, documentsReady, ownerAssigned, checklistStatus, inspectionStatus, overallReadiness, goNoGo };
  }

  private deriveChecklistStatus(inspections: readonly Inspection[]): ReadinessTriState {
    if (inspections.length === 0) {
      return 'not-started';
    }
    if (inspections.every((i) => i.completionPercent === 100)) {
      return 'complete';
    }
    if (inspections.every((i) => i.completionPercent === 0)) {
      return 'not-started';
    }
    return 'in-progress';
  }

  private mapStageToReadiness(status: HandoverStageStatusValue): ReadinessTriState | 'blocked' {
    const map: Record<HandoverStageStatusValue, ReadinessTriState | 'blocked'> = {
      completed: 'complete',
      'in-progress': 'in-progress',
      upcoming: 'not-started',
      delayed: 'blocked',
    };
    return map[status];
  }
}

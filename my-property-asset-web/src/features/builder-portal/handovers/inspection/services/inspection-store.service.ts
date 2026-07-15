import { Injectable, inject, signal } from '@angular/core';

import { HandoverStoreService } from '../../services/handover-store.service';
import { HandoverStageStatusValue } from '../../models/handover.model';
import { MOCK_INSPECTIONS } from '../config/inspection.config';
import { ChecklistItemStatus, Inspection } from '../models/inspection.model';
import { deriveInspectionResult } from './inspection.util';

@Injectable({ providedIn: 'root' })
export class InspectionStoreService {
  private readonly handoverStore = inject(HandoverStoreService);

  private readonly inspectionsSignal = signal<Inspection[]>([...MOCK_INSPECTIONS]);

  readonly inspections = this.inspectionsSignal.asReadonly();

  getByHandoverId(handoverId: string): readonly Inspection[] {
    return this.inspectionsSignal().filter((i) => i.handoverId === handoverId);
  }

  getById(id: string): Inspection | undefined {
    return this.inspectionsSignal().find((i) => i.id === id);
  }

  updateItemStatus(inspectionId: string, sectionId: string, itemId: string, status: ChecklistItemStatus, remarks?: string): void {
    let handoverId = '';

    this.inspectionsSignal.update((inspections) =>
      inspections.map((insp) => {
        if (insp.id !== inspectionId) {
          return insp;
        }
        handoverId = insp.handoverId;

        const sections = insp.sections.map((section) => {
          if (section.id !== sectionId) {
            return section;
          }
          return {
            ...section,
            items: section.items.map((item) =>
              item.id === itemId ? { ...item, status, remarks: remarks ?? item.remarks } : item,
            ),
          };
        });

        const allItems = sections.flatMap((s) => s.items);
        const derived = deriveInspectionResult(allItems);
        const now = new Date().toISOString();

        return {
          ...insp,
          sections,
          result: derived.result,
          completionPercent: derived.completionPercent,
          updatedAt: now,
          completedAt: derived.result === 'passed' || derived.result === 'passed-with-remarks' ? now : undefined,
        };
      }),
    );

    if (handoverId) {
      this.recomputeHandoverStage(handoverId);
    }
  }

  updateInspectorNotes(inspectionId: string, notes: string): void {
    this.inspectionsSignal.update((inspections) =>
      inspections.map((insp) =>
        insp.id === inspectionId ? { ...insp, inspectorNotes: notes, updatedAt: new Date().toISOString() } : insp,
      ),
    );
  }

  private recomputeHandoverStage(handoverId: string): void {
    const inspections = this.getByHandoverId(handoverId);
    const mandatoryOnes = inspections.filter((i) => i.mandatoryForHandover);
    const hasBlocking = inspections.some((i) => i.result === 'failed' || i.result === 'blocked');
    const allMandatoryPassed =
      mandatoryOnes.length > 0 && mandatoryOnes.every((i) => i.result === 'passed' || i.result === 'passed-with-remarks');

    let status: HandoverStageStatusValue;
    if (hasBlocking) {
      status = 'delayed';
    } else if (allMandatoryPassed) {
      status = 'completed';
    } else {
      status = 'in-progress';
    }

    this.handoverStore.updateStageStatus(handoverId, 'inspection', status);
  }
}

import { Injectable, inject, signal } from '@angular/core';

import { HandoverStoreService } from '../../services/handover-store.service';
import { MOCK_COMPLETIONS } from '../config/completion.config';
import { HandoverCompletion } from '../models/completion.model';

@Injectable({ providedIn: 'root' })
export class CompletionStoreService {
  private readonly handoverStore = inject(HandoverStoreService);

  private readonly completionsSignal = signal<HandoverCompletion[]>([...MOCK_COMPLETIONS]);

  readonly completions = this.completionsSignal.asReadonly();

  getByHandoverId(handoverId: string): HandoverCompletion | undefined {
    return this.completionsSignal().find((c) => c.handoverId === handoverId);
  }

  toggleKeyAsset(handoverId: string, itemId: string): void {
    const now = new Date().toISOString();
    this.completionsSignal.update((completions) =>
      completions.map((c) => {
        if (c.handoverId !== handoverId) {
          return c;
        }
        return {
          ...c,
          keysAssets: c.keysAssets.map((item) => (item.id === itemId ? { ...item, handedOver: !item.handedOver } : item)),
          updatedAt: now,
        };
      }),
    );
  }

  finalizeCompletion(handoverId: string, completedBy: string): void {
    const now = new Date().toISOString();
    this.completionsSignal.update((completions) =>
      completions.map((c) => {
        if (c.handoverId !== handoverId) {
          return c;
        }
        return {
          ...c,
          completedAt: now,
          completedBy,
          builderResponsibilityCompleted: true,
          ownerPossessionStarted: true,
          updatedAt: now,
          activity: [
            { id: `a-${crypto.randomUUID().slice(0, 8)}`, title: 'Handover finalized', description: `Completed by ${completedBy}`, timestamp: now, icon: 'pi pi-check-circle', tone: 'success' as const },
            ...c.activity,
          ],
        };
      }),
    );

    this.handoverStore.updateStageStatus(handoverId, 'completion', 'completed');
  }

  generateCertificate(handoverId: string): void {
    const now = new Date().toISOString();
    this.completionsSignal.update((completions) =>
      completions.map((c) => {
        if (c.handoverId !== handoverId) {
          return c;
        }
        const certificateNumber = c.certificate.certificateNumber ?? `MPA-CERT-${handoverId.replace('handover-', '')}`;
        return {
          ...c,
          certificate: { certificateNumber, issuedAt: now, status: 'generated' as const },
          updatedAt: now,
          activity: [
            { id: `a-${crypto.randomUUID().slice(0, 8)}`, title: 'Possession certificate generated', description: `Certificate ${certificateNumber} issued`, timestamp: now, icon: 'pi pi-verified', tone: 'success' as const },
            ...c.activity,
          ],
        };
      }),
    );
  }
}

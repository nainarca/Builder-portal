import { Injectable, inject, signal } from '@angular/core';

import { HandoverStoreService } from '../../services/handover-store.service';
import { MOCK_APPROVALS } from '../config/approval.config';
import { ApprovalStatus, HandoverApproval, SignatureParty } from '../models/approval.model';
import { deriveApprovalStatus } from './approval.util';

@Injectable({ providedIn: 'root' })
export class ApprovalStoreService {
  private readonly handoverStore = inject(HandoverStoreService);

  private readonly approvalsSignal = signal<HandoverApproval[]>([...MOCK_APPROVALS]);

  readonly approvals = this.approvalsSignal.asReadonly();

  getByHandoverId(handoverId: string): HandoverApproval | undefined {
    return this.approvalsSignal().find((a) => a.handoverId === handoverId);
  }

  acceptTerms(handoverId: string): void {
    const now = new Date().toISOString();
    this.approvalsSignal.update((approvals) =>
      approvals.map((a) => {
        if (a.handoverId !== handoverId) {
          return a;
        }
        return {
          ...a,
          termsAccepted: true,
          ownerReviewedAt: now,
          updatedAt: now,
          activity: [
            { id: `a-${crypto.randomUUID().slice(0, 8)}`, title: 'Owner reviewed handover', description: 'Terms & conditions accepted', timestamp: now, icon: 'pi pi-eye', tone: 'info' as const },
            ...a.activity,
          ],
        };
      }),
    );
  }

  signAs(handoverId: string, party: SignatureParty, signedByName: string): void {
    const now = new Date().toISOString();
    let handoverAffected = false;

    this.approvalsSignal.update((approvals) =>
      approvals.map((a) => {
        if (a.handoverId !== handoverId) {
          return a;
        }

        const signatures = a.signatures.map((s) =>
          s.party === party ? { ...s, status: 'signed' as const, signedByName, signedAt: now } : s,
        );
        const status = deriveApprovalStatus(signatures, a.status);

        if (status === 'pending-approval' && a.status !== 'pending-approval') {
          handoverAffected = true;
        }

        return {
          ...a,
          signatures,
          status,
          updatedAt: now,
          activity: [
            { id: `a-${crypto.randomUUID().slice(0, 8)}`, title: `${this.partyLabel(party)} signed`, description: `Signed by ${signedByName}`, timestamp: now, icon: 'pi pi-pencil', tone: 'primary' as const },
            ...a.activity,
          ],
        };
      }),
    );

    if (handoverAffected) {
      this.handoverStore.updateStageStatus(handoverId, 'digital-signature', 'completed');
    }
  }

  updateReviewNotes(handoverId: string, notes: string): void {
    this.approvalsSignal.update((approvals) =>
      approvals.map((a) =>
        a.handoverId === handoverId ? { ...a, reviewNotes: notes, updatedAt: new Date().toISOString() } : a,
      ),
    );
  }

  decide(handoverId: string, decision: 'approved' | 'rejected' | 'cancelled', decidedBy: string, reason?: string): void {
    const now = new Date().toISOString();
    this.approvalsSignal.update((approvals) =>
      approvals.map((a) => {
        if (a.handoverId !== handoverId) {
          return a;
        }
        return {
          ...a,
          status: decision as ApprovalStatus,
          decisionAt: now,
          decisionBy: decidedBy,
          rejectionReason: decision === 'rejected' ? reason : a.rejectionReason,
          updatedAt: now,
          activity: [
            {
              id: `a-${crypto.randomUUID().slice(0, 8)}`,
              title: `Handover ${decision}`,
              description: reason ?? `${decision === 'approved' ? 'Approved' : decision === 'rejected' ? 'Rejected' : 'Cancelled'} by ${decidedBy}`,
              timestamp: now,
              icon: decision === 'approved' ? 'pi pi-check-circle' : decision === 'rejected' ? 'pi pi-times-circle' : 'pi pi-ban',
              tone: decision === 'approved' ? ('success' as const) : ('danger' as const),
            },
            ...a.activity,
          ],
        };
      }),
    );

    this.handoverStore.updateStageStatus(handoverId, 'owner-acceptance', decision === 'approved' ? 'completed' : 'delayed');
  }

  private partyLabel(party: SignatureParty): string {
    const map: Record<SignatureParty, string> = { owner: 'Owner', builder: 'Builder', witness: 'Witness' };
    return map[party];
  }
}

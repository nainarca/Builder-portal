import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { HandoverApproval, SignatureParty } from '../../../approval/models/approval.model';

@Component({
  selector: 'app-acceptance-summary-panel',
  imports: [DatePipe],
  template: `
    <div class="handover-info-panel">
      <h3 class="handover-info-panel__title">Acceptance summary</h3>
      <dl class="handover-info-panel__list">
        <div class="handover-info-panel__row"><dt>Terms accepted</dt><dd>{{ approval().termsAccepted ? 'Yes' : 'No' }}</dd></div>
        @if (approval().ownerReviewedAt) {
          <div class="handover-info-panel__row"><dt>Reviewed</dt><dd>{{ approval().ownerReviewedAt | date: 'medium' }}</dd></div>
        }
        @for (sig of signedSignatures(); track sig.party) {
          <div class="handover-info-panel__row"><dt>{{ partyLabel(sig.party) }} signed</dt><dd>{{ sig.signedByName }} · {{ sig.signedAt | date: 'medium' }}</dd></div>
        }
        @if (approval().decisionAt) {
          <div class="handover-info-panel__row"><dt>Decision</dt><dd>{{ approval().decisionAt | date: 'medium' }} by {{ approval().decisionBy }}</dd></div>
        }
        @if (approval().rejectionReason) {
          <div class="handover-info-panel__row"><dt>Reason</dt><dd>{{ approval().rejectionReason }}</dd></div>
        }
      </dl>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptanceSummaryPanelComponent {
  readonly approval = input.required<HandoverApproval>();

  readonly signedSignatures = computed(() => this.approval().signatures.filter((s) => s.status === 'signed'));

  partyLabel(party: SignatureParty): string {
    const map: Record<SignatureParty, string> = { owner: 'Owner', builder: 'Builder', witness: 'Witness' };
    return map[party];
  }
}

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Owner } from '../../../../owners/models/owner.model';
import { HandoverApproval, SignatureParty } from '../../../approval/models/approval.model';
import { Handover } from '../../../models/handover.model';
import { HandoverCompletion } from '../../models/completion.model';

@Component({
  selector: 'app-certificate-preview',
  imports: [DatePipe],
  template: `
    <div class="certificate-preview">
      <div class="certificate-preview__header">
        <span class="certificate-preview__brand">MyPropertyAsset</span>
        <span class="certificate-preview__title">Certificate of Possession</span>
      </div>

      <div class="certificate-preview__body">
        <p class="certificate-preview__statement">
          This certifies that possession of the following property has been formally handed over from the builder
          to the owner.
        </p>

        <div class="certificate-preview__grid">
          <div class="certificate-preview__field">
            <h4>Property</h4>
            <p>{{ handover().projectName }} · {{ handover().towerName }}</p>
            <p>Unit {{ handover().unitNumber }}</p>
          </div>
          <div class="certificate-preview__field">
            <h4>Owner</h4>
            <p>{{ handover().ownerName }}</p>
            @if (owner(); as o) {
              <p>{{ o.email }}</p>
            }
          </div>
          <div class="certificate-preview__field">
            <h4>Builder</h4>
            <p>Builder Admin</p>
          </div>
          <div class="certificate-preview__field">
            <h4>Completion details</h4>
            <p>Completed: {{ completion().completedAt ? (completion().completedAt | date: 'longDate') : '—' }}</p>
            <p>Certificate No: {{ completion().certificate.certificateNumber ?? '—' }}</p>
          </div>
        </div>

        @if (signedSignatures().length > 0) {
          <div class="certificate-preview__signatures">
            @for (sig of signedSignatures(); track sig.party) {
              <div class="certificate-preview__signature">
                <span class="certificate-preview__signature-line"></span>
                <p class="certificate-preview__signature-name">{{ partyLabel(sig.party) }}: {{ sig.signedByName }}</p>
                <p class="certificate-preview__signature-date">{{ sig.signedAt | date: 'mediumDate' }}</p>
              </div>
            }
          </div>
        }
      </div>

      <div class="certificate-preview__footer">
        <span
          class="certificate-preview__status"
          [class.certificate-preview__status--generated]="completion().certificate.status === 'generated'"
        >
          {{ completion().certificate.status === 'generated' ? 'Issued' : 'Not yet issued' }}
        </span>
        @if (completion().certificate.issuedAt) {
          <span>Issued on {{ completion().certificate.issuedAt | date: 'medium' }}</span>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificatePreviewComponent {
  readonly handover = input.required<Handover>();
  readonly completion = input.required<HandoverCompletion>();
  readonly approval = input.required<HandoverApproval>();
  readonly owner = input<Owner | undefined>(undefined);

  readonly signedSignatures = computed(() => this.approval().signatures.filter((s) => s.status === 'signed'));

  partyLabel(party: SignatureParty): string {
    const map: Record<SignatureParty, string> = { owner: 'Owner', builder: 'Builder', witness: 'Witness' };
    return map[party];
  }
}

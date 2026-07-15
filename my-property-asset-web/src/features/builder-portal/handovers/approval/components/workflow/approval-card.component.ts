import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Handover } from '../../../models/handover.model';
import { HandoverApproval } from '../../models/approval.model';
import { ApprovalStatusBadgeComponent } from '../shared/approval-status-badge.component';

@Component({
  selector: 'app-approval-card',
  imports: [DatePipe, ApprovalStatusBadgeComponent],
  template: `
    <div class="handover-info-panel approval-card">
      <div class="approval-card__header">
        <span class="handover-icon"><i class="pi pi-verified" aria-hidden="true"></i></span>
        <div class="approval-card__title-group">
          <p class="approval-card__title">{{ handover().unitNumber }} · {{ handover().towerName }}</p>
          <p class="approval-card__meta">{{ handover().projectName }} · {{ handover().ownerName }}</p>
        </div>
        <app-approval-status-badge [status]="approval().status" />
      </div>
      <dl class="handover-info-panel__list">
        <div class="handover-info-panel__row"><dt>Terms accepted</dt><dd>{{ approval().termsAccepted ? 'Yes' : 'No' }}</dd></div>
        @if (approval().ownerReviewedAt) {
          <div class="handover-info-panel__row"><dt>Reviewed</dt><dd>{{ approval().ownerReviewedAt | date: 'medium' }}</dd></div>
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
export class ApprovalCardComponent {
  readonly handover = input.required<Handover>();
  readonly approval = input.required<HandoverApproval>();
}

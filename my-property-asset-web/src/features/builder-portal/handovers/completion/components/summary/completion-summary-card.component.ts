import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Handover } from '../../../models/handover.model';
import { CompletionStatus, HandoverCompletion } from '../../models/completion.model';
import { CompletionStatusBadgeComponent } from '../shared/completion-status-badge.component';

@Component({
  selector: 'app-completion-summary-card',
  imports: [DatePipe, CompletionStatusBadgeComponent],
  template: `
    <div class="handover-info-panel completion-summary-card">
      <div class="completion-summary-card__header">
        <span class="handover-icon"><i class="pi pi-verified" aria-hidden="true"></i></span>
        <div class="completion-summary-card__title-group">
          <p class="completion-summary-card__title">{{ handover().unitNumber }} · {{ handover().towerName }}</p>
          <p class="completion-summary-card__meta">{{ handover().projectName }} · {{ handover().ownerName }}</p>
        </div>
        <app-completion-status-badge [status]="status()" />
      </div>
      <dl class="handover-info-panel__list">
        @if (completion().completedAt) {
          <div class="handover-info-panel__row"><dt>Completed</dt><dd>{{ completion().completedAt | date: 'medium' }} by {{ completion().completedBy }}</dd></div>
        }
        <div class="handover-info-panel__row"><dt>Certificate</dt><dd>{{ completion().certificate.status === 'generated' ? 'Generated' : 'Not generated' }}</dd></div>
      </dl>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompletionSummaryCardComponent {
  readonly handover = input.required<Handover>();
  readonly completion = input.required<HandoverCompletion>();
  readonly status = input.required<CompletionStatus>();
}

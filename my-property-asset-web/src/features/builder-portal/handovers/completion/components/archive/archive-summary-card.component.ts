import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { HandoverCompletion } from '../../models/completion.model';

@Component({
  selector: 'app-archive-summary-card',
  imports: [DatePipe],
  template: `
    <div class="handover-info-panel">
      <h3 class="handover-info-panel__title">Archive summary</h3>
      <dl class="handover-info-panel__list">
        <div class="handover-info-panel__row"><dt>Completed on</dt><dd>{{ completion().completedAt ? (completion().completedAt | date: 'medium') : 'Not yet completed' }}</dd></div>
        <div class="handover-info-panel__row"><dt>Retention period</dt><dd>Indefinite — legal handover records are retained permanently</dd></div>
        <div class="handover-info-panel__row"><dt>Archive status</dt><dd>{{ completion().completedAt ? 'Archived' : 'Active' }}</dd></div>
      </dl>
      <p class="mpa-body-md">
        <i class="pi pi-history" aria-hidden="true"></i>
        A future module could support restoring an archived handover for correction — not implemented in this foundation.
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveSummaryCardComponent {
  readonly completion = input.required<HandoverCompletion>();
}

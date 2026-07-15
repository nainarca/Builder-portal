import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Handover } from '../../../models/handover.model';
import { DocumentSummaryPanelComponent, HandoverOverviewComponent } from '../../../components/detail';
import { InspectionChecklistSummaryPanelComponent } from './inspection-checklist-summary-panel.component';

@Component({
  selector: 'app-owner-review-summary',
  imports: [HandoverOverviewComponent, DocumentSummaryPanelComponent, InspectionChecklistSummaryPanelComponent],
  template: `
    <app-handover-overview [handover]="handover()" />
    <div class="owner-review-summary__grid">
      <app-document-summary-panel [unitId]="handover().unitId" />
      <app-inspection-checklist-summary-panel [handoverId]="handover().id" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerReviewSummaryComponent {
  readonly handover = input.required<Handover>();
}

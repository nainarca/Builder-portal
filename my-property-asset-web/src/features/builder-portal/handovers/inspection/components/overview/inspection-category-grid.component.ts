import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Inspection } from '../../models/inspection.model';
import { InspectionCardComponent, InspectionEmptyStateComponent } from '../shared';

@Component({
  selector: 'app-inspection-category-grid',
  imports: [InspectionCardComponent, InspectionEmptyStateComponent],
  template: `
    @if (inspections().length === 0) {
      <app-inspection-empty-state />
    } @else {
      <div class="insp-category-grid">
        @for (insp of inspections(); track insp.id) {
          <app-inspection-card [inspection]="insp" />
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InspectionCategoryGridComponent {
  readonly inspections = input.required<readonly Inspection[]>();
}

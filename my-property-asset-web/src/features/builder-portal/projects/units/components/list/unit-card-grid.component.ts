import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Unit } from '../../models/unit.model';
import { UnitCardComponent } from '../shared/unit-card.component';
import { UnitEmptyStateComponent } from '../shared/unit-empty-state.component';

@Component({
  selector: 'app-unit-card-grid',
  imports: [UnitCardComponent, UnitEmptyStateComponent],
  template: `
    @if (items().length === 0) {
      <app-unit-empty-state
        title="No units match your filters"
        subtitle="Try adjusting your search or filters."
        [actionLabel]="undefined"
      />
    } @else {
      <div class="unit-card-grid">
        @for (unit of items(); track unit.id) {
          <app-unit-card [unit]="unit" [projectId]="projectId()" />
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitCardGridComponent {
  readonly items = input.required<readonly Unit[]>();
  readonly projectId = input.required<string>();
}

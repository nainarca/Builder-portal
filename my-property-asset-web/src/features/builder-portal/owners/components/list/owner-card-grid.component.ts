import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { OwnerListItem } from '../../models/owner.model';
import { OwnerCardComponent } from '../shared/owner-card.component';
import { OwnerEmptyStateComponent } from '../shared/owner-empty-state.component';

@Component({
  selector: 'app-owner-card-grid',
  imports: [OwnerCardComponent, OwnerEmptyStateComponent],
  template: `
    @if (items().length === 0) {
      <app-owner-empty-state
        title="No owners match your filters"
        subtitle="Try adjusting your search or filters."
        [actionLabel]="undefined"
      />
    } @else {
      <div class="owner-card-grid">
        @for (item of items(); track item.owner.id) {
          <app-owner-card [item]="item" />
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerCardGridComponent {
  readonly items = input.required<readonly OwnerListItem[]>();
}

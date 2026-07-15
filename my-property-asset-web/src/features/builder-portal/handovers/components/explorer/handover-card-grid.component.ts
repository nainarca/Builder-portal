import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Handover } from '../../models/handover.model';
import { HandoverCardComponent, HandoverEmptyStateComponent } from '../shared';

@Component({
  selector: 'app-handover-card-grid',
  imports: [HandoverCardComponent, HandoverEmptyStateComponent],
  template: `
    @if (items().length === 0) {
      <app-handover-empty-state />
    } @else {
      <div class="handover-card-grid">
        @for (handover of items(); track handover.id) {
          <app-handover-card [handover]="handover" />
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandoverCardGridComponent {
  readonly items = input.required<readonly Handover[]>();
}

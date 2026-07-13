import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { BuilderStatusHistoryRecord } from '../../models/builder-admin.model';
import { BuilderStatusBadgeComponent } from '../shared/builder-status-badge.component';

@Component({
  selector: 'app-bldr-status-history',
  imports: [DatePipe, BuilderStatusBadgeComponent],
  template: `
    <section class="bldr-status-history">
      <h3 class="mpa-heading-sm">Status timeline</h3>
      <ol class="bldr-status-history__list">
        @for (item of items(); track item.id) {
          <li>
            <app-bldr-status-badge [status]="item.status" />
            <div><p>{{ item.reason || 'Status updated' }}</p><small>{{ item.changedBy }} · {{ item.changedAt | date: 'medium' }}</small></div>
          </li>
        } @empty { <li>No status changes recorded.</li> }
      </ol>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderStatusHistoryComponent {
  readonly items = input.required<readonly BuilderStatusHistoryRecord[]>();
}

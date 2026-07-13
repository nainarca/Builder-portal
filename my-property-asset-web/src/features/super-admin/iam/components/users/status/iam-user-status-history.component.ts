import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { UserStatusHistoryRecord } from '../../../models/user-admin.model';
import { IamUserStatusBadgeComponent } from '../../shared';

@Component({
  selector: 'app-iam-user-status-history',
  imports: [DatePipe, IamUserStatusBadgeComponent],
  template: `
    <section class="iam-status-history">
      <h3 class="mpa-heading-sm">Status timeline</h3>
      <ol class="iam-status-history__list">
        @for (item of items(); track item.id) {
          <li>
            <app-iam-user-status-badge [status]="item.status" />
            <div><p>{{ item.reason || 'Status updated' }}</p><small>{{ item.changedBy }} · {{ item.changedAt | date: 'medium' }}</small></div>
          </li>
        } @empty { <li>No status changes recorded.</li> }
      </ol>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserStatusHistoryComponent {
  readonly items = input.required<readonly UserStatusHistoryRecord[]>();
}

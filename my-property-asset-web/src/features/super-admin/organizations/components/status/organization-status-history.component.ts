import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { OrganizationStatusHistoryRecord } from '../../models/organization-admin.model';
import { OrganizationStatusBadgeComponent } from '../shared/organization-status-badge.component';

@Component({
  selector: 'app-org-status-history',
  imports: [DatePipe, OrganizationStatusBadgeComponent],
  template: `
    <section class="org-status-history" aria-label="Status history">
      <h3 class="mpa-heading-sm">Status history</h3>
      <ol class="org-status-history__list">
        @for (item of items(); track item.id) {
          <li class="org-status-history__item">
            <app-org-status-badge [status]="item.status" />
            <div>
              <p>{{ item.reason || 'Status updated' }}</p>
              <small>{{ item.changedBy }} · {{ item.changedAt | date: 'medium' }}</small>
            </div>
          </li>
        } @empty {
          <li class="org-status-history__empty">No status changes recorded.</li>
        }
      </ol>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationStatusHistoryComponent {
  readonly items = input.required<readonly OrganizationStatusHistoryRecord[]>();
}

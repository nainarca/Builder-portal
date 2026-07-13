import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ContentSectionComponent, SectionHeaderComponent } from '@shared/ui';

import { UserAuditRecord } from '../../../models/user-admin.model';

@Component({
  selector: 'app-iam-user-audit-summary',
  imports: [DatePipe, ContentSectionComponent, SectionHeaderComponent],
  template: `
    <app-content-section>
      <app-section-header title="Audit summary" description="Administrative actions on this user" />
      <ul class="iam-audit-list">
        @for (item of items(); track item.id) {
          <li class="iam-audit-list__item">
            <div><strong>{{ item.action }}</strong><p>{{ item.detail }}</p></div>
            <div class="iam-audit-list__meta"><span>{{ item.actor }}</span><time>{{ item.timestamp | date: 'short' }}</time></div>
          </li>
        } @empty { <li>No audit records.</li> }
      </ul>
    </app-content-section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserAuditSummaryComponent {
  readonly items = input.required<readonly UserAuditRecord[]>();
}

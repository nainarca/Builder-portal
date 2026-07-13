import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ContentSectionComponent, SectionHeaderComponent } from '@shared/ui';

import { UserAdminRecord } from '../../../models/user-admin.model';
import { UserSecuritySummary } from '../../../models/user-admin.model';
import { IamSecurityCardComponent } from '../../shared';

@Component({
  selector: 'app-iam-user-access-review',
  imports: [DatePipe, ContentSectionComponent, SectionHeaderComponent, IamSecurityCardComponent],
  template: `
    <app-content-section>
      <app-section-header title="Access review" description="Session and login activity summary" />
      <div class="iam-access-review">
        <app-iam-security-card [security]="security()" />
        <dl class="iam-access-review__meta">
          <div><dt>Last active</dt><dd>{{ user().lastActiveAt ? (user().lastActiveAt | date: 'medium') : '—' }}</dd></div>
          <div><dt>Invitation status</dt><dd>{{ user().invitationStatus }}</dd></div>
        </dl>
      </div>
    </app-content-section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserAccessReviewComponent {
  readonly user = input.required<UserAdminRecord>();
  readonly security = input.required<UserSecuritySummary>();
}

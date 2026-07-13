import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ContentSectionComponent, SectionHeaderComponent } from '@shared/ui';

import { OrganizationMemberRecord } from '../../models/organization-admin.model';
import { OrganizationAdministratorsListComponent } from './organization-administrators-list.component';
import { OrganizationInvitationStatusComponent } from './organization-invitation-status.component';
import { OrganizationMemberStatisticsComponent } from './organization-member-statistics.component';
import { OrganizationOwnerCardComponent } from './organization-owner-card.component';

@Component({
  selector: 'app-org-members-list',
  imports: [
    ContentSectionComponent,
    SectionHeaderComponent,
    OrganizationOwnerCardComponent,
    OrganizationMemberStatisticsComponent,
    OrganizationAdministratorsListComponent,
    OrganizationInvitationStatusComponent,
  ],
  template: `
    <app-content-section>
      <app-section-header title="Members" description="Organization membership overview (framework)" />
      <app-org-member-statistics [members]="members()" />
      <div class="org-members-layout">
        <app-org-owner-card [members]="members()" />
        <div>
          <h3 class="mpa-heading-sm">Administrators</h3>
          <app-org-administrators-list [members]="members()" />
        </div>
      </div>
      <app-org-invitation-status [members]="members()" />
    </app-content-section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationMembersListComponent {
  readonly members = input.required<readonly OrganizationMemberRecord[]>();
}

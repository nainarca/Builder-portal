import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EnterpriseSectionHeaderComponent } from '@shared/ui';

import { OrganizationMemberRecord } from '../../models/organization-admin.model';
import { OrganizationAdministratorsListComponent } from './organization-administrators-list.component';
import { OrganizationInvitationStatusComponent } from './organization-invitation-status.component';
import { OrganizationMemberStatisticsComponent } from './organization-member-statistics.component';
import { OrganizationOwnerCardComponent } from './organization-owner-card.component';

@Component({
  selector: 'app-org-members-list',
  imports: [
    EnterpriseSectionHeaderComponent,
    OrganizationOwnerCardComponent,
    OrganizationMemberStatisticsComponent,
    OrganizationAdministratorsListComponent,
    OrganizationInvitationStatusComponent,
  ],
  template: `
    <section class="org-members" aria-label="Organization members">
      <app-enterprise-section-header
        title="Members"
        description="Membership overview, administrators, and pending invitations"
      />

      <app-org-member-statistics [members]="members()" />

      <div class="org-members__layout">
        <app-org-owner-card [members]="members()" />
        <div class="org-members__administrators">
          <h3 class="mpa-heading-sm">Administrators</h3>
          <app-org-administrators-list [members]="members()" />
        </div>
      </div>

      <app-org-invitation-status [members]="members()" />
    </section>
  `,
  styles: `
    .org-members {
      display: grid;
      gap: var(--mpa-spacing-lg);
    }

    .org-members__layout {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--mpa-spacing-lg);
    }

    .org-members__administrators {
      display: grid;
      gap: var(--mpa-spacing-sm);
    }

    @media (max-width: 1024px) {
      .org-members__layout {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationMembersListComponent {
  readonly members = input.required<readonly OrganizationMemberRecord[]>();
}

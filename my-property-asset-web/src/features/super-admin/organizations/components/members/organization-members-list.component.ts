import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import {
  EnterpriseDetailSectionComponent,
  EnterpriseRelatedRecordsComponent,
  type EnterpriseDetailRelatedItem,
} from '@shared/ui';

import { OrganizationMemberRecord } from '../../models/organization-admin.model';
import { OrganizationMemberStatisticsComponent } from './organization-member-statistics.component';

@Component({
  selector: 'app-org-members-list',
  imports: [
    EnterpriseDetailSectionComponent,
    EnterpriseRelatedRecordsComponent,
    OrganizationMemberStatisticsComponent,
  ],
  template: `
    <app-enterprise-detail-section
      title="Members"
      description="Membership overview, administrators, and pending invitations"
      headingId="org-members"
      variant="outlined"
    >
      <app-org-member-statistics [members]="members()" />

      <div class="org-members__layout">
        <app-enterprise-related-records
          title="Organization owner"
          description="Primary account owner for this tenant."
          [items]="ownerItems()"
          emptyTitle="No owner listed"
          emptyDescription="An owner has not been assigned yet."
        />
        <app-enterprise-related-records
          title="Administrators"
          description="Users with administrative access."
          [items]="administratorItems()"
          emptyTitle="No administrators"
          emptyDescription="No administrators are listed for this organization."
        />
      </div>

      <app-enterprise-related-records
        title="Pending invitations"
        description="Members awaiting acceptance"
        [items]="invitationItems()"
        emptyTitle="No pending invitations"
        emptyDescription="All members have accepted their invitations."
      />
    </app-enterprise-detail-section>
  `,
  styles: `
    .org-members__layout {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--mpa-spacing-lg);
      margin: var(--mpa-spacing-lg) 0;
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

  readonly ownerItems = computed((): readonly EnterpriseDetailRelatedItem[] => {
    const owner =
      this.members().find((m) => m.role.includes('owner')) ?? this.members()[0];
    if (!owner) {
      return [];
    }
    return [
      {
        id: owner.id,
        title: owner.name,
        subtitle: owner.email,
        statusLabel: owner.role,
        statusSeverity: 'info',
        meta: owner.status,
      },
    ];
  });

  readonly administratorItems = computed((): readonly EnterpriseDetailRelatedItem[] =>
    this.members()
      .filter((m) => m.role.includes('admin') || m.role.includes('owner'))
      .map((member) => ({
        id: member.id,
        title: member.name,
        subtitle: member.email,
        statusLabel: member.role,
        statusSeverity: this.statusSeverity(member.status),
        meta: member.status,
      })),
  );

  readonly invitationItems = computed((): readonly EnterpriseDetailRelatedItem[] =>
    this.members()
      .filter((m) => m.status === 'invited')
      .map((member) => ({
        id: member.id,
        title: member.name,
        subtitle: member.email,
        statusLabel: 'Invited',
        statusSeverity: 'warn',
        meta: member.invitedAt
          ? new Date(member.invitedAt).toLocaleDateString()
          : undefined,
      })),
  );

  statusSeverity(
    status: OrganizationMemberRecord['status'],
  ): 'success' | 'warn' | 'danger' | 'secondary' {
    if (status === 'active') return 'success';
    if (status === 'invited') return 'warn';
    return 'danger';
  }
}

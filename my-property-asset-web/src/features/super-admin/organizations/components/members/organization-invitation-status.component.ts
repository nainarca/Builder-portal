import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { OrganizationMemberRecord } from '../../models/organization-admin.model';

@Component({
  selector: 'app-org-invitation-status',
  imports: [DatePipe],
  template: `
    <section class="org-invitations" aria-label="Invitation status">
      <h3 class="mpa-heading-sm">Pending invitations</h3>
      <ul class="org-invitations__list">
        @for (member of invited(); track member.id) {
          <li>
            <strong>{{ member.name }}</strong> — {{ member.email }}
            <time>{{ member.invitedAt | date: 'mediumDate' }}</time>
          </li>
        } @empty {
          <li class="org-invitations__empty">No pending invitations.</li>
        }
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationInvitationStatusComponent {
  readonly members = input.required<readonly OrganizationMemberRecord[]>();

  readonly invited = computed(() => this.members().filter((m) => m.status === 'invited'));
}

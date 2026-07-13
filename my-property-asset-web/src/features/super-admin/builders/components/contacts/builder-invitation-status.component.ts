import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { BuilderContactRecord } from '../../models/builder-admin.model';

@Component({
  selector: 'app-bldr-invitation-status',
  imports: [DatePipe],
  template: `
    <section class="bldr-invitations">
      <h3 class="mpa-heading-sm">Pending invitations</h3>
      <ul>
        @for (c of invited(); track c.id) {
          <li>{{ c.name }} — {{ c.email }} <time>{{ c.invitedAt | date: 'mediumDate' }}</time></li>
        } @empty { <li>No pending invitations.</li> }
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderInvitationStatusComponent {
  readonly contacts = input.required<readonly BuilderContactRecord[]>();
  readonly invited = computed(() => this.contacts().filter((c) => c.status === 'invited'));
}

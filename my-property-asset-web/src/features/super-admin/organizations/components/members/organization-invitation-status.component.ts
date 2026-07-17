import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { EmptyNoDataComponent, EnterpriseSectionHeaderComponent } from '@shared/ui';

import { OrganizationMemberRecord } from '../../models/organization-admin.model';

@Component({
  selector: 'app-org-invitation-status',
  imports: [DatePipe, EnterpriseSectionHeaderComponent, EmptyNoDataComponent],
  template: `
    <section class="org-invitations" aria-label="Invitation status">
      <app-enterprise-section-header
        title="Pending invitations"
        description="Members awaiting acceptance"
      />

      @if (invited().length) {
        <ul class="org-invitations__list">
          @for (member of invited(); track member.id) {
            <li class="org-invitations__item">
              <div>
                <strong>{{ member.name }}</strong>
                <span class="org-invitations__email">{{ member.email }}</span>
              </div>
              <time class="org-invitations__date">{{ member.invitedAt | date: 'mediumDate' }}</time>
            </li>
          }
        </ul>
      } @else {
        <app-empty-no-data
          title="No pending invitations"
          description="All members have accepted their invitations."
        />
      }
    </section>
  `,
  styles: `
    .org-invitations {
      display: grid;
      gap: var(--mpa-spacing-md);
    }

    .org-invitations__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: var(--mpa-spacing-sm);
    }

    .org-invitations__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--mpa-spacing-md);
      padding: var(--mpa-spacing-md);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg);
      background: var(--mpa-color-surface-elevated);
    }

    .org-invitations__email {
      display: block;
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }

    .org-invitations__date {
      font-size: var(--mpa-font-size-xs);
      color: var(--mpa-color-text-muted);
      white-space: nowrap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationInvitationStatusComponent {
  readonly members = input.required<readonly OrganizationMemberRecord[]>();

  readonly invited = computed(() => this.members().filter((m) => m.status === 'invited'));
}

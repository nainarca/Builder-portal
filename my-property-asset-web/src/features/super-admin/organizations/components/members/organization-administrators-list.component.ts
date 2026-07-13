import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatusBadgeComponent } from '@shared/ui';

import { OrganizationMemberRecord } from '../../models/organization-admin.model';

@Component({
  selector: 'app-org-administrators-list',
  imports: [TitleCasePipe, StatusBadgeComponent],
  template: `
    <ul class="org-members-list">
      @for (member of administrators(); track member.id) {
        <li class="org-members-list__item">
          <div>
            <strong>{{ member.name }}</strong>
            <p>{{ member.email }}</p>
          </div>
          <div class="org-members-list__meta">
            <app-status-badge [label]="member.role | titlecase" severity="secondary" />
            <app-status-badge [label]="member.status | titlecase" [severity]="statusSeverity(member.status)" />
          </div>
        </li>
      } @empty {
        <li class="org-members-list__empty">No administrators listed.</li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationAdministratorsListComponent {
  readonly members = input.required<readonly OrganizationMemberRecord[]>();

  readonly administrators = computed(() =>
    this.members().filter((m) => m.role.includes('admin') || m.role.includes('owner')),
  );

  statusSeverity(status: OrganizationMemberRecord['status']): 'success' | 'warn' | 'danger' | 'secondary' {
    if (status === 'active') return 'success';
    if (status === 'invited') return 'warn';
    return 'danger';
  }
}

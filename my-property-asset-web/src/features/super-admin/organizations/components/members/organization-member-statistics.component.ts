import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { OrganizationMemberRecord } from '../../models/organization-admin.model';
import { OrganizationStatisticsCardsComponent } from '../shared/organization-statistics-cards.component';

@Component({
  selector: 'app-org-member-statistics',
  imports: [OrganizationStatisticsCardsComponent],
  template: `<app-org-statistics-cards [stats]="stats()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationMemberStatisticsComponent {
  readonly members = input.required<readonly OrganizationMemberRecord[]>();

  readonly stats = computed(() => {
    const members = this.members();
    return [
      { label: 'Total members', value: String(members.length), icon: 'pi pi-users' },
      { label: 'Active', value: String(members.filter((m) => m.status === 'active').length) },
      { label: 'Invited', value: String(members.filter((m) => m.status === 'invited').length) },
      { label: 'Administrators', value: String(members.filter((m) => m.role.includes('admin') || m.role.includes('owner')).length) },
    ];
  });
}

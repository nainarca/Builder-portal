import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatusBadgeComponent } from '@shared/ui';

import { OrganizationAdminStatus } from '../../models/organization-admin.model';

@Component({
  selector: 'app-org-status-badge',
  imports: [StatusBadgeComponent],
  template: `<app-status-badge [label]="label()" [severity]="severity()" [icon]="icon()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationStatusBadgeComponent {
  readonly status = input.required<OrganizationAdminStatus>();

  readonly label = computed(() => {
    const map: Record<OrganizationAdminStatus, string> = {
      active: 'Active',
      inactive: 'Inactive',
      archived: 'Archived',
      pending: 'Pending',
    };
    return map[this.status()];
  });

  readonly severity = computed(() => {
    const map: Record<OrganizationAdminStatus, 'success' | 'warn' | 'danger' | 'info' | 'secondary'> = {
      active: 'success',
      inactive: 'secondary',
      archived: 'danger',
      pending: 'warn',
    };
    return map[this.status()];
  });

  readonly icon = computed(() => {
    const map: Record<OrganizationAdminStatus, string> = {
      active: 'pi pi-check-circle',
      inactive: 'pi pi-minus-circle',
      archived: 'pi pi-archive',
      pending: 'pi pi-clock',
    };
    return map[this.status()];
  });
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatusBadgeComponent } from '@shared/ui';

import { UserAdminStatus } from '../../models/user-admin.model';

@Component({
  selector: 'app-iam-user-status-badge',
  imports: [StatusBadgeComponent],
  template: `<app-status-badge [label]="label()" [severity]="severity()" [icon]="icon()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserStatusBadgeComponent {
  readonly status = input.required<UserAdminStatus>();

  readonly label = computed(() => ({
    active: 'Active', pending: 'Pending', inactive: 'Inactive', suspended: 'Suspended', archived: 'Archived',
  })[this.status()]);
  readonly severity = computed(() => ({
    active: 'success', pending: 'warn', inactive: 'secondary', suspended: 'danger', archived: 'danger',
  } as const)[this.status()]);
  readonly icon = computed(() => ({
    active: 'pi pi-check-circle', pending: 'pi pi-clock', inactive: 'pi pi-minus-circle',
    suspended: 'pi pi-ban', archived: 'pi pi-archive',
  })[this.status()]);
}

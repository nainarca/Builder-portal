import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatusBadgeComponent } from '@shared/ui';

import { InvitationStatus } from '../../models/invitation-admin.model';

@Component({
  selector: 'app-iam-invitation-badge',
  imports: [StatusBadgeComponent],
  template: `<app-status-badge [label]="label()" [severity]="severity()" [icon]="icon()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamInvitationBadgeComponent {
  readonly status = input.required<InvitationStatus>();

  readonly label = computed(() => ({
    pending: 'Pending', accepted: 'Accepted', expired: 'Expired', cancelled: 'Cancelled',
  })[this.status()]);
  readonly severity = computed(() => ({
    pending: 'warn', accepted: 'success', expired: 'secondary', cancelled: 'danger',
  } as const)[this.status()]);
  readonly icon = computed(() => ({
    pending: 'pi pi-clock', accepted: 'pi pi-check', expired: 'pi pi-calendar-times', cancelled: 'pi pi-times',
  })[this.status()]);
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatusBadgeComponent } from '@shared/ui';

import { OwnerActivationStatus } from '../../models/owner.model';

@Component({
  selector: 'app-owner-status-badge',
  imports: [StatusBadgeComponent],
  template: `<app-status-badge [label]="label()" [severity]="severity()" [icon]="icon()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerStatusBadgeComponent {
  readonly status = input.required<OwnerActivationStatus>();

  readonly label = computed(() => {
    const map: Record<OwnerActivationStatus, string> = {
      'not-invited': 'Not invited',
      invited: 'Invited',
      activated: 'Activated',
    };
    return map[this.status()];
  });

  readonly severity = computed(() => {
    const map: Record<OwnerActivationStatus, 'success' | 'warn' | 'danger' | 'info' | 'secondary'> = {
      'not-invited': 'secondary',
      invited: 'warn',
      activated: 'success',
    };
    return map[this.status()];
  });

  readonly icon = computed(() => {
    const map: Record<OwnerActivationStatus, string> = {
      'not-invited': 'pi pi-user',
      invited: 'pi pi-send',
      activated: 'pi pi-check-circle',
    };
    return map[this.status()];
  });
}

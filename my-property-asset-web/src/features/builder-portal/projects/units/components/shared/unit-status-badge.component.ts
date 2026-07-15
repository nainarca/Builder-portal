import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatusBadgeComponent } from '@shared/ui';

import { UnitStatus } from '../../models/unit.model';

@Component({
  selector: 'app-unit-status-badge',
  imports: [StatusBadgeComponent],
  template: `<app-status-badge [label]="label()" [severity]="severity()" [icon]="icon()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitStatusBadgeComponent {
  readonly status = input.required<UnitStatus>();

  readonly label = computed(() => {
    const map: Record<UnitStatus, string> = {
      available: 'Available',
      reserved: 'Reserved',
      sold: 'Sold',
      blocked: 'Blocked',
    };
    return map[this.status()];
  });

  readonly severity = computed(() => {
    const map: Record<UnitStatus, 'success' | 'warn' | 'danger' | 'info' | 'secondary'> = {
      available: 'info',
      reserved: 'warn',
      sold: 'success',
      blocked: 'secondary',
    };
    return map[this.status()];
  });

  readonly icon = computed(() => {
    const map: Record<UnitStatus, string> = {
      available: 'pi pi-circle',
      reserved: 'pi pi-clock',
      sold: 'pi pi-check-circle',
      blocked: 'pi pi-ban',
    };
    return map[this.status()];
  });
}

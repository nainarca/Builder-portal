import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { PermissionLevel } from '@core/rbac/models/permission.model';
import { StatusBadgeComponent } from '@shared/ui';

@Component({
  selector: 'app-iam-permission-badge',
  imports: [StatusBadgeComponent],
  template: `<app-status-badge [label]="label()" [severity]="severity()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamPermissionBadgeComponent {
  readonly level = input.required<PermissionLevel>();

  readonly label = computed(() => this.level().replace('-', ' '));
  readonly severity = computed(() => {
    const map: Record<PermissionLevel, 'success' | 'info' | 'warn' | 'secondary' | 'danger'> = {
      none: 'secondary', 'own-read': 'secondary', read: 'info', contribute: 'info',
      operate: 'warn', decide: 'warn', full: 'success', delegated: 'info',
    };
    return map[this.level()];
  });
}

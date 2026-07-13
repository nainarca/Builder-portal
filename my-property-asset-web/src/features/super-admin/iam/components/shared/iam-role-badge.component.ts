import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatusBadgeComponent } from '@shared/ui';

import { PlatformRole } from '@core/rbac/models/permission.model';
import { ROLE_REGISTRY } from '@core/rbac/registry/permission-matrix.registry';

@Component({
  selector: 'app-iam-role-badge',
  imports: [StatusBadgeComponent],
  template: `<app-status-badge [label]="label()" [severity]="severity()" [icon]="'pi pi-shield'" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamRoleBadgeComponent {
  readonly role = input.required<PlatformRole>();

  readonly label = computed(() => ROLE_REGISTRY[this.role()]?.label ?? this.role());
  readonly severity = computed(() => {
    const scope = ROLE_REGISTRY[this.role()]?.scope;
    return scope === 'platform' ? 'info' as const : 'secondary' as const;
  });
}

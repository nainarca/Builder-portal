import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { PermissionService } from '@core/rbac';

import { EnterpriseButtonComponent } from './enterprise-button.component';
import { EnterpriseButtonVariant } from '../models/enterprise.models';

/**
 * DS-03 Permission-aware Button — presentation gating only (hides when unauthorized).
 * Does not change RBAC rules; reads existing PermissionService.
 */
@Component({
  selector: 'app-permission-button',
  imports: [EnterpriseButtonComponent],
  template: `
    @if (allowed()) {
      <app-enterprise-button
        [variant]="variant()"
        [label]="label()"
        [icon]="icon()"
        [loading]="loading()"
        [disabled]="disabled()"
        [size]="size()"
        [type]="type()"
        [ariaLabel]="ariaLabel()"
        (clicked)="clicked.emit($event)"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'enterprise-permission-button' },
})
export class PermissionButtonComponent {
  private readonly permissions = inject(PermissionService);

  readonly permissionsRequired = input.required<string | readonly string[]>();
  readonly mode = input<'all' | 'any'>('all');
  readonly label = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly variant = input<EnterpriseButtonVariant>('primary');
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly size = input<'small' | 'large' | undefined>(undefined);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly clicked = output<MouseEvent>();

  readonly allowed = computed(() => {
    const value = this.permissionsRequired();
    const requirements = typeof value === 'string' ? [value] : [...value];
    return this.mode() === 'any'
      ? this.permissions.hasAnyPermission(requirements)
      : this.permissions.hasAllPermissions(requirements);
  });
}

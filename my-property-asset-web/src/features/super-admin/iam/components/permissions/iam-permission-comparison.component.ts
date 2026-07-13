import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { PlatformRole } from '@core/rbac/models/permission.model';
import { ROLE_REGISTRY } from '@core/rbac/registry/permission-matrix.registry';

@Component({
  selector: 'app-iam-permission-comparison',
  template: `
    <div class="iam-perm-comparison">
      <div class="iam-perm-comparison__selectors">
        <label class="iam-perm-comparison__field"><span>Role A</span>
          <select [value]="roleA()" (change)="onRoleA($event)">
            @for (r of roles; track r) { <option [value]="r">{{ roleLabel(r) }}</option> }
          </select>
        </label>
        <label class="iam-perm-comparison__field"><span>Role B</span>
          <select [value]="roleB()" (change)="onRoleB($event)">
            @for (r of roles; track r) { <option [value]="r">{{ roleLabel(r) }}</option> }
          </select>
        </label>
      </div>
      <p class="iam-perm-comparison__summary">{{ diffCount() }} differences found</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamPermissionComparisonComponent {
  readonly roleA = input<PlatformRole>('super-admin');
  readonly roleB = input<PlatformRole>('builder-org-admin');
  readonly diffCount = input(0);
  readonly roleAChange = output<PlatformRole>();
  readonly roleBChange = output<PlatformRole>();

  readonly roles = (Object.keys(ROLE_REGISTRY) as PlatformRole[]).filter((r) => r !== 'public-visitor');

  roleLabel(r: PlatformRole): string { return ROLE_REGISTRY[r]?.label ?? r; }
  onRoleA(e: Event): void { this.roleAChange.emit((e.target as HTMLSelectElement).value as PlatformRole); }
  onRoleB(e: Event): void { this.roleBChange.emit((e.target as HTMLSelectElement).value as PlatformRole); }
}

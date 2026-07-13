import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { PlatformRole } from '@core/rbac/models/permission.model';
import { ROLE_REGISTRY } from '@core/rbac/registry/permission-matrix.registry';

@Component({
  selector: 'app-iam-user-advanced-filters',
  template: `
    <div class="iam-advanced-filters">
      <label class="iam-advanced-filters__field"><span>Role</span>
        <select [value]="roleFilter()" (change)="onRole($event)">
          <option value="">All roles</option>
          @for (r of roles; track r) { <option [value]="r">{{ roleLabel(r) }}</option> }
        </select>
      </label>
      <label class="iam-advanced-filters__field"><span>Organization</span>
        <select [value]="organizationFilter()" (change)="onOrg($event)">
          <option value="">All organizations</option>
          @for (o of organizations(); track o) { <option [value]="o">{{ o }}</option> }
        </select>
      </label>
      <button type="button" class="iam-advanced-filters__reset" (click)="filtersReset.emit()">Reset filters</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserAdvancedFiltersComponent {
  readonly roleFilter = input<PlatformRole | 'all'>('all');
  readonly organizationFilter = input('');
  readonly organizations = input<readonly string[]>([]);
  readonly roleFilterChange = output<PlatformRole | 'all'>();
  readonly organizationFilterChange = output<string>();
  readonly filtersReset = output<void>();

  readonly roles = (Object.keys(ROLE_REGISTRY) as PlatformRole[]).filter((r) => r !== 'public-visitor');

  roleLabel(r: PlatformRole): string { return ROLE_REGISTRY[r]?.label ?? r; }

  onRole(e: Event): void {
    const v = (e.target as HTMLSelectElement).value;
    this.roleFilterChange.emit(v ? (v as PlatformRole) : 'all');
  }
  onOrg(e: Event): void { this.organizationFilterChange.emit((e.target as HTMLSelectElement).value); }
}

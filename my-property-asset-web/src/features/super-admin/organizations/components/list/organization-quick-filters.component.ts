import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { OrganizationAdminStatus } from '../../models/organization-admin.model';

@Component({
  selector: 'app-org-quick-filters',
  template: `
    <div class="org-quick-filters" role="group" aria-label="Quick filters">
      @for (filter of filters; track filter.value) {
        <button
          type="button"
          class="org-quick-filters__chip"
          [class.org-quick-filters__chip--active]="selected() === filter.value"
          [attr.aria-pressed]="selected() === filter.value"
          (click)="selectedChange.emit(filter.value)"
        >
          {{ filter.label }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationQuickFiltersComponent {
  readonly selected = input<OrganizationAdminStatus | 'all'>('all');

  readonly selectedChange = output<OrganizationAdminStatus | 'all'>();

  readonly filters = [
    { label: 'All', value: 'all' as const },
    { label: 'Active', value: 'active' as const },
    { label: 'Pending', value: 'pending' as const },
    { label: 'Inactive', value: 'inactive' as const },
    { label: 'Archived', value: 'archived' as const },
  ];
}

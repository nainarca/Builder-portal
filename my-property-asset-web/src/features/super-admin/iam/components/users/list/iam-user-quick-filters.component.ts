import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { UserAdminStatus } from '../../../models/user-admin.model';

@Component({
  selector: 'app-iam-user-quick-filters',
  template: `
    <div class="iam-quick-filters" role="group" aria-label="Quick filters">
      @for (f of filters; track f.value) {
        <button type="button" class="iam-quick-filters__chip"
          [class.iam-quick-filters__chip--active]="selected() === f.value"
          (click)="selectedChange.emit(f.value)">{{ f.label }}</button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserQuickFiltersComponent {
  readonly selected = input<UserAdminStatus | 'all'>('all');
  readonly selectedChange = output<UserAdminStatus | 'all'>();

  readonly filters = [
    { label: 'All', value: 'all' as const },
    { label: 'Active', value: 'active' as const },
    { label: 'Pending', value: 'pending' as const },
    { label: 'Suspended', value: 'suspended' as const },
    { label: 'Archived', value: 'archived' as const },
  ];
}

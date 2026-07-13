import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { BuilderAdminStatus } from '../../models/builder-admin.model';

@Component({
  selector: 'app-bldr-quick-filters',
  template: `
    <div class="bldr-quick-filters" role="group" aria-label="Quick filters">
      @for (f of filters; track f.value) {
        <button type="button" class="bldr-quick-filters__chip" [class.bldr-quick-filters__chip--active]="selected() === f.value"
          [attr.aria-pressed]="selected() === f.value" (click)="selectedChange.emit(f.value)">{{ f.label }}</button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderQuickFiltersComponent {
  readonly selected = input<BuilderAdminStatus | 'all'>('all');
  readonly selectedChange = output<BuilderAdminStatus | 'all'>();
  readonly filters = [
    { label: 'All', value: 'all' as const },
    { label: 'Active', value: 'active' as const },
    { label: 'Pending', value: 'pending' as const },
    { label: 'Inactive', value: 'inactive' as const },
    { label: 'Archived', value: 'archived' as const },
  ];
}

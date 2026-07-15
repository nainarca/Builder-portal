import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { UnitStatus } from '../../models/unit.model';

@Component({
  selector: 'app-unit-quick-filters',
  template: `
    <div class="unit-quick-filters" role="group" aria-label="Quick filters">
      @for (filter of filters; track filter.value) {
        <button
          type="button"
          class="unit-quick-filters__chip"
          [class.unit-quick-filters__chip--active]="selected() === filter.value"
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
export class UnitQuickFiltersComponent {
  readonly selected = input<UnitStatus | 'all'>('all');

  readonly selectedChange = output<UnitStatus | 'all'>();

  readonly filters = [
    { label: 'All', value: 'all' as const },
    { label: 'Available', value: 'available' as const },
    { label: 'Reserved', value: 'reserved' as const },
    { label: 'Sold', value: 'sold' as const },
    { label: 'Blocked', value: 'blocked' as const },
  ];
}

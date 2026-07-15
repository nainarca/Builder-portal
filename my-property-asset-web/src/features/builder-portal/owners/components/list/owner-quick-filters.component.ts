import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { OwnerActivationStatus } from '../../models/owner.model';

@Component({
  selector: 'app-owner-quick-filters',
  template: `
    <div class="owner-quick-filters" role="group" aria-label="Quick filters">
      @for (filter of filters; track filter.value) {
        <button
          type="button"
          class="owner-quick-filters__chip"
          [class.owner-quick-filters__chip--active]="selected() === filter.value"
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
export class OwnerQuickFiltersComponent {
  readonly selected = input<OwnerActivationStatus | 'all'>('all');

  readonly selectedChange = output<OwnerActivationStatus | 'all'>();

  readonly filters = [
    { label: 'All', value: 'all' as const },
    { label: 'Not invited', value: 'not-invited' as const },
    { label: 'Invited', value: 'invited' as const },
    { label: 'Activated', value: 'activated' as const },
  ];
}

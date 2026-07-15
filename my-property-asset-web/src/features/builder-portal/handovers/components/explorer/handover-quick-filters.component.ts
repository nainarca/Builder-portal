import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { HandoverOverallStatus } from '../../models/handover.model';

@Component({
  selector: 'app-handover-quick-filters',
  template: `
    <div class="handover-quick-filters" role="group" aria-label="Quick filters">
      @for (filter of filters; track filter.value) {
        <button
          type="button"
          class="handover-quick-filters__chip"
          [class.handover-quick-filters__chip--active]="selected() === filter.value"
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
export class HandoverQuickFiltersComponent {
  readonly selected = input<HandoverOverallStatus | 'all'>('all');

  readonly selectedChange = output<HandoverOverallStatus | 'all'>();

  readonly filters = [
    { label: 'All', value: 'all' as const },
    { label: 'Pending', value: 'pending' as const },
    { label: 'In progress', value: 'in-progress' as const },
    { label: 'Delayed', value: 'delayed' as const },
    { label: 'Completed', value: 'completed' as const },
  ];
}

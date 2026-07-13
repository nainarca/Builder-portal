import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DashboardFilterOption } from '../../models/dashboard.model';

@Component({
  selector: 'app-sa-dashboard-filters',
  template: `
    <div class="sa-dashboard-filters" role="group" [attr.aria-label]="ariaLabel()">
      @for (option of options(); track option.id) {
        <button
          type="button"
          class="sa-dashboard-filter"
          [class.sa-dashboard-filter--active]="option.value === selected()"
          [attr.aria-pressed]="option.value === selected()"
          (click)="selectedChange.emit(option.value)"
        >
          {{ option.label }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardFiltersComponent {
  readonly options = input.required<readonly DashboardFilterOption[]>();
  readonly selected = input.required<string>();
  readonly ariaLabel = input('Dashboard time range');

  readonly selectedChange = output<string>();
}

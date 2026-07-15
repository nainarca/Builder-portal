import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DashboardFilterOption } from '../../models/dashboard.model';

@Component({
  selector: 'app-bp-dashboard-filters',
  template: `
    <div class="bp-dashboard-filters" role="group" [attr.aria-label]="ariaLabel()">
      @for (option of options(); track option.id) {
        <button
          type="button"
          class="bp-dashboard-filter"
          [class.bp-dashboard-filter--active]="option.value === selected()"
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

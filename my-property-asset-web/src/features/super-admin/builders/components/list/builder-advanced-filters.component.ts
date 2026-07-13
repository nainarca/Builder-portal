import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { FilterPanelComponent } from '@shared/ui';

@Component({
  selector: 'app-bldr-advanced-filters',
  imports: [FilterPanelComponent],
  template: `
    <app-filter-panel ariaLabel="Advanced builder filters">
      <label class="bldr-advanced-filters__field"><span>Region</span>
        <select [value]="regionFilter()" (change)="onRegion($event)">
          <option value="">All regions</option>
          @for (r of regions(); track r) { <option [value]="r">{{ r }}</option> }
        </select>
      </label>
      <label class="bldr-advanced-filters__field"><span>Plan</span>
        <select [value]="planFilter()" (change)="onPlan($event)">
          <option value="">All plans</option>
          @for (p of plans(); track p) { <option [value]="p">{{ p }}</option> }
        </select>
      </label>
      <button type="button" class="bldr-advanced-filters__reset" (click)="filtersReset.emit()">Reset filters</button>
    </app-filter-panel>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderAdvancedFiltersComponent {
  readonly regionFilter = input('');
  readonly planFilter = input('');
  readonly regions = input<readonly string[]>([]);
  readonly plans = input<readonly string[]>([]);
  readonly regionFilterChange = output<string>();
  readonly planFilterChange = output<string>();
  readonly filtersReset = output<void>();

  onRegion(e: Event): void { this.regionFilterChange.emit((e.target as HTMLSelectElement).value); }
  onPlan(e: Event): void { this.planFilterChange.emit((e.target as HTMLSelectElement).value); }
}

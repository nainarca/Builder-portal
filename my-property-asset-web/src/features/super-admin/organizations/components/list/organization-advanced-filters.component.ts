import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { OrganizationType } from '@core/organization-context/models/organization.model';
import { FilterPanelComponent } from '@shared/ui';

@Component({
  selector: 'app-org-advanced-filters',
  imports: [FilterPanelComponent],
  template: `
    <app-filter-panel ariaLabel="Advanced organization filters">
      <label class="org-advanced-filters__field">
        <span>Type</span>
        <select [value]="typeFilter()" (change)="onTypeChange($event)">
          <option value="all">All types</option>
          <option value="builder">Builder</option>
          <option value="owner">Owner</option>
          <option value="partner">Partner</option>
          <option value="marketplace">Marketplace</option>
        </select>
      </label>
      <label class="org-advanced-filters__field">
        <span>Region</span>
        <select [value]="regionFilter()" (change)="onRegionChange($event)">
          <option value="">All regions</option>
          @for (region of regions(); track region) {
            <option [value]="region">{{ region }}</option>
          }
        </select>
      </label>
      <label class="org-advanced-filters__field">
        <span>Plan</span>
        <select [value]="planFilter()" (change)="onPlanChange($event)">
          <option value="">All plans</option>
          @for (plan of plans(); track plan) {
            <option [value]="plan">{{ plan }}</option>
          }
        </select>
      </label>
      <button type="button" class="org-advanced-filters__reset" (click)="filtersReset.emit()">Reset filters</button>
    </app-filter-panel>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationAdvancedFiltersComponent {
  readonly typeFilter = input<OrganizationType | 'all'>('all');
  readonly regionFilter = input('');
  readonly planFilter = input('');
  readonly regions = input<readonly string[]>([]);
  readonly plans = input<readonly string[]>([]);

  readonly typeFilterChange = output<OrganizationType | 'all'>();
  readonly regionFilterChange = output<string>();
  readonly planFilterChange = output<string>();
  readonly filtersReset = output<void>();

  onTypeChange(event: Event): void {
    this.typeFilterChange.emit((event.target as HTMLSelectElement).value as OrganizationType | 'all');
  }

  onRegionChange(event: Event): void {
    this.regionFilterChange.emit((event.target as HTMLSelectElement).value);
  }

  onPlanChange(event: Event): void {
    this.planFilterChange.emit((event.target as HTMLSelectElement).value);
  }
}

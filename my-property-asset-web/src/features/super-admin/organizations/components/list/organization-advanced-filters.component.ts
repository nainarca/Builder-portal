import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { OrganizationType } from '@core/organization-context/models/organization.model';
import {
  EnterpriseSelectInputComponent,
  FilterPanelComponent,
  GhostButtonComponent,
} from '@shared/ui';

const TYPE_OPTIONS = [
  { label: 'All types', value: 'all' },
  { label: 'Builder', value: 'builder' },
  { label: 'Owner', value: 'owner' },
  { label: 'Partner', value: 'partner' },
  { label: 'Marketplace', value: 'marketplace' },
];

@Component({
  selector: 'app-org-advanced-filters',
  imports: [FilterPanelComponent, EnterpriseSelectInputComponent, GhostButtonComponent],
  template: `
    <app-filter-panel ariaLabel="Advanced organization filters">
      <app-enterprise-select-input
        label="Type"
        [options]="typeOptions"
        [value]="typeFilter()"
        (valueChange)="onTypeChange($event)"
      />
      <app-enterprise-select-input
        label="Region"
        [options]="regionOptions()"
        [value]="regionFilter() || ''"
        (valueChange)="regionFilterChange.emit($event)"
      />
      <app-enterprise-select-input
        label="Plan"
        [options]="planOptions()"
        [value]="planFilter() || ''"
        (valueChange)="planFilterChange.emit($event)"
      />
      <app-ghost-button label="Reset filters" icon="pi pi-refresh" (clicked)="filtersReset.emit()" />
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

  readonly typeOptions = TYPE_OPTIONS;

  readonly regionOptions = computed(() => [
    { label: 'All regions', value: '' },
    ...this.regions().map((region) => ({ label: region, value: region })),
  ]);

  readonly planOptions = computed(() => [
    { label: 'All plans', value: '' },
    ...this.plans().map((plan) => ({ label: plan, value: plan })),
  ]);

  onTypeChange(value: string): void {
    this.typeFilterChange.emit(value as OrganizationType | 'all');
  }
}

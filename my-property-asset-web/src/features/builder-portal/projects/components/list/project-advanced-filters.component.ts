import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CheckboxComponent, FilterPanelComponent, SelectComponent, SelectOption } from '@shared/ui';

import { PROJECT_TYPE_OPTIONS } from '../../config/projects.config';
import { ProjectType } from '../../models/project.model';

@Component({
  selector: 'app-proj-advanced-filters',
  imports: [FilterPanelComponent, SelectComponent, CheckboxComponent],
  template: `
    <app-filter-panel ariaLabel="Advanced project filters">
      <div class="proj-advanced-filters__field">
        <span>Project type</span>
        <app-select
          [options]="typeOptions"
          [value]="typeFilter()"
          ariaLabel="Project type"
          (valueChange)="onTypeChange($event)"
        />
      </div>
      <div class="proj-advanced-filters__field">
        <span>City</span>
        <app-select
          [options]="cityOptions()"
          [value]="cityFilter()"
          ariaLabel="City"
          (valueChange)="cityFilterChange.emit($event)"
        />
      </div>
      <app-checkbox
        label="Include archived"
        [checked]="includeArchived()"
        (checkedChange)="includeArchivedChange.emit($event)"
      />
      <button type="button" class="proj-advanced-filters__reset" (click)="filtersReset.emit()">Reset filters</button>
    </app-filter-panel>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectAdvancedFiltersComponent {
  readonly typeFilter = input<ProjectType | 'all'>('all');
  readonly cityFilter = input('');
  readonly includeArchived = input(false);
  readonly cities = input<readonly string[]>([]);

  readonly typeFilterChange = output<ProjectType | 'all'>();
  readonly cityFilterChange = output<string>();
  readonly includeArchivedChange = output<boolean>();
  readonly filtersReset = output<void>();

  readonly typeOptions: readonly SelectOption[] = PROJECT_TYPE_OPTIONS;

  cityOptions(): readonly SelectOption[] {
    return [{ label: 'All cities', value: '' }, ...this.cities().map((city) => ({ label: city, value: city }))];
  }

  onTypeChange(value: string): void {
    this.typeFilterChange.emit(value as ProjectType | 'all');
  }
}

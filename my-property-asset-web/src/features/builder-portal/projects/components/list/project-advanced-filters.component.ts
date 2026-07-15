import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CheckboxComponent, FilterPanelComponent, SelectComponent, SelectOption } from '@shared/ui';

import {
  PROJECT_HEALTH_OPTIONS,
  PROJECT_STAGE_OPTIONS,
} from '../../config/projects.config';
import { ConstructionStage, ProjectHealth } from '../../models/project.model';

@Component({
  selector: 'app-proj-advanced-filters',
  imports: [FilterPanelComponent, SelectComponent, CheckboxComponent],
  template: `
    <app-filter-panel ariaLabel="Advanced project filters">
      <div class="proj-advanced-filters__field">
        <span>Construction stage</span>
        <app-select
          [options]="stageOptions"
          [value]="stageFilter()"
          ariaLabel="Construction stage"
          (valueChange)="onStageChange($event)"
        />
      </div>
      <div class="proj-advanced-filters__field">
        <span>Health</span>
        <app-select
          [options]="healthOptions"
          [value]="healthFilter()"
          ariaLabel="Health"
          (valueChange)="onHealthChange($event)"
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
  readonly stageFilter = input<ConstructionStage | 'all'>('all');
  readonly healthFilter = input<ProjectHealth | 'all'>('all');
  readonly cityFilter = input('');
  readonly includeArchived = input(false);
  readonly cities = input<readonly string[]>([]);

  readonly stageFilterChange = output<ConstructionStage | 'all'>();
  readonly healthFilterChange = output<ProjectHealth | 'all'>();
  readonly cityFilterChange = output<string>();
  readonly includeArchivedChange = output<boolean>();
  readonly filtersReset = output<void>();

  readonly stageOptions: readonly SelectOption[] = PROJECT_STAGE_OPTIONS;
  readonly healthOptions: readonly SelectOption[] = PROJECT_HEALTH_OPTIONS;

  cityOptions(): readonly SelectOption[] {
    return [{ label: 'All cities', value: '' }, ...this.cities().map((city) => ({ label: city, value: city }))];
  }

  onStageChange(value: string): void {
    this.stageFilterChange.emit(value as ConstructionStage | 'all');
  }

  onHealthChange(value: string): void {
    this.healthFilterChange.emit(value as ProjectHealth | 'all');
  }
}

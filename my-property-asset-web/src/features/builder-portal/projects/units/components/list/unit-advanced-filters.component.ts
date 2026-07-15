import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CheckboxComponent, FilterPanelComponent, SelectComponent, SelectOption } from '@shared/ui';

import { UNIT_STAGE_OPTIONS, UNIT_TYPE_OPTIONS } from '../../config/units.config';
import { Tower, UnitConstructionStage, UnitTypeCategory } from '../../models/unit.model';

@Component({
  selector: 'app-unit-advanced-filters',
  imports: [FilterPanelComponent, SelectComponent, CheckboxComponent],
  template: `
    <app-filter-panel ariaLabel="Advanced unit filters">
      <div class="unit-advanced-filters__field">
        <span>Tower</span>
        <app-select [options]="towerOptions()" [value]="towerFilter()" ariaLabel="Tower" (valueChange)="towerFilterChange.emit($event)" />
      </div>
      <div class="unit-advanced-filters__field">
        <span>Floor</span>
        <app-select [options]="floorOptions()" [value]="floorFilterValue()" ariaLabel="Floor" (valueChange)="onFloorChange($event)" />
      </div>
      <div class="unit-advanced-filters__field">
        <span>Type</span>
        <app-select [options]="typeOptions" [value]="typeFilter()" ariaLabel="Type" (valueChange)="onTypeChange($event)" />
      </div>
      <div class="unit-advanced-filters__field">
        <span>Construction stage</span>
        <app-select [options]="stageOptions" [value]="stageFilter()" ariaLabel="Construction stage" (valueChange)="onStageChange($event)" />
      </div>
      <app-checkbox
        label="Include archived"
        [checked]="includeArchived()"
        (checkedChange)="includeArchivedChange.emit($event)"
      />
      <button type="button" class="unit-advanced-filters__reset" (click)="filtersReset.emit()">Reset filters</button>
    </app-filter-panel>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitAdvancedFiltersComponent {
  readonly stageFilter = input<UnitConstructionStage | 'all'>('all');
  readonly typeFilter = input<UnitTypeCategory | 'all'>('all');
  readonly towerFilter = input('');
  readonly floorFilter = input<number | 'all'>('all');
  readonly includeArchived = input(false);
  readonly towers = input<readonly Tower[]>([]);
  readonly floors = input<readonly number[]>([]);

  readonly stageFilterChange = output<UnitConstructionStage | 'all'>();
  readonly typeFilterChange = output<UnitTypeCategory | 'all'>();
  readonly towerFilterChange = output<string>();
  readonly floorFilterChange = output<number | 'all'>();
  readonly includeArchivedChange = output<boolean>();
  readonly filtersReset = output<void>();

  readonly stageOptions: readonly SelectOption[] = UNIT_STAGE_OPTIONS;
  readonly typeOptions: readonly SelectOption[] = UNIT_TYPE_OPTIONS;

  towerOptions(): readonly SelectOption[] {
    return [{ label: 'All towers', value: '' }, ...this.towers().map((t) => ({ label: t.name, value: t.id }))];
  }

  floorOptions(): readonly SelectOption[] {
    return [
      { label: 'All floors', value: 'all' },
      ...this.floors().map((f) => ({ label: `Floor ${f}`, value: String(f) })),
    ];
  }

  floorFilterValue(): string {
    return this.floorFilter() === 'all' ? 'all' : String(this.floorFilter());
  }

  onFloorChange(value: string): void {
    this.floorFilterChange.emit(value === 'all' ? 'all' : Number(value));
  }

  onTypeChange(value: string): void {
    this.typeFilterChange.emit(value as UnitTypeCategory | 'all');
  }

  onStageChange(value: string): void {
    this.stageFilterChange.emit(value as UnitConstructionStage | 'all');
  }
}

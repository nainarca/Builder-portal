import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { FilterPanelComponent, SelectComponent, SelectOption } from '@shared/ui';

interface ProjectOption {
  readonly id: string;
  readonly name: string;
}

@Component({
  selector: 'app-handover-advanced-filters',
  imports: [FilterPanelComponent, SelectComponent],
  template: `
    <app-filter-panel ariaLabel="Advanced handover filters">
      <div class="handover-advanced-filters__field">
        <span>Project</span>
        <app-select [options]="projectOptions()" [value]="projectFilter()" ariaLabel="Project" (valueChange)="projectFilterChange.emit($event)" />
      </div>
      <button type="button" class="handover-advanced-filters__reset" (click)="filtersReset.emit()">Reset filters</button>
    </app-filter-panel>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandoverAdvancedFiltersComponent {
  readonly projectFilter = input('');
  readonly projects = input<readonly ProjectOption[]>([]);

  readonly projectFilterChange = output<string>();
  readonly filtersReset = output<void>();

  projectOptions(): readonly SelectOption[] {
    return [{ label: 'All projects', value: '' }, ...this.projects().map((p) => ({ label: p.name, value: p.id }))];
  }
}

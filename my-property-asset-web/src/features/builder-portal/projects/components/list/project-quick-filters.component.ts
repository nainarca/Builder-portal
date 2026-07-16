import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ProjectStatus } from '../../models/project.model';

@Component({
  selector: 'app-proj-quick-filters',
  template: `
    <div class="proj-quick-filters" role="group" aria-label="Quick filters">
      @for (filter of filters; track filter.value) {
        <button
          type="button"
          class="proj-quick-filters__chip"
          [class.proj-quick-filters__chip--active]="selected() === filter.value"
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
export class ProjectQuickFiltersComponent {
  readonly selected = input<ProjectStatus | 'all'>('all');

  readonly selectedChange = output<ProjectStatus | 'all'>();

  readonly filters = [
    { label: 'All', value: 'all' as const },
    { label: 'Upcoming', value: 'upcoming' as const },
    { label: 'Planning', value: 'planning' as const },
    { label: 'Construction', value: 'construction' as const },
    { label: 'Completed', value: 'completed' as const },
  ];
}

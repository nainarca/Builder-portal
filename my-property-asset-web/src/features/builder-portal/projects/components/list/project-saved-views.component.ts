import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { SelectComponent, SelectOption } from '@shared/ui';

import { ProjectSavedView } from '../../models/project.model';

@Component({
  selector: 'app-proj-saved-views',
  imports: [SelectComponent],
  template: `
    <div class="proj-saved-views">
      <span class="proj-saved-views__label" id="proj-saved-views-label">Saved view</span>
      <app-select
        [options]="options()"
        [value]="selectedId()"
        ariaLabel="Saved view"
        (valueChange)="viewChange.emit($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSavedViewsComponent {
  readonly views = input.required<readonly ProjectSavedView[]>();
  readonly selectedId = input('all');

  readonly viewChange = output<string>();

  readonly options = computed<readonly SelectOption[]>(() =>
    this.views().map((view) => ({ label: view.name, value: view.id })),
  );
}

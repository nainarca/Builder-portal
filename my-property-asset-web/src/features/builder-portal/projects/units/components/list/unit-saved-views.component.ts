import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { SelectComponent, SelectOption } from '@shared/ui';

import { UnitSavedView } from '../../models/unit.model';

@Component({
  selector: 'app-unit-saved-views',
  imports: [SelectComponent],
  template: `
    <div class="unit-saved-views">
      <span class="unit-saved-views__label" id="unit-saved-views-label">Saved view</span>
      <app-select [options]="options()" [value]="selectedId()" ariaLabel="Saved view" (valueChange)="viewChange.emit($event)" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitSavedViewsComponent {
  readonly views = input.required<readonly UnitSavedView[]>();
  readonly selectedId = input('all');

  readonly viewChange = output<string>();

  readonly options = computed<readonly SelectOption[]>(() =>
    this.views().map((view) => ({ label: view.name, value: view.id })),
  );
}

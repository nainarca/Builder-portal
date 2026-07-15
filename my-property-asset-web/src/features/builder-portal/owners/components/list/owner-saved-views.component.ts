import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { SelectComponent, SelectOption } from '@shared/ui';

import { OwnerSavedView } from '../../models/owner.model';

@Component({
  selector: 'app-owner-saved-views',
  imports: [SelectComponent],
  template: `
    <div class="owner-saved-views">
      <span class="owner-saved-views__label">Saved view</span>
      <app-select [options]="options()" [value]="selectedId()" ariaLabel="Saved view" (valueChange)="viewChange.emit($event)" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerSavedViewsComponent {
  readonly views = input.required<readonly OwnerSavedView[]>();
  readonly selectedId = input('all');

  readonly viewChange = output<string>();

  readonly options = computed<readonly SelectOption[]>(() =>
    this.views().map((view) => ({ label: view.name, value: view.id })),
  );
}

import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { SelectComponent, SelectOption } from '@shared/ui';

import { HandoverSavedView } from '../../models/handover.model';

@Component({
  selector: 'app-handover-saved-views',
  imports: [SelectComponent],
  template: `
    <div class="handover-saved-views">
      <span class="handover-saved-views__label">Saved view</span>
      <app-select [options]="options()" [value]="selectedId()" ariaLabel="Saved view" (valueChange)="viewChange.emit($event)" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandoverSavedViewsComponent {
  readonly views = input.required<readonly HandoverSavedView[]>();
  readonly selectedId = input('all');

  readonly viewChange = output<string>();

  readonly options = computed<readonly SelectOption[]>(() =>
    this.views().map((view) => ({ label: view.name, value: view.id })),
  );
}

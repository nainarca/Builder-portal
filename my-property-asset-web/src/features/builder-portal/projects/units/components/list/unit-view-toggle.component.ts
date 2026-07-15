import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { UnitViewMode } from '../../services/unit-list-state.service';

@Component({
  selector: 'app-unit-view-toggle',
  template: `
    <div class="unit-view-toggle" role="group" aria-label="Toggle view">
      <button
        type="button"
        class="unit-view-toggle__btn"
        [class.unit-view-toggle__btn--active]="mode() === 'card'"
        [attr.aria-pressed]="mode() === 'card'"
        aria-label="Card view"
        (click)="modeChange.emit('card')"
      >
        <i class="pi pi-th-large" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="unit-view-toggle__btn"
        [class.unit-view-toggle__btn--active]="mode() === 'table'"
        [attr.aria-pressed]="mode() === 'table'"
        aria-label="Table view"
        (click)="modeChange.emit('table')"
      >
        <i class="pi pi-table" aria-hidden="true"></i>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitViewToggleComponent {
  readonly mode = input.required<UnitViewMode>();

  readonly modeChange = output<UnitViewMode>();
}

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CheckboxComponent } from '@shared/ui';

import { UNIT_TABLE_COLUMNS } from '../../config/units.config';

@Component({
  selector: 'app-unit-column-selector',
  imports: [CheckboxComponent],
  template: `
    <div class="unit-column-selector" role="group" aria-label="Column selector">
      <span class="unit-column-selector__label">Columns</span>
      @for (column of columns; track column.id) {
        <app-checkbox
          [label]="column.label"
          [checked]="isVisible(column.id)"
          (checkedChange)="columnToggle.emit(column.id)"
        />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitColumnSelectorComponent {
  readonly visibleColumns = input<string[]>([]);

  readonly columnToggle = output<string>();

  readonly columns = UNIT_TABLE_COLUMNS;

  isVisible(id: string): boolean {
    return this.visibleColumns().includes(id);
  }
}

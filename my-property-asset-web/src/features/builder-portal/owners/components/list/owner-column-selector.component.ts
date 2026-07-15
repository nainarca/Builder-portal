import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CheckboxComponent } from '@shared/ui';

import { OWNER_TABLE_COLUMNS } from '../../config/owners.config';

@Component({
  selector: 'app-owner-column-selector',
  imports: [CheckboxComponent],
  template: `
    <div class="owner-column-selector" role="group" aria-label="Column selector">
      <span class="owner-column-selector__label">Columns</span>
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
export class OwnerColumnSelectorComponent {
  readonly visibleColumns = input<string[]>([]);

  readonly columnToggle = output<string>();

  readonly columns = OWNER_TABLE_COLUMNS;

  isVisible(id: string): boolean {
    return this.visibleColumns().includes(id);
  }
}

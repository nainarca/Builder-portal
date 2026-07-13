import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { USER_TABLE_COLUMNS } from '../../../config/iam.config';

@Component({
  selector: 'app-iam-user-column-selector',
  template: `
    <div class="iam-column-selector" role="group" aria-label="Column selector">
      <span class="iam-column-selector__label">Columns</span>
      @for (col of columns; track col.id) {
        <label class="iam-column-selector__option">
          <input type="checkbox" [checked]="visibleColumns().includes(col.id)" (change)="columnToggle.emit(col.id)" />
          {{ col.label }}
        </label>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserColumnSelectorComponent {
  readonly visibleColumns = input<string[]>([]);
  readonly columnToggle = output<string>();
  readonly columns = USER_TABLE_COLUMNS;
}

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ORGANIZATION_TABLE_COLUMNS } from '../../config/organizations.config';

@Component({
  selector: 'app-org-column-selector',
  template: `
    <div class="org-column-selector" role="group" aria-label="Column selector">
      <span class="org-column-selector__label">Columns</span>
      @for (column of columns; track column.id) {
        <label class="org-column-selector__option">
          <input
            type="checkbox"
            [checked]="isVisible(column.id)"
            (change)="columnToggle.emit(column.id)"
          />
          {{ column.label }}
        </label>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationColumnSelectorComponent {
  readonly visibleColumns = input<string[]>([]);

  readonly columnToggle = output<string>();

  readonly columns = ORGANIZATION_TABLE_COLUMNS;

  isVisible(id: string): boolean {
    return this.visibleColumns().includes(id);
  }
}

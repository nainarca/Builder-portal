import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { BUILDER_TABLE_COLUMNS } from '../../config/builders.config';

@Component({
  selector: 'app-bldr-column-selector',
  template: `
    <div class="bldr-column-selector" role="group" aria-label="Column selector">
      <span class="bldr-column-selector__label">Columns</span>
      @for (col of columns; track col.id) {
        <label class="bldr-column-selector__option">
          <input type="checkbox" [checked]="isVisible(col.id)" (change)="columnToggle.emit(col.id)" />
          {{ col.label }}
        </label>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderColumnSelectorComponent {
  readonly visibleColumns = input<string[]>([]);
  readonly columnToggle = output<string>();
  readonly columns = BUILDER_TABLE_COLUMNS;
  isVisible(id: string): boolean { return this.visibleColumns().includes(id); }
}

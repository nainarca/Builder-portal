import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CheckboxComponent } from '@shared/ui';

import { PROJECT_TABLE_COLUMNS } from '../../config/projects.config';

@Component({
  selector: 'app-proj-column-selector',
  imports: [CheckboxComponent],
  template: `
    <div class="proj-column-selector" role="group" aria-label="Column selector">
      <span class="proj-column-selector__label">Columns</span>
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
export class ProjectColumnSelectorComponent {
  readonly visibleColumns = input<string[]>([]);

  readonly columnToggle = output<string>();

  readonly columns = PROJECT_TABLE_COLUMNS;

  isVisible(id: string): boolean {
    return this.visibleColumns().includes(id);
  }
}

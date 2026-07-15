import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CheckboxComponent } from '@shared/ui';

import { DOCUMENT_TABLE_COLUMNS } from '../../config/documents.config';

@Component({
  selector: 'app-document-column-selector',
  imports: [CheckboxComponent],
  template: `
    <div class="doc-column-selector" role="group" aria-label="Column selector">
      <span class="doc-column-selector__label">Columns</span>
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
export class DocumentColumnSelectorComponent {
  readonly visibleColumns = input<string[]>([]);

  readonly columnToggle = output<string>();

  readonly columns = DOCUMENT_TABLE_COLUMNS;

  isVisible(id: string): boolean {
    return this.visibleColumns().includes(id);
  }
}

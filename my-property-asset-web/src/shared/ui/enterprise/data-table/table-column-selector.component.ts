import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { CheckboxComponent } from '../../primitives/checkbox/checkbox.component';
import { GhostButtonComponent, IconButtonComponent } from '../buttons/enterprise-button.component';
import type { EnterpriseTableColumnDef } from './models/enterprise-table.models';
import { reorderColumns, toggleColumnVisibility } from './utils/enterprise-table-columns.util';

@Component({
  selector: 'app-enterprise-table-column-selector',
  imports: [CheckboxComponent, IconButtonComponent, GhostButtonComponent],
  template: `
    <div class="enterprise-table-column-selector">
      <app-icon-button
        label="Columns"
        icon="pi pi-table"
        size="small"
        ariaLabel="Choose visible columns"
        (clicked)="togglePanel()"
      />
      @if (panelOpen()) {
        <div
          class="enterprise-table-column-selector__panel"
          role="dialog"
          aria-label="Column visibility and order"
          (keydown.escape)="closePanel()"
        >
          <div class="enterprise-table-column-selector__header">Columns</div>
          @for (column of columns(); track column.id; let index = $index) {
            <div class="enterprise-table-column-selector__row">
              <app-checkbox
                [checked]="column.visible !== false"
                [label]="column.header"
                (checkedChange)="onVisibilityChange(column.id, $event)"
              />
              <div class="enterprise-table-column-selector__reorder">
                <app-ghost-button
                  label="Move up"
                  icon="pi pi-arrow-up"
                  size="small"
                  [disabled]="index === 0"
                  (clicked)="moveColumn(index, index - 1)"
                />
                <app-ghost-button
                  label="Move down"
                  icon="pi pi-arrow-down"
                  size="small"
                  [disabled]="index === columns().length - 1"
                  (clicked)="moveColumn(index, index + 1)"
                />
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .enterprise-table-column-selector {
      position: relative;
    }
    .enterprise-table-column-selector__panel {
      position: absolute;
      top: 100%;
      right: 0;
      z-index: var(--mpa-z-index-dropdown, 200);
      min-width: 16rem;
      max-height: 20rem;
      overflow: auto;
      margin-top: var(--mpa-spacing-xs);
      padding: var(--mpa-spacing-sm);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md);
      background: var(--mpa-color-surface-elevated, var(--mpa-color-surface));
      box-shadow: var(--mpa-shadow-md, 0 4px 12px rgb(15 23 42 / 12%));
    }
    .enterprise-table-column-selector__header {
      margin-bottom: var(--mpa-spacing-sm);
      font-size: var(--mpa-font-size-sm);
      font-weight: var(--mpa-font-weight-semibold);
    }
    .enterprise-table-column-selector__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--mpa-spacing-sm);
      padding: var(--mpa-spacing-xs) 0;
    }
    .enterprise-table-column-selector__reorder {
      display: inline-flex;
      gap: var(--mpa-spacing-xs);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTableColumnSelectorComponent {
  readonly columns = input<readonly EnterpriseTableColumnDef[]>([]);

  readonly columnsChange = output<readonly EnterpriseTableColumnDef[]>();

  readonly panelOpen = signal(false);

  togglePanel(): void {
    this.panelOpen.update((open) => !open);
  }

  closePanel(): void {
    this.panelOpen.set(false);
  }

  onVisibilityChange(columnId: string, visible: boolean): void {
    this.columnsChange.emit(toggleColumnVisibility(this.columns(), columnId, visible));
  }

  moveColumn(fromIndex: number, toIndex: number): void {
    this.columnsChange.emit(reorderColumns(this.columns(), fromIndex, toIndex));
  }
}

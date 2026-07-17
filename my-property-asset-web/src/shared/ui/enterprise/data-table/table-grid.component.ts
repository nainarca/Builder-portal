import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  TemplateRef,
} from '@angular/core';
import { TableModule } from 'primeng/table';

import { TableComponent } from '../../primitives/table/table.component';
import { EnterpriseTableRowActionsComponent } from './table-row-actions.component';
import { EnterpriseSearchHighlightComponent } from './table-search.component';
import type {
  EnterpriseTableColumnDef,
  EnterpriseTableResponsiveConfig,
  EnterpriseTableRowAction,
  EnterpriseTableVirtualScrollConfig,
  TableDensity,
} from './models/enterprise-table.models';
import { visibleColumns } from './utils/enterprise-table-columns.util';

export type EnterpriseTableCellTemplateContext<T> = {
  readonly $implicit: T;
  readonly row: T;
  readonly column: EnterpriseTableColumnDef;
  readonly searchQuery: string;
};

/**
 * Declarative enterprise grid — single p-table instance (avoids nested-table anti-pattern).
 * Host supplies column defs; optional custom templates via cellTemplates map.
 */
@Component({
  selector: 'app-enterprise-table-grid',
  imports: [
    NgTemplateOutlet,
    TableComponent,
    TableModule,
    EnterpriseTableRowActionsComponent,
    EnterpriseSearchHighlightComponent,
  ],
  template: `
    <div
      class="enterprise-table-grid"
      [class.enterprise-table-grid--compact]="density() === 'compact'"
      [class.enterprise-table-grid--sticky-header]="responsive().stickyHeader !== false"
      [class.enterprise-table-grid--sticky-first-column]="responsive().stickyFirstColumn"
      [class.enterprise-table-grid--horizontal-scroll]="responsive().enableHorizontalScroll !== false"
    >
      <app-table
        [value]="gridRows()"
        [loading]="loading()"
        [paginator]="paginator()"
        [rows]="pageSize()"
        [totalRecords]="totalRecords()"
        [rowsPerPageOptions]="rowsPerPageOptions()"
        [lazy]="lazy()"
        [scrollable]="virtualScrollConfig().enabled || responsive().enableHorizontalScroll !== false"
        [scrollHeight]="virtualScrollConfig().scrollHeight"
        [virtualScroll]="virtualScrollConfig().enabled"
        [virtualScrollItemSize]="virtualScrollConfig().itemSize"
        [resizableColumns]="resizableColumns()"
        [reorderableColumns]="reorderableColumns()"
        [stripedRows]="true"
        styleClass="enterprise-table-grid__table"
        (lazyLoad)="lazyLoad.emit($event)"
      >
        <ng-template pTemplate="header">
          <tr>
            @if (selectable()) {
              <th class="enterprise-table-grid__checkbox-col">
                <p-tableHeaderCheckbox />
              </th>
            }
            @for (column of displayColumns(); track column.id; let first = $first) {
              <th
                [style.width]="column.width"
                [style.min-width]="column.minWidth"
                [class.enterprise-table-grid__sticky-col]="column.frozen || (responsive().stickyFirstColumn && first && !selectable())"
              >
                @if (column.sortable) {
                  <span [pSortableColumn]="column.field">
                    {{ column.header }}
                    <p-sortIcon [field]="column.field" />
                  </span>
                } @else {
                  {{ column.header }}
                }
              </th>
            }
            @if (rowActions().length > 0) {
              <th class="enterprise-table-grid__actions-col">Actions</th>
            }
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-row let-rowIndex="rowIndex">
          <tr>
            @if (selectable()) {
              <td>
                <p-tableCheckbox [value]="row" />
              </td>
            }
            @for (column of displayColumns(); track column.id; let first = $first) {
              <td [class.enterprise-table-grid__sticky-col]="column.frozen || (responsive().stickyFirstColumn && first && !selectable())">
                @if (cellTemplate(column.field); as template) {
                  <ng-container
                    *ngTemplateOutlet="template; context: { $implicit: row, row: row, column: column, searchQuery: searchQuery() }"
                  />
                } @else {
                  <app-enterprise-search-highlight
                    [text]="formatCell(row, column.field)"
                    [query]="searchQuery()"
                  />
                }
              </td>
            }
            @if (rowActions().length > 0) {
              <td>
                <app-enterprise-table-row-actions
                  [actions]="rowActions()"
                  (actionClick)="rowAction.emit({ actionId: $event, row, rowIndex })"
                />
              </td>
            }
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td [attr.colspan]="columnSpan()">
              <ng-content select="[emptyMessage]" />
            </td>
          </tr>
        </ng-template>
      </app-table>
    </div>
  `,
  styleUrl: './styles/enterprise-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTableGridComponent<T extends Record<string, unknown>> {
  readonly rows = input<readonly T[]>([]);
  readonly columns = input<readonly EnterpriseTableColumnDef[]>([]);
  readonly loading = input(false);
  readonly paginator = input(true);
  readonly pageSize = input(10);
  readonly totalRecords = input(0);
  readonly rowsPerPageOptions = input<number[]>([10, 25, 50, 100]);
  readonly lazy = input(false);
  readonly selectable = input(false);
  readonly density = input<TableDensity>('comfortable');
  readonly searchQuery = input('');
  readonly resizableColumns = input(true);
  readonly reorderableColumns = input(true);
  readonly rowActions = input<readonly EnterpriseTableRowAction[]>([]);
  readonly responsive = input<EnterpriseTableResponsiveConfig>({
    stickyHeader: true,
    stickyFirstColumn: false,
    enableHorizontalScroll: true,
  });
  readonly virtualScrollConfig = input<EnterpriseTableVirtualScrollConfig>({
    enabled: false,
    itemSize: 46,
    scrollHeight: 'flex',
  });
  readonly cellTemplates = input<Readonly<Record<string, TemplateRef<EnterpriseTableCellTemplateContext<T>>>>>({});

  readonly lazyLoad = output<unknown>();
  readonly rowAction = output<{ actionId: string; row: T; rowIndex: number }>();

  readonly displayColumns = computed(() => visibleColumns(this.columns()));
  readonly gridRows = computed(() => [...this.rows()]);

  cellTemplate(field: string): TemplateRef<EnterpriseTableCellTemplateContext<T>> | undefined {
    return this.cellTemplates()[field];
  }

  formatCell(row: T, field: string): string {
    const value = row[field];
    if (value == null) {
      return '—';
    }
    return String(value);
  }

  columnSpan(): number {
    let span = this.displayColumns().length;
    if (this.selectable()) span += 1;
    if (this.rowActions().length > 0) span += 1;
    return span;
  }
}

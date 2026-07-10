import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { TableComponent } from '../../primitives/table/table.component';

@Component({
  selector: 'app-table-shell',
  imports: [TableComponent],
  template: `
    <div class="ui-table-shell">
      <ng-content select="app-table-toolbar,[tableToolbar]" />
      <app-table
        [value]="value()"
        [loading]="loading()"
        [paginator]="paginator()"
        [rows]="rows()"
        [totalRecords]="totalRecords()"
        [lazy]="lazy()"
        (lazyLoad)="lazyLoad.emit($event)"
      >
        <ng-content />
      </app-table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableShellComponent {
  readonly value = input<unknown[]>([]);
  readonly loading = input(false);
  readonly paginator = input(false);
  readonly rows = input(10);
  readonly totalRecords = input(0);
  readonly lazy = input(false);

  readonly lazyLoad = output<unknown>();
}

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-table',
  imports: [TableModule],
  template: `
    <p-table
      [value]="value()"
      [loading]="loading()"
      [paginator]="paginator()"
      [rows]="rows()"
      [rowsPerPageOptions]="rowsPerPageOptions()"
      [totalRecords]="totalRecords()"
      [lazy]="lazy()"
      [scrollable]="scrollable()"
      [showGridlines]="showGridlines()"
      [stripedRows]="stripedRows()"
      (onLazyLoad)="lazyLoad.emit($event)"
    >
      <ng-content />
    </p-table>
  `,
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  readonly value = input<unknown[]>([]);
  readonly loading = input(false);
  readonly paginator = input(false);
  readonly rows = input(10);
  readonly rowsPerPageOptions = input<number[]>([10, 25, 50]);
  readonly totalRecords = input(0);
  readonly lazy = input(false);
  readonly scrollable = input(false);
  readonly showGridlines = input(false);
  readonly stripedRows = input(true);

  readonly lazyLoad = output<unknown>();
}
